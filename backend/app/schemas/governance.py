from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class IssueReportCreate(BaseModel):
    scheme_id: str
    scheme_name: str
    issue_type: str = Field(..., description="'outdated_info' | 'incorrect_eligibility' | 'broken_link' | 'wrong_amount' | 'translation_error'")
    description: str = Field(..., min_length=5)

class IssueReportResponse(BaseModel):
    id: int
    scheme_id: str
    scheme_name: str
    issue_type: str
    description: str
    status: str
    submitted_at: str
    reviewer_notes: Optional[str] = None

    class Config:
        from_attributes = True

class CoverageMetric(BaseModel):
    label: str
    value: Any
    status: str
    target: str

class SlotTarget(BaseModel):
    slo: str
    target: str
    current: str
    window: str
    status: str

class GovernanceMetricsResponse(BaseModel):
    total_published_schemes: int
    central_schemes_count: int
    state_schemes_count: int
    verified_sources_ratio: str
    stale_record_ratio: str
    review_queue_depth: int
    coverage_metrics: List[CoverageMetric]
    slo_targets: List[SlotTarget]
    recent_reports: List[IssueReportResponse]
