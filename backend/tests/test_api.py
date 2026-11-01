import pytest
from fastapi.testclient import TestClient
from app.main import app, init_db

@pytest.fixture(autouse=True)
def setup_db():
    init_db()

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


def test_health_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["mode"] == "deterministic_grounded"


def test_evidence_endpoint(client):
    response = client.get("/api/evidence")
    assert response.status_code == 200
    items = response.json()
    assert len(items) >= 7
    # Verify claims have official URLs
    for item in items:
        assert item["source_url"].startswith("https://iomete.com")
        assert item["verification_status"] == "verified_official"


def test_demo_prospects(client):
    response = client.get("/api/prospects")
    assert response.status_code == 200
    prospects = response.json()
    assert len(prospects) == 3
    names = [p["company_name"] for p in prospects]
    assert "Acme Bank" in names
    assert "Nova Retail" in names
    assert "Vertex Health" in names


def test_assessment_flow_for_bank(client):
    payload = {
        "company_name": "Acme Bank",
        "industry": "Banking",
        "company_size": "5,000 - 10,000 employees",
        "region": "Europe",
        "current_platform": "Snowflake",
        "approximate_data_volume": "120 TB",
        "deployment_preference": "On-premises",
        "is_regulated_industry": "Yes",
        "current_infrastructure": "Hybrid (On-premises + AWS)",
        "cloud_provider": "AWS",
        "storage_environment": "MinIO on-premises + AWS S3",
        "analytics_engine": "Snowflake Virtual Warehouses",
        "bi_tools": "PowerBI, Tableau",
        "data_engineering_workflow": "dbt + Airflow",
        "monthly_infrastructure_spend": 85000,
        "operational_challenges": "Rising quarterly credit costs and compliance requirements",
        "challenges": [
            "Rising cloud infrastructure costs",
            "Vendor lock-in",
            "Data sovereignty and privacy",
            "Strict data residency"
        ],
        "stakeholder_priorities": ["CISO", "CFO", "CTO"]
    }
    response = client.post("/api/assessments", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["company_name"] == "Acme Bank"
    assert "fit_classification" in data
    assert data["fit_classification"] == "Strong potential fit"
    assert data["fit_score"] >= 75
    assert len(data["matched_capabilities"]) > 0
    assert len(data["evidence_references"]) > 0
    assert len(data["limitations"]) > 0
    assert len(data["discovery_questions"]) > 0

    # Test report generation for this assessment
    report_res = client.get(f"/api/reports/{data['id']}")
    assert report_res.status_code == 200
    report = report_res.json()
    assert "DISCLAIMER" in report["report_metadata"]["disclaimer"]
    assert report["company_profile"]["company_name"] == "Acme Bank"


def test_objection_analysis(client):
    # Test Snowflake objection
    payload = {
        "objection_text": "We already use Snowflake. Why should we consider IOMETE?",
        "company_context": "European Bank",
        "current_platform": "Snowflake"
    }
    response = client.post("/api/objections/analyse", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["category"] == "Incumbent Platform Differentiation"
    assert "underlying_concern" in res
    assert "recommended_response" in res
    assert "next_sales_action" in res
    assert len(res["supporting_evidence"]) > 0
    assert len(res["discovery_questions"]) > 0


def test_architecture_generation(client):
    payload = {
        "deployment_preference": "On-premises",
        "current_platform": "Snowflake"
    }
    response = client.post("/api/architecture/generate", json=payload)
    assert response.status_code == 200
    arch = response.json()
    assert "current_state" in arch
    assert "proposed_lakehouse" in arch
    assert len(arch["proposed_lakehouse"]["nodes"]) >= 6


def test_cost_scenario(client):
    payload = {
        "current_monthly_compute_spend": 60000.0,
        "current_monthly_storage_spend": 15000.0,
        "current_monthly_data_transfer_spend": 8000.0,
        "current_annual_platform_licensing": 50000.0,
        "current_annual_staffing_cost": 120000.0,
        "target_workload_offload_percent": 0.70
    }
    response = client.post("/api/cost/scenario", json=payload)
    assert response.status_code == 200
    cost = response.json()
    assert cost["current_estimated_annual_cost"] > cost["proposed_estimated_annual_cost"]
    assert cost["annual_difference"] > 0
    assert len(cost["breakdown"]) == 5
def test_comparison_competitors(client):
    response = client.get("/api/comparison/competitors")
    assert response.status_code == 200
    competitors = response.json()
    assert "Snowflake" in competitors
    assert "Databricks" in competitors


def test_comparison_generation_for_snowflake(client):
    payload = {
        "current_platform": "Snowflake",
        "selected_priorities": [
            "Data sovereignty & deployment control",
            "Vendor lock-in / portability",
            "Cost predictability"
        ],
        "stakeholder": "CFO"
    }
    response = client.post("/api/comparison/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["current_platform"] == "Snowflake"
    assert data["stakeholder"] == "CFO"
    assert len(data["rows"]) == 3
    # Check that IOMETE position has evidence links
    for row in data["rows"]:
        assert row["iomete_evidence_id"].startswith("EVID-")
        assert row["iomete_verification_status"] == "verified_official"
        assert len(row["why_this_matters_to_you"]) > 10
    # Check that context summary has no fake win badge
    assert "IOMETE wins" not in data["context_summary"]


