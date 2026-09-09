from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.db.database import get_db
from backend.app.core.config import settings
from backend.app.db.models import SavedApplication, IssueReport, RecommendationHistory
from backend.app.schemas.profile import UserProfileSchema

router = APIRouter(tags=["SIH Demo Showcase & Protected Admin"])

DEMO_PROFILES = [
    {
        "id": "demo-up-woman-artisan",
        "title": "Savitri Devi — Woman Artisan (Varanasi, UP)",
        "tagline": "Traditional handloom weaving micro-enterprise seeking capital subsidy",
        "profile": {
            "location_state": "Uttar Pradesh",
            "district": "Varanasi",
            "applicant_persona": "artisan",
            "business_type": "Textile",
            "funding_need": ["Starting a business", "Machinery & Equipment", "Subsidy"],
            "business_size_range": "micro_under_10l",
            "age": 28,
            "gender": "female",
            "social_category": "OBC",
            "business_stage": "new",
            "is_street_vendor": False,
            "is_traditional_artisan": True,
            "education_level": "10th",
            "has_udyam_registration": False,
            "has_bank_default": False
        },
        "expected_top_matches": ["PM Vishwakarma Scheme", "PMEGP (35% Rural Subsidy)", "Mahila Coir Yojana"]
    },
    {
        "id": "demo-mh-food-processing",
        "title": "Rajesh Deshmukh — Food Processing (Pune, Maharashtra)",
        "tagline": "Agri-food packaging enterprise requiring working capital loan",
        "profile": {
            "location_state": "Maharashtra",
            "district": "Pune",
            "applicant_persona": "starting_business",
            "business_type": "Food",
            "funding_need": ["Working capital", "Machinery & Equipment", "Loan"],
            "business_size_range": "small_10l_50l",
            "age": 34,
            "gender": "male",
            "social_category": "General",
            "business_stage": "new",
            "is_street_vendor": False,
            "is_traditional_artisan": False,
            "education_level": "graduate",
            "has_udyam_registration": True,
            "has_bank_default": False
        },
        "expected_top_matches": ["PMEGP", "Pradhan Mantri Mudra Yojana (Tarun)", "CGTMSE"]
    },
    {
        "id": "demo-vendor-delhi",
        "title": "Ramesh Gupta — Urban Street Vendor (Delhi)",
        "tagline": "Licensed roadside fruits & vegetable vendor requiring micro-credit",
        "profile": {
            "location_state": "Delhi",
            "district": "Central Delhi",
            "applicant_persona": "street_vendor",
            "business_type": "Retail",
            "funding_need": ["Working capital", "Loan"],
            "business_size_range": "nano_under_1l",
            "age": 42,
            "gender": "male",
            "social_category": "OBC",
            "business_stage": "existing",
            "is_street_vendor": True,
            "is_traditional_artisan": False,
            "education_level": "8th",
            "has_udyam_registration": False,
            "has_bank_default": False
        },
        "expected_top_matches": ["PM SVANidhi", "Mudra Yojana (Shishu)"]
    }
]

@router.get("/api/demo/profiles")
def get_sih_demo_profiles():
    """
    Returns pre-configured showcase profiles for rapid 30-second SIH presentations.
    """
    return DEMO_PROFILES

@router.post("/admin/demo/reset")
def reset_demo_database(
    x_admin_key: Optional[str] = Header(None, alias="X-Admin-Key"),
    db: Session = Depends(get_db)
):
    """
    PROTECTED ENDPOINT: Resets transient demo data (saved applications, reports, history) for clean judge demo.
    """
    if not x_admin_key or x_admin_key != settings.ADMIN_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin authentication required to perform demo reset."
        )

    db.query(SavedApplication).delete()
    db.query(IssueReport).delete()
    db.query(RecommendationHistory).delete()
    db.commit()

    return {"message": "Demo database successfully reset to clean state."}
