"""
UdyamSetu Intent Mapper
Maps user financial and operational support needs to scheme benefit affinities.
"""

from typing import List, Dict, Any, Tuple

INTENT_BENEFIT_MAP = {
    "starting_capital": ["subsidy", "grant", "loan"],
    "working_capital": ["working_capital", "credit_guarantee", "loan"],
    "machinery_equipment": ["equipment", "subsidy", "loan", "term_loan"],
    "term_loan": ["loan", "term_loan", "credit_guarantee"],
    "subsidy": ["subsidy", "grant"],
    "training": ["training", "skill"],
    "market_access": ["market_access", "exhibition", "support"]
}

class IntentMapper:
    @staticmethod
    def calculate_intent_fit(intents: List[str], scheme: Dict[str, Any]) -> Tuple[float, List[str]]:
        """
        Calculates need fit score (0 to 100) and returns matched reasons.
        """
        scheme_benefits = [b.lower() for b in scheme.get("benefit_types", [])]
        desc = (scheme.get("description", "") + " " + scheme.get("name", "")).lower()

        matched_intents: List[str] = []
        score_accumulator = 0.0

        for intent in intents:
            target_benefits = INTENT_BENEFIT_MAP.get(intent, [intent])
            has_match = any(tb in scheme_benefits or tb in desc for tb in target_benefits)
            if has_match:
                matched_intents.append(intent.replace("_", " ").title())
                score_accumulator += 1.0

        if not intents:
            return 50.0, ["Standard financial enterprise support."]

        ratio = score_accumulator / len(intents)
        score = min(100.0, max(20.0, ratio * 100.0))
        reasons = [f"Directly addresses your stated need for: {', '.join(matched_intents)}."] if matched_intents else []
        return score, reasons
