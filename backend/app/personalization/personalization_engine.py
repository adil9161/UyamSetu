"""
UdyamSetu Personalization & Ranking Engine v2.2
Combines multi-factor signals into an explainable relevance score (0 - 100).
Ranks eligible and near-match schemes, strictly separating them from ineligibles.
"""

from typing import Dict, Any, List, Tuple
from backend.app.personalization.feature_extractor import ProfileFeatures, FeatureExtractor
from backend.app.personalization.occupation_mapper import OccupationMapper
from backend.app.personalization.intent_mapper import IntentMapper
from backend.app.schemas.profile import UserProfileSchema

class PersonalizationEngine:
    @classmethod
    def calculate_relevance(
        cls,
        scheme: Dict[str, Any],
        profile: UserProfileSchema,
        statutory_status: str
    ) -> Tuple[float, Dict[str, float], List[str]]:
        features = FeatureExtractor.extract(profile)
        slug = (scheme.get("slug") or "").lower()
        desc = (scheme.get("description") or "").lower()

        why_matched: List[str] = []

        # 1. Occupation Fit (25%)
        occ_score, occ_reasons = OccupationMapper.calculate_occupation_fit(features, scheme)
        why_matched.extend(occ_reasons)

        # 2. Need / Intent Fit (20%)
        need_score, need_reasons = IntentMapper.calculate_intent_fit(features.intents, scheme)
        why_matched.extend(need_reasons)

        # 3. Business Stage Fit (15%)
        stage_score = 70.0
        if features.business_stage == "new":
            if "pmegp" in slug or "standup" in slug or "mudra" in slug or "greenfield" in desc:
                stage_score = 95.0
                why_matched.append("Tailored for greenfield / first-time enterprise establishment.")
            elif "expansion" in desc or "upgrade" in desc:
                stage_score = 40.0
        else: # existing
            if "cgtmse" in slug or "upgrade" in desc or "expansion" in desc or "mudra" in slug:
                stage_score = 95.0
                why_matched.append("Provides credit expansion and collateral guarantee for operating businesses.")
            elif "greenfield only" in desc:
                stage_score = 30.0

        # 4. Sector Fit (15%)
        sector_score = 75.0
        user_sec = features.sector_code
        b_types = [str(b).lower() for b in scheme.get("business_types", [])]
        if any(user_sec in b or b in user_sec for b in b_types):
            sector_score = 95.0
        elif "all" in b_types or "all sectors" in b_types:
            sector_score = 75.0
        else:
            sector_score = 40.0

        # 5. Location & Residence Fit (10%)
        loc_score = 80.0
        if scheme.get("level") == "state":
            if (scheme.get("state_name") or "").lower() == features.location_state.lower():
                loc_score = 100.0
                why_matched.append(f"State-specific DIC incentive exclusively for {features.location_state}.")
            else:
                loc_score = 20.0
        else:
            # Central scheme rural/urban fit
            if features.residence_type == "rural" and ("rural" in desc or "kvic" in desc or "pmegp" in slug):
                loc_score = 95.0
                why_matched.append("Unlocks higher 35% rural government capital subsidy tier.")
            elif features.residence_type == "urban" and "svanidhi" in slug:
                loc_score = 95.0
                why_matched.append("Targeted urban municipality credit mechanism.")

        # 6. Demographic Incentives (5%)
        demo_score = 60.0
        if features.is_female or features.is_sc_st:
            if "standup" in slug or "women" in desc or "special category" in desc:
                demo_score = 98.0
                reason = "Woman" if features.is_female else "Affirmative Action"
                why_matched.append(f"Statutory quota satisfies {reason} entrepreneur priority allocation.")
            else:
                demo_score = 80.0

        # 7. Readiness Fit (5%)
        readiness_score = 85.0 if features.has_udyam else 55.0
        if features.has_udyam:
            why_matched.append("Verified MSME Udyam status accelerates direct bank sanction.")

        # 8. Benefit Scale Fit (5%)
        benefit_score = 75.0
        max_loan = scheme.get("max_loan_amount_inr", 1000000.0)
        if features.revenue_tier == "up_to_1_lakh" and max_loan <= 100000:
            benefit_score = 95.0
        elif features.revenue_tier == "10_to_50_lakh" and max_loan >= 1000000:
            benefit_score = 95.0

        # Weighted Composition
        total_score = (
            occ_score * 0.25 +
            need_score * 0.20 +
            stage_score * 0.15 +
            sector_score * 0.15 +
            loc_score * 0.10 +
            demo_score * 0.05 +
            readiness_score * 0.05 +
            benefit_score * 0.05
        )

        # Ineligible Cap
        if statutory_status == "ineligible":
            total_score = min(total_score, 35.0)

        breakdown = {
            "occupation_score": round(occ_score, 1),
            "need_score": round(need_score, 1),
            "stage_score": round(stage_score, 1),
            "sector_score": round(sector_score, 1),
            "location_score": round(loc_score, 1),
            "beneficiary_score": round(demo_score, 1),
            "demographic_score": round(demo_score, 1),
            "readiness_score": round(readiness_score, 1),
            "confidence_score": 95.0
        }

        # Deduplicate why matched
        unique_reasons = list(dict.fromkeys(why_matched))[:5]
        return round(min(98.5, max(15.0, total_score)), 1), breakdown, unique_reasons

    @classmethod
    def rank_and_partition(cls, items: List[Any]) -> Tuple[List[Any], List[Any], List[Any]]:
        """
        Partitions items into:
        1. best_matches: Eligible items sorted by relevance descending
        2. near_matches: Near-match items sorted by relevance descending
        3. ineligible_schemes: Disqualified items (never presented as recommendations)
        """
        eligible_items = [i for i in items if i.eligibility_status == "eligible"]
        near_match_items = [i for i in items if i.eligibility_status == "near_match"]
        ineligible_items = [i for i in items if i.eligibility_status == "ineligible"]

        eligible_items.sort(key=lambda x: x.relevance_score, reverse=True)
        near_match_items.sort(key=lambda x: x.relevance_score, reverse=True)
        ineligible_items.sort(key=lambda x: x.relevance_score, reverse=True)

        return eligible_items, near_match_items, ineligible_items
