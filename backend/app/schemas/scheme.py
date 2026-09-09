from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class SchemeRule(BaseModel):
    id: Optional[str] = None
    rule_type: str = Field(..., description="'demographic' | 'location' | 'sector' | 'financial' | 'regulatory'")
    field: str = Field(..., description="Target attribute, e.g. 'age', 'location_state', 'gender', 'has_udyam_registration'")
    operator: str = Field(..., description="'==' | 'in' | '<=' | '>=' | '!=' | 'contains' | 'boolean'")
    expected_value: Any = Field(..., description="Expected value or set of allowed values")
    mandatory: bool = Field(True, description="Whether failure constitutes hard disqualification")
    explanation: str = Field(..., description="Plain-English explanation of the statutory rule")
    disqualification_reason: Optional[str] = Field(None, description="Explanation when user fails this rule")
    source_id: Optional[str] = Field("official-gazette", description="Reference ID of the ministry notification")

class SchemeDocument(BaseModel):
    id: str
    name: str
    mandatory: bool = True
    description: Optional[str] = None

class SchemeEvidence(BaseModel):
    source_url: str = Field("https://msme.gov.in", description="Official portal link")
    source_type: str = Field("ministry_portal", description="'ministry_portal' | 'gazette' | 'nodal_circular'")
    last_verified_at: str = Field("2026-09-02T10:00:00Z", description="ISO verification timestamp")
    verification_status: str = Field("verified", description="'verified' | 'provisional' | 'stale_review_needed'")
    content_hash: str = Field("", description="SHA-256 hash of official content guidelines")
    confidence_score: float = Field(0.95, description="Confidence in scheme accuracy (0.0 to 1.0)")
    verified_by: str = Field("UdyamSetu Intelligence Nodal Team", description="Reviewing authority")

class SchemeSummary(BaseModel):
    id: str
    name: str
    slug: str
    code: str
    level: str # 'central' | 'state'
    state_name: Optional[str] = None
    ministry: str
    description: str
    benefit_types: List[str] = []
    max_subsidy_percentage: Optional[float] = None
    max_loan_amount_inr: Optional[float] = None
    scheme_version: str = "v2.1"
    evidence: SchemeEvidence
    tags: List[str] = []

class SchemeDetail(SchemeSummary):
    brief_summary: Optional[str] = None
    detailed_benefits: List[str] = []
    eligibility_criteria_text: List[str] = []
    structured_rules: List[SchemeRule] = []
    documents_required: List[SchemeDocument] = []
    application_process: List[str] = []
    official_portal_url: str
    helpline_number: Optional[str] = None
    target_beneficiaries: List[str] = []
    business_types: List[str] = []

class SchemeFilterParams(BaseModel):
    query: Optional[str] = None
    level: Optional[str] = "all" # 'all' | 'central' | 'state'
    state_name: Optional[str] = None
    sector: Optional[str] = "all"
    benefit_type: Optional[str] = "all"
    page: int = 1
    page_size: int = 20
