from typing import List, Optional
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from backend.app.db.database import get_db
from backend.app.schemas.governance import (
    GovernanceMetricsResponse,
    IssueReportCreate,
    IssueReportResponse
)
from backend.app.services.analytics_service import AnalyticsService
from backend.app.routers.auth import get_current_user
from backend.app.db.models import User
from backend.app.core.config import settings

router = APIRouter(prefix="/governance", tags=["Data Trust & Governance Console"])

@router.get("/metrics", response_model=GovernanceMetricsResponse)
def get_metrics(db: Session = Depends(get_db)):
    """
    Returns real-time coverage metrics, SLO health, and recent reports.
    """
    return AnalyticsService.get_governance_metrics(db)

@router.post("/reports", response_model=IssueReportResponse)
def submit_citizen_issue_report(
    req: IssueReportCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    user_id = current_user.id if current_user else None
    return AnalyticsService.submit_report(db=db, report_data=req, user_id=user_id)

@router.get("/reports", response_model=List[IssueReportResponse])
def get_all_reports(db: Session = Depends(get_db)):
    metrics = AnalyticsService.get_governance_metrics(db)
    return metrics.recent_reports

@router.get("/audit-logs")
def get_audit_trail(
    limit: int = 25,
    db: Session = Depends(get_db)
):
    return AnalyticsService.get_audit_trail(db=db, limit=limit)
