import json
import os
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.models import Evidence

SEED_EVIDENCE_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "data",
    "seed_evidence.json"
)


class EvidenceService:
    @staticmethod
    def load_seed_evidence() -> List[dict]:
        if os.path.exists(SEED_EVIDENCE_FILE):
            with open(SEED_EVIDENCE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        return []

    @staticmethod
    def seed_database(db: Session):
        count = db.query(Evidence).count()
        if count == 0:
            evidence_data = EvidenceService.load_seed_evidence()
            for item in evidence_data:
                ev = Evidence(
                    id=item["id"],
                    claim=item["claim"],
                    capability_category=item["capability_category"],
                    description=item["description"],
                    source_title=item["source_title"],
                    source_url=item["source_url"],
                    source_type=item["source_type"],
                    verification_status=item["verification_status"],
                    last_verified_date=item["last_verified_date"],
                    qualification_or_limitation=item["qualification_or_limitation"],
                    related_objections=item.get("related_objections", [])
                )
                db.add(ev)
            db.commit()

    @staticmethod
    def get_all(db: Session, category: Optional[str] = None) -> List[Evidence]:
        query = db.query(Evidence)
        if category:
            query = query.filter(Evidence.capability_category.ilike(f"%{category}%"))
        return query.all()

    @staticmethod
    def get_by_id(db: Session, evidence_id: str) -> Optional[Evidence]:
        return db.query(Evidence).filter(Evidence.id == evidence_id).first()

    @staticmethod
    def get_by_ids(db: Session, evidence_ids: List[str]) -> List[Evidence]:
        return db.query(Evidence).filter(Evidence.id.in_(evidence_ids)).all()

    @staticmethod
    def search_by_objection(db: Session, objection_tag: str) -> List[Evidence]:
        all_items = db.query(Evidence).all()
        matched = []
        for item in all_items:
            tags = item.related_objections or []
            if objection_tag in tags:
                matched.append(item)
        return matched
