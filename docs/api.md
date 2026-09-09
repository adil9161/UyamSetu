# UdyamSetu — OpenAPI & REST API Specification

This document provides complete, accurate documentation for all endpoints implemented in the **UdyamSetu Intelligence Backend** (`v2.1.0`).

Interactive OpenAPI / Swagger documentation is available at runtime at `http://127.0.0.1:8000/docs` or ReDoc at `http://127.0.0.1:8000/redoc`.

---

## 1. Authentication & Citizen Profile

### 1.1 Register Citizen Account
- **Endpoint**: `POST /api/auth/register` (and `/api/v1/auth/register`)
- **Summary**: Creates a citizen account and seeds the associated profile with demographic details for deterministic scheme eligibility.
- **Auth**: None
- **Request Body**:
```json
{
  "email_or_phone": "savitri.devi@example.com",
  "full_name": "Savitri Devi",
  "password": "secure_password_123",
  "role": "user",
  "gender": "female",
  "age": 28,
  "social_category": "OBC",
  "education_level": "10th",
  "address": "Varanasi, Uttar Pradesh"
}
```
- **Response** (`200 OK`):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "role": "user",
  "user_id": 1,
  "full_name": "Savitri Devi",
  "email_or_phone": "savitri.devi@example.com",
  "age": 28,
  "gender": "female",
  "social_category": "OBC",
  "education_level": "10th",
  "address": "Varanasi, Uttar Pradesh"
}
```

### 1.2 Login Citizen Account
- **Endpoint**: `POST /api/auth/login` (and `/api/v1/auth/login`)
- **Summary**: Authenticates an existing citizen with email/phone and password, returning a JWT access token.
- **Auth**: None
- **Request Body**:
```json
{
  "email_or_phone": "savitri.devi@example.com",
  "password": "secure_password_123"
}
```
- **Response** (`200 OK`): Returns `Token` schema with user demographic snapshot.

### 1.3 Get Current User Profile
- **Endpoint**: `GET /api/auth/me` (and `/api/v1/auth/me`)
- **Summary**: Retrieves the authenticated citizen's user record and role.
- **Auth**: `Bearer <JWT_TOKEN>`
- **Response** (`200 OK`): `UserResponse` object.

---

## 2. Scheme Discovery & Repository

### 2.1 List & Filter Schemes
- **Endpoint**: `GET /api/schemes` (and `/api/v1/schemes`)
- **Summary**: Paginated filtering of indexed central and state schemes by sector, level, state, and benefit type.
- **Query Parameters**:
  - `query` (string, optional): Keyword search across title, ministry, and tags
  - `level` (string, default `"all"`): `"all"` \| `"central"` \| `"state"`
  - `state_name` (string, optional): State name filter (e.g. `"Uttar Pradesh"`)
  - `sector` (string, default `"all"`): `"Manufacturing"`, `"Textile"`, `"Agriculture"`, etc.
  - `benefit_type` (string, default `"all"`): `"loan"`, `"subsidy"`, `"training"`, `"all"`
  - `page` (integer, default `1`)
  - `limit` (integer, default `20`, max `100`)
- **Response** (`200 OK`):
```json
{
  "data": [
    {
      "id": "pmegp",
      "slug": "pmegp",
      "name": "Prime Minister's Employment Generation Programme (PMEGP)",
      "ministry": "Ministry of Micro, Small and Medium Enterprises",
      "level": "central",
      "benefit_amount_max": 5000000,
      "subsidy_percentage": 35.0,
      "rules": []
    }
  ],
  "pagination": {
    "total": 2066,
    "page": 1,
    "limit": 20,
    "total_pages": 104
  }
}
```

### 2.2 Get Scheme Detail
- **Endpoint**: `GET /api/schemes/{slug_or_id}` (and `/api/v1/schemes/{slug_or_id}`)
- **Summary**: Returns full statutory metadata, guidelines, document checklists, application steps, and verification provenance.
- **Response** (`200 OK`): Complete `Scheme` object.

### 2.3 Get EDA Taxonomy Statistics
- **Endpoint**: `GET /api/schemes/stats/eda` (and `/api/v1/schemes/stats/eda`)
- **Summary**: Returns national scheme distribution metrics (central vs. state counts and top state scheme tallies).

---

## 3. Deterministic Matching & Explainability

### 3.1 Calculate Personalized Matching
- **Endpoint**: `POST /api/matching/calculate` (and `/api/v1/matching/calculate`)
- **Summary**: Executes the 3-level statutory rule engine and multi-factor ranking pipeline across all 2,066 indexed schemes.
- **Auth**: Optional `Bearer <JWT_TOKEN>` (persists run in `recommendation_history` if authenticated)
- **Request Body**:
```json
{
  "location_state": "Uttar Pradesh",
  "district": "Varanasi",
  "residence_type": "rural",
  "applicant_persona": "artisan",
  "business_type": "Textile",
  "funding_need": ["Starting a business", "Machinery & Equipment", "Subsidy"],
  "business_size_range": "micro_under_10l",
  "age": 28,
  "gender": "female",
  "social_category": "OBC",
  "business_stage": "new",
  "is_street_vendor": false,
  "is_traditional_artisan": true,
  "education_level": "10th",
  "has_udyam_registration": false,
  "has_bank_default": false
}
```
- **Response** (`200 OK`):
```json
{
  "best_matches": [
    {
      "scheme_id": "pm-vishwakarma",
      "scheme_name": "PM Vishwakarma Scheme",
      "eligibility_status": "eligible",
      "relevance_score": 92.5,
      "why_matched": [
        "Traditional artisan status verified for textile craft",
        "Age 28 satisfies 18+ requirement",
        "Rural domicile qualifies for maximum subsidy tier"
      ],
      "why_not": [],
      "next_best_actions": [
        "Register on pmvishwakarma.gov.in with Aadhaar and artisan trade",
        "Complete 5-day basic skill training to unlock ₹15,000 toolkit grant",
        "Apply for 1st tranche collateral-free loan up to ₹1,00,000 at 5% interest"
      ]
    }
  ],
  "near_matches": [],
  "other_schemes": [],
  "summary": {
    "total_evaluated": 2066,
    "eligible_count": 15,
    "near_match_count": 2,
    "ineligible_count": 2049
  }
}
```

### 3.2 Explain Decision Trail
- **Endpoint**: `POST /api/matching/explain` (and `/api/v1/matching/explain`)
- **Summary**: Provides an audit trail of rule checks for transparent, step-by-step frontend animation.
- **Request Body**:
```json
{
  "scheme_id": "pm-vishwakarma",
  "profile": { ... }
}
```
- **Response** (`200 OK`): `MatchingExplainResponse` with sequential decision steps.

### 3.3 Get Recommendation History
- **Endpoint**: `GET /api/matching/history` (and `/api/v1/matching/history`)
- **Summary**: Retrieves past recommendation runs for the logged-in citizen.

---

## 4. Grounded AI Assistant (RAG)

### 4.1 Chat with Grounded Assistant
- **Endpoint**: `POST /api/ai/chat` (and `/api/v1/ai/chat`)
- **Summary**: Submits citizen inquiries to the RAG pipeline. Responses are strictly grounded in retrieved official ministry circulars.
- **Request Body**:
```json
{
  "query": "What is the capital subsidy for women under PMEGP in rural areas?",
  "user_state": "Uttar Pradesh",
  "business_type": "Textile"
}
```
- **Response** (`200 OK`):
```json
{
  "answer": "Under the Prime Minister's Employment Generation Programme (PMEGP), women entrepreneurs setting up manufacturing or service micro-enterprises in Rural areas are categorized under the Special Category. They receive a 35% Capital Subsidy (Margin Money Grant) on project costs up to ₹50 Lakh for manufacturing units and ₹20 Lakh for service units.",
  "sources": [
    {
      "name": "KVIC PMEGP Portal",
      "url": "https://www.kviconline.gov.in/",
      "date": "02 Sep 2026"
    }
  ],
  "engine_mode": "offline_bm25_grounded",
  "model_used": "Verified BM25 Grounded RAG"
}
```

---

## 5. Application Preparation & Checklist

### 5.1 Get Saved Applications
- **Endpoint**: `GET /api/applications`
- **Summary**: Retrieves the citizen's saved scheme application dossiers.

### 5.2 Save Application
- **Endpoint**: `POST /api/applications`
- **Summary**: Adds a scheme to the citizen's preparation tracker.

### 5.3 Toggle Document Checklist
- **Endpoint**: `PATCH /api/applications/{scheme_id}/docs`
- **Summary**: Marks an application document as prepared/unprepared, updating completion percentage.
- **Request Body**:
```json
{
  "document_id": "doc-aadhaar"
}
```

### 5.4 Remove Saved Application
- **Endpoint**: `DELETE /api/applications/{scheme_id}`
- **Summary**: Deletes a scheme from the citizen's application tracker.

---

## 6. Data Trust & Governance

### 6.1 Get Platform Metrics
- **Endpoint**: `GET /api/governance/metrics`
- **Summary**: Returns verification rates, active reports, and SLO status.

### 6.2 Submit Citizen Issue Report
- **Endpoint**: `POST /api/governance/reports`
- **Summary**: Enables citizens to report outdated circulars or incorrect rules.

### 6.3 Audit Trail
- **Endpoint**: `GET /api/governance/audit-logs`
- **Summary**: Returns audit logs for platform transparency.

---

## 7. MSME Udyam Verification

### 7.1 Verify Udyam Registration
- **Endpoint**: `POST /api/udyam/verify`
- **Summary**: Verifies Udyam registration format (`UDYAM-XX-00-0000000`) and returns enterprise tier details.

---

## 8. System Health & Benchmarking

### 8.1 Health Check
- **Endpoint**: `GET /api/health`
- **Summary**: Returns service health and total schemes currently indexed.

### 8.2 Real Latency Benchmark
- **Endpoint**: `GET /api/health/benchmark`
- **Summary**: Executes and reports actual measured P50/P95 latencies across Retrieval, Rule Evaluation, Ranking, and AI Explanation.

---

## 9. SIH Demo & Admin Tools

### 9.1 Get Golden Demo Profiles
- **Endpoint**: `GET /api/demo/profiles`
- **Summary**: Pre-configured citizen archetypes for 30-second SIH presentations.

### 9.2 Reset Demo Database (Protected)
- **Endpoint**: `POST /admin/demo/reset`
- **Header**: `X-Admin-Key: <ADMIN_API_KEY>`
- **Summary**: Cleans transient application, report, and history tables for fresh judge presentations.
