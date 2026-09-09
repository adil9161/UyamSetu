import re
from typing import Dict, Any, List
from backend.ingestion.version_manager import create_evidence_record
from backend.ingestion.rule_compiler import compile_scheme_rules

def clean_text(text: str) -> str:
    if not text:
        return ""
    text = text.replace('\xa0', ' ').replace('\u200b', '')
    text = re.sub(r'[\r\n]+', ' ', text)
    text = re.sub(r'[ \t]+', ' ', text)
    return text.strip()


def normalize_scheme_record(raw: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalizes raw scheme data from any format into the canonical Scheme Intelligence Model.
    """
    name = raw.get("name") or raw.get("scheme_name") or "Government Welfare Scheme"
    slug = raw.get("slug") or re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
    scheme_id = raw.get("id") or f"scheme-{slug[:30]}"
    
    # Extract benefit types
    benefits_raw = raw.get("benefit_types") or []
    if not benefits_raw:
        desc_lower = (name + " " + str(raw.get("description", ""))).lower()
        if any(w in desc_lower for w in ['loan', 'credit', 'advance', 'borrowing']):
            benefits_raw.append("loan")
        if any(w in desc_lower for w in ['subsidy', 'margin money', 'rebate', 'grant']):
            benefits_raw.append("subsidy")
        if any(w in desc_lower for w in ['training', 'skill', 'stipend']):
            benefits_raw.append("training")
        if not benefits_raw:
            benefits_raw = ["financial_support"]

    # Normalize business types
    b_types = raw.get("business_types") or raw.get("sectors") or ["All Sectors"]
    if isinstance(b_types, str):
        b_types = [b_types]

    # Documents required
    docs_raw = raw.get("documents_required") or [
        {"id": "doc-aadhaar", "name": "Aadhaar Card", "mandatory": True, "description": "National identity proof with linked mobile number"},
        {"id": "doc-pan", "name": "PAN Card", "mandatory": True, "description": "Permanent Account Number of promoter/proprietor"},
        {"id": "doc-bank", "name": "Bank Account Statement (6 Months)", "mandatory": True, "description": "Active operational bank account with IFSC code"}
    ]
    formatted_docs = []
    for idx, d in enumerate(docs_raw):
        if isinstance(d, dict):
            formatted_docs.append({
                "id": d.get("id", f"doc-{idx}"),
                "name": d.get("name", "Verification Document"),
                "mandatory": d.get("mandatory", True),
                "description": d.get("description", "")
            })
        elif isinstance(d, str):
            formatted_docs.append({
                "id": f"doc-{idx}",
                "name": d,
                "mandatory": True,
                "description": "Statutory proof document required during application"
            })

    # Detailed benefits
    benefits_list = raw.get("detailed_benefits") or raw.get("benefits") or [
        "Statutory institutional credit support with government margin subvention",
        "Direct benefit transfer (DBT) or subsidized interest rate incentives"
    ]
    if isinstance(benefits_list, str):
        benefits_list = [benefits_list]

    # Detailed eligibility text
    eligibility_list = raw.get("eligibility_criteria_text") or raw.get("eligibility") or [
        "Citizen of India with valid national KYC identification",
        "Age between 18 and 65 years with viable business proposal"
    ]
    if isinstance(eligibility_list, str):
        eligibility_list = [eligibility_list]

    official_url = raw.get("official_portal_url") or raw.get("official_url") or "https://msme.gov.in"

    normalized = {
        "id": scheme_id,
        "name": clean_text(name),
        "slug": slug,
        "code": raw.get("code") or f"IND-{slug[:12].upper()}",
        "level": "state" if raw.get("level") == "state" or raw.get("state_name") else "central",
        "state_name": raw.get("state_name") or None,
        "ministry": clean_text(raw.get("ministry") or "Ministry of Micro, Small & Medium Enterprises"),
        "description": clean_text(raw.get("description") or f"National enterprise empowerment initiative under {name}."),
        "brief_summary": clean_text(raw.get("brief_summary") or raw.get("description") or ""),
        "benefit_types": list(set(benefits_raw)),
        "max_subsidy_percentage": raw.get("max_subsidy_percentage", 35.0 if "pmegp" in slug else None),
        "max_loan_amount_inr": raw.get("max_loan_amount_inr", 5000000.0 if "pmegp" in slug else 1000000.0),
        "detailed_benefits": benefits_list,
        "eligibility_criteria_text": eligibility_list,
        "documents_required": formatted_docs,
        "application_process": raw.get("application_process") or [
            "Submit online application via the official national ministry portal.",
            "Undergo verification and scrutiny at District Industries Centre (DIC) or local branch.",
            "Sanction and disbursement directly to the entrepreneur's verified bank account."
        ],
        "official_portal_url": official_url,
        "helpline_number": raw.get("helpline_number") or "1800-180-6763",
        "target_beneficiaries": raw.get("target_beneficiaries") or ["Entrepreneurs", "Artisans", "Women", "Youth"],
        "business_types": b_types,
        "scheme_version": raw.get("scheme_version", "v2.1"),
        "tags": raw.get("tags") or ["MSME", "Enterprise", "Credit Support"]
    }

    # Attach evidence metadata
    normalized["evidence"] = create_evidence_record(normalized, official_url)

    # Attach explicit structured rules via Rule Compiler
    normalized["structured_rules"] = compile_scheme_rules(normalized)

    return normalized
