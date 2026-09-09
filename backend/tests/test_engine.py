import sys
import os

# Configure UTF-8 output
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from backend.app.schemas.profile import UserProfileSchema
from backend.ingestion.index_builder import get_scheme_index
from backend.app.engine.rule_engine import RuleEngine
from backend.app.engine.scoring_engine import ScoringEngine
from backend.app.engine.ranking_engine import RankingEngine
from backend.app.services.matching_service import MatchingService
from backend.app.services.rag_service import RAGService
from backend.app.schemas.ai import ChatRequest

def run_all_tests():
    print(">>> Running UdyamSetu Intelligence Engine Tests...")

    # Test 1: Ingestion
    index = get_scheme_index()
    assert len(index.schemes) > 0, "Schemes must be indexed"
    print(f"[PASS] Test 1: {len(index.schemes)} schemes successfully ingested with structured rules.")

    # Test 2: Profile A - UP Woman Artisan
    profile_a = UserProfileSchema(
        location_state="Uttar Pradesh",
        business_type="Textile",
        applicant_persona="artisan",
        gender="female",
        social_category="OBC",
        is_traditional_artisan=True
    )
    res_a = MatchingService.execute_matching(profile_a)
    assert len(res_a.best_matches) > 0, "Profile A must produce best matches"
    top_a = res_a.best_matches[0]
    print(f"[PASS] Test 2: Profile A top match: '{top_a.scheme_name}' (Score: {top_a.relevance_score}%, Status: {top_a.eligibility_status})")
    assert len(top_a.why_matched) > 0, "Must have why matched reasons"
    assert len(top_a.next_best_actions) > 0, "Must have next best actions"

    # Test 3: Profile B - Urban Street Vendor in Delhi
    profile_b = UserProfileSchema(
        location_state="Delhi",
        business_type="Retail",
        applicant_persona="street_vendor",
        gender="male",
        social_category="General",
        is_street_vendor=True,
        is_traditional_artisan=False
    )
    res_b = MatchingService.execute_matching(profile_b)
    assert len(res_b.best_matches) > 0
    top_b = res_b.best_matches[0]
    print(f"[PASS] Test 3: Profile B top match: '{top_b.scheme_name}' (Score: {top_b.relevance_score}%, Status: {top_b.eligibility_status})")

    # Test 4: Ineligibility Testing
    state_scheme = next((s for s in index.schemes if s.get("level") == "state" and s.get("state_name") and s.get("state_name").lower() != "uttar pradesh"), None)
    if state_scheme:
        eval_res = RuleEngine.evaluate_scheme(state_scheme, profile_a)
        assert eval_res.eligibility_status in ["ineligible", "not_eligible"], f"Mismatched state scheme must be ineligible (got {eval_res.eligibility_status})"
        assert len(eval_res.why_not_reasons) > 0, "Must have explicit 'Why Not' reasons"
        print(f"[PASS] Test 4: Ineligible state scheme correctly disqualified with reason: '{eval_res.why_not_reasons[0]}'")

    # Test 5: Grounded RAG Chat
    chat_res = RAGService.answer_query(ChatRequest(query="What is the subsidy under PMEGP for women in rural areas?"))
    assert len(chat_res.answer) > 20, "Must return grounded answer"
    assert len(chat_res.sources) > 0, "Must return official citations"
    print(f"[PASS] Test 5: Grounded RAG generated answer (mode: {chat_res.engine_mode}) with {len(chat_res.sources)} official citations.")

    # Test 6: Decision Explain Endpoint
    explain_res = MatchingService.explain_matching(top_a.scheme_id, profile_a)
    assert len(explain_res.decision_trail) >= 5, "Must have step-by-step decision trail for animation"
    print(f"[PASS] Test 6: Decision explanation generated {len(explain_res.decision_trail)} animation steps.")

    print("\n>>> ALL 6 INTELLIGENCE TESTS PASSED SUCCESSFULLY! 🚀")

if __name__ == "__main__":
    run_all_tests()
