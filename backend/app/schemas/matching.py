from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from backend.app.schemas.profile import UserProfileSchema
from backend.app.schemas.scheme import SchemeSummary, SchemeEvidence

class GapAnalysisItem(BaseModel):
    condition: str = Field(..., description="Condition that is missing or requires attention")
    action_required: str = Field(..., description="Action the applicant must take")
    time_estimate: str = Field(..., description="e.g. '1-2 days', 'Immediate'")
    portal_url: Optional[str] = None

class NextBestAction(BaseModel):
    step_number: int
    title: str
    description: str
    impact: str = Field("Mandatory for qualification", description="Why this step is critical")
    action_url: Optional[str] = None

class RelevanceBreakdown(BaseModel):
    location_score: float = Field(0.0, description="Location Fit")
    sector_score: float = Field(0.0, description="Sector Fit")
    beneficiary_score: float = Field(0.0, description="Beneficiary Demographic Fit")
    need_score: float = Field(0.0, description="Need / Intent Fit")
    stage_score: float = Field(0.0, description="Business Stage Fit")
    demographic_score: float = Field(0.0, description="Demographic Incentive Fit")
    readiness_score: float = Field(0.0, description="Readiness / Udyam Fit")
    confidence_score: float = Field(0.0, description="Data Confidence Fit")
    occupation_score: Optional[float] = Field(0.0, description="Occupation / Persona Fit")

class MatchResultItem(BaseModel):
    scheme_id: str
    scheme_name: str
    scheme_slug: str
    ministry: str
    level: str
    state_name: Optional[str] = None
    eligibility_status: str = Field(..., description="'eligible' | 'potentially_eligible' | 'not_eligible'")
    eligibility_label: str
    relevance_score: float = Field(..., description="Overall match score 0-100")
    relevance_breakdown: RelevanceBreakdown
    why_matched: List[str] = []
    why_not_eligible: List[str] = []
    missing_requirements: List[str] = []
    gap_analysis: Optional[GapAnalysisItem] = None
    next_best_actions: List[NextBestAction] = []
    readiness_percentage: int = 80
    evidence: SchemeEvidence

class MatchingResponse(BaseModel):
    best_matches: List[MatchResultItem]
    near_matches: List[MatchResultItem]
    ineligible_schemes: List[MatchResultItem]
    summary: Dict[str, int]
    recommendation_id: Optional[int] = None
    evaluated_at: str

class DecisionStep(BaseModel):
    step_name: str # 'Checking Profile Constraints', 'Evaluating State Residency', etc.
    status: str # 'passed', 'flagged', 'failed'
    details: str

class MatchingExplainResponse(BaseModel):
    scheme_id: str
    scheme_name: str
    eligibility: str
    overall_score: float
    decision_trail: List[DecisionStep]
    rules_passed: List[str]
    rules_failed: List[str]
    evidence_citation: SchemeEvidence
    next_best_actions: List[NextBestAction]
