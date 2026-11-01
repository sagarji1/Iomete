from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class CostScenarioRequest(BaseModel):
    current_monthly_compute_spend: float = Field(default=50000.0, description="Current monthly compute spend ($)")
    current_monthly_storage_spend: float = Field(default=15000.0, description="Current monthly storage spend ($)")
    current_monthly_data_transfer_spend: float = Field(default=8000.0, description="Current monthly transfer/egress spend ($)")
    current_annual_platform_licensing: float = Field(default=60000.0, description="Current annual platform license fee ($)")
    current_annual_staffing_cost: float = Field(default=120000.0, description="Current annual operations/DBA staffing ($)")
    
    # Proposed Lakehouse Inputs
    estimated_proposed_infrastructure_cost: Optional[float] = Field(default=None, description="Estimated underlying cloud/hardware compute+storage ($)")
    estimated_migration_cost: float = Field(default=35000.0, description="One-time migration and pilot rollout cost ($)")
    annual_data_growth_rate: float = Field(default=0.20, description="Estimated annual data growth rate (e.g. 0.20 for 20%)")
    target_workload_offload_percent: float = Field(default=0.70, description="Percentage of workloads suitable for open lakehouse (0.1 to 1.0)")


class CostBreakdownItem(BaseModel):
    category: str
    current_annual: float
    proposed_annual: float
    difference: float
    notes: str


class CostScenarioResponse(BaseModel):
    current_estimated_annual_cost: float
    proposed_estimated_annual_cost: float
    annual_difference: float
    estimated_first_year_net_difference: float
    break_even_months: Optional[float]
    breakdown: List[CostBreakdownItem]
    assumptions: List[str]
    sensitivity_analysis: List[Dict[str, Any]]
    limitations_and_exclusions: List[str]
