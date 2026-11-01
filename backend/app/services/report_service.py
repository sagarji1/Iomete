from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.models import Assessment
from app.services.cost_service import CostService
from app.schemas.cost import CostScenarioRequest


from app.schemas.comparison import ComparisonRequest
from app.services.comparison_engine import ComparisonEngine

class ReportService:
    @staticmethod
    def generate_report(db: Session, assessment_id: str) -> Optional[Dict[str, Any]]:
        assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
        if not assessment:
            return None

        # Build comparison matrix for the top 3 priorities
        comparison_res = ComparisonEngine.generate_comparison(
            db,
            ComparisonRequest(
                assessment_id=assessment.id,
                current_platform=assessment.current_platform,
                selected_priorities=[
                    "Data sovereignty & deployment control",
                    "Vendor lock-in / portability",
                    "Cost predictability"
                ],
                stakeholder=assessment.stakeholder_priorities[0] if assessment.stakeholder_priorities else "CTO"
            )
        )

        # Build associated cost model if monthly spend is recorded
        monthly_spend = assessment.monthly_infrastructure_spend or 60000.0
        cost_scenario = CostService.calculate_scenario(
            CostScenarioRequest(
                current_monthly_compute_spend=monthly_spend * 0.65,
                current_monthly_storage_spend=monthly_spend * 0.20,
                current_monthly_data_transfer_spend=monthly_spend * 0.15,
                current_annual_platform_licensing=50000.0,
                current_annual_staffing_cost=100000.0,
                target_workload_offload_percent=0.70
            )
        )


        return {
            "report_metadata": {
                "report_id": f"REP-{assessment.id[:8].upper()}",
                "generated_at": assessment.created_at.isoformat(),
                "status": "Preliminary Sales-Ready Technical Evaluation",
                "disclaimer": (
                    "DISCLAIMER: This document represents a preliminary architectural and commercial fit assessment "
                    "based on customer-provided requirements and officially published IOMETE technical specifications. "
                    "It does NOT constitute a binding commercial proposal, contract, or performance guarantee. "
                    "Actual performance and economics require a technical discovery session and scoped pilot validation."
                )
            },
            "company_profile": {
                "company_name": assessment.company_name,
                "industry": assessment.industry,
                "company_size": assessment.company_size,
                "region": assessment.region,
                "current_platform": assessment.current_platform,
                "approximate_data_volume": assessment.approximate_data_volume,
                "deployment_preference": assessment.deployment_preference,
                "is_regulated_industry": assessment.is_regulated_industry,
                "current_infrastructure": assessment.current_infrastructure,
                "cloud_provider": assessment.cloud_provider,
                "storage_environment": assessment.storage_environment,
                "bi_tools": assessment.bi_tools,
                "monthly_infrastructure_spend": assessment.monthly_infrastructure_spend
            },
            "executive_summary": assessment.executive_summary,
            "fit_analysis": {
                "classification": assessment.fit_classification,
                "score": assessment.fit_score,
                "explanation": assessment.fit_explanation
            },
            "business_challenges": assessment.challenges or [],
            "stakeholder_perspectives": assessment.stakeholder_perspectives or {},
            "matched_capabilities": assessment.matched_capabilities or [],
            "verified_evidence": assessment.evidence_references or [],
            "comparison_matrix": {
                "current_platform": comparison_res.current_platform,
                "stakeholder": comparison_res.stakeholder,
                "rows": [row.model_dump() for row in comparison_res.rows],
                "context_summary": comparison_res.context_summary,
                "limitations": comparison_res.limitations
            },
            "cost_model_summary": {

                "current_estimated_annual": cost_scenario.current_estimated_annual_cost,
                "proposed_estimated_annual": cost_scenario.proposed_estimated_annual_cost,
                "projected_annual_difference": cost_scenario.annual_difference,
                "break_even_months": cost_scenario.break_even_months,
                "assumptions": cost_scenario.assumptions
            },
            "architecture_summary": {
                "deployment_type": assessment.deployment_preference,
                "storage_layer": "Customer-Owned Object Storage (Apache Iceberg / Parquet)",
                "compute_engine": "Self-Hosted Apache Spark clusters on customer Kubernetes",
                "security_model": "Fine-grained RBAC & Apache Ranger within isolated customer perimeter"
            },
            "limitations_and_exclusions": assessment.limitations or [],
            "missing_information_to_clarify": assessment.missing_information or [],
            "technical_discovery_questions": assessment.discovery_questions or [],
            "recommended_sales_action": assessment.recommended_sales_action
        }
