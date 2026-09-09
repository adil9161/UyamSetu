"""
UdyamSetu Taxonomy Service
Controlled vocabularies for scheme matching, eligibility, and personalization.
Standardizes occupations, sectors, stages, support needs, revenue ranges, and locations.
"""

from typing import Dict, List, Any, Optional

OCCUPATIONS = {
    "artisan_tailor": {
        "code": "artisan_tailor",
        "title": "Artisan / Tailor & Garment Maker",
        "title_hi": "कारीगर / दर्जी व परिधान निर्माता",
        "default_sector": "textile",
        "is_artisan": True,
        "synonyms": ["tailor", "darzi", "stitching", "cloth stitching", "boutique", "garment maker", "dressmaker", "sewing"]
    },
    "artisan_craftsperson": {
        "code": "artisan_craftsperson",
        "title": "Artisan / Traditional Craftsperson",
        "title_hi": "कारीगर / पारंपरिक शिल्पकार",
        "default_sector": "handicraft",
        "is_artisan": True,
        "synonyms": ["artisan", "karigar", "craftsman", "carpenter", "potter", "blacksmith", "goldsmith", "weaver", "sculptor"]
    },
    "street_vendor": {
        "code": "street_vendor",
        "title": "Street Vendor / Hawker",
        "title_hi": "रेहड़ी-पटरी विक्रेता / स्ट्रीट वेंडर",
        "default_sector": "retail",
        "is_street_vendor": True,
        "synonyms": ["street vendor", "vendor", "thela", "hawker", "cart vendor", "stall", "roadside vendor", "pheriwala"]
    },
    "retailer": {
        "code": "retailer",
        "title": "Retailer / Shopkeeper",
        "title_hi": "खुदरा व्यापारी / दुकानदार",
        "default_sector": "retail",
        "synonyms": ["retailer", "shopkeeper", "general store", "kirana", "dukan", "provision store", "trader"]
    },
    "farmer_dairy": {
        "code": "farmer_dairy",
        "title": "Farmer / Agri & Dairy Entrepreneur",
        "title_hi": "किसान / कृषि व डेयरी उद्यमी",
        "default_sector": "agriculture",
        "synonyms": ["farmer", "kisan", "dairy", "milk dairy", "poultry", "fisheries", "livestock", "agri entrepreneur"]
    },
    "tech_founder": {
        "code": "tech_founder",
        "title": "Technology / Innovation Startup",
        "title_hi": "प्रौद्योगिकी / नवाचार स्टार्टअप",
        "default_sector": "technology",
        "synonyms": ["startup", "tech startup", "software", "digital platform", "innovation", "founder", "app developer"]
    },
    "self_employed": {
        "code": "self_employed",
        "title": "Self-Employed Professional / Technician",
        "title_hi": "स्वरोजगार / तकनीशियन",
        "default_sector": "services",
        "synonyms": ["self employed", "electrician", "plumber", "mechanic", "technician", "salon", "beautician", "freelancer"]
    },
    "shg_member": {
        "code": "shg_member",
        "title": "Self Help Group (SHG) Member",
        "title_hi": "स्वयं सहायता समूह (SHG) सदस्य",
        "default_sector": "manufacturing",
        "synonyms": ["shg", "self help group", "mahila mandal", "bachat gat", "women collective"]
    },
    "starting_business": {
        "code": "starting_business",
        "title": "Aspiring Entrepreneur (New Enterprise)",
        "title_hi": "नया व्यवसाय शुरू करने वाले",
        "default_sector": "manufacturing",
        "synonyms": ["new business", "first time entrepreneur", "planning", "greenfield", "startup"]
    },
    "existing_entrepreneur": {
        "code": "existing_entrepreneur",
        "title": "Existing MSME Business Owner",
        "title_hi": "मौजूदा एमएसएमई व्यवसायी",
        "default_sector": "manufacturing",
        "synonyms": ["existing business", "msme owner", "running business", "factory", "operating enterprise"]
    }
}

SECTORS = {
    "textile": {
        "code": "textile",
        "title": "Textile, Garments & Tailoring",
        "title_hi": "वस्त्र, परिधान व सिलाई",
        "synonyms": ["textile", "textiles", "garments", "apparel", "tailoring", "embroidery", "handloom", "weaving"]
    },
    "handicraft": {
        "code": "handicraft",
        "title": "Handicraft & Traditional Art",
        "title_hi": "हस्तशिल्प व पारंपरिक कला",
        "synonyms": ["handicraft", "handicrafts", "pottery", "leather craft", "metal art", "woodcraft", "terracotta"]
    },
    "food_processing": {
        "code": "food_processing",
        "title": "Food Processing & Bakery",
        "title_hi": "खाद्य प्रसंस्करण व बेकरी",
        "synonyms": ["food", "food processing", "bakery", "dairy products", "spices", "snacks", "beverages", "confectionery"]
    },
    "agriculture": {
        "code": "agriculture",
        "title": "Agriculture Allied & Dairy",
        "title_hi": "कृषि संबद्ध व डेयरी",
        "synonyms": ["agriculture", "agri", "farming", "dairy farming", "horticulture", "poultry", "sericulture"]
    },
    "manufacturing": {
        "code": "manufacturing",
        "title": "Manufacturing & Production",
        "title_hi": "विनिर्माण / उत्पादन",
        "synonyms": ["manufacturing", "production", "fabrication", "assembly", "goods manufacturing", "packaging", "plastics"]
    },
    "services": {
        "code": "services",
        "title": "Services & Operations",
        "title_hi": "सेवाएं और संचालन",
        "synonyms": ["services", "service", "repairs", "logistics", "hospitality", "maintenance", "consultancy", "transport"]
    },
    "retail": {
        "code": "retail",
        "title": "Retail & Trading",
        "title_hi": "खुदरा एवं व्यापार",
        "synonyms": ["retail", "trading", "store", "shop", "wholesale", "distribution", "e-commerce"]
    },
    "technology": {
        "code": "technology",
        "title": "Technology & Digital",
        "title_hi": "तकनीकी और डिजिटल",
        "synonyms": ["technology", "it", "software", "digital", "electronics", "ai", "hardware", "cyber"]
    },
    "other": {
        "code": "other",
        "title": "Other Sector",
        "title_hi": "अन्य क्षेत्र",
        "synonyms": ["other", "general", "misc", "miscellaneous"]
    }
}

