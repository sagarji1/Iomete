from typing import Dict, Any, List


class ArchitectureService:
    @staticmethod
    def generate_diagram(deployment_preference: str = "On-premises", current_platform: str = "Snowflake") -> Dict[str, Any]:
        """
        Generates nodes, edges, and descriptions for both:
        1) Current-State Architecture (Incumbent silo)
        2) Proposed IOMETE Sovereign Lakehouse Architecture
        """
        is_on_prem = "on-premises" in deployment_preference.lower()
        is_hybrid = "hybrid" in deployment_preference.lower()
        
        storage_label = "MinIO / Ceph (On-Prem)" if is_on_prem else ("Hybrid Storage (S3 + MinIO)" if is_hybrid else "Customer S3 / GCS / ADLS")
        compute_boundary = "Customer On-Premises K8s" if is_on_prem else ("Customer VPC / Private Cloud K8s" if not is_hybrid else "Customer Hybrid K8s")

        # CURRENT STATE NODES
        current_state_nodes = [
            {
                "id": "src-1",
                "type": "customNode",
                "position": {"x": 50, "y": 150},
                "data": {
                    "label": "Operational Systems",
                    "sublabel": "PostgreSQL, MySQL, ERP, Kafka",
                    "type": "source",
                    "description": "Enterprise transactional systems generating operational logs and financial transactions."
                }
            },
            {
                "id": "ingest-1",
                "type": "customNode",
                "position": {"x": 280, "y": 150},
                "data": {
                    "label": "ETL Ingestion Pipelines",
                    "sublabel": "Fivetran / Custom Airflow",
                    "type": "ingestion",
                    "description": "Data extracted, transformed, and loaded into proprietary vendor storage."
                }
            },
            {
                "id": "cur-plat",
                "type": "customNode",
                "position": {"x": 520, "y": 120},
                "data": {
                    "label": f"Proprietary {current_platform}",
                    "sublabel": "Proprietary Storage + Compute Credits",
                    "type": "proprietary",
                    "description": f"Multi-tenant SaaS where compute and data are tied to {current_platform}'s closed formats and credit pricing."
                }
            },
            {
                "id": "cur-bi",
                "type": "customNode",
                "position": {"x": 800, "y": 150},
                "data": {
                    "label": "BI & Analytics",
                    "sublabel": "PowerBI / Tableau / SQL Users",
                    "type": "consumer",
                    "description": "Business analysts and reporting dashboards consuming data through proprietary SQL warehouse credits."
                }
            }
        ]

        current_state_edges = [
            {"id": "ce1", "source": "src-1", "target": "ingest-1", "label": "Raw Extraction", "animated": True},
            {"id": "ce2", "source": "ingest-1", "target": "cur-plat", "label": "Proprietary Load", "animated": True},
            {"id": "ce3", "source": "cur-plat", "target": "cur-bi", "label": "Metered Query Credits", "animated": True}
        ]

        # PROPOSED IOMETE LAKEHOUSE ARCHITECTURE
        proposed_nodes = [
            {
                "id": "src-p",
                "type": "customNode",
                "position": {"x": 40, "y": 160},
                "data": {
                    "label": "Enterprise Data Sources",
                    "sublabel": "Transactional DBs, Streams, Logs",
                    "type": "source",
                    "description": "Internal transactional systems and event feeds."
                }
            },
            {
                "id": "ingest-p",
                "type": "customNode",
                "position": {"x": 260, "y": 160},
                "data": {
                    "label": "Ingestion & Spark Pipelines",
                    "sublabel": "Airflow / dbt / Kafka Streaming",
                    "type": "ingestion",
                    "description": "Continuous batch and streaming ingestion using standard open connectors."
                }
            },
            {
                "id": "storage-p",
                "type": "customNode",
                "position": {"x": 490, "y": 60},
                "data": {
                    "label": "Customer Object Storage",
                    "sublabel": storage_label,
                    "type": "storage",
                    "description": "Data stays 100% inside your perimeter. No third-party data replication."
                }
            },
            {
                "id": "iceberg-p",
                "type": "customNode",
                "position": {"x": 490, "y": 250},
                "data": {
                    "label": "Apache Iceberg Open Table Format",
                    "sublabel": "ACID, Time-Travel, Zero-Copy",
                    "type": "iceberg",
                    "description": "Standard open table metadata eliminating vendor lock-in. Queryable by any compatible engine."
                }
            },
            {
                "id": "iomete-platform",
                "type": "customNode",
                "position": {"x": 750, "y": 140},
                "data": {
                    "label": "IOMETE Lakehouse Platform",
                    "sublabel": f"Deployed inside {compute_boundary}",
                    "type": "iomete",
                    "description": "Workload-isolated Apache Spark clusters, unified RBAC governance, and zero-markup execution."
                }
            },
            {
                "id": "consumers-p",
                "type": "customNode",
                "position": {"x": 1020, "y": 60},
                "data": {
                    "label": "BI & Ad-Hoc SQL",
                    "sublabel": "Tableau / PowerBI / Superset",
                    "type": "consumer",
                    "description": "Sub-second BI dashboards and SQL reporting via JDBC/ODBC."
                }
            },
            {
                "id": "ai-p",
                "type": "customNode",
                "position": {"x": 1020, "y": 240},
                "data": {
                    "label": "AI & Data Science",
                    "sublabel": "PySpark / Jupyter / GenAI ML",
                    "type": "consumer",
                    "description": "Direct programmatic model training and feature extraction with zero data movement."
                }
            }
        ]

        proposed_edges = [
            {"id": "pe1", "source": "src-p", "target": "ingest-p", "label": "Secure Ingestion", "animated": True},
            {"id": "pe2", "source": "ingest-p", "target": "storage-p", "label": "Parquet Files", "animated": True},
            {"id": "pe3", "source": "storage-p", "target": "iceberg-p", "label": "Iceberg Metadata", "animated": False},
            {"id": "pe4", "source": "iceberg-p", "target": "iomete-platform", "label": "Zero-Copy Access", "animated": True},
            {"id": "pe5", "source": "iomete-platform", "target": "consumers-p", "label": "Standard SQL / JDBC", "animated": True},
            {"id": "pe6", "source": "iomete-platform", "target": "ai-p", "label": "PySpark & Notebooks", "animated": True}
        ]

        return {
            "disclaimer": "Conceptual reference architecture for evaluation purposes. Not an automatically validated production deployment. Production sizing requires infrastructure discovery.",
            "deployment_context": {
                "preference": deployment_preference,
                "storage_backend": storage_label,
                "compute_boundary": compute_boundary,
                "current_platform": current_platform
            },
            "current_state": {
                "nodes": current_state_nodes,
                "edges": current_state_edges,
                "summary": f"Data and queries are processed inside {current_platform}'s closed perimeter with consumption-based credit multipliers."
            },
            "proposed_lakehouse": {
                "nodes": proposed_nodes,
                "edges": proposed_edges,
                "summary": f"Data resides in customer-owned {storage_label} under Apache Iceberg format. IOMETE Spark engines run inside {compute_boundary} with zero vendor lock-in."
            }
        }
