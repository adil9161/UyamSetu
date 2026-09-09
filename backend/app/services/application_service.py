from typing import List, Optional
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from backend.app.db.models import SavedApplication
from backend.app.schemas.application import SavedApplicationCreate, ApplicationResponse
from backend.ingestion.index_builder import get_scheme_index

class ApplicationService:
    @classmethod
    def get_user_applications(cls, db: Session, user_id: Optional[int] = None) -> List[ApplicationResponse]:
        query = db.query(SavedApplication)
        if user_id:
            query = query.filter(SavedApplication.user_id == user_id)
        apps = query.order_by(SavedApplication.created_at.desc()).all()
        
        result = []
        for a in apps:
            result.append(ApplicationResponse(
                id=a.id,
                scheme_id=a.scheme_id,
                scheme_name=a.scheme_name,
                scheme_slug=a.scheme_slug,
                notes=a.notes or "",
                completed_docs=a.completed_docs or [],
                preparation_status=a.preparation_status,
                official_ref_number=a.official_ref_number,
                saved_at=a.created_at.strftime("%Y-%m-%d")
            ))
        return result

    @classmethod
    def save_application(cls, db: Session, app_data: SavedApplicationCreate, user_id: Optional[int] = None) -> ApplicationResponse:
        # Check if already exists
        existing = db.query(SavedApplication).filter(
            SavedApplication.scheme_id == app_data.scheme_id
        )
        if user_id:
            existing = existing.filter(SavedApplication.user_id == user_id)
        found = existing.first()
        if found:
            return ApplicationResponse(
                id=found.id,
                scheme_id=found.scheme_id,
                scheme_name=found.scheme_name,
                scheme_slug=found.scheme_slug,
                notes=found.notes or "",
                completed_docs=found.completed_docs or [],
                preparation_status=found.preparation_status,
                official_ref_number=found.official_ref_number,
                saved_at=found.created_at.strftime("%Y-%m-%d")
            )

        # Look up scheme to find default required documents
        index = get_scheme_index()
        scheme = index.scheme_map.get(app_data.scheme_id) or index.slug_map.get(app_data.scheme_id)
        total_docs = len(scheme.get("documents_required", [])) if scheme else 3
        default_completed = [scheme["documents_required"][0]["id"]] if (scheme and scheme.get("documents_required")) else ["doc-aadhaar"]
        initial_status = int((len(default_completed) / max(1, total_docs)) * 100)

        new_app = SavedApplication(
            user_id=user_id,
            scheme_id=app_data.scheme_id,
            scheme_name=app_data.scheme_name,
            scheme_slug=app_data.scheme_slug or (scheme.get("slug") if scheme else None),
            notes=app_data.notes or "Saved from UdyamSetu matching flow.",
            completed_docs=default_completed,
            preparation_status=initial_status,
            official_ref_number=None
        )
        db.add(new_app)
        db.commit()
        db.refresh(new_app)

        return ApplicationResponse(
            id=new_app.id,
            scheme_id=new_app.scheme_id,
            scheme_name=new_app.scheme_name,
            scheme_slug=new_app.scheme_slug,
            notes=new_app.notes,
            completed_docs=new_app.completed_docs,
            preparation_status=new_app.preparation_status,
            official_ref_number=new_app.official_ref_number,
            saved_at=new_app.created_at.strftime("%Y-%m-%d")
        )

    @classmethod
    def toggle_document(cls, db: Session, scheme_id: str, document_id: str, user_id: Optional[int] = None) -> Optional[ApplicationResponse]:
        query = db.query(SavedApplication).filter(SavedApplication.scheme_id == scheme_id)
        if user_id:
            query = query.filter(SavedApplication.user_id == user_id)
        app = query.first()
        if not app:
            return None

        docs = list(app.completed_docs or [])
        if document_id in docs:
            docs.remove(document_id)
        else:
            docs.append(document_id)

        index = get_scheme_index()
        scheme = index.scheme_map.get(scheme_id)
        total_docs = len(scheme.get("documents_required", [])) if scheme else 3
        app.completed_docs = docs
        app.preparation_status = min(100, int((len(docs) / max(1, total_docs)) * 100))
        app.updated_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(app)

        return ApplicationResponse(
            id=app.id,
            scheme_id=app.scheme_id,
            scheme_name=app.scheme_name,
            scheme_slug=app.scheme_slug,
            notes=app.notes or "",
            completed_docs=app.completed_docs,
            preparation_status=app.preparation_status,
            official_ref_number=app.official_ref_number,
            saved_at=app.created_at.strftime("%Y-%m-%d")
        )

    @classmethod
    def delete_application(cls, db: Session, scheme_id: str, user_id: Optional[int] = None) -> bool:
        query = db.query(SavedApplication).filter(SavedApplication.scheme_id == scheme_id)
        if user_id:
            query = query.filter(SavedApplication.user_id == user_id)
        app = query.first()
        if app:
            db.delete(app)
            db.commit()
            return True
        return False
