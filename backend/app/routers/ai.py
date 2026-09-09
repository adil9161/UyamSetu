from fastapi import APIRouter
from backend.app.schemas.ai import ChatRequest, ChatResponse
from backend.app.services.rag_service import RAGService

router = APIRouter(prefix="/ai", tags=["Grounded RAG AI Assistant"])

@router.post("/chat", response_model=ChatResponse)
def ask_ai_assistant(req: ChatRequest):
    """
    Submits inquiry to UdyamSetu Grounded RAG Assistant.
    Answers strictly using retrieved verified scheme evidence.
    """
    return RAGService.answer_query(req)
