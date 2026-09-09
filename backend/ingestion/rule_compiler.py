"""
UdyamSetu Rule Compiler
Compiles textual and semi-structured scheme data into rich Rule DSL objects.
Injects statutory provenance, severity, source citations, and operator rules.
"""

from typing import List, Dict, Any

def compile_scheme_rules(scheme: Dict[str, Any]) -> List[Dict[str, Any]]:
    rules: List[Dict[str, Any]] = []
    slug = (scheme.get("slug") or "").lower()
    scheme_id = str(scheme.get("id") or "").lower()
    level = scheme.get("level", "central")
    state_name = scheme.get("state_name")
    source_url = scheme.get("official_portal_url") or scheme.get("official_url") or "https://msme.gov.in"

    # 1. Location Rule
    if level == "state" and state_name:
        rules.append({
            "id": f"{scheme.get('id')}-LOC-01",
            "rule_type": "location",
            "field": "location_state",
            "operator": "equals",
            "expected_value": state_name,
            "mandatory": True,
            "severity": "blocking",
            "explanation": f"Exclusively available for applicants establishing/operating in {state_name}.",
            "source_id": f"SRC-LOC-{state_name.upper().replace(' ', '_')}",
            "source_url": source_url,
            "effective_from": "2026-04-01",
            "effective_to": "2027-03-31"
        })
    else:
        rules.append({
            "id": f"{scheme.get('id')}-LOC-PAN",
            "rule_type": "location",
            "field": "location_state",
            "operator": "any",
            "expected_value": "All States/UTs",
            "mandatory": False,
            "severity": "soft",
            "explanation": "Pan-India Central Government program accessible in all states and UTs.",
            "source_id": "SRC-CENTRAL-NOTIF",
            "source_url": source_url,
            "effective_from": "2026-04-01",
            "effective_to": "2027-03-31"
        })

    # 2. Age Rule
    min_age = scheme.get("min_age", 18)
    max_age = scheme.get("max_age", 65 if ("pmegp" in slug or "artisan" in slug) else 115)
    rules.append({
        "id": f"{scheme.get('id')}-AGE-01",
        "rule_type": "eligibility",
        "field": "age",
        "operator": "between",
        "expected_value": {"min": min_age, "max": max_age},
        "mandatory": True,
        "severity": "blocking",
        "explanation": f"Applicant age must be between {min_age} and {max_age} years (legal adult requirement).",
        "source_id": f"SRC-AGE-{slug.upper()[:10]}",
        "source_url": source_url,
        "effective_from": "2026-04-01",
        "effective_to": "2027-03-31"
    })

    # 3. Demographic & Gender Rules
    if "mahila" in slug or "women" in slug or "mahila-coir" in scheme_id:
        rules.append({
            "id": f"{scheme.get('id')}-GENDER-01",
            "rule_type": "demographic",
            "field": "gender",
            "operator": "equals",
            "expected_value": "female",
            "mandatory": True,
            "severity": "blocking",
            "explanation": "Statutory reservation mandates promoter must be a woman entrepreneur.",
            "source_id": "SRC-MSME-WOMEN-QUOTA",
            "source_url": source_url,
            "effective_from": "2026-04-01",
            "effective_to": "2027-03-31"
        })
    elif "standup" in slug or "stand-up" in slug:
        rules.append({
            "id": f"{scheme.get('id')}-DEMO-COMPOSITE",
            "rule_type": "demographic",
            "field": "demographic_composite",
            "operator": "in",
            "expected_value": ["female", "SC", "ST"],
            "mandatory": True,
            "severity": "blocking",
            "explanation": "Stand-Up India mandates loan beneficiary must be either a Woman OR belong to SC/ST category.",
            "source_id": "SRC-DFS-STANDUP-MANDATE",
            "source_url": "https://www.standupmitra.in/",
            "effective_from": "2026-04-01",
            "effective_to": "2027-03-31"
        })

    # 4. Urban Street Vendor
    if "svanidhi" in slug:
        rules.append({
            "id": f"{scheme.get('id')}-VENDOR-01",
            "rule_type": "regulatory",
            "field": "is_street_vendor",
            "operator": "requires",
            "expected_value": True,
            "mandatory": True,
            "severity": "blocking",
            "explanation": "Applicant must be an active urban street vendor with ULB recommendation or Vending Certificate.",
            "source_id": "SRC-MOHUA-SVANIDHI-SOP",
            "source_url": "https://pmsvanidhi.mohua.gov.in/",
            "effective_from": "2026-04-01",
            "effective_to": "2027-03-31"
        })
        # Urban location check
        rules.append({
            "id": f"{scheme.get('id')}-RESIDENCE-URBAN",
            "rule_type": "location",
            "field": "residence_type",
            "operator": "equals",
            "expected_value": "urban",
            "mandatory": False,
            "severity": "soft",
            "explanation": "PM SVANidhi is primarily targeted at street vendors vending in Urban Local Body (ULB) areas.",
            "source_id": "SRC-MOHUA-URBAN-CLAUSE",
            "source_url": "https://pmsvanidhi.mohua.gov.in/",
            "effective_from": "2026-04-01",
            "effective_to": "2027-03-31"
        })

    # 5. Traditional Artisan Trade
    if "vishwakarma" in slug:
        rules.append({
            "id": f"{scheme.get('id')}-ARTISAN-01",
            "rule_type": "sector",
            "field": "is_traditional_artisan",
            "operator": "requires",
            "expected_value": True,
            "mandatory": True,
            "severity": "blocking",
            "explanation": "Must be engaged in one of the 18 recognized traditional artisan/craftsman family trades (tailor, carpenter, blacksmith, etc.).",
            "source_id": "SRC-MSME-VISHWAKARMA-NOTIF",
            "source_url": "https://pmvishwakarma.gov.in/",
            "effective_from": "2026-04-01",
            "effective_to": "2027-03-31"
        })

    # 6. Enterprise Stage (e.g. PMEGP greenfield focus)
    if "pmegp" in slug:
        rules.append({
            "id": f"{scheme.get('id')}-STAGE-GREENFIELD",
            "rule_type": "business_stage",
            "field": "business_stage",
            "operator": "equals",
            "expected_value": "new",
            "mandatory": False,
            "severity": "soft",
            "explanation": "PMEGP first loan is for greenfield / new enterprises (existing units can apply under 2nd loan expansion).",
            "source_id": "SRC-KVIC-STAGE-CLAUSE",
            "source_url": "https://www.kviconline.gov.in/",
            "effective_from": "2026-04-01",
            "effective_to": "2027-03-31"
        })

    # 7. Regulatory Udyam Registration (Soft condition for MSME schemes)
    if any(k in slug for k in ["cgtmse", "pmegp", "standup", "msme", "subsidy", "cluster"]):
        rules.append({
            "id": f"{scheme.get('id')}-UDYAM-SOFT",
            "rule_type": "regulatory",
            "field": "has_udyam_registration",
            "operator": "requires",
            "expected_value": True,
            "mandatory": False,
            "severity": "soft",
            "explanation": "Formal MSME Udyam Certificate is recommended/required for formal subsidy disbursal.",
            "source_id": "SRC-MSME-UDYAM-DIRECTIVE",
            "source_url": "https://udyamregistration.gov.in/",
            "effective_from": "2026-04-01",
            "effective_to": "2027-03-31"
        })

    return rules
