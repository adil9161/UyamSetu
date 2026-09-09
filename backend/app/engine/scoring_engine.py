from typing import Dict, Any, Tuple
from backend.app.schemas.profile import UserProfileSchema
from backend.app.schemas.matching import RelevanceBreakdown

class ScoringWeights:
    LOCATION: float = 20.0
    SECTOR: float = 20.0
    BENEFICIARY: float = 20.0
    NEED: float = 15.0
    STAGE: float = 10.0
    DEMOGRAPHICS: float = 5.0
    READINESS: float = 5.0
    CONFIDENCE: float = 5.0

class ScoringEngine:
    """
    Multi-Factor Relevance Scoring Engine.
    Computes explainable weighted alignment scores across 8 distinct dimensions.
    """

    @classmethod
    def calculate_relevance(
        cls,
        scheme: Dict[str, Any],
        profile: UserProfileSchema,
        statutory_status: str
    ) -> Tuple[float, RelevanceBreakdown]:
        weights = ScoringWeights()

        # 1. Location Score (Max 20)
        loc_score = 0.0
        scheme_level = scheme.get("level", "central")
        scheme_state = scheme.get("state_name")
        if scheme_level == "central":
            loc_score = weights.LOCATION * 0.95 # Pan-India central scheme
        elif scheme_state and profile.location_state.lower() == scheme_state.lower():
            loc_score = weights.LOCATION # Direct state-level priority
        else:
            loc_score = weights.LOCATION * 0.1 # Mismatched state

        # 2. Sector Score (Max 20)
        sector_score = 0.0
        scheme_sectors = [s.lower() for s in scheme.get("business_types", [])]
        user_sector = (profile.business_type or "").lower()
        if any(user_sector in s or s in user_sector for s in scheme_sectors):
            sector_score = weights.SECTOR
        elif "all" in scheme_sectors or "all sectors" in scheme_sectors:
            sector_score = weights.SECTOR * 0.85
        else:
            sector_score = weights.SECTOR * 0.25

        # 3. Beneficiary Persona (Max 20)
        bene_score = weights.BENEFICIARY * 0.7 # Base baseline
        slug = scheme.get("slug", "").lower()
        if profile.applicant_persona == "artisan" and "vishwakarma" in slug:
            bene_score = weights.BENEFICIARY
        elif profile.applicant_persona == "street_vendor" and "svanidhi" in slug:
            bene_score = weights.BENEFICIARY
        elif profile.applicant_persona == "starting_business" and ("pmegp" in slug or "standup" in slug or "mudra" in slug):
            bene_score = weights.BENEFICIARY
        elif profile.applicant_persona == "existing_entrepreneur" and ("mudra" in slug or "cgtmse" in slug):
            bene_score = weights.BENEFICIARY

        # 4. Financial Need (Max 15)
        need_score = weights.NEED * 0.5
        b_types = [b.lower() for b in scheme.get("benefit_types", [])]
        user_needs = [n.lower() for n in profile.funding_need]
        
        has_loan_need = any("loan" in n for n in user_needs)
        has_subsidy_need = any("subsidy" in n for n in user_needs)
        
        if has_loan_need and "loan" in b_types:
            need_score += weights.NEED * 0.25
        if has_subsidy_need and "subsidy" in b_types:
            need_score += weights.NEED * 0.25
        need_score = min(weights.NEED, need_score)

        # 5. Business Stage (Max 10)
        stage_score = weights.STAGE * 0.8
        if profile.business_stage == "new" and ("pmegp" in slug or "standup" in slug):
            stage_score = weights.STAGE
        elif profile.business_stage == "existing" and "mudra" in slug:
            stage_score = weights.STAGE

        # 6. Demographics (Max 5)
        demo_score = weights.DEMOGRAPHICS * 0.5
        if profile.gender == "female":
            demo_score = weights.DEMOGRAPHICS
        elif profile.social_category in ["SC", "ST", "SC/ST", "OBC", "Minority", "EWS"]:
            demo_score = weights.DEMOGRAPHICS * 0.9

        # 7. Readiness (Max 5)
        readiness_score = weights.READINESS * 0.6
        if profile.has_udyam_registration:
            readiness_score = weights.READINESS
        if not profile.has_bank_default:
            readiness_score = min(weights.READINESS, readiness_score + 1.0)

        # 8. Data Confidence (Max 5)
        confidence_score = weights.CONFIDENCE * scheme.get("evidence", {}).get("confidence_score", 0.95)

        total_score = (
            loc_score + sector_score + bene_score + need_score +
            stage_score + demo_score + readiness_score + confidence_score
        )

        # Cap and penalize if statutory rules failed
        if statutory_status == "not_eligible":
            total_score = min(total_score * 0.4, 45.0)
        elif statutory_status == "potentially_eligible":
            total_score = min(total_score * 0.9, 88.0)

        breakdown = RelevanceBreakdown(
            location_score=round(loc_score, 1),
            sector_score=round(sector_score, 1),
            beneficiary_score=round(bene_score, 1),
            need_score=round(need_score, 1),
            stage_score=round(stage_score, 1),
            demographic_score=round(demo_score, 1),
            readiness_score=round(readiness_score, 1),
            confidence_score=round(confidence_score, 1)
        )

        return round(total_score, 1), breakdown
