from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class AssessmentCreate(BaseModel):
    # Step 1: Company profile
    company_name: str = Field(..., description="Company name")
    industry: str = Field(..., description="Industry sector")
    company_size: str = Field(..., description="Company headcount or size tier")
    region: str = Field(..., description="Operating region or headquarters")
    current_platform: str = Field(..., description="Current data platform (e.g., Snowflake, Databricks, BigQuery, Redshift, On-Premises Hadoop)")
    approximate_data_volume: str = Field(..., description="Data volume (e.g., 50 TB, 120 TB, 1 PB)")
    deployment_preference: str = Field(..., description="Deployment preference: On-premises, Private Cloud, Hybrid, or Multi-Cloud")
    is_regulated_industry: str = Field(default="Unsure", description="Yes, No, or Unsure")

    # Step 2: Current data environment
    current_infrastructure: Optional[str] = Field(default=None, description="Cloud / Hardware infrastructure")
    cloud_provider: Optional[str] = Field(default="Not sure", description="AWS, GCP, Azure, On-prem, or Not sure")
    storage_environment: Optional[str] = Field(default=None, description="Current storage layer (S3, GCS, ADLS, MinIO, HDFS)")
    analytics_engine: Optional[str] = Field(default=None, description="Current analytics/compute engine")
    bi_tools: Optional[str] = Field(default=None, description="BI & visualization tools")
    data_engineering_workflow: Optional[str] = Field(default=None, description="Orchestration & pipelines")
    monthly_infrastructure_spend: Optional[float] = Field(default=None, description="Approximate monthly cloud / data spend")
    operational_challenges: Optional[str] = Field(default=None, description="Existing operational challenges")

    # Step 3: Business challenges
    challenges: List[str] = Field(default_factory=list, description="Selected business challenges")
    context_notes: Optional[str] = Field(default=None, description="Additional context or specific constraints")

    # Step 4: Stakeholder priorities
    stakeholder_priorities: List[str] = Field(default_factory=list, description="Prioritized stakeholder roles")


class MatchedCapability(BaseModel):
    capability_name: str
    category: str
    relevance_reason: str
    evidence_ids: List[str]
    qualification: str


class EvidenceSummary(BaseModel):
    id: str
    claim: str
    capability_category: str
    source_title: str
    source_url: str
    source_type: str
    verification_status: str
    qualification_or_limitation: str


class AssessmentResponse(BaseModel):
    id: str
    created_at: datetime
    company_name: str
    industry: str
    company_size: str
    region: str
    current_platform: str
    approximate_data_volume: str
    deployment_preference: str
    is_regulated_industry: str
    
    current_infrastructure: Optional[str] = None
    cloud_provider: Optional[str] = None
    storage_environment: Optional[str] = None
    analytics_engine: Optional[str] = None
    bi_tools: Optional[str] = None
    data_engineering_workflow: Optional[str] = None
    monthly_infrastructure_spend: Optional[float] = None
    operational_challenges: Optional[str] = None
    
    challenges: List[str]
    context_notes: Optional[str] = None
    stakeholder_priorities: List[str]
    
    fit_classification: str
    fit_score: int
    fit_explanation: str
    matched_capabilities: List[MatchedCapability]
    evidence_references: List[EvidenceSummary]
    limitations: List[str]
    missing_information: List[str]
    discovery_questions: List[str]
    recommended_sales_action: str
    executive_summary: str
    stakeholder_perspectives: Dict[str, str]

    model_config = {
        "from_attributes": True
    }

