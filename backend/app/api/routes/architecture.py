from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.architecture_service import ArchitectureService

router = APIRouter()


class ArchitectureRequest(BaseModel):
    deployment_preference: Optional[str] = "On-premises"
    current_platform: Optional[str] = "Snowflake"


@router.post("/architecture/generate")
def generate_architecture(data: ArchitectureRequest):
    return ArchitectureService.generate_diagram(
        deployment_preference=data.deployment_preference or "On-premises",
        current_platform=data.current_platform or "Snowflake"
    )
