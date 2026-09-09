from typing import List, Optional
from pydantic import BaseModel, Field

class ChatMessagePayload(BaseModel):
    role: str = Field(..., description="'user' | 'assistant'")
    content: str

class ChatSourceCitation(BaseModel):
    name: str
    url: str
    date: str
    confidence: float = 0.95

class SuggestedSchemeAction(BaseModel):
    label: str
    view: str # 'scheme-detail' | 'match' | 'schemes'
    slug: Optional[str] = None

class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1)
    history: List[ChatMessagePayload] = []
    user_state: Optional[str] = "Uttar Pradesh"
    user_sector: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    answer_hi: Optional[str] = None
    sources: List[ChatSourceCitation] = []
    suggested_action: Optional[SuggestedSchemeAction] = None
    engine_mode: str = Field(..., description="'gemini_rag' | 'offline_bm25_grounded'")
    confidence: float = 0.95
    model_used: str

class MatchExplanationRequest(BaseModel):
    scheme_id: str
    user_profile: Optional[dict] = None
