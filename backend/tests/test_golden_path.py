from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_golden_path_acme_bank():
    # Step 1: Health
    health_resp = client.get("/api/health")
    assert health_resp.status_code == 200

    # Step 2: Assessment submission
    assessment_payload = {
        "company_name": "Acme Bank",
        "industry": "Banking",
        "company_size": "5,000-10,000 employees",
        "region": "North America",
        "current_platform": "Snowflake",
        "approximate_data_volume": "120 TB",
        "deployment_preference": "on-premises",
        "is_regulated_industry": "Yes",
        "current_infrastructure": "VMware private cloud",
        "cloud_provider": "On-Premises",
        "storage_environment": "MinIO / Dell ECS",
        "analytics_engine": "Snowflake",
        "bi_tools": "Tableau",
        "data_engineering_workflow": "dbt",
        "monthly_infrastructure_spend": 95000,
        "existing_challenges": "Strict data sovereignty mandates prevent storing PII in public SaaS.",
        "challenges": ["rising cloud cost", "vendor lock-in", "data sovereignty"],
        "free_text_challenges": "Must keep financial records strictly within internal perimeter.",
        "stakeholder_priorities": ["CTO", "CISO", "CFO", "Data Engineering Head"],
        "primary_stakeholder": "CFO"
    }
    res = client.post("/api/assessments", json=assessment_payload)
    assert res.status_code == 200
    assessment = res.json()
    assessment_id = assessment["id"]
    assert "fit_classification" in assessment
    assert assessment["fit_classification"] == "Strong potential fit"
    assert len(assessment["matched_capabilities"]) > 0

    # Step 3: Comparison Matrix Generation
    comp_payload = {
        "assessment_id": assessment_id,
        "current_platform": "Snowflake",
        "selected_priorities": [
            "Data sovereignty & deployment control",
            "Vendor lock-in / portability",
            "Cost predictability"
        ],
        "primary_stakeholder": "CFO"
    }
    comp_res = client.post("/api/comparison/generate", json=comp_payload)
    assert comp_res.status_code == 200
    matrix = comp_res.json()
    assert len(matrix["rows"]) == 3
    # Check source verification
    for row in matrix["rows"]:
        assert row["competitor_source_title"] is not None
        assert row["iomete_evidence_id"] is not None
        assert len(row["why_this_matters_to_you"]) > 0

    # Step 4: Objection Analysis
    obj_payload = {
        "assessment_id": assessment_id,
        "objection_text": "We already use Snowflake. Why should we consider IOMETE?",
        "current_platform": "Snowflake"
    }
    obj_res = client.post("/api/objections/analyse", json=obj_payload)
    assert obj_res.status_code == 200
    obj_data = obj_res.json()
    assert "next_sales_action" in obj_data
    assert len(obj_data["supporting_evidence"]) > 0

    # Step 5: Cost Scenario
    cost_payload = {
        "current_monthly_compute_spend": 55000.0,
        "current_monthly_storage_spend": 20000.0,
        "current_monthly_data_transfer_spend": 8000.0,
        "current_annual_platform_licensing": 140000.0,
        "current_annual_staffing_cost": 220000.0,
        "estimated_proposed_infrastructure_cost": 32000.0,
        "estimated_migration_cost": 45000.0
    }
    cost_res = client.post("/api/cost/scenario", json=cost_payload)
    assert cost_res.status_code == 200
    cost_data = cost_res.json()
    assert cost_data["annual_difference"] > 0
    assert len(cost_data["assumptions"]) > 0
    assert len(cost_data["limitations_and_exclusions"]) > 0

    # Step 6: Customer Report Generation
    rep_res = client.get(f"/api/reports/{assessment_id}")
    assert rep_res.status_code == 200
    report = rep_res.json()
    assert report["company_profile"]["company_name"] == "Acme Bank"
    assert "comparison_matrix" in report
    assert len(report["comparison_matrix"]["rows"]) == 3
    assert report["fit_analysis"]["classification"] == "Strong potential fit"
    assert len(report["technical_discovery_questions"]) > 0
