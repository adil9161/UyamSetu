from typing import Optional, List
from pydantic import BaseModel
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.app.db.database import get_db
from backend.app.schemas.profile import UserProfileSchema
from backend.app.schemas.matching import MatchingResponse, MatchingExplainResponse
from backend.app.services.matching_service import MatchingService
from backend.app.routers.auth import get_current_user
from backend.app.db.models import User, RecommendationHistory

router = APIRouter(prefix="/matching", tags=["Deterministic Matching & Explainability"])

class ExplainRequest(BaseModel):
    scheme_id: str
    profile: Optional[UserProfileSchema] = None

@router.post("/calculate", response_model=MatchingResponse)
def calculate_matching(
    profile: UserProfileSchema,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Executes the deterministic 3-level statutory rule engine and multi-factor ranking pipeline.
    """
    user_id = current_user.id if current_user else None
    return MatchingService.execute_matching(profile=profile, db=db, user_id=user_id)

@router.post("/explain", response_model=MatchingExplainResponse)
def explain_decision(req: ExplainRequest):
    """
    Provides step-by-step transparent decision trails and rule verification for frontend animation.
    """
    default_p = req.profile or UserProfileSchema()
    return MatchingService.explain_matching(scheme_id=req.scheme_id, profile=default_p)

@router.get("/history")
def get_recommendation_history(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    query = db.query(RecommendationHistory)
    if current_user:
        query = query.filter(RecommendationHistory.user_id == current_user.id)
    records = query.order_by(RecommendationHistory.created_at.desc()).limit(limit).all()
    
    return [
        {
            "id": r.id,
            "scheme_id": r.scheme_id,
            "scheme_name": r.scheme_name,
            "eligibility_status": r.eligibility_status,
            "match_score": r.match_score,
            "evidence_version": r.evidence_version,
            "rules_passed": r.rules_passed,
            "rules_failed": r.rules_failed,
            "timestamp": r.created_at.isoformat()
        }
        for r in records
    ]
