import json
import os
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.schemas.comparison import ComparisonRequest, ComparisonResponse, ComparisonRow
from app.services.evidence_service import EvidenceService
from app.models.models import Assessment

COMPETITOR_REGISTRY_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "data",
    "competitor_registry.json"
)

# Fixed priorities list defined in §7
PRIORITIES_LIST = [
    "Cost predictability",
    "Vendor lock-in / portability",
    "Data sovereignty & deployment control",
    "Performance at stated volume",
    "Migration effort",
    "Governance & security"
]

IOMETE_PRIORITY_MAPPINGS = {
    "Cost predictability": {
        "evidence_id": "EVID-COST-04",
        "position": "Predictable workload-based compute economics without proprietary query markup or hidden egress overhead. Isolated, autoscaling Apache Spark clusters run on customer's negotiated cloud instances or on-premises servers.",
        "source_title": "IOMETE Design Principles: Compute & Storage Decoupling",
        "source_url": "https://iomete.com/product/data-platform/design-principles",
        "verification_status": "verified_official"
    },
    "Vendor lock-in / portability": {
        "evidence_id": "EVID-OPEN-01",
        "position": "100% open table formats (Apache Iceberg) and standard Parquet files stored directly in customer-owned object storage. Zero proprietary data lock-in and zero conversion penalties when accessed by external analytical engines.",
        "source_title": "IOMETE Open Source Architecture & Principles",
        "source_url": "https://iomete.com/product/architecture/open-source",
        "verification_status": "verified_official"
    },
    "Data sovereignty & deployment control": {
        "evidence_id": "EVID-SOV-02",
        "position": "Complete data sovereignty: Data and compute reside entirely inside customer's own cloud VPC or on-premises bare-metal data centre. Control plane can be self-hosted or air-gapped; sensitive data never leaves your perimeter.",
        "source_title": "Self-Hosted Data Platform & Private Cloud Architecture",
        "source_url": "https://iomete.com/resources/blog/self-hosted-data-platform-private-cloud-architecture",
        "verification_status": "verified_official"
    },
    "Performance at stated volume": {
        "evidence_id": "EVID-PERF-06",
        "position": "Accelerated Apache Spark engine combined with Iceberg metadata indexing and file pruning. Delivers sub-second BI query acceleration and horizontal scaling for multi-terabyte to petabyte batch workloads.",
        "source_title": "Sovereign Lakehouse Proof at Scale",
        "source_url": "https://iomete.com/resources/blog/sovereign-lakehouse-proof-at-scale",
        "verification_status": "verified_official"
    },
    "Migration effort": {
        "evidence_id": "EVID-MIGR-07",
        "position": "Non-disruptive coexistence: Point IOMETE directly to existing object storage datasets and offload high-cost batch or sensitive pipelines without replacing incumbent BI dashboards or upstream ingestion upfront.",
        "source_title": "IOMETE Platform Architecture Overview",
        "source_url": "https://iomete.com/",
        "verification_status": "verified_official"
    },
    "Governance & security": {
        "evidence_id": "EVID-SEC-05",
        "position": "Enterprise-grade fine-grained access control (RBAC), row/column masking, tag-based security policies, and Apache Ranger integration governing all SQL and programmatic Spark queries.",
        "source_title": "IOMETE Security & Data Governance Specification",
        "source_url": "https://iomete.com/product/data-platform/design-principles",
        "verification_status": "verified_official"
    }
}

STAKEHOLDER_RELEVANCE = {
    "CFO": {
        "Cost predictability": "Replaces volatile monthly credit burns with predictable compute instance budgeting, reducing unforecasted variance.",
        "Vendor lock-in / portability": "Protects capital investment by preventing costly data egress and migration penalties down the line.",
        "Data sovereignty & deployment control": "Avoids severe regulatory fines (GDPR, EBA, HIPAA) associated with cross-border data residency violations.",
        "Performance at stated volume": "Ensures computational resources scale cost-linearly rather than exponentially with business data growth.",
        "Migration effort": "Minimizes initial project CAPEX by enabling a phased, low-risk pilot offload on existing hardware.",
        "Governance & security": "Protects enterprise enterprise valuation by preventing costly data leaks and compliance audit failures."
    },
    "CTO": {
        "Cost predictability": "Enables decoupled workload sizing per department so high-volume batch jobs don't drain company-wide compute quotas.",
        "Vendor lock-in / portability": "Ensures architectural sovereignty by decoupling storage, metadata (Iceberg), and compute (Spark) from single-vendor roadmaps.",
        "Data sovereignty & deployment control": "Gives complete control over the infrastructure topology, network perimeter, and Kubernetes execution environment.",
        "Performance at stated volume": "Provides horizontal Spark autoscaling with Iceberg file pruning for petabyte-scale pipeline efficiency.",
        "Migration effort": "Allows engineers to adopt open standards without rewriting existing business-facing reporting dashboards.",
        "Governance & security": "Unifies identity management (LDAP/Okta) with Apache Ranger RBAC across both SQL queries and programmatic Python scripts."
    },
    "CISO": {
        "Cost predictability": "Ensures predictable security tooling and isolated cluster provisioning without shared tenancy cost overhead.",
        "Vendor lock-in / portability": "Maintains open audit logs and portability of encryption keys without proprietary vendor escrow.",
        "Data sovereignty & deployment control": "Enforces strict perimeter isolation where raw data, metadata, and compute clusters never cross corporate boundaries.",
        "Performance at stated volume": "Ensures high-volume security analytics (SIEM/audit logs) can be queried rapidly without cluster queue bottlenecks.",
        "Migration effort": "Permits zero-trust staging: test isolated data access in a sandbox before production cutover.",
        "Governance & security": "Enforces column-level masking, row-level filtering, and cryptographic audit trails across all data consumers."
    },
    "Data Engineering Head": {
        "Cost predictability": "Allows heavy ETL pipelines to run on dedicated, non-metered Spark clusters without fighting analysts for warehouse credits.",
        "Vendor lock-in / portability": "Native Parquet and Apache Iceberg interoperability with standard tools (dbt, Airflow, Spark, DuckDB).",
        "Data sovereignty & deployment control": "Runs directly on Kubernetes with familiar container deployment, helm charts, and GitOps workflows.",
        "Performance at stated volume": "Optimized Spark query engine handles complex joins and streaming transformations without memory crashes.",
        "Migration effort": "Reuses existing PySpark and standard SQL models directly with zero format re-ingestion.",
        "Governance & security": "Centralized RBAC reduces ticket backlog for schema grants and access permission requests."
    },
    "Analytics Leader": {
        "Cost predictability": "Guarantees executive dashboards run consistently without artificial cluster auto-suspend latency spikes.",
        "Vendor lock-in / portability": "Seamless connectivity via standard JDBC/ODBC to PowerBI, Tableau, Superset, and Looker.",
        "Data sovereignty & deployment control": "Assures stakeholders that sensitive customer analytics strictly comply with internal data residency policies.",
        "Performance at stated volume": "Sub-second BI response times powered by Iceberg metadata acceleration and partition pruning.",
        "Migration effort": "Zero interruption to existing BI dashboards while backend workloads are optimized.",
        "Governance & security": "Row-level masking ensures analysts only see permissible customer segments automatically."
    }
}


