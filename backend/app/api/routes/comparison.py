from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.comparison import ComparisonRequest, ComparisonResponse
from app.services.comparison_engine import ComparisonEngine

router = APIRouter()


@router.post("/comparison/generate", response_model=ComparisonResponse)
def generate_comparison(data: ComparisonRequest, db: Session = Depends(get_db)):
    return ComparisonEngine.generate_comparison(db, data)


@router.get("/comparison/competitors", response_model=List[str])
def list_competitors():
    return ComparisonEngine.get_competitors()
