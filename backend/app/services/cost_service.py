from typing import Dict, Any, List
from app.schemas.cost import CostScenarioRequest, CostScenarioResponse, CostBreakdownItem


class CostService:
    @staticmethod
    def calculate_scenario(req: CostScenarioRequest) -> CostScenarioResponse:
        # Current Annual Baseline
        current_annual_compute = req.current_monthly_compute_spend * 12
        current_annual_storage = req.current_monthly_storage_spend * 12
        current_annual_transfer = req.current_monthly_data_transfer_spend * 12
        current_annual_licensing = req.current_annual_platform_licensing
        current_annual_staffing = req.current_annual_staffing_cost
        
        current_total_annual = (
            current_annual_compute
            + current_annual_storage
            + current_annual_transfer
            + current_annual_licensing
            + current_annual_staffing
        )

        # Proposed Annual Model:
        # Offload percentage (default 70% of batch/heavy ETL workloads)
        offload = min(1.0, max(0.1, req.target_workload_offload_percent))
        
        # Proposed compute:
        # In IOMETE, compute runs on customer's own cloud or on-prem hardware (typically ~40% of SaaS credit price due to absence of vendor markup)
        # For remaining non-offloaded workloads (e.g. legacy ad-hoc queries remaining on incumbent), cost remains proportional
        if req.estimated_proposed_infrastructure_cost is not None and req.estimated_proposed_infrastructure_cost > 0:
            proposed_annual_compute = req.estimated_proposed_infrastructure_cost
        else:
            # Transparently modeled as: (offloaded portion * ~0.45 instance rate) + (retained portion * incumbent rate)
            proposed_annual_compute = (current_annual_compute * offload * 0.45) + (current_annual_compute * (1 - offload))

        # Storage: in open lakehouse, raw storage cost is standard S3/GCS or local disk, no proprietary table storage multiplier
        proposed_annual_storage = current_annual_storage * 0.85
        
        # Data transfer: within same VPC / on-premise network, cross-region or egress is greatly minimized
        proposed_annual_transfer = current_annual_transfer * 0.40

        # Proposed platform software subscription (transparent estimate)
        proposed_annual_licensing = 45000.0  # Transparent example platform license assumption

        # Staffing: lakehouse automation + standard Spark/Iceberg skills
        proposed_annual_staffing = current_annual_staffing * 0.95

        proposed_total_annual = (
            proposed_annual_compute
            + proposed_annual_storage
            + proposed_annual_transfer
            + proposed_annual_licensing
            + proposed_annual_staffing
        )

        annual_difference = current_total_annual - proposed_total_annual
        first_year_net = annual_difference - req.estimated_migration_cost

        # Break-even calculation in months
        monthly_run_rate_savings = annual_difference / 12.0
        if monthly_run_rate_savings > 0 and req.estimated_migration_cost > 0:
            break_even_months = round(req.estimated_migration_cost / monthly_run_rate_savings, 1)
        elif annual_difference > 0:
            break_even_months = 0.0
        else:
            break_even_months = None

        breakdown = [
            CostBreakdownItem(
                category="Compute & Workload Processing",
                current_annual=round(current_annual_compute, 2),
                proposed_annual=round(proposed_annual_compute, 2),
                difference=round(current_annual_compute - proposed_annual_compute, 2),
                notes=f"Reflects offload of {int(offload * 100)}% of candidate workloads to self-hosted Spark clusters on standard instance pricing."
            ),
            CostBreakdownItem(
                category="Object Storage & Table Management",
                current_annual=round(current_annual_storage, 2),
                proposed_annual=round(proposed_annual_storage, 2),
                difference=round(current_annual_storage - proposed_annual_storage, 2),
                notes="Data remains in standard Parquet files on customer-owned storage without proprietary table storage premium."
            ),
            CostBreakdownItem(
                category="Data Transfer & Network Egress",
                current_annual=round(current_annual_transfer, 2),
                proposed_annual=round(proposed_annual_transfer, 2),
                difference=round(current_annual_transfer - proposed_annual_transfer, 2),
                notes="Compute co-located with storage inside customer VPC or local on-prem network eliminates vendor egress penalties."
            ),
            CostBreakdownItem(
                category="Platform Licensing / Subscription",
                current_annual=round(current_annual_licensing, 2),
                proposed_annual=round(proposed_annual_licensing, 2),
                difference=round(current_annual_licensing - proposed_annual_licensing, 2),
                notes="Transparent software platform licensing based on cluster capacity rather than metered query credits."
            ),
            CostBreakdownItem(
                category="Engineering & Operational Maintenance",
                current_annual=round(current_annual_staffing, 2),
                proposed_annual=round(proposed_annual_staffing, 2),
                difference=round(current_annual_staffing - proposed_annual_staffing, 2),
                notes="Standard Spark and Kubernetes skillsets; eliminates proprietary SQL syntax lock-in."
            )
        ]

        assumptions = [
            f"Target workload offload ratio: {int(offload * 100)}% of high-volume batch ETL and scheduled transformations.",
            "Underlying compute instance pricing assumes customer's negotiated cloud discount (AWS/GCP/Azure) or existing on-premises server capacity.",
            f"One-time migration and pilot implementation budget: ${req.estimated_migration_cost:,.2f}.",
            "Does not assume 100% replacement of legacy ad-hoc BI warehouse on Day 1; modeled on a phased coexistence pattern.",
            "All numbers are scenario models based on provided inputs and do not constitute an official pricing guarantee."
        ]

        # Sensitivity Analysis (variations across offload percentages)
        sensitivity_analysis = []
        for pct in [0.30, 0.50, 0.70, 0.90]:
            comp_prop = (current_annual_compute * pct * 0.45) + (current_annual_compute * (1 - pct))
            prop_tot = comp_prop + proposed_annual_storage + proposed_annual_transfer + proposed_annual_licensing + proposed_annual_staffing
            diff = current_total_annual - prop_tot
            sensitivity_analysis.append({
                "offload_percent": f"{int(pct * 100)}%",
                "current_annual": round(current_total_annual, 2),
                "proposed_annual": round(prop_tot, 2),
                "annual_savings": round(diff, 2)
            })

        limitations_and_exclusions = [
            "Hardware acquisition costs (if deploying to bare-metal data centers) are excluded from cloud baseline comparison.",
            "Does not include third-party BI tool licensing (PowerBI/Tableau licenses remain unchanged).",
            "Actual cluster utilization depends on autoscaling efficiency and query concurrency."
        ]

        return CostScenarioResponse(
            current_estimated_annual_cost=round(current_total_annual, 2),
            proposed_estimated_annual_cost=round(proposed_total_annual, 2),
            annual_difference=round(annual_difference, 2),
            estimated_first_year_net_difference=round(first_year_net, 2),
            break_even_months=break_even_months,
            breakdown=breakdown,
            assumptions=assumptions,
            sensitivity_analysis=sensitivity_analysis,
            limitations_and_exclusions=limitations_and_exclusions
        )
