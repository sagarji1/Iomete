import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, Text, JSON
from app.core.database import Base


class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(String(50), primary_key=True, index=True)
    claim = Column(Text, nullable=False)
    capability_category = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=False)
    source_title = Column(String(255), nullable=False)
    source_url = Column(String(500), nullable=False)
    source_type = Column(String(50), nullable=False)  # official_documentation, whitepaper, etc.
    verification_status = Column(String(50), nullable=False)  # verified_official, unverified_assumption
    last_verified_date = Column(String(50), nullable=False)
    qualification_or_limitation = Column(Text, nullable=False)
    related_objections = Column(JSON, default=list)


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(String(100), primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Company Profile
    company_name = Column(String(200), nullable=False)
    industry = Column(String(100), nullable=False)
    company_size = Column(String(100), nullable=False)
    region = Column(String(100), nullable=False)
    current_platform = Column(String(100), nullable=False)
    approximate_data_volume = Column(String(100), nullable=False)
    deployment_preference = Column(String(100), nullable=False)
    is_regulated_industry = Column(String(20), nullable=False)
    
    # Current Data Environment
    current_infrastructure = Column(String(255), nullable=True)
    cloud_provider = Column(String(100), nullable=True)
    storage_environment = Column(String(255), nullable=True)
    analytics_engine = Column(String(255), nullable=True)
    bi_tools = Column(String(255), nullable=True)
    data_engineering_workflow = Column(String(255), nullable=True)
    monthly_infrastructure_spend = Column(Float, nullable=True)
    operational_challenges = Column(Text, nullable=True)
    
    # Business Challenges & Stakeholders
    challenges = Column(JSON, default=list)
    context_notes = Column(Text, nullable=True)
    stakeholder_priorities = Column(JSON, default=list)
    
    # Fit Analysis Results (Deterministic)
    fit_classification = Column(String(100), nullable=False)
    fit_score = Column(Integer, nullable=False)
    fit_explanation = Column(Text, nullable=False)
    matched_capabilities = Column(JSON, default=list)
    evidence_references = Column(JSON, default=list)
    limitations = Column(JSON, default=list)
    missing_information = Column(JSON, default=list)
    discovery_questions = Column(JSON, default=list)
    recommended_sales_action = Column(Text, nullable=False)
    executive_summary = Column(Text, nullable=False)
    stakeholder_perspectives = Column(JSON, default=dict)


class ObjectionLog(Base):
    __tablename__ = "objection_logs"

    id = Column(String(100), primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    objection_text = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    underlying_concern = Column(Text, nullable=False)
    why_this_matters = Column(Text, nullable=False)
    relevant_capabilities = Column(JSON, default=list)
    supporting_evidence = Column(JSON, default=list)
    limitations = Column(JSON, default=list)
    recommended_response = Column(Text, nullable=False)
    next_sales_action = Column(Text, nullable=False)
    discovery_questions = Column(JSON, default=list)
