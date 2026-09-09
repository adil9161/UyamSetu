from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from backend.app.profile.profile_normalizer import ProfileNormalizer

class UserProfileSchema(BaseModel):
    location_state: str = Field("Uttar Pradesh", description="Applicant home/enterprise state")
    residence_type: str = Field("rural", description="urban | rural")
    district: Optional[str] = Field("Varanasi", description="District (optional internal)")
    applicant_persona: str = Field("starting_business", description="Persona type")
    business_type: str = Field("Textile", description="Sector / Business Type")
    funding_need: List[str] = Field(default_factory=lambda: ["Starting a business", "Machinery & Equipment", "Loan"])
    business_size_range: Optional[str] = Field("micro_under_10l", description="Investment size range")
    revenue_range: Optional[str] = Field(None, description="up_to_1_lakh | 1_to_10_lakh | 10_to_50_lakh | above_50_lakh (Mandatory for existing)")
    age: int = Field(28, ge=18, le=115, description="Applicant age bounded 18 to 115")
    gender: str = Field("female", description="female | male | transgender | prefer_not_to_say")
    social_category: str = Field("OBC", description="General | OBC | SC | ST | Minority | None")
    business_stage: str = Field("new", description="new | existing")
    is_street_vendor: bool = False
    is_traditional_artisan: bool = True
    education_level: Optional[str] = "10th"
    has_udyam_registration: bool = False
    udyam_registration_number: Optional[str] = None
    udyam_verification_status: Optional[str] = Field("not_registered", description="verified | unverified | failed | not_registered")
    udyam_verified_data: Optional[Dict[str, Any]] = None
    has_bank_default: bool = False

    def get_normalized_occupation(self) -> str:
        return ProfileNormalizer.normalize_occupation(self.applicant_persona)

    def get_normalized_sector(self) -> str:
        occ = self.get_normalized_occupation()
        return ProfileNormalizer.normalize_sector(self.business_type, occ)

    def get_normalized_needs(self) -> List[str]:
        return ProfileNormalizer.normalize_needs(self.funding_need)

    class Config:
        from_attributes = True

class ProfileResponse(UserProfileSchema):
    id: Optional[int] = None
    user_id: Optional[int] = None

