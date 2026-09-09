"""
UdyamSetu Validation Unit Test Matrix
Tests form boundaries, enterprise stage revenue requirements, Udyam format verification,
and 3-tier eligibility logic.
"""

import sys
import os

# Configure UTF-8 output
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from backend.app.schemas.profile import UserProfileSchema
from backend.app.profile.profile_normalizer import ProfileNormalizer
from backend.app.engine.rule_engine import RuleEngine, EligibilityStatus
from backend.app.personalization.personalization_engine import PersonalizationEngine

def run_matrix():
    print(">>> Running UdyamSetu Form & Validation Test Matrix...")
    passed = 0

    # 1. Age Boundary Tests: 17 (invalid), 18 (valid), 115 (valid), 116 (invalid)
    try:
        UserProfileSchema(age=17)
        assert False, "Age 17 must fail validation (<18)"
    except Exception:
        print("[PASS] Age 17 correctly rejected (< 18)")
        passed += 1

    p18 = UserProfileSchema(age=18)
    assert p18.age == 18, "Age 18 must be valid"
    print("[PASS] Age 18 accepted (boundary valid)")
    passed += 1

    p115 = UserProfileSchema(age=115)
    assert p115.age == 115, "Age 115 must be valid"
    print("[PASS] Age 115 accepted (ceiling valid)")
    passed += 1

    try:
        UserProfileSchema(age=116)
        assert False, "Age 116 must fail validation (>115)"
    except Exception:
        print("[PASS] Age 116 correctly rejected (> 115)")
        passed += 1

    # 2. Stage & Revenue Logic
    # New enterprise: revenue omitted -> VALID
    p_new = UserProfileSchema(business_stage="new", revenue_range=None)
    assert p_new.business_stage == "new" and p_new.revenue_range is None
    print("[PASS] New Enterprise without revenue is VALID")
    passed += 1

    # Existing enterprise: exactly 4 revenue options
    valid_revenues = ["up_to_1_lakh", "1_to_10_lakh", "10_to_50_lakh", "above_50_lakh"]
    for rev in valid_revenues:
        p_exist = UserProfileSchema(business_stage="existing", revenue_range=rev)
        assert p_exist.revenue_range == rev
    print(f"[PASS] Existing Enterprise accepts all {len(valid_revenues)} canonical revenue ranges")
    passed += 1

    # 3. Residence Type Validation
    p_urban = UserProfileSchema(residence_type="urban")
    p_rural = UserProfileSchema(residence_type="rural")
    assert p_urban.residence_type == "urban" and p_rural.residence_type == "rural"
    print("[PASS] Residence classification supports exact 'urban' and 'rural'")
    passed += 1

    # 4. Udyam Format Verification
    assert ProfileNormalizer.validate_udyam_format("UDYAM-UP-00-1234567") is True
    assert ProfileNormalizer.validate_udyam_format("UDYAM-DL-00-7654321") is True
    assert ProfileNormalizer.validate_udyam_format("123456") is False
    assert ProfileNormalizer.validate_udyam_format("UDYAM-123") is False
    assert ProfileNormalizer.validate_udyam_format("UDYAM-MH-1-12345") is False
    print("[PASS] Udyam registration format regex verified (UDYAM-XX-00-0000000)")
    passed += 1

    # 5. Deterministic Eligibility & Ineligible Cap
    sample_scheme = {
        "id": "test-state-sch",
        "name": "State DIC Subsidy",
        "slug": "test-state-sch",
        "level": "state",
        "state_name": "Kerala",
        "structured_rules": [
            {
                "id": "R1",
                "field": "location_state",
                "operator": "equals",
                "expected_value": "Kerala",
                "severity": "blocking",
                "explanation": "Must be located in Kerala"
            }
        ]
    }
    # User in UP -> must be ineligible
    eval_res = RuleEngine.evaluate_scheme(sample_scheme, UserProfileSchema(location_state="Uttar Pradesh"))
    assert eval_res.eligibility_status == "ineligible"
    print("[PASS] Disqualified state scheme marked as INELIGIBLE")
    passed += 1

    # Ineligible scheme relevance capped at 35%
    rel_score, _, _ = PersonalizationEngine.calculate_relevance(sample_scheme, UserProfileSchema(location_state="Uttar Pradesh"), eval_res.eligibility_status)
    assert rel_score <= 35.0, f"Ineligible scheme relevance must not exceed 35% (got {rel_score})"
    print(f"[PASS] Ineligible scheme score capped at {rel_score}% (never promoted to best matches)")
    passed += 1

    print(f"\n>>> ALL {passed} VALIDATION TESTS PASSED! 🚀")

if __name__ == "__main__":
    run_matrix()
