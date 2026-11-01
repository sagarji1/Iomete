from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class ObjectionRequest(BaseModel):
    objection_text: str = Field(..., description="Customer objection text or predefined question")
    company_context: Optional[str] = Field(default=None, description="Optional company context (e.g., Snowflake user, bank, on-prem)")
    current_platform: Optional[str] = Field(default=None, description="Current platform if known")


class ObjectionResponse(BaseModel):
    id: str
    created_at: datetime
    objection_text: str
    category: str
    underlying_concern: str
    why_this_matters: str
    relevant_capabilities: List[str]
    supporting_evidence: List[dict]
    limitations: List[str]
    recommended_response: str
    next_sales_action: str
    discovery_questions: List[str]
    validation_status: str
