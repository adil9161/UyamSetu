# Implementation Plan: Final Locked Architecture — UdyamSetu Intelligence Backend

Locked 10-Phase execution plan for the **UdyamSetu Intelligence Backend** and Full-Stack React Integration.

---

## 10-Phase Execution Sequence

- **Phase 1**: Database + Models + Config (`backend/app/core/`, `backend/app/db/`, `backend/app/schemas/`)
- **Phase 2**: Scheme Ingestion Pipeline & Structured Rules (`backend/ingestion/`)
- **Phase 3**: Rule Engine (Deterministic statutory evaluation) (`backend/app/engine/rule_engine.py`)
- **Phase 4**: Scoring + Ranking + Explainability (`scoring_engine.py`, `ranking_engine.py`, `explanation_engine.py`, `/api/matching/explain`)
- **Phase 5**: Evidence + Grounded Hybrid RAG (Configurable `GEMINI_MODEL` + Offline BM25/TF-IDF)
- **Phase 6**: Applications + Governance + Auditing (`application_service.py`, `audit_service.py`, `recommendation_history`)
- **Phase 7**: REST APIs + Protected Admin Endpoints + Swagger (`/api/*`, `/admin/*`, `/docs`)
- **Phase 8**: React Integration (`src/services/api.ts`, `AppContext.tsx`, Animated Decision Tree)
- **Phase 9**: Testing & Low-Latency Retrieval Benchmarking (`/api/health/benchmark`)
- **Phase 10**: SIH Demo Hardening & One-Click Showcase Profiles

---

## Key Refinements Incorporated
1. **Configurable Gemini Model**: Uses `GEMINI_API_KEY` and `GEMINI_MODEL` (default: `gemini-2.0-flash` or `gemini-1.5-flash`) via `.env`.
2. **Structured `scheme_rules` Model**: Explicit rule structure (`rule_type`, `field`, `operator`, `expected_value`, `mandatory`, `explanation`, `source_id`).
3. **Dedicated Ingestion Pipeline** (`backend/ingestion/`): Loader, normalizer, validator, version manager (SHA-256 hash), and index builder.
4. **Protected Admin Endpoints**: `/admin/demo/reset`, `/admin/governance/*` secured with admin authentication/token.
5. **Decision Explain Endpoint** (`POST /api/matching/explain`): Powers step-by-step decision animations on the frontend.
