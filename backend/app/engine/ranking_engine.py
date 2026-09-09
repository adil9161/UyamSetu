from typing import List, Tuple
from backend.app.schemas.matching import MatchResultItem

class RankingEngine:
    """
    Tier-Partitioning and Priority Ranking Engine.
    Partitions schemes into Eligible, Potentially Eligible, and Ineligible tiers.
    """

    @classmethod
    def rank_and_partition(
        cls,
        results: List[MatchResultItem]
    ) -> Tuple[List[MatchResultItem], List[MatchResultItem], List[MatchResultItem]]:
        best_matches: List[MatchResultItem] = []
        near_matches: List[MatchResultItem] = []
        ineligible_schemes: List[MatchResultItem] = []

        for item in results:
            if item.eligibility_status == "eligible":
                best_matches.append(item)
            elif item.eligibility_status == "potentially_eligible":
                near_matches.append(item)
            else:
                ineligible_schemes.append(item)

        # Sort each tier by relevance score descending
        best_matches.sort(key=lambda x: x.relevance_score, reverse=True)
        near_matches.sort(key=lambda x: x.relevance_score, reverse=True)
        ineligible_schemes.sort(key=lambda x: x.relevance_score, reverse=True)

        return best_matches, near_matches, ineligible_schemes
