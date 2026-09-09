"""
UdyamSetu AI Advisor Policy & Interface
Strict statutory boundaries: AI explains and guides; it must NEVER invent eligibility or override rules.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class AIAdvisorPolicy(BaseModel):
    may_explain_eligibility: bool = True
    may_rank_eligible_schemes: bool = True
    may_suggest_preparation_steps: bool = True
    may_suggest_questions: bool = True
    may_invent_eligibility: bool = False
    may_invent_benefits: bool = False
    may_invent_application_links: bool = False
    may_override_hard_rules: bool = False
    may_claim_government_approval: bool = False

POLICY_V2 = AIAdvisorPolicy()

class AIExplanationResult(BaseModel):
    summary_text: str
    personalized_rationale: List[str]
    next_3_steps: List[str]
    model_used: str
    prompt_version: str = "v2.2"
    retrieval_version: str = "bm25-v2"
    is_fallback: bool = False
    generated_at: str

class AIAdvisorInterface(ABC):
    @abstractmethod
    async def explain_recommendation(
        self,
        profile: Any,
        scheme: Dict[str, Any],
        relevance_score: float,
        matched_signals: List[str]
    ) -> AIExplanationResult:
        pass

    @abstractmethod
    def answer_query(self, query: str, context_schemes: List[Dict[str, Any]]) -> Dict[str, Any]:
        pass
