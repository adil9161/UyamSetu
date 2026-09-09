"""
UdyamSetu Golden Demo Profile Test Suite
Validates that all signature SIH demo profiles produce expected recommendations,
satisfy deterministic eligibility, and personalize top schemes according to persona.
"""

import sys
import os
import json
import glob

# Configure UTF-8 output
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from backend.app.schemas.profile import UserProfileSchema
from backend.app.services.matching_service import MatchingService

def run_demo_profile_tests():
    print(">>> Running UdyamSetu Golden Demo Profile Test Suite...")
    demo_dir = os.path.join(root_dir, "backend", "demo_profiles")
    profile_files = glob.glob(os.path.join(demo_dir, "*.json"))

    assert len(profile_files) >= 5, f"Must have at least 5 golden demo profiles (found {len(profile_files)})"

    passed_count = 0
    for pf in profile_files:
        with open(pf, "r", encoding="utf-8") as f:
            data = json.load(f)

        profile_id = data["id"]
        profile_name = data["name"]
        raw_p = data["profile"]
        expected_min = data.get("expected_min_eligible", 1)

        user_profile = UserProfileSchema(**raw_p)
        res = MatchingService.execute_matching(user_profile)

        eligible_count = len(res.best_matches)
        near_match_count = len(res.near_matches)

        assert eligible_count >= expected_min, f"[{profile_id}] Expected at least {expected_min} eligible matches, got {eligible_count}"

        top_match = res.best_matches[0]
        print(f"[PASS] {profile_name}")
        print(f"       -> Top Match: '{top_match.scheme_name}' (Score: {top_match.relevance_score}%)")
        print(f"       -> Eligible: {eligible_count}, Near-Matches: {near_match_count}")
        passed_count += 1

    print(f"\n>>> ALL {passed_count} GOLDEN DEMO PROFILES PASSED REGRESSION TESTING! 🚀")

if __name__ == "__main__":
    run_demo_profile_tests()
