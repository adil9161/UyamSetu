# UdyamSetu Versioned REST API Contract (/api/v1/*)

## Endpoints Overview

### 1. Matching & Recommendations
- `POST /api/v1/matching/calculate`
  - **Request**: `UserProfileSchema`
  - **Response**: `MatchingResponse`
    - `best_matches`: List of eligible schemes with relevance score $\ge 50$
    - `near_matches`: List of near-match schemes with actionable gap analysis
    - `ineligible_schemes`: Disqualified schemes with failed rule reasons
    - `summary`: `{ total_evaluated, eligible_count, near_match_count, ineligible_count }`
    - `evaluated_at`: ISO timestamp

- `POST /api/v1/matching/explain`
  - **Request**: `{ "scheme_id": string, "profile": UserProfileSchema }`
  - **Response**: `MatchingExplainResponse`
    - `decision_trail`: 7-step sequential evaluation animation with status and details
    - `rules_passed`: List of verified condition strings
    - `rules_failed`: List of failed constraint strings
    - `next_best_actions`: Step-by-step roadmap to sanction

### 2. MSME Udyam Verification
- `POST /api/v1/udyam/verify`
  - **Request**: `{ "registration_number": "UDYAM-UP-00-1234567" }`
  - **Response**: `UdyamVerificationResult`
    - `is_valid`: boolean
    - `enterprise_name`: string
    - `organization_type`: string
    - `major_activity`: string
    - `verification_status`: `"verified" | "unverified" | "format_error"`
    - `source`: Gateway provenance

### 3. Grounded AI Advisor
- `POST /api/v1/ai/chat`
  - **Request**: `{ "query": string, "user_state": string, "user_sector": string }`
  - **Response**: `ChatResponse`
    - `answer`: Grounded natural-language guidance
    - `sources`: List of official citations with URLs and confidence
    - `engine_mode`: `"gemini_rag" | "offline_bm25_grounded"`
    - `model_used`: string

### 4. Health & Latency Benchmarking
- `GET /api/v1/health/benchmark`
  - **Response**: Real measured P50 and P95 latency breakdown across retrieval, rule evaluation, personalization, and AI.
