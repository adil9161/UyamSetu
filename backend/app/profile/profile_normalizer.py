"""
UdyamSetu Profile Normalizer Layer
Converts informal or colloquial user inputs into canonical taxonomy codes.
Ensures seamless matching across diverse dialects, terminology, and spelling variations.
"""

import re
from typing import Dict, Any, List, Optional
from backend.app.taxonomy.taxonomy_service import OCCUPATIONS, SECTORS, NEEDS, REVENUE_RANGES, LOCATION_TYPES

UDYAM_REGEX = re.compile(r"^UDYAM-[A-Z]{2}-\d{2}-\d{7}$", re.IGNORECASE)

class ProfileNormalizer:
    @staticmethod
    def normalize_occupation(raw_persona: Optional[str], raw_text: Optional[str] = None) -> str:
        """
        Maps raw input like 'Tailor', 'Darzi', 'Clothes stitching' to canonical 'artisan_tailor'.
        """
        combined = f"{raw_persona or ''} {raw_text or ''}".lower().strip()
        if not combined:
            return "starting_business"

        for code, data in OCCUPATIONS.items():
            if combined == code.lower():
                return code
            for syn in data.get("synonyms", []):
                if syn.lower() in combined or combined in syn.lower():
                    return code

        # Default fallback persona
        if "vendor" in combined or "street" in combined or "hawker" in combined:
            return "street_vendor"
        if "artisan" in combined or "craft" in combined or "tailor" in combined:
            return "artisan_craftsperson"
        if "startup" in combined or "tech" in combined or "app" in combined:
            return "tech_founder"
        if "dairy" in combined or "farm" in combined or "kisan" in combined:
            return "farmer_dairy"
        if "shop" in combined or "store" in combined or "retail" in combined:
            return "retailer"
        if "existing" in combined or "running" in combined:
            return "existing_entrepreneur"

        return "starting_business"

    @staticmethod
    def normalize_sector(raw_sector: Optional[str], occupation_code: Optional[str] = None) -> str:
        """
        Maps raw sector like 'Bakery', 'Food & Beverages' to canonical 'food_processing'.
        """
        sector_str = (raw_sector or "").lower().strip()
        if not sector_str:
            if occupation_code and occupation_code in OCCUPATIONS:
                return OCCUPATIONS[occupation_code].get("default_sector", "other")
            return "other"

        for code, data in SECTORS.items():
            if sector_str == code.lower():
                return code
            for syn in data.get("synonyms", []):
                if syn.lower() in sector_str or sector_str in syn.lower():
                    return code

        return "other"

    @staticmethod
    def normalize_needs(raw_needs: List[str]) -> List[str]:
        """
        Maps diverse need strings to canonical need codes.
        """
        normalized: List[str] = []
        for n in raw_needs:
            n_lower = n.lower().strip()
            matched = False
            for code, data in NEEDS.items():
                if n_lower == code:
                    normalized.append(code)
                    matched = True
                    break
                for syn in data.get("synonyms", []):
                    if syn.lower() in n_lower or n_lower in syn.lower():
                        normalized.append(code)
                        matched = True
                        break
            if not matched and n_lower:
                normalized.append(n_lower)
        return list(dict.fromkeys(normalized))

    @staticmethod
    def normalize_location_type(residence: Optional[str]) -> str:
        res = (residence or "").lower().strip()
        if "urban" in res or "शहर" in res:
            return "urban"
        return "rural" # Default high-subsidy rural baseline

    @staticmethod
    def normalize_stage(stage: Optional[str]) -> str:
        s = (stage or "").lower().strip()
        if "exist" in s or s == "existing" or "brownfield" in s:
            return "existing"
        return "new"

    @staticmethod
    def validate_udyam_format(udyam_no: Optional[str]) -> bool:
        if not udyam_no:
            return False
        return bool(UDYAM_REGEX.match(udyam_no.strip()))
