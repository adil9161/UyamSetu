from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.db.database import get_db
from backend.app.schemas.application import (
    SavedApplicationCreate,
    ApplicationResponse,
    DocumentChecklistToggle
)
from backend.app.services.application_service import ApplicationService
from backend.app.routers.auth import get_current_user
from backend.app.db.models import User

router = APIRouter(prefix="/applications", tags=["Application Preparation Module"])

@router.get("", response_model=List[ApplicationResponse])
def get_saved_applications(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    user_id = current_user.id if current_user else None
    return ApplicationService.get_user_applications(db=db, user_id=user_id)

@router.post("", response_model=ApplicationResponse)
def save_scheme_application(
    req: SavedApplicationCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    user_id = current_user.id if current_user else None
    return ApplicationService.save_application(db=db, app_data=req, user_id=user_id)

@router.delete("/{scheme_id}")
def delete_saved_application(
    scheme_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    user_id = current_user.id if current_user else None
    success = ApplicationService.delete_application(db=db, scheme_id=scheme_id, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Application not found.")
    return {"message": "Application removed successfully."}

@router.patch("/{scheme_id}/docs", response_model=ApplicationResponse)
def toggle_document_completion(
    scheme_id: str,
    req: DocumentChecklistToggle,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    user_id = current_user.id if current_user else None
    updated = ApplicationService.toggle_document(
        db=db,
        scheme_id=scheme_id,
        document_id=req.document_id,
        user_id=user_id
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Application record not found.")
    return updated
