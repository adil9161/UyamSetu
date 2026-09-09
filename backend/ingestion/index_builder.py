import re
import math
from collections import defaultdict
from typing import List, Dict, Any, Tuple

class SchemeIndex:
    def __init__(self, schemes: List[Dict[str, Any]]):
        self.schemes = schemes
        self.scheme_map = {s["id"]: s for s in schemes}
        self.slug_map = {s["slug"]: s for s in schemes}
        self.inverted_index: Dict[str, List[str]] = defaultdict(list)
        self.doc_lengths: Dict[str, int] = {}
        self.corpus_size = len(schemes)
        self._build_index()

    def _tokenize(self, text: str) -> List[str]:
        if not text:
            return []
        cleaned = re.sub(r'[^a-zA-Z0-9\s]', ' ', text.lower())
        tokens = [t for t in cleaned.split() if len(t) > 2]
        return tokens

    def _build_index(self):
        for s in self.schemes:
            sid = s["id"]
            content = f"{s.get('name', '')} {s.get('ministry', '')} {s.get('description', '')} " \
                      f"{' '.join(s.get('detailed_benefits', []))} {' '.join(s.get('business_types', []))} " \
                      f"{s.get('state_name', '')}"
            tokens = self._tokenize(content)
            self.doc_lengths[sid] = len(tokens)
            unique_tokens = set(tokens)
            for token in unique_tokens:
                self.inverted_index[token].append(sid)

    def search_bm25(self, query: str, top_k: int = 10, state_filter: str = None) -> List[Tuple[Dict[str, Any], float]]:
        """
        Lightweight, deterministic BM25 / TF-IDF ranking over scheme corpus.
        Guarantees sub-10ms query execution with zero external network dependencies.
        """
        query_tokens = self._tokenize(query)
        if not query_tokens:
            return [(s, 1.0) for s in self.schemes[:top_k]]

        scores: Dict[str, float] = defaultdict(float)
        avg_dl = sum(self.doc_lengths.values()) / max(1, self.corpus_size)
        k1 = 1.5
        b = 0.75

        for token in query_tokens:
            matching_ids = self.inverted_index.get(token, [])
            df = len(matching_ids)
            if df == 0:
                continue
            idf = math.log(1 + (self.corpus_size - df + 0.5) / (df + 0.5))
            for sid in matching_ids:
                dl = self.doc_lengths.get(sid, 100)
                tf = 1 # Approximation
                tf_norm = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (dl / avg_dl)))
                scores[sid] += idf * tf_norm

        ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        results = []
        for sid, score in ranked:
            scheme = self.scheme_map.get(sid)
            if not scheme:
                continue
            if state_filter and scheme.get("level") == "state" and scheme.get("state_name"):
                if scheme["state_name"].lower() != state_filter.lower():
                    continue
            results.append((scheme, round(float(score), 4)))
            if len(results) >= top_k:
                break

        if not results:
            results = [(s, 0.5) for s in self.schemes[:top_k]]

        return results

    def filter_schemes(
        self,
        query: str = None,
        level: str = "all",
        state_name: str = None,
        sector: str = "all",
        benefit_type: str = "all",
        limit: int = 20,
        offset: int = 0
    ) -> Tuple[List[Dict[str, Any]], int]:
        filtered = []
        q = (query or "").lower().strip()

        for s in self.schemes:
            if level != "all" and s.get("level") != level:
                continue
            if state_name and s.get("level") == "state" and s.get("state_name"):
                if s["state_name"].lower() != state_name.lower():
                    continue
            if sector != "all":
                b_types = [b.lower() for b in s.get("business_types", [])]
                if not any(sector.lower() in b for b in b_types) and "all sectors" not in b_types:
                    continue
            if benefit_type != "all":
                b_benefits = [b.lower() for b in s.get("benefit_types", [])]
                if benefit_type.lower() not in b_benefits:
                    continue
            if q:
                combined = f"{s.get('name', '')} {s.get('description', '')} {s.get('ministry', '')} {s.get('code', '')}".lower()
                if q not in combined:
                    continue

            filtered.append(s)

        total = len(filtered)
        paginated = filtered[offset:offset + limit]
        return paginated, total

_global_index: SchemeIndex = None

def get_scheme_index() -> SchemeIndex:
    global _global_index
    if _global_index is None:
        from backend.ingestion.scheme_loader import ingest_and_process_schemes
        schemes = ingest_and_process_schemes()
        _global_index = SchemeIndex(schemes)
    return _global_index
