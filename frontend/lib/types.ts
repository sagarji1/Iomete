export interface EvidenceSummary {
  id: string;
  claim: string;
  capability_category: string;
  source_title: string;
  source_url: string;
  source_type: string;
  verification_status: string;
  qualification_or_limitation: string;
}

export interface EvidenceItem extends EvidenceSummary {
  description: string;
  last_verified_date: string;
  related_objections?: string[];
}

export interface MatchedCapability {
  capability_name: string;
  category: string;
  relevance_reason: string;
  evidence_ids: string[];
  qualification: string;
}

export interface AssessmentCreatePayload {
  company_name: string;
  industry: string;
  company_size: string;
  region: string;
  current_platform: string;
  approximate_data_volume: string;
  deployment_preference: string;
  is_regulated_industry: string;
  
  current_infrastructure?: string;
  cloud_provider?: string;
  storage_environment?: string;
  analytics_engine?: string;
  bi_tools?: string;
  data_engineering_workflow?: string;
  monthly_infrastructure_spend?: number;
  operational_challenges?: string;
  
  challenges: string[];
  context_notes?: string;
  stakeholder_priorities: string[];
}

export interface AssessmentRecord {
  id: string;
  created_at: string;
  company_name: string;
  industry: string;
  company_size: string;
  region: string;
  current_platform: string;
  approximate_data_volume: string;
  deployment_preference: string;
  is_regulated_industry: string;
  
  current_infrastructure?: string;
  cloud_provider?: string;
  storage_environment?: string;
  analytics_engine?: string;
  bi_tools?: string;
  data_engineering_workflow?: string;
  monthly_infrastructure_spend?: number;
  operational_challenges?: string;
  
  challenges: string[];
  context_notes?: string;
  stakeholder_priorities: string[];
  
  fit_classification: "Strong potential fit" | "Potential fit — further validation needed" | "Discovery required" | "Insufficient evidence";
  fit_score: number;
  fit_explanation: string;
  matched_capabilities: MatchedCapability[];
  evidence_references: EvidenceSummary[];
  limitations: string[];
  missing_information: string[];
  discovery_questions: string[];
  recommended_sales_action: string;
  executive_summary: string;
  stakeholder_perspectives: Record<string, string>;
}

export interface ObjectionAnalysisResponse {
  id: string;
  created_at: string;
  objection_text: string;
  category: string;
  underlying_concern: string;
  why_this_matters: string;
  relevant_capabilities: string[];
  supporting_evidence: EvidenceSummary[];
  limitations: string[];
  recommended_response: string;
  next_sales_action: string;
  discovery_questions: string[];
  validation_status: string;
}

export interface ComparisonRequest {
  assessment_id?: string;
  current_platform: string;
  selected_priorities: string[];
  stakeholder?: string;
}

export interface ComparisonRow {
  priority: string;
  iomete_position: string;
  iomete_evidence_id: string;
  iomete_source_title: string;
  iomete_source_url: string;
  iomete_verification_status: string;
  competitor_position: string;
  competitor_source_title?: string;
  competitor_source_url?: string;
  competitor_verification_status: string;
  why_this_matters_to_you: string;
}

export interface ComparisonResponse {
  current_platform: string;
  stakeholder: string;
  rows: ComparisonRow[];
  context_summary: string;
  limitations: string[];
}


export interface CostBreakdownItem {
  category: string;
  current_annual: number;
  proposed_annual: number;
  difference: number;
  notes: string;
}

export interface CostScenarioResponse {
  current_estimated_annual_cost: number;
  proposed_estimated_annual_cost: number;
  annual_difference: number;
  estimated_first_year_net_difference: number;
  break_even_months?: number | null;
  breakdown: CostBreakdownItem[];
  assumptions: string[];
  sensitivity_analysis: Array<{
    offload_percent: string;
    current_annual: number;
    proposed_annual: number;
    annual_savings: number;
  }>;
  limitations_and_exclusions: string[];
}

export interface ArchitectureNodeData {
  label: string;
  sublabel: string;
  type: string;
  description: string;
}

export interface ArchitectureResponse {
  disclaimer: string;
  deployment_context: {
    preference: string;
    storage_backend: string;
    compute_boundary: string;
    current_platform: string;
  };
  current_state: {
    nodes: any[];
    edges: any[];
    summary: string;
  };
  proposed_lakehouse: {
    nodes: any[];
    edges: any[];
    summary: string;
  };
}

export interface DemoProspect {
  id: string;
  company_name: string;
  industry: string;
  company_size: string;
  region: string;
  current_platform: string;
  approximate_data_volume: string;
  deployment_preference: string;
  is_regulated_industry: string;
  current_infrastructure: string;
  cloud_provider: string;
  storage_environment: string;
  analytics_engine: string;
  bi_tools: string;
  data_engineering_workflow: string;
  monthly_infrastructure_spend: number;
  operational_challenges: string;
  challenges: string[];
  context_notes: string;
  stakeholder_priorities: string[];
}
