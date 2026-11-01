from pydantic import BaseModel, Field
from typing import List, Optional


class ComparisonRequest(BaseModel):
    assessment_id: Optional[str] = Field(default=None, description="Optional assessment ID to pull context from")
    current_platform: str = Field(default="Snowflake", description="Prospect incumbent platform (Snowflake, Databricks, Google BigQuery, Other)")
    selected_priorities: List[str] = Field(..., min_length=1, max_length=6, description="Selected priorities to compare (max 3 recommended)")
    stakeholder: Optional[str] = Field(default="CTO", description="Target stakeholder role for tailored relevance explanation")


class ComparisonRow(BaseModel):
    priority: str
    iomete_position: str
    iomete_evidence_id: str
    iomete_source_title: str
    iomete_source_url: str
    iomete_verification_status: str
    competitor_position: str
    competitor_source_title: Optional[str] = None
    competitor_source_url: Optional[str] = None
    competitor_verification_status: str
    why_this_matters_to_you: str


class ComparisonResponse(BaseModel):
    current_platform: str
    stakeholder: str
    rows: List[ComparisonRow]
    context_summary: str
    limitations: List[str]
