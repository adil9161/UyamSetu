"""
UdyamSetu Occupation & Sector Mapper
Calculates specialized profession-level fit between user trade and scheme mandates.
"""

from typing import Dict, Any, Tuple, List
from backend.app.personalization.feature_extractor import ProfileFeatures

OCCUPATION_SCHEME_AFFINITIES = {
    "artisan_tailor": ["pm-vishwakarma", "pmegp", "standup-india", "textile", "artisan", "garment"],
    "artisan_craftsperson": ["pm-vishwakarma", "pmegp", "handicraft", "artisan", "mudra"],
    "street_vendor": ["pm-svanidhi", "pm-mudra", "mudra", "vendor", "micro"],
    "retailer": ["pm-mudra", "cgtmse", "retail", "shop", "trading"],
    "farmer_dairy": ["dairy", "agri", "animal husbandry", "kisan", "nabard"],
    "tech_founder": ["startup", "sisfs", "cgtmse", "innovation", "technology"],
    "shg_member": ["standup-india", "pmegp", "nrlm", "mahila", "women"],
    "starting_business": ["pmegp", "standup-india", "mudra"],
    "existing_entrepreneur": ["cgtmse", "pm-mudra", "standup-india"]
}

class OccupationMapper:
    @staticmethod
    def calculate_occupation_fit(features: ProfileFeatures, scheme: Dict[str, Any]) -> Tuple[float, List[str]]:
        slug = (scheme.get("slug") or "").lower()
        name = (scheme.get("name") or "").lower()
        desc = (scheme.get("description") or "").lower()
        b_types = [str(b).lower() for b in scheme.get("business_types", [])]

        occ = features.occupation_code
        affinities = OCCUPATION_SCHEME_AFFINITIES.get(occ, [])
        reasons: List[str] = []

        is_high_affinity = any(aff in slug or aff in name or aff in desc for aff in affinities)

        # Sector alignment
        user_sec = features.sector_code
        sec_match = any(user_sec in b or b in user_sec or b in ["all", "all sectors"] for b in b_types)

        score = 50.0
        if is_high_affinity and sec_match:
            score = 95.0
            reasons.append(f"Direct flagship program specifically engineered for your trade as an {occ.replace('_', ' ').title()}.")
        elif is_high_affinity:
            score = 85.0
            reasons.append(f"Scheme specifically prioritizes {occ.replace('_', ' ').title()} beneficiaries.")
        elif sec_match:
            score = 75.0
            reasons.append(f"Direct sector alignment with your {user_sec.title()} enterprise.")
        else:
            score = 45.0

        return score, reasons
