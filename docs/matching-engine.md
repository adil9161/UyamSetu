# UdyamSetu Deterministic Matching Engine v2.2

## Principle of Operation
The matching engine executes deterministic formal logic over structured statutory rules extracted from official Indian Central and State Government gazettes.

### 3-Tier Status Output
Every scheme evaluation results in one of three statuses:
1. **ELIGIBLE (`eligible`)**: All statutory conditions are satisfied.
2. **NEAR_MATCH (`near_match`)**: Statutory profile qualifies, but 1 actionable prerequisite (e.g. Udyam Registration or TVC certificate) is pending.
3. **INELIGIBLE (`ineligible`)**: Applicant fails a hard statutory constraint (e.g. out-of-state applicant for a state scheme, underage/overage, or demographic mismatch).

### Rule DSL Operators
- `equals` / `==`: Exact match (case-insensitive string or value).
- `between` / `range`: Value is within bounded range $[min, max]$.
- `in` / `one_of`: Value belongs to designated set (e.g. `demographic_composite in ["female", "SC", "ST"]`).
- `requires`: Boolean existence verification.
- `any`: Universal Pan-India applicability.

### Rule Provenance Data Contract
Every evaluated rule outputs:
```json
{
  "rule_id": "PMEGP-AGE-01",
  "field": "age",
  "status": "passed",
  "severity": "blocking",
  "actual": 28,
  "expected": {"min": 18, "max": 65},
  "source_id": "SRC-AGE-PMEGP",
  "source_url": "https://www.kviconline.gov.in/",
  "explanation": "Applicant age must be between 18 and 65 years (legal adult requirement)."
}
```
