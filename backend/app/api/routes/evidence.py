from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.services.evidence_service import EvidenceService
from app.models.models import Evidence

router = APIRouter()


@router.get("/evidence")
def list_evidence(
    category: Optional[str] = Query(None, description="Filter by capability category"),
    db: Session = Depends(get_db)
):
    items = EvidenceService.get_all(db, category=category)
    return [
        {
            "id": item.id,
            "claim": item.claim,
            "capability_category": item.capability_category,
            "description": item.description,
            "source_title": item.source_title,
            "source_url": item.source_url,
            "source_type": item.source_type,
            "verification_status": item.verification_status,
            "last_verified_date": item.last_verified_date,
            "qualification_or_limitation": item.qualification_or_limitation,
            "related_objections": item.related_objections
        }
        for item in items
    ]


@router.get("/evidence/{evidence_id}")
def get_evidence_item(evidence_id: str, db: Session = Depends(get_db)):
    item = EvidenceService.get_by_id(db, evidence_id)
    if not item:
        raise HTTPException(status_code=404, detail="Evidence item not found")
    return {
        "id": item.id,
        "claim": item.claim,
        "capability_category": item.capability_category,
        "description": item.description,
        "source_title": item.source_title,
        "source_url": item.source_url,
        "source_type": item.source_type,
        "verification_status": item.verification_status,
        "last_verified_date": item.last_verified_date,
        "qualification_or_limitation": item.qualification_or_limitation,
        "related_objections": item.related_objections
    }
