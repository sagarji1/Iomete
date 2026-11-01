import json
import os
from fastapi import APIRouter

router = APIRouter()

DEMO_PROSPECTS_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "data",
    "demo_prospects.json"
)


@router.get("/prospects")
def list_demo_prospects():
    if os.path.exists(DEMO_PROSPECTS_FILE):
        with open(DEMO_PROSPECTS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []
