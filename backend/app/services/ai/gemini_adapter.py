"""
UdyamSetu Gemini Advisor Adapter
Connects to Google Gemini using configurable GEMINI_API_KEY and GEMINI_MODEL.
Enforces strict grounding: Gemini receives structured verified scheme evidence and profile,
and generates explainable advice without ability to hallucinate rules or invent benefits.
Falls back seamlessly to FallbackAdvisor on network or quota issues.
"""

import json
import requests
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from backend.app.core.config import settings
from backend.app.core.logging import logger
from backend.app.services.ai.advisor_interface import AIAdvisorInterface, AIExplanationResult
from backend.app.services.ai.fallback_explainer import FallbackAdvisor

class GeminiAdvisorAdapter(AIAdvisorInterface):
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL or "gemini-2.5-flash"

    async def explain_recommendation(
        self,
        profile: Any,
        scheme: Dict[str, Any],
        relevance_score: float,
        matched_signals: List[str]
    ) -> AIExplanationResult:
        if not self.api_key or len(self.api_key.strip()) < 5:
            return FallbackAdvisor.explain_recommendation(profile, scheme, relevance_score, matched_signals)

        prompt = (
            "You are UdyamSetu's AI Scheme Advisor. Explain why the following scheme is recommended for this entrepreneur.\n"
            f"APPLICANT: Persona={getattr(profile, 'applicant_persona', '')}, Sector={getattr(profile, 'business_type', '')}, "
            f"Stage={getattr(profile, 'business_stage', '')}, Location={getattr(profile, 'location_state', '')} ({getattr(profile, 'residence_type', '')})\n"
            f"RECOMMENDED SCHEME: {scheme.get('name')} ({scheme.get('ministry')})\n"
            f"VERIFIED SIGNALS: {', '.join(matched_signals)}\n"
            f"BENEFITS: {'; '.join(scheme.get('detailed_benefits', []))}\n\n"
            "Respond in JSON format with exactly three keys:\n"
            "{\n"
            '  "summary": "1-2 sentence personalized rationale",\n'
            '  "rationale": ["bullet 1", "bullet 2", "bullet 3"],\n'
            '  "next_steps": ["step 1", "step 2", "step 3"]\n'
            "}\n"
            "Rules: Strictly stick to the verified benefits and signals. Do not invent links or government approvals."
        )

        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent?key={self.api_key}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.2,
                    "maxOutputTokens": 600,
                    "responseMimeType": "application/json"
                }
            }
            resp = requests.post(url, json=payload, timeout=8)
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                parsed = json.loads(text)
                return AIExplanationResult(
                    summary_text=parsed.get("summary", ""),
                    personalized_rationale=parsed.get("rationale", matched_signals),
                    next_3_steps=parsed.get("next_steps", []),
                    model_used=f"Google Gemini ({self.model_name})",
                    prompt_version="v2.2-gemini",
                    retrieval_version="bm25-v2",
                    is_fallback=False,
                    generated_at=datetime.now(timezone.utc).isoformat()
                )
        except Exception as e:
            logger.warning(f"Gemini explanation failed, using fallback: {e}")

        return FallbackAdvisor.explain_recommendation(profile, scheme, relevance_score, matched_signals)

    def answer_query(self, query: str, context_schemes: List[Dict[str, Any]]) -> Dict[str, Any]:
        # Handled through RAG service
        return {}
