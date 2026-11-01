from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def get_health():
    return {
        "status": "healthy",
        "service": "IOMETE PROOF Engine",
        "version": "1.0.0",
        "mode": "deterministic_grounded"
    }
