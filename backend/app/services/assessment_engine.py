import uuid
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.schemas.assessment import AssessmentCreate, AssessmentResponse, MatchedCapability, EvidenceSummary
from app.models.models import Assessment, Evidence
from app.services.evidence_service import EvidenceService
from app.services.ai_provider import ai_provider


class AssessmentEngine:
    @staticmethod
    def evaluate(db: Session, request: AssessmentCreate) -> Assessment:
        score_breakdown: List[str] = []
        raw_score = 0
        matched_capabilities: List[MatchedCapability] = []
        limitations: List[str] = []
        missing_information: List[str] = []
        discovery_questions: List[str] = []
        evidence_ids_to_collect: List[str] = []

        # 1. Evaluate Deployment Preference & Sovereignty
        deploy_pref = request.deployment_preference.lower()
        challenges_lower = [c.lower() for c in request.challenges]

        if "on-premises" in deploy_pref or "private cloud" in deploy_pref:
            raw_score += 30
            score_breakdown.append("+30 points: Dedicated sovereign deployment (On-prem / Private Cloud) matches IOMETE self-hosted architecture.")
            matched_capabilities.append(
                MatchedCapability(
                    capability_name="Self-Hosted Kubernetes Deployment & Data Sovereignty",
                    category="Data Sovereignty",
                    relevance_reason=f"Prospect requires {request.deployment_preference} deployment. IOMETE deploys directly inside customer-managed infrastructure so raw data and compute never leave internal perimeters.",
                    evidence_ids=["EVID-SOV-02", "EVID-BANK-03"],
                    qualification="Customer must provide and administer Kubernetes cluster infrastructure (EKS Anywhere, OpenShift, or bare metal) and object storage."
                )
            )
            evidence_ids_to_collect.extend(["EVID-SOV-02", "EVID-BANK-03"])
        elif "hybrid" in deploy_pref:
            raw_score += 25
            score_breakdown.append("+25 points: Hybrid cloud architecture is supported via unified object storage and decoupled Spark compute.")
            matched_capabilities.append(
                MatchedCapability(
                    capability_name="Hybrid Cloud Lakehouse Architecture",
                    category="Open Architecture",
                    relevance_reason="Prospect operates a hybrid footprint. IOMETE enables querying object storage across private and public environments using standard open protocols.",
                    evidence_ids=["EVID-SOV-02", "EVID-OPEN-01"],
                    qualification="Inter-environment bandwidth and network latency between clouds must be profiled."
                )
            )
            evidence_ids_to_collect.extend(["EVID-SOV-02", "EVID-OPEN-01"])
        else:
            raw_score += 15
            score_breakdown.append("+15 points: Standard public cloud deployment is supported via customer VPC.")

        # 2. Evaluate Vendor Lock-In & Open Standards
        if any("vendor lock-in" in c for c in challenges_lower):
            raw_score += 25
            score_breakdown.append("+25 points: High concern regarding vendor lock-in addressed by native Apache Iceberg format and zero data copy.")
            matched_capabilities.append(
                MatchedCapability(
                    capability_name="Apache Iceberg Open Table Format",
                    category="Open Architecture",
                    relevance_reason=f"Current usage of {request.current_platform} raises vendor lock-in concerns. Iceberg tables keep underlying data in standard Parquet files owned directly by {request.company_name}.",
                    evidence_ids=["EVID-OPEN-01"],
                    qualification="Requires catalog synchronization and evaluation of proprietary features currently in use (e.g. proprietary Snowflake Snowpipe or Streams)."
                )
            )
            evidence_ids_to_collect.append("EVID-OPEN-01")

        # 3. Evaluate Cloud Cost & Workload Economics
        if any("cost" in c for c in challenges_lower) or (request.monthly_infrastructure_spend and request.monthly_infrastructure_spend > 30000):
            raw_score += 20
            score_breakdown.append("+20 points: Cloud cost friction present. IOMETE workload-isolated Spark eliminates proprietary credit markup.")
            matched_capabilities.append(
                MatchedCapability(
                    capability_name="Decoupled Workload-Isolated Compute",
                    category="Cost Optimisation",
                    relevance_reason=f"Monthly spend of approximately ${request.monthly_infrastructure_spend or 'undisclosed'} on {request.current_platform} can be audited for compute credit markup and high-concurrency cost escalation.",
                    evidence_ids=["EVID-COST-04"],
                    qualification="Savings are workload-dependent; an initial query-log profiling POC is necessary to measure actual credit consumption before committing."
                )
            )
            evidence_ids_to_collect.append("EVID-COST-04")

        # 4. Evaluate Security, Compliance & Data Sovereignty
        if any("sovereignty" in c or "privacy" in c or "residency" in c for c in challenges_lower) or request.is_regulated_industry == "Yes":
            raw_score += 20
            score_breakdown.append("+20 points: Regulated compliance / strict sovereignty requirements align with IOMETE's non-multi-tenant design.")
            matched_capabilities.append(
                MatchedCapability(
                    capability_name="Fine-Grained Access Control & Compliance Isolation",
                    category="Governance and Security",
                    relevance_reason="Regulated data privacy mandates require zero multi-tenant data sharing and granular RBAC column/row masking.",
                    evidence_ids=["EVID-SEC-05", "EVID-BANK-03"],
                    qualification="Existing LDAP/Active Directory or Okta identity mappings need validation during architecture discovery."
                )
            )
            evidence_ids_to_collect.extend(["EVID-SEC-05", "EVID-BANK-03"])

        # 5. Evaluate Performance & Analytical Scale
        if any("performance" in c or "complexity" in c or "readiness" in c for c in challenges_lower):
            raw_score += 15
            score_breakdown.append("+15 points: Large-scale data engineering or analytics scaling demands addressed via native Spark & Iceberg metadata acceleration.")
            matched_capabilities.append(
                MatchedCapability(
                    capability_name="Accelerated Spark Engine & Iceberg Metadata Pruning",
                    category="Apache Spark & Performance",
                    relevance_reason=f"Data volume of {request.approximate_data_volume} requires scalable query execution without proprietary cluster queue delays.",
                    evidence_ids=["EVID-PERF-06", "EVID-AI-08"],
                    qualification="Query optimization requires indexing and partition alignment according to query access patterns."
                )
            )
            evidence_ids_to_collect.extend(["EVID-PERF-06", "EVID-AI-08"])

        # Coexistence capability
        if request.current_platform in ["Snowflake", "Databricks", "BigQuery"]:
            matched_capabilities.append(
                MatchedCapability(
                    capability_name="Non-Disruptive Coexistence & Pilot Offload",
                    category="Architecture Migration",
                    relevance_reason=f"Allows {request.company_name} to test IOMETE on sensitive or high-cost batch workloads without replacing the existing {request.current_platform} deployment upfront.",
                    evidence_ids=["EVID-MIGR-07"],
                    qualification="Requires identifying 1-2 candidate workloads for side-by-side benchmarking rather than a whole-system rip-and-replace."
                )
            )
            evidence_ids_to_collect.append("EVID-MIGR-07")

        # Determine Fit Classification
        # Cap raw score at 100
        score = min(100, raw_score)
        if score >= 75:
            fit_classification = "Strong potential fit"
        elif score >= 50:
            fit_classification = "Potential fit — further validation needed"
        elif score >= 30:
            fit_classification = "Discovery required"
        else:
            fit_classification = "Insufficient evidence"

        fit_explanation = (
            f"Calculated Score: {score}/100. Factors: " + "; ".join(score_breakdown)
        )

        # Honest Limitations & Unknowns
        limitations.append("IOMETE does not sell a proprietary managed multi-tenant SaaS warehouse; it deploys in customer-governed cloud or bare metal Kubernetes.")
        limitations.append(f"Does not automatically guarantee lower costs than {request.current_platform} without workload profiling and concurrency analysis.")
        if "on-premises" in deploy_pref:
            limitations.append("On-premises deployments require customer-managed SAN/MinIO object storage throughput verification.")

        # Missing Information
        if not request.monthly_infrastructure_spend:
            missing_information.append("Exact monthly infrastructure and credit spend breakdown.")
        if not request.storage_environment or request.storage_environment == "Not sure":
            missing_information.append("Underlying storage topology and protocols (S3, MinIO, Ceph, ADLS).")
        missing_information.append("List of proprietary SQL dialect extensions or stored procedures currently deployed.")
        missing_information.append("Concurrency peak patterns (number of simultaneous BI queries vs. scheduled ETL batch pipelines).")

        # Questions for the Next Discovery Call
        discovery_questions = [
            f"What specific workloads in your current {request.current_platform} setup represent the largest credit or license expenditure?",
            f"Are there data residency or regulatory boundaries (such as GDPR, EBA, HIPAA) that prevent certain datasets from being processed in a public SaaS cloud?",
            "What object storage system is currently used or planned for your long-term storage repository (e.g. AWS S3, MinIO, Dell ECS)?",
            "What BI and ingestion tools must maintain seamless connectivity during any evaluation?",
            "Would you be open to a 2-week scoped side-by-side POC on 1-2 representative batch or query workloads?"
        ]

        # Recommended Next Sales Action
        if fit_classification == "Strong potential fit":
            recommended_sales_action = (
                f"Schedule a 45-minute Technical Architecture Alignment call. Focus on non-disruptive coexistence: propose running a scoped, zero-risk pilot on {request.company_name}'s high-cost batch or sensitive on-premises workloads using their existing storage."
            )
        elif fit_classification == "Potential fit — further validation needed":
            recommended_sales_action = (
                f"Conduct an Infrastructure Discovery Session to review {request.company_name}'s Kubernetes readiness, object storage specs, and query concurrency requirements."
            )
        else:
            recommended_sales_action = (
                f"Engage in an exploratory qualification interview to clarify data residency mandates and long-term architectural roadmap before scheduling a technical demo."
            )

        # Stakeholder Perspectives
        stakeholder_perspectives = {
            "CTO": f"Architectural independence: Transition from proprietary lock-in to open Apache Iceberg and Spark standards while maintaining full control over compute execution.",
            "CIO": f"Risk mitigation & Sovereignty: Guarantee data never leaves corporate boundaries or jurisdictional perimeters, ensuring long-term regulatory compliance.",
            "CFO": f"Unit economics: Replace unpredictable SaaS credit markups with transparent, predictable compute costs running on customer-negotiated infrastructure.",
            "CISO": f"Zero-trust security: Eliminate third-party multi-tenant risk with dedicated VPC/on-premises deployment, granular RBAC, and unified audit logs.",
            "Data Engineering Head": f"Developer freedom: Native Apache Spark and Iceberg interoperability with zero format conversion and direct notebook/dbt pipeline support.",
            "Analytics Leader": f"Reliable query performance: Decouple ETL batch jobs from BI queries so executive dashboards never suffer from cluster contention."
        }

        # Filter stakeholder perspectives to requested roles
        selected_perspectives = {}
        for role in request.stakeholder_priorities:
            if role in stakeholder_perspectives:
                selected_perspectives[role] = stakeholder_perspectives[role]
        if not selected_perspectives:
            selected_perspectives = stakeholder_perspectives

        # Collect unique verified evidence items
        unique_ev_ids = list(set(evidence_ids_to_collect))
        db_evidence = EvidenceService.get_by_ids(db, unique_ev_ids)
        evidence_summaries = [
            {
                "id": ev.id,
                "claim": ev.claim,
                "capability_category": ev.capability_category,
                "source_title": ev.source_title,
                "source_url": ev.source_url,
                "source_type": ev.source_type,
                "verification_status": ev.verification_status,
                "qualification_or_limitation": ev.qualification_or_limitation
            }
            for ev in db_evidence
        ]

        # Executive Summary
        deterministic_summary = (
            f"Preliminary assessment indicates a {fit_classification} ({score}/100) for {request.company_name}. "
            f"The evaluation is driven by alignment with {request.deployment_preference} deployment requirements, "
            f"open table formats (Apache Iceberg) to eliminate vendor lock-in from {request.current_platform}, "
            f"and predictable workload-level compute economics. "
            f"A side-by-side coexistence pilot is recommended to measure actual performance and validate hardware sizing."
        )

        executive_summary = ai_provider.enhance_executive_summary(
            company_name=request.company_name,
            current_platform=request.current_platform,
            challenges=request.challenges,
            fit_classification=fit_classification,
            deterministic_summary=deterministic_summary
        )

        assessment_record = Assessment(
            id=str(uuid.uuid4()),
            company_name=request.company_name,
            industry=request.industry,
            company_size=request.company_size,
            region=request.region,
            current_platform=request.current_platform,
            approximate_data_volume=request.approximate_data_volume,
            deployment_preference=request.deployment_preference,
            is_regulated_industry=request.is_regulated_industry,
            current_infrastructure=request.current_infrastructure,
            cloud_provider=request.cloud_provider,
            storage_environment=request.storage_environment,
            analytics_engine=request.analytics_engine,
            bi_tools=request.bi_tools,
            data_engineering_workflow=request.data_engineering_workflow,
            monthly_infrastructure_spend=request.monthly_infrastructure_spend,
            operational_challenges=request.operational_challenges,
            challenges=request.challenges,
            context_notes=request.context_notes,
            stakeholder_priorities=request.stakeholder_priorities,
            fit_classification=fit_classification,
            fit_score=score,
            fit_explanation=fit_explanation,
            matched_capabilities=[mc.model_dump() for mc in matched_capabilities],
            evidence_references=evidence_summaries,
            limitations=limitations,
            missing_information=missing_information,
            discovery_questions=discovery_questions,
            recommended_sales_action=recommended_sales_action,
            executive_summary=executive_summary,
            stakeholder_perspectives=selected_perspectives
        )

        db.add(assessment_record)
        db.commit()
        db.refresh(assessment_record)

        return assessment_record
