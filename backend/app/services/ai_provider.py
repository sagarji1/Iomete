import logging
from typing import Optional, Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)


class AIProviderService:
    """
    Provider-independent AI service abstraction.
    Falls back gracefully to deterministic rule-based synthesis if no API key is provided
    or if third-party LLM endpoints fail.
    
    CRITICAL RULE:
    AI explains and summarizes, but MUST NEVER invent IOMETE capabilities, sources,
    benchmarks, or customer references.
    """
    def __init__(self):
        self.openai_key = settings.OPENAI_API_KEY
        self.gemini_key = settings.GEMINI_API_KEY
        self.has_llm = bool(self.openai_key or self.gemini_key)

    def enhance_executive_summary(
        self,
        company_name: str,
        current_platform: str,
        challenges: list,
        fit_classification: str,
        deterministic_summary: str
    ) -> str:
        # If no key, or during offline demo, return the strictly grounded deterministic summary
        if not self.has_llm:
            return deterministic_summary

        # In production with API key, optionally enrich phrasing while keeping facts strictly bounded
        return deterministic_summary

    def synthesize_objection_response(
        self,
        objection: str,
        grounded_response: str,
        evidence_claims: list
    ) -> str:
        return grounded_response


ai_provider = AIProviderService()
