from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.app.db.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email_or_phone = Column(String(120), unique=True, index=True, nullable=False)
    full_name = Column(String(120), nullable=False, default="Entrepreneur")
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="user") # 'user', 'admin'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    profile = relationship("UserProfile", back_populates="user", uselist=False)
    applications = relationship("SavedApplication", back_populates="user")
    recommendations = relationship("RecommendationHistory", back_populates="user")

class UserProfile(Base):
    __tablename__ = "user_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    
    location_state = Column(String(100), nullable=False, default="Uttar Pradesh")
    district = Column(String(100), nullable=True, default="Varanasi")
    applicant_persona = Column(String(100), default="starting_business")
    business_type = Column(String(100), default="Textile")
    funding_need = Column(JSON, default=lambda: ["Starting a business", "Machinery & Equipment", "Loan"])
    business_size_range = Column(String(100), default="micro_under_10l")
    age = Column(Integer, default=28)
    gender = Column(String(50), default="female")
    social_category = Column(String(50), default="OBC")
    business_stage = Column(String(50), default="new")
    is_street_vendor = Column(Boolean, default=False)
    is_traditional_artisan = Column(Boolean, default=True)
    education_level = Column(String(50), default="10th")
    has_udyam_registration = Column(Boolean, default=False)
    has_bank_default = Column(Boolean, default=False)
    address = Column(Text, nullable=True)
    
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="profile")

class SavedApplication(Base):
    __tablename__ = "saved_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    scheme_id = Column(String(100), nullable=False, index=True)
    scheme_name = Column(String(255), nullable=False)
    scheme_slug = Column(String(150), nullable=True)
    notes = Column(Text, default="Saved from UdyamSetu matching flow.")
    completed_docs = Column(JSON, default=list) # e.g. ["doc-aadhaar", "doc-pan"]
    preparation_status = Column(Integer, default=0) # 0 - 100%
    official_ref_number = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="applications")

class IssueReport(Base):
    __tablename__ = "issue_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    scheme_id = Column(String(100), nullable=False, index=True)
    scheme_name = Column(String(255), nullable=False)
    issue_type = Column(String(100), nullable=False) # 'outdated_info', 'incorrect_eligibility', etc.
    description = Column(Text, nullable=False)
    status = Column(String(50), default="pending") # 'pending', 'under_review', 'resolved'
    reviewer_notes = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    resolved_at = Column(DateTime, nullable=True)

class RecommendationHistory(Base):
    __tablename__ = "recommendation_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    profile_snapshot = Column(JSON, nullable=False)
    scheme_id = Column(String(100), nullable=False, index=True)
    scheme_name = Column(String(255), nullable=False)
    eligibility_status = Column(String(50), nullable=False) # 'eligible', 'potentially_eligible', 'not_eligible'
    match_score = Column(Float, nullable=False) # 0 - 100
    rules_passed = Column(JSON, default=list)
    rules_failed = Column(JSON, default=list)
    evidence_version = Column(String(50), default="v2.1")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="recommendations")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(100), nullable=False) # 'matching_executed', 'application_saved', etc.
    user_id = Column(Integer, nullable=True)
    details = Column(JSON, default=dict)
    ip_address = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
