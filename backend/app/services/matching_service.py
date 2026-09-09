from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from backend.app.core.logging import logger
from backend.ingestion.index_builder import get_scheme_index
from backend.app.schemas.profile import UserProfileSchema
from backend.app.schemas.matching import (
    MatchResultItem,
    MatchingResponse,
    MatchingExplainResponse
)
from backend.app.engine.rule_engine import RuleEngine
from backend.app.personalization.personalization_engine import PersonalizationEngine
from backend.app.engine.explanation_engine import ExplanationEngine
from backend.app.services.evidence_service import EvidenceService
from backend.app.db.models import RecommendationHistory, AuditLog

class MatchingService:
    """
    Central Eligibility and Recommendation Orchestrator.
    Strict sequential pipeline:
    Profile -> Hard Rule Engine -> Statutory Tier -> Multi-Factor Scoring -> Ranking -> Explanation.
    """

    @classmethod
    def execute_matching(
        cls,
        profile: UserProfileSchema,
        db: Optional[Session] = None,
        user_id: Optional[int] = None
    ) -> MatchingResponse:
        index = get_scheme_index()
        all_schemes = index.schemes

        evaluated_items: List[MatchResultItem] = []

        for scheme in all_schemes:
            # 1. Statutory Rule Evaluation (Hard constraints)
            statutory_res = RuleEngine.evaluate_scheme(scheme, profile)

            # 2. Multi-Factor Personalization Scoring
            relevance_score, breakdown, why_matched_personal = PersonalizationEngine.calculate_relevance(
                scheme=scheme,
                profile=profile,
                statutory_status=statutory_res.eligibility_status
            )

            # 3. Evidence Compilation
            evidence = EvidenceService.get_evidence_for_scheme(scheme)

            # 4. Synthesize Explanations & Next Best Actions
            why_matched = list(dict.fromkeys(why_matched_personal + statutory_res.rules_passed))[:5]

            gap_item = ExplanationEngine.generate_gap_analysis(
                scheme=scheme,
                profile=profile,
                missing_requirements=statutory_res.missing_requirements
            )

            next_actions = ExplanationEngine.generate_next_best_actions(
                scheme=scheme,
                profile=profile,
                gap=gap_item
            )

            item = MatchResultItem(
                scheme_id=scheme["id"],
                scheme_name=scheme["name"],
                scheme_slug=scheme["slug"],
                ministry=scheme["ministry"],
                level=scheme["level"],
                state_name=scheme.get("state_name"),
                eligibility_status=statutory_res.eligibility_status,
                eligibility_label=statutory_res.eligibility_label,
                relevance_score=relevance_score,
                relevance_breakdown=breakdown,
                why_matched=why_matched,
                why_not_eligible=statutory_res.why_not_reasons,
                missing_requirements=statutory_res.missing_requirements,
                gap_analysis=gap_item,
                next_best_actions=next_actions,
                readiness_percentage=statutory_res.readiness_percentage,
                evidence=evidence
            )
            evaluated_items.append(item)

        # 5. Rank and Partition into 3 Tiers (Eligible, Near-Match, Ineligible)
        best_matches, near_matches, ineligible_schemes = PersonalizationEngine.rank_and_partition(evaluated_items)

        # 6. Persistent Audit Trail in SQLite if DB session is active
        rec_id = None
        if db:
            try:
                # Store audit for top match
                top_match = best_matches[0] if best_matches else (near_matches[0] if near_matches else None)
                if top_match:
                    rec_history = RecommendationHistory(
                        user_id=user_id,
                        profile_snapshot=profile.model_dump(),
                        scheme_id=top_match.scheme_id,
                        scheme_name=top_match.scheme_name,
                        eligibility_status=top_match.eligibility_status,
                        match_score=top_match.relevance_score,
                        rules_passed=top_match.why_matched,
                        rules_failed=top_match.why_not_eligible,
                        evidence_version=top_match.evidence.content_hash[:8] if top_match.evidence.content_hash else "v2.1"
                    )
                    db.add(rec_history)
                    
                    audit = AuditLog(
                        action="matching_executed",
                        user_id=user_id,
                        details={
                            "total_evaluated": len(all_schemes),
                            "eligible_count": len(best_matches),
                            "near_match_count": len(near_matches),
                            "top_match": top_match.scheme_name,
                            "top_score": top_match.relevance_score
                        }
                    )
                    db.add(audit)
                    db.commit()
                    db.refresh(rec_history)
                    rec_id = rec_history.id
            except Exception as e:
                logger.error(f"Failed to record recommendation history: {e}")
                db.rollback()

        return MatchingResponse(
            best_matches=best_matches[:15],
            near_matches=near_matches[:15],
            ineligible_schemes=ineligible_schemes[:10],
            summary={
                "total_evaluated": len(all_schemes),
                "eligible_count": len(best_matches),
                "near_match_count": len(near_matches),
                "ineligible_count": len(ineligible_schemes)
            },
            recommendation_id=rec_id,
            evaluated_at=datetime.now(timezone.utc).isoformat()
        )

    @classmethod
    def explain_matching(cls, scheme_id: str, profile: UserProfileSchema) -> MatchingExplainResponse:
        """
        Generates step-by-step transparent decision trail for frontend decision animation.
        """
        index = get_scheme_index()
        scheme = index.scheme_map.get(scheme_id) or index.slug_map.get(scheme_id)
        if not scheme:
            # Fallback to first scheme
            scheme = index.schemes[0]

        statutory_res = RuleEngine.evaluate_scheme(scheme, profile)
        score, _, why_matched = PersonalizationEngine.calculate_relevance(scheme, profile, statutory_res.eligibility_status)
        evidence = EvidenceService.get_evidence_for_scheme(scheme)
        gap = ExplanationEngine.generate_gap_analysis(scheme, profile, statutory_res.missing_requirements)
        next_actions = ExplanationEngine.generate_next_best_actions(scheme, profile, gap)
        
        # Decision steps for the 7-stage animated decision tree
        decision_steps = ExplanationEngine.generate_decision_trail(
            scheme=scheme,
            profile=profile,
            rules_passed=statutory_res.rules_passed,
            rules_failed=statutory_res.rules_failed,
            score=score
        )

        return MatchingExplainResponse(
            scheme_id=scheme["id"],
            scheme_name=scheme["name"],
            eligibility=statutory_res.eligibility_status,
            overall_score=score,
            decision_trail=decision_steps,
            rules_passed=statutory_res.rules_passed,
            rules_failed=statutory_res.rules_failed,
            evidence_citation=evidence,
            next_best_actions=next_actions
        )
