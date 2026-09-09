from typing import Dict, Any, Tuple, List

def validate_scheme(scheme: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """
    Validates a scheme against data integrity standards.
    Returns (is_valid, list_of_errors).
    """
    errors = []
    
    if not scheme.get("id"):
        errors.append("Missing mandatory 'id'")
    if not scheme.get("name") or len(scheme["name"]) < 3:
        errors.append("Invalid or empty 'name'")
    if not scheme.get("ministry"):
        errors.append("Missing 'ministry'")
    if not scheme.get("official_portal_url") or not scheme["official_portal_url"].startswith("http"):
        errors.append("Invalid or missing 'official_portal_url'")
    if not scheme.get("structured_rules"):
        errors.append("Missing structured eligibility rules")
    if not scheme.get("evidence") or not scheme["evidence"].get("content_hash"):
        errors.append("Missing evidence hash verification")

    return (len(errors) == 0, errors)
