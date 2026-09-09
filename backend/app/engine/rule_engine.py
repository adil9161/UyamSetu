"""
UdyamSetu Deterministic Statutory Rule Engine v2.2
Evaluates Rule DSL definitions against user profile attributes.
Separates hard statutory disqualifications (INELIGIBLE) from actionable soft gaps (NEAR_MATCH).
Provides full rule provenance (rule_id, field, actual, expected, source_id, status, explanation).
"""

from typing import Dict, Any, List, Tuple, Optional
from enum import Enum
from backend.app.schemas.profile import UserProfileSchema
from backend.app.engine.rule_dsl import RuleDSL, RuleSeverity, RuleStatus, RuleEvaluationItem

class EligibilityStatus(str, Enum):
    ELIGIBLE = "eligible"
    NEAR_MATCH = "near_match"
    INELIGIBLE = "ineligible"

class StatutoryEvaluationResult:
    def __init__(
        self,
        scheme_id: str,
        eligibility_status: EligibilityStatus,
        eligibility_label: str,
        rules_passed: List[str],
        rules_failed: List[str],
        missing_requirements: List[str],
        why_not_reasons: List[str],
        decision_steps: List[Dict[str, Any]],
        readiness_percentage: int
    ):
        self.scheme_id = scheme_id
        self.eligibility_status = eligibility_status.value
        self.eligibility_label = eligibility_label
        self.rules_passed = rules_passed
        self.rules_failed = rules_failed
        self.missing_requirements = missing_requirements
        self.why_not_reasons = why_not_reasons
        self.decision_steps = decision_steps
        self.readiness_percentage = readiness_percentage

class RuleEngine:
    @staticmethod
    def evaluate_rule(rule: Dict[str, Any], profile: UserProfileSchema) -> RuleEvaluationItem:
        rule_id = rule.get("id", "GEN-RULE-01")
        field = rule.get("field", "")
        operator = rule.get("operator", "==")
        expected = rule.get("expected_value")
        severity_str = rule.get("severity", "blocking" if rule.get("mandatory", True) else "soft")
        severity = RuleSeverity.BLOCKING if severity_str == "blocking" else RuleSeverity.SOFT
        source_id = rule.get("source_id", "STATUTORY-NOTIF")
        source_url = rule.get("source_url")
        explanation = rule.get("explanation", "")

        # Extract actual value from profile
        actual_val = None
        if field == "location_state":
            actual_val = profile.location_state
        elif field == "residence_type":
            actual_val = profile.residence_type
        elif field == "gender":
            actual_val = profile.gender
        elif field == "demographic_composite":
            actual_val = "female" if profile.gender == "female" else profile.social_category
        elif field == "is_street_vendor":
            actual_val = profile.is_street_vendor or profile.applicant_persona == "street_vendor"
        elif field == "is_traditional_artisan":
            actual_val = profile.is_traditional_artisan or profile.applicant_persona == "artisan"
        elif field == "business_type":
            actual_val = profile.business_type
        elif field == "age":
            actual_val = profile.age
        elif field == "business_stage":
            actual_val = profile.business_stage
        elif field == "revenue_range":
            actual_val = profile.revenue_range
        elif field == "has_udyam_registration":
            actual_val = profile.has_udyam_registration
        else:
            actual_val = getattr(profile, field, None)

        # Composite Demographics Special Handling (e.g. Stand-Up India: Female OR SC/ST)
        if field == "demographic_composite":
            is_female = profile.gender == "female"
            is_sc_st = profile.social_category in ["SC", "ST", "SC/ST"]
            passed = is_female or is_sc_st
            status = RuleStatus.PASSED if passed else RuleStatus.FAILED
            msg = f"✓ Statutory Criteria Satisfied: Qualifies as a {'Woman' if is_female else profile.social_category} entrepreneur under affirmative action mandate." if passed else "✕ Statutory Reservation: Available exclusively for Women OR SC/ST promoters."
            return RuleEvaluationItem(
                rule_id=rule_id,
                field=field,
                status=status,
                severity=severity,
                actual=actual_val,
                expected=expected,
                source_id=source_id,
                explanation=msg,
                source_url=source_url
            )

        # General Operator Evaluation via RuleDSL
        passed = RuleDSL.evaluate_atomic_condition(operator, actual_val, expected)

        if passed:
            status = RuleStatus.PASSED
            msg = f"✓ {explanation}" if explanation else f"✓ Requirement satisfied for {field}."
        else:
            status = RuleStatus.FAILED if severity == RuleSeverity.BLOCKING else RuleStatus.WARNING
            if severity == RuleSeverity.BLOCKING:
                msg = f"✕ Requirement not met: {field} (Your profile: {actual_val}, Required: {expected})."
            else:
                msg = f"⚠ Prerequisite Pending: {explanation or field}."

        return RuleEvaluationItem(
            rule_id=rule_id,
            field=field,
            status=status,
            severity=severity,
            actual=actual_val,
            expected=expected,
            source_id=source_id,
            explanation=msg,
            source_url=source_url
        )

    @classmethod
    def evaluate_scheme(cls, scheme: Dict[str, Any], profile: UserProfileSchema) -> StatutoryEvaluationResult:
        rules = scheme.get("structured_rules", [])
        rules_passed: List[str] = []
        rules_failed: List[str] = []
        missing_requirements: List[str] = []
        why_not_reasons: List[str] = []
        decision_steps: List[Dict[str, Any]] = []

        has_blocking_failure = False
        has_soft_gap = False

        for rule in rules:
            item = cls.evaluate_rule(rule, profile)
            decision_steps.append(item.to_dict())

            if item.status == RuleStatus.PASSED:
                rules_passed.append(item.explanation)
            elif item.status == RuleStatus.FAILED:
                has_blocking_failure = True
                rules_failed.append(item.explanation)
                why_not_reasons.append(item.explanation)
            elif item.status == RuleStatus.WARNING:
                has_soft_gap = True
                missing_requirements.append(item.explanation)
                rules_passed.append(item.explanation) # Recorded as soft gap

        # Strict 3-Tier Partitioning
        if has_blocking_failure:
            status = EligibilityStatus.INELIGIBLE
            label = "🔴 Statutory Requirements Not Met"
            readiness = 20
        elif has_soft_gap:
            status = EligibilityStatus.NEAR_MATCH
            label = "🟡 Potentially Eligible — Action Required"
            readiness = 70
        else:
            status = EligibilityStatus.ELIGIBLE
            label = "🟢 Verified Eligible under Current Norms"
            readiness = 95

        return StatutoryEvaluationResult(
            scheme_id=str(scheme.get("id")),
            eligibility_status=status,
            eligibility_label=label,
            rules_passed=rules_passed,
            rules_failed=rules_failed,
            missing_requirements=missing_requirements,
            why_not_reasons=why_not_reasons,
            decision_steps=decision_steps,
            readiness_percentage=readiness
        )