class ComparisonEngine:
    @staticmethod
    def load_competitor_registry() -> List[dict]:
        if os.path.exists(COMPETITOR_REGISTRY_FILE):
            with open(COMPETITOR_REGISTRY_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        return []

    @staticmethod
    def get_competitors() -> List[str]:
        registry = ComparisonEngine.load_competitor_registry()
        competitors = list(set([item["competitor"] for item in registry]))
        return sorted(competitors)

    @staticmethod
    def generate_comparison(db: Session, request: ComparisonRequest) -> ComparisonResponse:
        competitor_name = request.current_platform
        stakeholder = request.stakeholder or "CTO"
        
        # If assessment_id is provided, resolve current_platform and primary stakeholder
        if request.assessment_id:
            assessment = db.query(Assessment).filter(Assessment.id == request.assessment_id).first()
            if assessment:
                competitor_name = assessment.current_platform
                if assessment.stakeholder_priorities and len(assessment.stakeholder_priorities) > 0:
                    stakeholder = assessment.stakeholder_priorities[0]

        registry = ComparisonEngine.load_competitor_registry()
        
        # Filter registry for the competitor
        competitor_items = {
            item["priority"].lower(): item
            for item in registry
            if item["competitor"].lower() == competitor_name.lower()
        }

        # Build comparison rows for selected priorities (up to 3 recommended)
        rows: List[ComparisonRow] = []
        for priority in request.selected_priorities:
            # Sourced IOMETE position
            iomete_info = IOMETE_PRIORITY_MAPPINGS.get(priority, {
                "evidence_id": "EVID-OPEN-01",
                "position": "Supported natively through Apache Iceberg and decoupled Spark compute.",
                "source_title": "IOMETE Official Documentation",
                "source_url": "https://iomete.com",
                "verification_status": "verified_official"
            })

            # Competitor position from registry
            comp_match = competitor_items.get(priority.lower())
            if comp_match:
                comp_pos = comp_match["position_statement"]
                comp_source_title = comp_match["source_title"]
                comp_source_url = comp_match["source_url"]
                comp_status = comp_match["verification_status"]
            else:
                comp_pos = "Not independently verified — confirm with the prospect's current contract"
                comp_source_title = "Requires Contract Review"
                comp_source_url = None
                comp_status = "unverified_contract_review"

            # Tailored why this matters explanation
            stakeholder_dict = STAKEHOLDER_RELEVANCE.get(stakeholder, STAKEHOLDER_RELEVANCE["CTO"])
            why_it_matters = stakeholder_dict.get(
                priority,
                f"Directly impacts operational reliability, unit economics, and governance for the {stakeholder}."
            )

            rows.append(
                ComparisonRow(
                    priority=priority,
                    iomete_position=iomete_info["position"],
                    iomete_evidence_id=iomete_info["evidence_id"],
                    iomete_source_title=iomete_info["source_title"],
                    iomete_source_url=iomete_info["source_url"],
                    iomete_verification_status=iomete_info["verification_status"],
                    competitor_position=comp_pos,
                    competitor_source_title=comp_source_title,
                    competitor_source_url=comp_source_url,
                    competitor_verification_status=comp_status,
                    why_this_matters_to_you=why_it_matters
                )
            )

        context_summary = (
            f"This matrix contrasts {competitor_name}'s published operational model against IOMETE's decoupled lakehouse "
            f"architecture across {len(rows)} key evaluation dimensions. Data is sourced strictly from public documentation "
            f"and architecture whitepapers. This comparison reflects architectural tradeoffs rather than a declared verdict."
        )

        limitations = [
            f"Competitor capabilities for {competitor_name} reflect standard enterprise edition specifications and may differ under bespoke enterprise agreements.",
            "Workload performance comparisons depend on query complexity, data partitioning, and hardware sizing.",
            "Unverified competitor items require validation against the customer's actual contract terms."
        ]

        return ComparisonResponse(
            current_platform=competitor_name,
            stakeholder=stakeholder,
            rows=rows,
            context_summary=context_summary,
            limitations=limitations
        )
