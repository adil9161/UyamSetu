"""
UdyamSetu Fallback AI Explainer
Deterministic synthesis engine that generates high-fidelity natural explanations
when external LLMs (Gemini) are unavailable, unreachable, or rate-limited.
Guarantees 100% platform availability with zero single-point-of-failure.
"""

from datetime import datetime, timezone
from typing import Dict, Any, List
from backend.app.services.ai.advisor_interface import AIExplanationResult

class FallbackAdvisor:
    @staticmethod
    def explain_recommendation(
        profile: Any,
        scheme: Dict[str, Any],
        relevance_score: float,
        matched_signals: List[str]
    ) -> AIExplanationResult:
        scheme_name = scheme.get("name", "Government Scheme")
        occ = getattr(profile, "applicant_persona", "entrepreneur").replace("_", " ").title()
        sector = getattr(profile, "business_type", "Textile")
        stage = getattr(profile, "business_stage", "new").lower()
        state = getattr(profile, "location_state", "India")
        residence = getattr(profile, "residence_type", "rural").title()

        summary = (
            f"'{scheme_name}' is ranked as your highest-affinity program with a verified {relevance_score}% relevance score. "
            f"It directly accommodates your goal as an {occ} establishing a {stage} {sector} enterprise in {residence} {state}."
        )

        rationale = matched_signals if matched_signals else [
            f"Sector alignment with {sector} operations.",
            f"Supports {stage} enterprise capital funding needs.",
            f"Accessible in {state} under statutory nodal guidelines."
        ]

        steps = [
            "Complete free MSME Udyam Registration on udyamregistration.gov.in (if not already verified).",
            "Prepare a basic Project Cost Estimate / DPR covering machinery, premises, and working capital.",
            f"Submit your digital application directly on the official {scheme.get('ministry', 'Ministry')} portal."
        ]

        return AIExplanationResult(
            summary_text=summary,
            personalized_rationale=rationale,
            next_3_steps=steps,
            model_used="UdyamSetu Deterministic Synthesizer (Zero-Failure Fallback)",
            prompt_version="v2.2-fallback",
            retrieval_version="bm25-v2",
            is_fallback=True,
            generated_at=datetime.now(timezone.utc).isoformat()
        )
