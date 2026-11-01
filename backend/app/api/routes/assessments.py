from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.assessment import AssessmentCreate, AssessmentResponse
from app.models.models import Assessment
from app.services.assessment_engine import AssessmentEngine

router = APIRouter()


@router.post("/assessments", response_model=AssessmentResponse)
def create_assessment(data: AssessmentCreate, db: Session = Depends(get_db)):
    assessment = AssessmentEngine.evaluate(db, data)
    return assessment


@router.get("/assessments", response_model=List[AssessmentResponse])
def list_assessments(db: Session = Depends(get_db)):
    return db.query(Assessment).order_by(Assessment.created_at.desc()).all()


@router.get("/assessments/{assessment_id}", response_model=AssessmentResponse)
def get_assessment(assessment_id: str, db: Session = Depends(get_db)):
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return assessment
