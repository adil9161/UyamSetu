"""
UdyamSetu Rule DSL Engine
Defines formal, machine-evaluable statutory rule schemas and operators.
Evaluates composite rules (AND/OR), range conditions (between), sets (in/not_in), and field checks.
Provides exact rule provenance (rule_id, field, actual, expected, source_id, status, explanation).
"""

from typing import Dict, Any, List, Tuple, Optional, Union
from enum import Enum

class RuleSeverity(str, Enum):
    BLOCKING = "blocking" # Hard statutory constraint -> Ineligible if failed
    SOFT = "soft"         # Prerequisite/document gap -> Near Match if failed

class RuleStatus(str, Enum):
    PASSED = "passed"
    FAILED = "failed"
    WARNING = "warning"

class RuleEvaluationItem:
    def __init__(
        self,
        rule_id: str,
        field: str,
        status: RuleStatus,
        severity: RuleSeverity,
        actual: Any,
        expected: Any,
        source_id: str,
        explanation: str,
        source_url: Optional[str] = None
    ):
        self.rule_id = rule_id
        self.field = field
        self.status = status
        self.severity = severity
        self.actual = actual
        self.expected = expected
        self.source_id = source_id
        self.explanation = explanation
        self.source_url = source_url

    def to_dict(self) -> Dict[str, Any]:
        return {
            "rule_id": self.rule_id,
            "field": self.field,
            "status": self.status.value,
            "severity": self.severity.value,
            "actual": self.actual,
            "expected": self.expected,
            "source_id": self.source_id,
            "source_url": self.source_url,
            "explanation": self.explanation
        }

class RuleDSL:
    @staticmethod
    def evaluate_atomic_condition(operator: str, actual_val: Any, expected_val: Any) -> bool:
        op = operator.lower().strip()
        
        if op in ["==", "equals", "eq"]:
            if isinstance(actual_val, str) and isinstance(expected_val, str):
                return actual_val.strip().lower() == expected_val.strip().lower()
            return actual_val == expected_val

        if op in ["!=", "not_equals", "neq"]:
            if isinstance(actual_val, str) and isinstance(expected_val, str):
                return actual_val.strip().lower() != expected_val.strip().lower()
            return actual_val != expected_val

        if op in [">=", "greater_or_equal", "gte"]:
            try:
                return float(actual_val) >= float(expected_val)
            except (ValueError, TypeError):
                return False

        if op in ["<=", "less_or_equal", "lte"]:
            try:
                return float(actual_val) <= float(expected_val)
            except (ValueError, TypeError):
                return False

        if op in [">", "greater_than", "gt"]:
            try:
                return float(actual_val) > float(expected_val)
            except (ValueError, TypeError):
                return False

        if op in ["<", "less_than", "lt"]:
            try:
                return float(actual_val) < float(expected_val)
            except (ValueError, TypeError):
                return False

        if op in ["between", "range"]:
            try:
                val = float(actual_val)
                if isinstance(expected_val, dict):
                    min_val = float(expected_val.get("min", float("-inf")))
                    max_val = float(expected_val.get("max", float("inf")))
                    return min_val <= val <= max_val
                elif isinstance(expected_val, (list, tuple)) and len(expected_val) >= 2:
                    return float(expected_val[0]) <= val <= float(expected_val[1])
            except (ValueError, TypeError):
                return False

        if op in ["in", "one_of"]:
            if isinstance(expected_val, list):
                if isinstance(actual_val, str):
                    return any(actual_val.strip().lower() == str(x).strip().lower() for x in expected_val)
                return actual_val in expected_val
            return False

        if op in ["not_in"]:
            if isinstance(expected_val, list):
                if isinstance(actual_val, str):
                    return not any(actual_val.strip().lower() == str(x).strip().lower() for x in expected_val)
                return actual_val not in expected_val
            return True

        if op in ["contains"]:
            if isinstance(actual_val, list):
                return any(str(expected_val).strip().lower() == str(item).strip().lower() for item in actual_val)
            elif isinstance(actual_val, str):
                return str(expected_val).strip().lower() in actual_val.strip().lower()
            return False

        if op in ["any"]:
            return True

        if op in ["requires", "is_true"]:
            return bool(actual_val)

        return False
