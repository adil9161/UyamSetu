"""
UdyamSetu Personalization Feature Extractor
Extracts multidimensional feature vectors from normalized user profiles.
"""

from typing import Dict, Any, List
from backend.app.schemas.profile import UserProfileSchema

class ProfileFeatures:
    def __init__(
        self,
        occupation_code: str,
        sector_code: str,
        intents: List[str],
        business_stage: str,
        residence_type: str,
        location_state: str,
        is_female: bool,
        is_sc_st: bool,
        age: int,
        revenue_tier: str,
        has_udyam: bool,
        is_street_vendor: bool,
        is_traditional_artisan: bool
    ):
        self.occupation_code = occupation_code
        self.sector_code = sector_code
        self.intents = intents
        self.business_stage = business_stage
        self.residence_type = residence_type
        self.location_state = location_state
        self.is_female = is_female
        self.is_sc_st = is_sc_st
        self.age = age
        self.revenue_tier = revenue_tier
        self.has_udyam = has_udyam
        self.is_street_vendor = is_street_vendor
        self.is_traditional_artisan = is_traditional_artisan

class FeatureExtractor:
    @staticmethod
    def extract(profile: UserProfileSchema) -> ProfileFeatures:
        occ = profile.get_normalized_occupation()
        sec = profile.get_normalized_sector()
        needs = profile.get_normalized_needs()
        
        is_fem = (profile.gender or "").lower() == "female"
        is_sc_st = (profile.social_category or "") in ["SC", "ST"]
        stage = (profile.business_stage or "new").lower()
        residence = (profile.residence_type or "rural").lower()
        rev = profile.revenue_range or "up_to_1_lakh"

        is_vendor = profile.is_street_vendor or occ == "street_vendor"
        is_artisan = profile.is_traditional_artisan or "artisan" in occ

        return ProfileFeatures(
            occupation_code=occ,
            sector_code=sec,
            intents=needs,
            business_stage=stage,
            residence_type=residence,
            location_state=profile.location_state or "All India",
            is_female=is_fem,
            is_sc_st=is_sc_st,
            age=profile.age,
            revenue_tier=rev,
            has_udyam=profile.has_udyam_registration,
            is_street_vendor=is_vendor,
            is_traditional_artisan=is_artisan
        )
