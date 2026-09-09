from typing import List, Optional
from pydantic import BaseModel, Field

class SavedApplicationCreate(BaseModel):
    scheme_id: str
    scheme_name: str
    scheme_slug: Optional[str] = None
    notes: Optional[str] = "Saved from UdyamSetu matching flow."

class DocumentChecklistToggle(BaseModel):
    document_id: str
    is_completed: bool

class ApplicationNotesUpdate(BaseModel):
    notes: str

class ApplicationResponse(BaseModel):
    id: int
    scheme_id: str
    scheme_name: str
    scheme_slug: Optional[str] = None
    notes: str
    completed_docs: List[str]
    preparation_status: int # 0 to 100
    official_ref_number: Optional[str] = None
    saved_at: str

    class Config:
        from_attributes = True
