from typing import List, Dict, Any

def extract_structured_rules(scheme: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Extracts structured, machine-evaluable statutory rules for a scheme.
    Prevents black-box matching by turning statutory text into formal conditions.
    """
    rules: List[Dict[str, Any]] = []
    slug = scheme.get("slug", "").lower()
    scheme_id = scheme.get("id", "").lower()
    level = scheme.get("level", "central")
    state_name = scheme.get("state_name")
    
    # 1. Location Rule (Mandatory for state schemes)
    if level == "state" and state_name:
        rules.append({
            "id": f"{scheme.get('id')}-rule-loc",
            "rule_type": "location",
            "field": "location_state",
            "operator": "==",
            "expected_value": state_name,
            "mandatory": True,
            "explanation": f"Exclusively available for enterprise units established in {state_name}.",
            "disqualification_reason": f"Scheme restricted to residents and registered enterprises of {state_name}.",
            "source_id": "state-gazette-location-clause"
        })
    else:
        rules.append({
            "id": f"{scheme.get('id')}-rule-loc-pan",
            "rule_type": "location",
            "field": "location_state",
            "operator": "any",
            "expected_value": "All States/UTs of India",
            "mandatory": False,
            "explanation": "Pan-India Central Government scheme accessible across all states and Union Territories.",
            "disqualification_reason": None,
            "source_id": "central-notification"
        })

    # 2. Gender and Special Mandates
    if "mahila" in slug or "women" in slug or "mahila-coir" in scheme_id:
        rules.append({
            "id": f"{scheme.get('id')}-rule-gender",
            "rule_type": "demographic",
            "field": "gender",
            "operator": "==",
            "expected_value": "female",
            "mandatory": True,
            "explanation": "Exclusively earmarked for women artisans, micro-entrepreneurs, and women-led SHGs.",
            "disqualification_reason": "Statutory reservation mandates applicant must be a woman entrepreneur.",
            "source_id": "msme-special-gender-clause"
        })

    # Stand-Up India rule: Female OR SC/ST
    if "standup" in slug or "stand-up" in slug:
        rules.append({
            "id": f"{scheme.get('id')}-rule-standup-demo",
            "rule_type": "demographic",
            "field": "demographic_composite",
            "operator": "in",
            "expected_value": ["female", "SC", "ST"],
            "mandatory": True,
            "explanation": "Must be either a woman entrepreneur OR belong to SC / ST category.",
            "disqualification_reason": "Stand-Up India is exclusively reserved for Women OR SC/ST greenfield entrepreneurs.",
            "source_id": "dfs-standup-mandate"
        })

    # PM SVANidhi rule: Urban street vendors
    if "svanidhi" in slug:
        rules.append({
            "id": f"{scheme.get('id')}-rule-vendor",
            "rule_type": "regulatory",
            "field": "is_street_vendor",
            "operator": "==",
            "expected_value": True,
            "mandatory": True,
            "explanation": "Must be an active urban micro/street vendor possessing a Certificate of Vending (CoV) or ULB recommendation.",
            "disqualification_reason": "Requires active urban street vendor status certified by Urban Local Body (ULB).",
            "source_id": "mohua-svanidhi-sop"
        })

    # PM Vishwakarma: Traditional artisan trades
    if "vishwakarma" in slug:
        rules.append({
            "id": f"{scheme.get('id')}-rule-artisan",
            "rule_type": "sector",
            "field": "is_traditional_artisan",
            "operator": "==",
            "expected_value": True,
            "mandatory": True,
            "explanation": "Must practice one of the 18 recognized traditional artisanal or craft trades (carpenter, blacksmith, tailor, etc.).",
            "disqualification_reason": "Applicant must belong to one of the 18 traditional artisan/craftsman trade families.",
            "source_id": "msme-vishwakarma-notification"
        })

    # Sector rules if specific
    business_types = scheme.get("business_types", [])
    if business_types and len(business_types) <= 3 and "All" not in business_types and "All Sectors" not in business_types:
        rules.append({
            "id": f"{scheme.get('id')}-rule-sector",
            "rule_type": "sector",
            "field": "business_type",
            "operator": "in",
            "expected_value": business_types,
            "mandatory": False,
            "explanation": f"Earmarked priority for enterprises in {', '.join(business_types)} sectors.",
            "disqualification_reason": f"Activity sector outside prime target focus: {', '.join(business_types)}.",
            "source_id": "sectoral-guideline"
        })

    # Age rule
    rules.append({
        "id": f"{scheme.get('id')}-rule-age",
        "rule_type": "demographic",
        "field": "age",
        "operator": ">=",
        "expected_value": 18,
        "mandatory": True,
        "explanation": "Applicant must be at least 18 years of age at the time of statutory application.",
        "disqualification_reason": "Applicant is below legal age of 18 years required for commercial enterprise contracts.",
        "source_id": "legal-contract-act"
    })

    # Regulatory registration (Udyam) - only for formal industrial subsidy schemes
    if any(k in slug for k in ["pmegp", "cgtmse", "zed", "clcss", "msme"]):
        rules.append({
            "id": f"{scheme.get('id')}-rule-udyam",
            "rule_type": "regulatory",
            "field": "has_udyam_registration",
            "operator": "==",
            "expected_value": True,
            "mandatory": False, # Soft gap
            "explanation": "Udyam Registration Certificate recommended for formal MSME subsidy disbursement.",
            "disqualification_reason": "Enterprise requires active Udyam registration for government subsidy routing.",
            "source_id": "msme-gazette-udyam-mandate"
        })

    return rules