NEEDS = {
    "starting_capital": {
        "code": "starting_capital",
        "title": "Seed Capital / Starting Capital",
        "title_hi": "शुरुआती पूंजी / बीज अनुदान",
        "scheme_benefit_types": ["grant", "subsidy", "loan"],
        "synonyms": ["starting", "seed", "starting a business", "initial capital", "setup capital"]
    },
    "working_capital": {
        "code": "working_capital",
        "title": "Daily Working Capital",
        "title_hi": "कार्यशील पूंजी",
        "scheme_benefit_types": ["working_capital", "credit_guarantee", "loan"],
        "synonyms": ["working capital", "inventory", "raw material", "stock purchase", "cash credit"]
    },
    "machinery_equipment": {
        "code": "machinery_equipment",
        "title": "Machinery & Equipment Purchase",
        "title_hi": "मशीनरी व उपकरण खरीद",
        "scheme_benefit_types": ["loan", "subsidy", "term_loan"],
        "synonyms": ["machinery", "equipment", "machinery & equipment", "tool kit", "tools", "technology upgrade"]
    },
    "term_loan": {
        "code": "term_loan",
        "title": "Collateral-Free Bank Loan",
        "title_hi": "बिना गारंटी बैंक ऋण",
        "scheme_benefit_types": ["loan", "term_loan", "credit_guarantee"],
        "synonyms": ["loan", "bank loan", "collateral free", "credit", "term loan", "finance"]
    },
    "subsidy": {
        "code": "subsidy",
        "title": "Government Capital Subsidy",
        "title_hi": "सरकारी पूंजीगत सब्सिडी",
        "scheme_benefit_types": ["subsidy", "grant"],
        "synonyms": ["subsidy", "grant", "margin money", "capital subsidy", "interest subsidy"]
    },
    "training": {
        "code": "training",
        "title": "Skill & Entrepreneurship Training",
        "title_hi": "कौशल व उद्यमिता प्रशिक्षण",
        "scheme_benefit_types": ["training", "skill"],
        "synonyms": ["training", "skilling", "entrepreneurship development", "edp", "certification"]
    },
    "market_access": {
        "code": "market_access",
        "title": "Market Access & Fair Exhibitions",
        "title_hi": "बाजार पहुंच व व्यापार मेले",
        "scheme_benefit_types": ["market_access", "exhibition", "support"],
        "synonyms": ["market", "market access", "exhibition", "export", "procurement", "fair", "trade fair"]
    }
}

REVENUE_RANGES = {
    "up_to_1_lakh": {
        "code": "up_to_1_lakh",
        "label": "Up to ₹1 Lakh",
        "label_hi": "₹1 लाख तक (माइक्रो)",
        "min_inr": 0,
        "max_inr": 100000
    },
    "1_to_10_lakh": {
        "code": "1_to_10_lakh",
        "label": "₹1 Lakh to ₹10 Lakh",
        "label_hi": "₹1 लाख से ₹10 लाख",
        "min_inr": 100000,
        "max_inr": 1000000
    },
    "10_to_50_lakh": {
        "code": "10_to_50_lakh",
        "label": "₹10 Lakh to ₹50 Lakh",
        "label_hi": "₹10 लाख से ₹50 लाख",
        "min_inr": 1000000,
        "max_inr": 5000000
    },
    "above_50_lakh": {
        "code": "above_50_lakh",
        "label": "Above ₹50 Lakh",
        "label_hi": "₹50 लाख से अधिक",
        "min_inr": 5000000,
        "max_inr": 50000000
    }
}

LOCATION_TYPES = {
    "rural": {"code": "rural", "label": "Rural (ग्रामीण)", "subsidy_multiplier": 1.25},
    "urban": {"code": "urban", "label": "Urban (शहरी)", "subsidy_multiplier": 1.0}
}

class TaxonomyService:
    @staticmethod
    def get_all_occupations() -> Dict[str, Any]:
        return OCCUPATIONS

    @staticmethod
    def get_all_sectors() -> Dict[str, Any]:
        return SECTORS

    @staticmethod
    def get_all_needs() -> Dict[str, Any]:
        return NEEDS

    @staticmethod
    def get_revenue_ranges() -> Dict[str, Any]:
        return REVENUE_RANGES
