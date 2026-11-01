from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.objection import ObjectionRequest, ObjectionResponse
from app.services.objection_engine import ObjectionEngine

router = APIRouter()


@router.post("/objections/analyse", response_model=ObjectionResponse)
def analyse_objection(data: ObjectionRequest, db: Session = Depends(get_db)):
    result = ObjectionEngine.analyse(db, data)
    return result
