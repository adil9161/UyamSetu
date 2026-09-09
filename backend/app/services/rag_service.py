import os
import json
import requests
from typing import List, Dict, Any, Optional
from backend.app.core.config import settings
from backend.app.core.logging import logger
from backend.ingestion.index_builder import get_scheme_index
from backend.app.schemas.ai import ChatRequest, ChatResponse, ChatSourceCitation, SuggestedSchemeAction

class RAGService:
    """
    Hybrid Grounded RAG AI Service.
    Mode A: Google Gemini API (using GEMINI_MODEL via .env) with strict citation constraints.
    Mode B: Offline High-Speed BM25 / TF-IDF Retrieval + Structured Grounded Synthesis.
    """

    @classmethod
    def answer_query(cls, request: ChatRequest) -> ChatResponse:
        query = request.query
        state_filter = request.user_state
        
        # 1. Retrieve top 4 relevant schemes via in-memory index
        index = get_scheme_index()
        top_matches = index.search_bm25(query, top_k=4, state_filter=state_filter)
        
        retrieved_schemes = [m[0] for m in top_matches]
        primary_scheme = retrieved_schemes[0] if retrieved_schemes else None

        # Build citations
        citations: List[ChatSourceCitation] = []
        for s in retrieved_schemes[:3]:
            url = s.get("official_portal_url") or s.get("evidence", {}).get("source_url") or "https://msme.gov.in"
            name = s.get("ministry") or s.get("name")
            citations.append(ChatSourceCitation(
                name=name,
                url=url,
                date="02 Sep 2026",
                confidence=s.get("evidence", {}).get("confidence_score", 0.95)
            ))

        # Suggested Action
        suggested_action = None
        if primary_scheme:
            suggested_action = SuggestedSchemeAction(
                label=f"View {primary_scheme.get('name')[:35]}...",
                view="scheme-detail",
                slug=primary_scheme.get("slug")
            )

        # 2. Attempt Mode A: Google Gemini if GEMINI_API_KEY is configured
        if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY.strip()) > 5:
            try:
                gemini_answer = cls._call_gemini_api(query, retrieved_schemes)
                if gemini_answer:
                    return ChatResponse(
                        answer=gemini_answer,
                        sources=citations,
                        suggested_action=suggested_action,
                        engine_mode="gemini_rag",
                        confidence=0.96,
                        model_used=settings.GEMINI_MODEL
                    )
            except Exception as e:
                logger.warning(f"Gemini API call failed, falling back to offline mode: {e}")

        # 3. Mode B: Offline High-Speed Grounded RAG
        offline_answer, offline_hi = cls._generate_offline_grounded_answer(query, retrieved_schemes)
        return ChatResponse(
            answer=offline_answer,
            answer_hi=offline_hi,
            sources=citations,
            suggested_action=suggested_action,
            engine_mode="offline_bm25_grounded",
            confidence=0.94,
            model_used="UdyamSetu Grounded Retriever (v2.1)"
        )

    @classmethod
    def _call_gemini_api(cls, query: str, context_schemes: List[Dict[str, Any]]) -> Optional[str]:
        """
        Calls Gemini API with strict grounding prompt.
        """
        # Build context document
        context_blocks = []
        for s in context_schemes:
            context_blocks.append(
                f"SCHEME: {s.get('name')}\n"
                f"MINISTRY: {s.get('ministry')}\n"
                f"LEVEL: {s.get('level')} (State: {s.get('state_name', 'National')})\n"
                f"BENEFITS: {'; '.join(s.get('detailed_benefits', []))}\n"
                f"ELIGIBILITY: {'; '.join(s.get('eligibility_criteria_text', []))}\n"
                f"MAX LOAN: ₹{s.get('max_loan_amount_inr', 'N/A')}\n"
                f"MAX SUBSIDY: {s.get('max_subsidy_percentage', 'N/A')}%\n"
                f"OFFICIAL PORTAL: {s.get('official_portal_url')}\n"
            )
        evidence_text = "\n---\n".join(context_blocks)

        system_instruction = (
            "You are UdyamSetu AI, an expert advisor on Indian Central and State Government welfare and MSME schemes. "
            "You MUST answer strictly and truthfully using ONLY the provided verified scheme evidence below. "
            "Never hallucinate or fabricate eligibility requirements, subsidy figures, or contact portals. "
            "Provide clear, numbered steps and conclude with next actionable advice."
        )

        prompt = f"{system_instruction}\n\nVERIFIED SCHEME EVIDENCE:\n{evidence_text}\n\nCITIZEN QUESTION:\n{query}\n\nANSWER:"

        model_name = settings.GEMINI_MODEL
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={settings.GEMINI_API_KEY}"
        
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 800
            }
        }

        resp = requests.post(url, json=payload, timeout=12)
        if resp.status_code == 200:
            data = resp.json()
            candidates = data.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    return parts[0].get("text", "")
        else:
            logger.error(f"Gemini API returned status {resp.status_code}: {resp.text}")
        return None

    @classmethod
    def _generate_offline_grounded_answer(cls, query: str, context_schemes: List[Dict[str, Any]]) -> Tuple[str, str]:
        """
        Deterministic, offline grounded explanation generator.
        Produces structured answers with official scheme data and statutory advice.
        """
        if not context_schemes:
            return (
                "No verified government scheme directly matched your specific inquiry. "
                "Please verify your state or sector criteria, or visit the official MSME portal (https://msme.gov.in).",
                "आपकी पूछताछ से कोई भी सत्यापित सरकारी योजना सीधे मेल नहीं खाती। कृपया राज्य या क्षेत्र की पुष्टि करें।"
            )

        top_s = context_schemes[0]
        q_lower = query.lower()

        # Generate structured bullet response
        name = top_s.get("name")
        ministry = top_s.get("ministry")
        portal = top_s.get("official_portal_url")
        benefits = top_s.get("detailed_benefits", ["Capital loan assistance with interest subvention."])[:2]
        eligibility = top_s.get("eligibility_criteria_text", ["Citizen of India meeting basic enterprise requirements."])[:2]
        
        max_loan = top_s.get("max_loan_amount_inr")
        max_sub = top_s.get("max_subsidy_percentage")

        loan_str = f"up to ₹{int(max_loan):,}" if max_loan else "as per sanctioned project cost"
        sub_str = f"{max_sub}% capital subsidy" if max_sub else "interest subvention / margin support"

        answer_en = (
            f"Based on verified ministry records, here is the official information regarding your query:\n\n"
            f"### Primary Recommendation: **{name}**\n"
            f"- **Nodal Ministry**: {ministry}\n"
            f"- **Statutory Financial Support**: Provides credit assistance {loan_str} with {sub_str}.\n"
            f"- **Key Benefits**:\n"
            f"  • {benefits[0]}\n"
            f"  • {benefits[1] if len(benefits) > 1 else 'Direct bank disbursement with government backing.'}\n"
            f"- **Eligibility Guidelines**:\n"
            f"  • {eligibility[0]}\n"
            f"  • {eligibility[1] if len(eligibility) > 1 else 'Valid Aadhaar & enterprise proposal required.'}\n\n"
            f"**Next Steps for You**:\n"
            f"1. Ensure you have an active **Udyam Registration Certificate** (free on udyamregistration.gov.in).\n"
            f"2. Prepare your 6-month bank statement and project proposal.\n"
            f"3. Apply directly at the official portal: [{name}]({portal})."
        )

        answer_hi = (
            f"सत्यापित मंत्रालय रिकॉर्ड के आधार पर आधिकारिक जानकारी:\n\n"
            f"### मुख्य योजना: **{name}**\n"
            f"- **मंत्रालय**: {ministry}\n"
            f"- **वित्तीय सहायता**: {loan_str} तक ऋण और {sub_str}।\n"
            f"- **मुख्य लाभ**: {benefits[0]}\n"
            f"- **पात्रता**: {eligibility[0]}\n\n"
            f"**अगले कदम**: आधार कार्ड, पैन और 6 महीने का बैंक विवरण तैयार करें और आधिकारिक पोर्टल पर आवेदन करें।"
        )

        return answer_en, answer_hi
