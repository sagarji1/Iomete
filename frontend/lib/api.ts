import {
  AssessmentCreatePayload,
  AssessmentRecord,
  ObjectionAnalysisResponse,
  ComparisonRequest,
  ComparisonResponse,
  CostScenarioResponse,
  ArchitectureResponse,
  EvidenceItem,
  DemoProspect
} from "./types";


const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") {
      return "https://iomete.onrender.com/api";
    }
  }
  return process.env.NODE_ENV === "production"
    ? "https://iomete.onrender.com/api"
    : "http://localhost:8000/api";
};

const API_BASE_URL = getApiBaseUrl();

export async function fetchHealth() {
  const res = await fetch(`${API_BASE_URL}/health`);
  if (!res.ok) throw new Error("Health check failed");
  return res.json();
}

export async function fetchDemoProspects(): Promise<DemoProspect[]> {
  const res = await fetch(`${API_BASE_URL}/prospects`);
  if (!res.ok) throw new Error("Failed to load demo prospects");
  return res.json();
}

export async function createAssessment(payload: AssessmentCreatePayload): Promise<AssessmentRecord> {
  const res = await fetch(`${API_BASE_URL}/assessments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to generate assessment");
  }
  return res.json();
}

export async function fetchAssessments(): Promise<AssessmentRecord[]> {
  const res = await fetch(`${API_BASE_URL}/assessments`);
  if (!res.ok) throw new Error("Failed to fetch assessments");
  return res.json();
}

export async function fetchAssessmentById(id: string): Promise<AssessmentRecord> {
  const res = await fetch(`${API_BASE_URL}/assessments/${id}`);
  if (!res.ok) throw new Error("Failed to fetch assessment");
  return res.json();
}

export async function fetchComparisonCompetitors(): Promise<string[]> {
  const res = await fetch(`${API_BASE_URL}/comparison/competitors`);
  if (!res.ok) throw new Error("Failed to fetch competitors list");
  return res.json();
}

export async function generateComparisonMatrix(payload: ComparisonRequest): Promise<ComparisonResponse> {
  const res = await fetch(`${API_BASE_URL}/comparison/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to generate comparison matrix");
  }
  return res.json();
}


export async function analyseObjection(objection_text: string, company_context?: string, current_platform?: string): Promise<ObjectionAnalysisResponse> {
  const res = await fetch(`${API_BASE_URL}/objections/analyse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ objection_text, company_context, current_platform })
  });
  if (!res.ok) throw new Error("Failed to analyse objection");
  return res.json();
}

export async function fetchEvidence(category?: string): Promise<EvidenceItem[]> {
  const url = category ? `${API_BASE_URL}/evidence?category=${encodeURIComponent(category)}` : `${API_BASE_URL}/evidence`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch evidence registry");
  return res.json();
}

export async function fetchEvidenceById(id: string): Promise<EvidenceItem> {
  const res = await fetch(`${API_BASE_URL}/evidence/${id}`);
  if (!res.ok) throw new Error("Failed to fetch evidence item");
  return res.json();
}

export async function generateArchitecture(deployment_preference?: string, current_platform?: string): Promise<ArchitectureResponse> {
  const res = await fetch(`${API_BASE_URL}/architecture/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deployment_preference, current_platform })
  });
  if (!res.ok) throw new Error("Failed to generate architecture diagram");
  return res.json();
}

export async function calculateCostScenario(params: {
  current_monthly_compute_spend: number;
  current_monthly_storage_spend: number;
  current_monthly_data_transfer_spend: number;
  current_annual_platform_licensing: number;
  current_annual_staffing_cost: number;
  target_workload_offload_percent: number;
  estimated_migration_cost?: number;
}): Promise<CostScenarioResponse> {
  const res = await fetch(`${API_BASE_URL}/cost/scenario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error("Failed to model cost scenario");
  return res.json();
}

export async function fetchCustomerReport(assessmentId: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/reports/${assessmentId}`);
  if (!res.ok) throw new Error("Failed to fetch customer report");
  return res.json();
}
