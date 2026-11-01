import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.services.evidence_service import EvidenceService

from app.api.routes import (
    health,
    assessments,
    comparison,
    objections,
    evidence,
    architecture,
    cost,
    reports,
    prospects
)


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        EvidenceService.seed_database(db)
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing database tables and seed evidence...")
    init_db()
    yield
    logger.info("Shutting down IOMETE PROOF API...")



app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="IOMETE PROOF — Don't Pitch. Prove. Enterprise Sales Intelligence & Product Experience Platform",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all during local dev / production preview
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["Health"])
app.include_router(assessments.router, prefix=settings.API_V1_STR, tags=["Assessments"])
app.include_router(comparison.router, prefix=settings.API_V1_STR, tags=["Comparison Matrix"])
app.include_router(objections.router, prefix=settings.API_V1_STR, tags=["Objection Engine"])

app.include_router(evidence.router, prefix=settings.API_V1_STR, tags=["Evidence Library"])
app.include_router(architecture.router, prefix=settings.API_V1_STR, tags=["Architecture Studio"])
app.include_router(cost.router, prefix=settings.API_V1_STR, tags=["Cost Explorer"])
app.include_router(reports.router, prefix=settings.API_V1_STR, tags=["Customer Reports"])
app.include_router(prospects.router, prefix=settings.API_V1_STR, tags=["Demo Prospects"])


@app.get("/")
def root():
    return {
        "message": "Welcome to IOMETE PROOF API",
        "docs": "/docs",
        "status": "active",
        "tagline": "Don't Pitch. Prove."
    }
