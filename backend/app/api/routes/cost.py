from fastapi import APIRouter
from app.schemas.cost import CostScenarioRequest, CostScenarioResponse
from app.services.cost_service import CostService

router = APIRouter()


@router.post("/cost/scenario", response_model=CostScenarioResponse)
def compute_cost_scenario(data: CostScenarioRequest):
    return CostService.calculate_scenario(data)
