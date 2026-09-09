import os
import json
from typing import List, Dict, Any
from backend.app.core.logging import logger
from backend.ingestion.normalizer import normalize_scheme_record
from backend.ingestion.validator import validate_scheme

def load_all_raw_schemes() -> List[Dict[str, Any]]:
    """
    Locates raw schemes data files from src/data or backend/data.
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    possible_paths = [
        os.path.join(base_dir, "src", "data", "all_schemes.json"),
        os.path.join(base_dir, "backend", "app", "data", "all_schemes.json"),
        os.path.join(base_dir, "data", "all_schemes.json")
    ]
    
    for p in possible_paths:
        if os.path.exists(p):
            try:
                with open(p, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, list) and len(data) > 0:
                        logger.info(f"Loaded {len(data)} raw schemes from {p}")
                        return data
            except Exception as e:
                logger.error(f"Failed to read {p}: {e}")

    logger.warning("all_schemes.json not found, using verified fallback core schemes")
    return get_core_verified_fallback_schemes()

def get_core_verified_fallback_schemes() -> List[Dict[str, Any]]:
    return [
        {
            "id": "pmegp-central-01",
            "name": "Prime Minister's Employment Generation Programme (PMEGP)",
            "slug": "pmegp",
            "code": "MSME-PMEGP-01",
            "level": "central",
            "ministry": "Ministry of Micro, Small and Medium Enterprises",
            "description": "Credit-linked subsidy programme to generate employment opportunities by establishing micro-enterprises in manufacturing and service sectors.",
            "benefit_types": ["subsidy", "loan"],
            "max_subsidy_percentage": 35.0,
            "max_loan_amount_inr": 5000000.0,
            "business_types": ["Manufacturing", "Services", "Textile", "Food", "Retail"],
            "official_portal_url": "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp"
        },
        {
            "id": "pm-vishwakarma-02",
            "name": "PM Vishwakarma Scheme",
            "slug": "pm-vishwakarma",
            "code": "MSME-VISHWA-02",
            "level": "central",
            "ministry": "Ministry of Micro, Small and Medium Enterprises",
            "description": "End-to-end support for traditional artisans and craftspeople with digital verification, modern toolkit grants, and collateral-free enterprise credit.",
            "benefit_types": ["grant", "loan", "training"],
            "max_subsidy_percentage": 100.0,
            "max_loan_amount_inr": 300000.0,
            "business_types": ["Handicraft", "Textile", "Manufacturing", "Services"],
            "official_portal_url": "https://pmvishwakarma.gov.in/"
        },
        {
            "id": "standup-india-03",
            "name": "Stand-Up India Scheme",
            "slug": "standup-india",
            "code": "DFS-STANDUP-03",
            "level": "central",
            "ministry": "Ministry of Finance",
            "description": "Facilitates bank loans between ₹10 lakh and ₹1 crore to at least one SC or ST borrower and at least one woman borrower per bank branch.",
            "benefit_types": ["loan"],
            "max_subsidy_percentage": 0.0,
            "max_loan_amount_inr": 10000000.0,
            "business_types": ["Manufacturing", "Services", "Retail", "Agriculture"],
            "official_portal_url": "https://www.standupmitra.in/"
        },
        {
            "id": "pm-svanidhi-04",
            "name": "PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi)",
            "slug": "pm-svanidhi",
            "code": "MOHUA-SVANIDHI-04",
            "level": "central",
            "ministry": "Ministry of Housing and Urban Affairs",
            "description": "Micro-credit facility for urban street vendors with collateral-free working capital loan up to ₹50,000 with 7% interest subsidy.",
            "benefit_types": ["loan", "subsidy"],
            "max_subsidy_percentage": 7.0,
            "max_loan_amount_inr": 50000.0,
            "business_types": ["Retail", "Food", "Services"],
            "official_portal_url": "https://pmsvanidhi.mohua.gov.in/"
        },
        {
            "id": "mudra-yojana-05",
            "name": "Pradhan Mantri Mudra Yojana (PMMY)",
            "slug": "pm-mudra",
            "code": "DFS-MUDRA-05",
            "level": "central",
            "ministry": "Ministry of Finance",
            "description": "Provides collateral-free institutional loans up to ₹20 lakh to non-corporate, non-farm small and micro-enterprises under Shishu, Kishore, and Tarun categories.",
            "benefit_types": ["loan"],
            "max_subsidy_percentage": 0.0,
            "max_loan_amount_inr": 2000000.0,
            "business_types": ["Retail", "Manufacturing", "Services", "Food"],
            "official_portal_url": "https://www.mudra.org.in/"
        }
    ]

def ingest_and_process_schemes() -> List[Dict[str, Any]]:
    """
    Executes full ingestion pipeline: Load -> Normalize -> Validate -> Rule Extraction -> Versioning.
    """
    raw_list = load_all_raw_schemes()
    processed: List[Dict[str, Any]] = []
    
    for raw in raw_list:
        normalized = normalize_scheme_record(raw)
        is_valid, errors = validate_scheme(normalized)
        if is_valid:
            processed.append(normalized)
        else:
            logger.debug(f"Skipping invalid scheme '{raw.get('name')}': {errors}")

    logger.info(f"Ingestion pipeline complete: {len(processed)} schemes validated with structured rules and evidence hashes.")
    return processed
