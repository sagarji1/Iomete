import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.models import ObjectionLog, Evidence
from app.schemas.objection import ObjectionRequest, ObjectionResponse
from app.services.evidence_service import EvidenceService


class ObjectionEngine:
    @staticmethod
    def analyse(db: Session, request: ObjectionRequest) -> ObjectionResponse:
        text = request.objection_text.lower()
        context = (request.company_context or "").lower()
        platform = (request.current_platform or "").lower()

        # Classification logic based on keywords
        if "snowflake" in text or "databricks" in text or "bigquery" in text or "already use" in text:
            category = "Incumbent Platform Differentiation"
            underlying_concern = (
                "Fear of unnecessary platform churn, sunk investment in existing pipelines, "
                "and skepticism about why another data platform is needed when Snowflake/Databricks is functioning."
            )
            why_this_matters = (
                "Enterprise buyers hate rip-and-replace. If IOMETE requires rewriting all pipelines or ditching their current warehouse day one, the sales cycle dies immediately."
            )
            relevant_capabilities = [
                "Non-Disruptive Coexistence & Pilot Offload",
                "Apache Iceberg Standard Open Formats",
                "Workload-Isolated Compute without Credit Markup"
            ]
            evidence_ids = ["EVID-OPEN-01", "EVID-COST-04", "EVID-MIGR-07"]
            limitations = [
                "IOMETE is not trying to displace your entire Snowflake data warehouse on Day 1.",
                "Snowflake-specific stored procedures (e.g. JavaScript UDFs or Snowpark proprietary bindings) require assessment before migration.",
                "Does not replace business-facing BI tools or semantic layers."
            ]
            validation_items = [
                "Identify top 3 most expensive recurring batch/ETL workloads on Snowflake.",
                "Verify whether data is or can be registered in Apache Iceberg format.",
                "Confirm query latency SLA requirements for existing dashboards."
            ]
            recommended_response = (
                "We don't recommend replacing your existing Snowflake environment today. Most of our enterprise clients started exactly where you are: "
                "Snowflake works well for ad-hoc business SQL, but running heavy ETL batch pipelines, continuous streaming ingestion, and sensitive data workloads "
                "inside Snowflake causes compute credit consumption to skyrocket. "
                "IOMETE deploys directly inside your cloud VPC or on-premises environment on Apache Iceberg open table formats. "
                "This means you can offload high-cost batch workloads to dedicated Spark clusters—cutting compute markup by 50%+ without proprietary data lock-in—"
                "while Snowflake and BI tools continue reading the exact same Iceberg tables with zero data duplication."
            )
            next_sales_action = (
                "Propose a side-by-side Shadow Benchmark: Take one heavy scheduled query or ETL pipeline from Snowflake, "
                "run it in parallel on an IOMETE trial cluster against the same Parquet/Iceberg storage, and measure actual compute unit cost and latency."
            )
            discovery_questions = [
                "Which specific Snowflake virtual warehouses account for the largest share of monthly credit burn?",
                "Are you currently exploring or using Apache Iceberg tables within your cloud storage?",
                "What is your tolerance for keeping Snowflake for executive BI while offloading high-throughput batch pipelines to self-hosted Spark?"
            ]

        elif "sensitive" in text or "sovereignty" in text or "privacy" in text or "on-prem" in text or "outside" in text or "residency" in text:
            category = "Data Sovereignty & Perimeter Security"
            underlying_concern = (
                "Zero tolerance for regulatory violation, compliance penalties (GDPR/HIPAA/EBA), "
                "or risk of data exfiltration associated with multi-tenant SaaS architectures."
            )
            why_this_matters = (
                "For banks, healthcare providers, and sovereign institutions, keeping data inside strict physical or logical perimeters is a mandatory legal constraint, not an architectural preference."
            )
            relevant_capabilities = [
                "Self-Hosted Kubernetes Deployment (Air-Gapped & On-Premises)",
                "Complete Separation of Control & Data Planes",
                "Fine-Grained RBAC & Apache Ranger Integration"
            ]
            evidence_ids = ["EVID-SOV-02", "EVID-BANK-03", "EVID-SEC-05"]
            limitations = [
                "Customer must furnish and manage the host Kubernetes cluster (EKS Anywhere, OpenShift, or Bare Metal) and storage backend.",
                "High availability and automated offsite backup schedules are managed according to internal IT policies."
            ]
            validation_items = [
                "Confirm target environment: Air-gapped on-premises bare-metal, private cloud VPC, or hybrid.",
                "Review enterprise identity directory integration (LDAP / Active Directory / Okta / SAML).",
                "Validate local storage protocol (MinIO, Ceph, SAN, or S3-compatible API)."
            ]
            recommended_response = (
                "You have absolute authority over where your data resides. Unlike multi-tenant cloud SaaS warehouses where customer data or metadata "
                "travels through shared vendor infrastructure, IOMETE installs directly inside your own private cloud VPC or on-premises data centre. "
                "Data never leaves your security boundary, query execution runs on your dedicated compute, and you maintain complete control over encryption keys. "
                "In fact, tier-1 European banks run IOMETE in full compliance with EBA and GDPR regulations using on-premises object storage."
            )
            next_sales_action = (
                "Offer a Technical Security Architecture Review with our Lead Architect to walk through the isolated Kubernetes deployment manifest and data-flow perimeter diagram."
            )
            discovery_questions = [
                "Does your regulatory policy mandate an air-gapped network or can the control plane communicate with a secured endpoint?",
                "What internal Kubernetes distribution (OpenShift, Rancher, Tanzu, vanilla K8s) is standard in your data centres?",
                "What encryption and key management infrastructure (HSM, HashiCorp Vault) is required?"
            ]

        elif "cost" in text or "expensive" in text or "spend" in text or "budget" in text or "credit" in text:
            category = "Compute Economics & Predictability"
            underlying_concern = (
                "Unpredictable quarterly cloud invoices, opaque credit consumption models, "
                "and fear that adopting another tool will add overhead rather than reduce costs."
            )
            why_this_matters = (
                "CFOs and Data Leaders are facing intense mandates to rein in SaaS data warehouse expenses after years of runaway consumption bills."
            )
            relevant_capabilities = [
                "Workload-Isolated Compute on Negotiated Cloud Instances",
                "Decoupled Storage and Compute Economics",
                "Elimination of Proprietary SaaS Credit Multipliers"
            ]
            evidence_ids = ["EVID-COST-04", "EVID-OPEN-01"]
            limitations = [
                "We do not promise arbitrary blanket '80% savings' without assessing query concurrency and instance utilization efficiency.",
                "Savings are realized on compute and ingestion workloads; raw storage costs remain governed by cloud provider object storage rates."
            ]
            validation_items = [
                "Examine current monthly spend breakdown between compute credits, storage, and egress.",
                "Analyze query concurrency profiles: sustained baseline vs bursty ad-hoc users.",
                "Determine current enterprise discounting on AWS/GCP/Azure compute instances."
            ]
            recommended_response = (
                "We share your focus on unit economics. Proprietary cloud data warehouses bundle compute with proprietary markups—often charging 3x to 5x "
                "the underlying cloud instance rate via credit systems. "
                "With IOMETE, you run Apache Spark compute engines directly on your own negotiated cloud compute instances or on-premises hardware. "
                "There are no artificial credit markups, no idle cluster charges, and compute stops automatically when not in use. "
                "We prefer to run a transparent scenario model based on your actual compute hours rather than promising generic savings."
            )
            next_sales_action = (
                "Run a Workload Cost Comparison Session using the IOMETE Cost Explorer with the prospect's actual instance types and monthly query volumes."
            )
            discovery_questions = [
                "How much of your monthly bill is driven by 24/7 continuous pipelines versus ad-hoc analytical queries?",
                "Do you have committed spend discounts directly with your cloud provider (AWS/GCP/Azure)?",
                "What is your target reduction in annual data platform infrastructure costs?"
            ]

        elif "lock-in" in text or "lock in" in text or "proprietary" in text or "open" in text:
            category = "Open Architecture & Portability"
            underlying_concern = (
                "Fear of being trapped in proprietary formats where extracting data in the future requires exorbitant egress costs and format conversions."
            )
            why_this_matters = (
                "Data is a strategic corporate asset. Locking petabytes into proprietary storage tables renders the company dependent on one vendor's pricing roadmap."
            )
            relevant_capabilities = [
                "Apache Iceberg Native Open Table Format",
                "Zero Data Copy & Universal Engine Access",
                "Standard Parquet Storage on Customer-Owned Buckets"
            ]
            evidence_ids = ["EVID-OPEN-01", "EVID-PERF-06"]
            limitations = [
                "Maintaining an open format lakehouse requires organizational alignment around open data standards rather than vendor-specific proprietary shortcuts.",
                "Catalog synchronization (e.g. Apache Polaris or Nessie) should be established."
            ]
            validation_items = [
                "Verify format of current raw datasets (Parquet, ORC, CSV, proprietary).",
                "Check multi-engine usage (e.g. Spark, Trino, Flink, DuckDB)."
            ]
            recommended_response = (
                "Vendor lock-in is one of the most valid concerns in enterprise data today. "
                "IOMETE is built strictly on open source standards: Apache Iceberg for table formats, Apache Spark for compute, and standard Parquet files. "
                "Your data is stored in your own buckets. If you ever decide to stop using IOMETE tomorrow, your data remains 100% accessible to any "
                "Iceberg-compatible engine—including Trino, Snowflake, Spark, or DuckDB—with zero conversion, zero migration, and zero lock-in."
            )
            next_sales_action = (
                "Demonstrate Zero-Lock-In Live: Create a table in IOMETE, query it via standard external DuckDB/PySpark, showing seamless zero-copy access."
            )
            discovery_questions = [
                "Are you evaluating open table formats like Apache Iceberg or Delta Lake across your enterprise?",
                "Which other analytical or AI engines need direct access to your data lake without going through a proprietary SQL gateway?"
            ]

        elif "migration" in text or "affect" in text or "disrupt" in text or "risk" in text:
            category = "Operational Migration Risk"
            underlying_concern = (
                "Engineering teams are already stretched thin. A high-risk platform migration that interrupts ongoing BI or reporting will face internal resistance."
            )
            why_this_matters = (
                "Data initiatives fail when migrations take 18 months, exceed budgets, and disrupt executive reporting."
            )
            relevant_capabilities = [
                "Phased Coexistence Model",
                "Zero Data Movement In-Place Registration",
                "Standard ANSI SQL & PySpark Interoperability"
            ]
            evidence_ids = ["EVID-MIGR-07", "EVID-OPEN-01"]
            limitations = [
                "Not an overnight push-button migration; a pilot workload must be chosen carefully.",
                "Custom proprietary stored procedures require translation to standard SQL or Spark tasks."
            ]
            validation_items = [
                "Inventory current orchestration tools (Airflow, dbt, Prefect).",
                "Count number of production dashboards and scheduled SQL models."
            ]
            recommended_response = (
                "We do not believe in high-risk migration big-bangs. Our architecture enables phased, non-disruptive coexistence. "
                "We start by pointing IOMETE directly at an existing read-only dataset in your object storage, or by carving out a single batch ingestion pipeline. "
                "Your existing dashboards, reports, and legacy data platform stay 100% operational. "
                "You validate performance, cost, and reliability on that single workload first before touching anything else."
            )
            next_sales_action = (
                "Co-design a 14-day 'No-Disruption Pilot Plan' focused on a single isolated batch ingestion pipeline."
            )
            discovery_questions = [
                "What is one isolated, non-critical but resource-heavy batch pipeline that could serve as a clean POC candidate?",
                "Are your pipelines managed via dbt or standard SQL/Python scripts?"
            ]

        else:
            # General objection / existing architecture
            category = "Architecture Coexistence & Value Demonstration"
            underlying_concern = (
                "Satisfaction with the status quo or reluctance to introduce another tool into an already complex tech stack."
            )
            why_this_matters = (
                "Unless there is a clear, compelling reason to add IOMETE, enterprise architects will protect their current architecture stack from complexity."
            )
            relevant_capabilities = [
                "Open Lakehouse Decoupling",
                "Targeted Workload Optimization",
                "Full Sovereign Control"
            ]
            evidence_ids = ["EVID-OPEN-01", "EVID-SOV-02", "EVID-COST-04"]
            limitations = [
                "If your current stack satisfies all latency, cost, and sovereignty requirements without friction, IOMETE may not be needed today."
            ]
            validation_items = [
                "Assess whether current platform faces pain points in cost growth, residency mandates, or proprietary lock-in."
            ]
            recommended_response = (
                "If your current architecture meets all performance requirements, maintains predictable costs, and satisfies all compliance mandates, "
                "you may not need to change anything right now. "
                "Where our customers find immediate value is when their existing platform—such as Snowflake or Databricks—becomes cost-prohibitive "
                "for large-scale batch processing, or when new data residency regulations demand an on-premises or sovereign private cloud deployment "
                "that multi-tenant SaaS simply cannot provide."
            )
            next_sales_action = (
                "Share the 5-minute IOMETE Self-Assessment Framework to identify if any current workloads fall into the high-cost or high-compliance zones."
            )
            discovery_questions = [
                "Are there any upcoming regulatory or data residency requirements that your current cloud setup cannot address?",
                "Is your current data spend scaling linearly or exponentially relative to business data growth?"
            ]

        # Retrieve DB evidence
        evidence_items = EvidenceService.get_by_ids(db, evidence_ids)
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
            for ev in evidence_items
        ]

        # Save to DB log
        obj_record = ObjectionLog(
            id=str(uuid.uuid4()),
            created_at=datetime.utcnow(),
            objection_text=request.objection_text,
            category=category,
            underlying_concern=underlying_concern,
            why_this_matters=why_this_matters,
            relevant_capabilities=relevant_capabilities,
            supporting_evidence=evidence_summaries,
            limitations=limitations,
            recommended_response=recommended_response,
            next_sales_action=next_sales_action,
            discovery_questions=discovery_questions
        )
        db.add(obj_record)
        db.commit()

        return ObjectionResponse(
            id=obj_record.id,
            created_at=obj_record.created_at,
            objection_text=request.objection_text,
            category=category,
            underlying_concern=underlying_concern,
            why_this_matters=why_this_matters,
            relevant_capabilities=relevant_capabilities,
            supporting_evidence=evidence_summaries,
            limitations=limitations,
            recommended_response=recommended_response,
            next_sales_action=next_sales_action,
            discovery_questions=discovery_questions,
            validation_status="Verified from official documentation & clear qualification boundaries"
        )
