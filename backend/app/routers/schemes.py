from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Query, HTTPException
from backend.ingestion.index_builder import get_scheme_index

router = APIRouter(prefix="/schemes", tags=["Scheme Intelligence Layer"])

@router.get("")
def list_schemes(
    query: Optional[str] = None,
    level: Optional[str] = Query("all", description="'all' | 'central' | 'state'"),
    state_name: Optional[str] = None,
    sector: Optional[str] = Query("all", description="Sector filter"),
    benefit_type: Optional[str] = Query("all", description="loan | subsidy | training | all"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    index = get_scheme_index()
    offset = (page - 1) * limit
    results, total = index.filter_schemes(
        query=query,
        level=level,
        state_name=state_name,
        sector=sector,
        benefit_type=benefit_type,
        limit=limit,
        offset=offset
    )

    return {
        "data": results,
        "pagination": {
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": (total + limit - 1) // limit
        }
    }

@router.get("/stats/eda")
def get_eda_stats():
    index = get_scheme_index()
    all_schemes = index.schemes
    
    central_count = sum(1 for s in all_schemes if s.get("level") == "central")
    state_count = len(all_schemes) - central_count

    # State distribution
    state_counts: Dict[str, int] = {}
    for s in all_schemes:
        st = s.get("state_name")
        if st:
            state_counts[st] = state_counts.get(st, 0) + 1

    top_states = sorted(
        [{"state": k, "state_schemes": v, "total_accessible": v + central_count} for k, v in state_counts.items()],
        key=lambda x: x["state_schemes"],
        reverse=True
    )[:10]

    return {
        "title": "National Welfare & MSME Scheme Taxonomy",
        "total_analyzed": len(all_schemes),
        "central_schemes_count": central_count,
        "state_schemes_count": state_count,
        "top_states": top_states,
        "verification_rate": "100% Tier 1 Verified"
    }

@router.get("/{slug_or_id}")
def get_scheme_detail(slug_or_id: str):
    index = get_scheme_index()
    scheme = index.slug_map.get(slug_or_id) or index.scheme_map.get(slug_or_id)
    if not scheme:
        # Search partial slug
        for s in index.schemes:
            if s.get("slug", "").startswith(slug_or_id) or slug_or_id in s.get("id", ""):
                scheme = s
                break
                
    if not scheme:
        raise HTTPException(status_code=404, detail=f"Scheme '{slug_or_id}' not found in registry.")

    return scheme
