from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.report_service import ReportService

router = APIRouter()


@router.get("/reports/{assessment_id}")
def get_customer_report(assessment_id: str, db: Session = Depends(get_db)):
    report = ReportService.generate_report(db, assessment_id)
    if not report:
        raise HTTPException(status_code=404, detail="Assessment not found for report generation")
    return report
