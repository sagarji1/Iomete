"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ShieldCheckIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  BuildingIcon,
  DatabaseIcon,
  HelpCircleIcon
} from "@/components/shared/Icons";
import { createAssessment, fetchDemoProspects } from "@/lib/api";
import { AssessmentCreatePayload, DemoProspect } from "@/lib/types";

function AssessmentWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetParam = searchParams.get("preset");

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [demoProspects, setDemoProspects] = useState<DemoProspect[]>([]);

  // Form State
  const [formData, setFormData] = useState<AssessmentCreatePayload>({
    company_name: "",
    industry: "Banking",
    company_size: "5,000 - 10,000 employees",
    region: "European Union / UK",
    current_platform: "Snowflake",
    approximate_data_volume: "120 TB",
    deployment_preference: "On-premises",
    is_regulated_industry: "Yes",
    
    current_infrastructure: "Hybrid (On-premises VMware + AWS eu-west-1)",
    cloud_provider: "AWS",
    storage_environment: "MinIO on-premises + AWS S3",
    analytics_engine: "Snowflake Virtual Warehouses",
    bi_tools: "PowerBI, Tableau",
    data_engineering_workflow: "dbt + Airflow",
    monthly_infrastructure_spend: 85000,
    operational_challenges: "Skyrocketing quarterly Snowflake credits, regulator audit scrutiny over cross-border data transfer.",

    challenges: [
      "Rising cloud infrastructure costs",
      "Vendor lock-in",
      "Data sovereignty and privacy",
      "Strict data residency"
    ],
    context_notes: "",
    stakeholder_priorities: ["CISO", "CFO", "CTO"]
  });

  // Load demo prospects from API
  useEffect(() => {
    fetchDemoProspects().then((data) => {
      setDemoProspects(data);
      if (presetParam) {
        const found = data.find((p) => p.id.includes(presetParam));
        if (found) loadScenario(found);
      }
    }).catch((err) => console.warn("Demo prospects loading error", err));
  }, [presetParam]);

  const loadScenario = (prospect: DemoProspect) => {
    setFormData({
      company_name: prospect.company_name,
      industry: prospect.industry,
      company_size: prospect.company_size,
      region: prospect.region,
      current_platform: prospect.current_platform,
      approximate_data_volume: prospect.approximate_data_volume,
      deployment_preference: prospect.deployment_preference,
      is_regulated_industry: prospect.is_regulated_industry,
      current_infrastructure: prospect.current_infrastructure,
      cloud_provider: prospect.cloud_provider,
      storage_environment: prospect.storage_environment,
      analytics_engine: prospect.analytics_engine,
      bi_tools: prospect.bi_tools,
      data_engineering_workflow: prospect.data_engineering_workflow,
      monthly_infrastructure_spend: prospect.monthly_infrastructure_spend,
      operational_challenges: prospect.operational_challenges,
      challenges: prospect.challenges,
      context_notes: prospect.context_notes,
      stakeholder_priorities: prospect.stakeholder_priorities
    });
    toast.success(`Loaded demo scenario for ${prospect.company_name}`);
  };

  const handleChallengeToggle = (challenge: string) => {
    setFormData((prev) => {
      const exists = prev.challenges.includes(challenge);
      return {
        ...prev,
        challenges: exists
          ? prev.challenges.filter((c) => c !== challenge)
          : [...prev.challenges, challenge]
      };
    });
  };

  const handleStakeholderToggle = (role: string) => {
    setFormData((prev) => {
      const exists = prev.stakeholder_priorities.includes(role);
      return {
        ...prev,
        stakeholder_priorities: exists
          ? prev.stakeholder_priorities.filter((r) => r !== role)
          : [...prev.stakeholder_priorities, role]
      };
    });
  };

  const handleSubmit = async () => {
    if (!formData.company_name) {
      toast.error("Please enter a company name");
      setCurrentStep(1);
      return;
    }
    setSubmitting(true);
    try {
      const result = await createAssessment(formData);
      toast.success("Assessment generated with deterministic proof!");
      router.push(`/assessments/${result.id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to generate assessment");
      setSubmitting(false);
    }
  };

  const availableChallenges = [
    "Rising cloud infrastructure costs",
    "Vendor lock-in",
    "Data sovereignty and privacy",
    "Strict data residency",
    "Performance and scalability",
    "Complex data architecture",
    "Infrastructure control",
    "Operational complexity",
    "AI and analytics readiness"
  ];

  const availableStakeholders = [
    "CTO",
    "CIO",
    "CFO",
    "CISO",
    "Data Engineering Head",
    "Analytics Leader"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Header & Preset Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(148,163,184,0.14)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F1F5F9]">Company Assessment Wizard</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Capture architectural constraints and evaluate fit against verified IOMETE capabilities.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#64748B]">DEMO PRESETS:</span>
          {demoProspects.length > 0 ? (
            demoProspects.map((dp) => (
              <button
                key={dp.id}
                type="button"
                onClick={() => loadScenario(dp)}
                className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                  formData.company_name === dp.company_name
                    ? "bg-[#42D6A4]/15 border-[#42D6A4] text-[#42D6A4]"
                    : "bg-[#111923] border-[rgba(148,163,184,0.2)] text-[#94A3B8] hover:text-[#F1F5F9]"
                }`}
              >
                {dp.company_name.split(" ")[0]}
              </button>
            ))
          ) : (
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  company_name: "Acme Bank",
                  current_platform: "Snowflake",
                  deployment_preference: "On-premises",
                  approximate_data_volume: "120 TB",
                  is_regulated_industry: "Yes",
                  monthly_infrastructure_spend: 85000
                }));
                toast.success("Loaded Acme Bank scenario");
              }}
              className="px-2.5 py-1 text-xs rounded bg-[#151F2B] text-[#42D6A4] border border-[#42D6A4]/30"
            >
              Acme Bank
            </button>
          )}
        </div>
      </div>

      {/* Wizard Progress Steps */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { num: 1, label: "Company Profile" },
          { num: 2, label: "Data Environment" },
          { num: 3, label: "Business Challenges" },
          { num: 4, label: "Stakeholders & Generate" }
        ].map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => setCurrentStep(s.num)}
            className={`p-3 rounded-lg border text-left transition-all ${
              currentStep === s.num
                ? "bg-[#151F2B] border-[#42D6A4] text-[#F1F5F9]"
                : currentStep > s.num
                ? "bg-[#111923] border-[rgba(148,163,184,0.2)] text-[#42D6A4]"
                : "bg-[#0D121A] border-[rgba(148,163,184,0.1)] text-[#64748B]"
            }`}
          >
            <div className="text-[10px] font-mono">STEP 0{s.num}</div>
            <div className="text-xs font-semibold mt-0.5 truncate">{s.label}</div>
          </button>
        ))}
      </div>

      {/* STEP 1: COMPANY PROFILE */}
      {currentStep === 1 && (
        <div className="p-6 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)] space-y-6">
          <div className="border-b border-[rgba(148,163,184,0.1)] pb-3">
            <h2 className="text-sm font-semibold text-[#F1F5F9]">Step 1: Company Profile</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">Define organization identity, incumbent stack, and deployment bounds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Company Name *</label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="e.g. Acme Bank"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.2)] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#42D6A4]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Industry Sector</label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.2)] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#42D6A4]"
              >
                <option value="Banking & Financial Services">Banking & Financial Services</option>
                <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                <option value="Retail & E-commerce">Retail & E-commerce</option>
                <option value="Telecommunications">Telecommunications</option>
                <option value="Public Sector / Government">Public Sector / Government</option>
                <option value="Technology & SaaS">Technology & SaaS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Current Primary Data Platform *</label>
              <select
                value={formData.current_platform}
                onChange={(e) => setFormData({ ...formData, current_platform: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.2)] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#42D6A4]"
              >
                <option value="Snowflake">Snowflake</option>
                <option value="Databricks">Databricks</option>
                <option value="Google BigQuery">Google BigQuery</option>
                <option value="AWS Redshift">AWS Redshift</option>
                <option value="On-Premises Hadoop / Cloudera">On-Premises Hadoop / Cloudera</option>
                <option value="Other / Legacy Data Warehouse">Other / Legacy Data Warehouse</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Approximate Data Volume</label>
              <select
                value={formData.approximate_data_volume}
                onChange={(e) => setFormData({ ...formData, approximate_data_volume: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.2)] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#42D6A4]"
              >
                <option value="10 - 50 TB">10 - 50 TB</option>
                <option value="120 TB">120 TB (Enterprise Scale)</option>
                <option value="450 TB">450 TB (High Scale)</option>
                <option value="1 PB+">1 PB+ (Petabyte Scale)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Target Deployment Preference *</label>
              <select
                value={formData.deployment_preference}
                onChange={(e) => setFormData({ ...formData, deployment_preference: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.2)] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#42D6A4]"
              >
                <option value="On-premises">On-premises (Customer Bare Metal / Private DC)</option>
                <option value="Private Cloud">Private Cloud (Customer VPC on AWS/GCP/Azure)</option>
                <option value="Hybrid">Hybrid (On-premises + Cloud Object Storage)</option>
                <option value="Multi-Cloud">Multi-Cloud</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Regulated Industry Mandate?</label>
              <div className="flex gap-2">
                {["Yes", "No", "Unsure"].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setFormData({ ...formData, is_regulated_industry: val })}
                    className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-colors ${
                      formData.is_regulated_industry === val
                        ? "bg-[#42D6A4]/15 border-[#42D6A4] text-[#42D6A4]"
                        : "bg-[#0D121A] border-[rgba(148,163,184,0.2)] text-[#94A3B8]"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => {
                if (!formData.company_name) {
                  toast.error("Please enter a company name");
                  return;
                }
                setCurrentStep(2);
              }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#42D6A4] hover:bg-[#38b88d] text-[#080B10] font-semibold text-xs tracking-wide"
            >
              <span>Next: Current Data Environment</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DATA ENVIRONMENT */}
      {currentStep === 2 && (
        <div className="p-6 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)] space-y-6">
          <div className="border-b border-[rgba(148,163,184,0.1)] pb-3">
            <h2 className="text-sm font-semibold text-[#F1F5F9]">Step 2: Current Data Environment</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">Detail existing infrastructure, storage tiers, and monthly cloud burn.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Storage Layer / Object Store</label>
              <input
                type="text"
                value={formData.storage_environment || ""}
                onChange={(e) => setFormData({ ...formData, storage_environment: e.target.value })}
                placeholder="e.g. MinIO on-premises, AWS S3, Azure ADLS, Ceph"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.2)] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#42D6A4]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Analytics & SQL Engine</label>
              <input
                type="text"
                value={formData.analytics_engine || ""}
                onChange={(e) => setFormData({ ...formData, analytics_engine: e.target.value })}
                placeholder="e.g. Snowflake Warehouses, Databricks SQL, Presto"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.2)] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#42D6A4]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">BI & Visualization Tools</label>
              <input
                type="text"
                value={formData.bi_tools || ""}
                onChange={(e) => setFormData({ ...formData, bi_tools: e.target.value })}
                placeholder="e.g. PowerBI, Tableau, Looker, Superset"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.2)] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#42D6A4]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Approx. Monthly Data Spend ($ USD)</label>
              <input
                type="number"
                value={formData.monthly_infrastructure_spend || ""}
                onChange={(e) => setFormData({ ...formData, monthly_infrastructure_spend: parseFloat(e.target.value) || 0 })}
                placeholder="e.g. 85000"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.2)] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#42D6A4]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Existing Operational Friction</label>
              <textarea
                rows={2}
                value={formData.operational_challenges || ""}
                onChange={(e) => setFormData({ ...formData, operational_challenges: e.target.value })}
                placeholder="e.g. High credit usage for nightly batch transformations, difficulty maintaining GDPR residency boundaries."
                className="w-full px-3.5 py-2 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.2)] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#42D6A4]"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 rounded-lg bg-[#0D121A] hover:bg-[#151F2B] text-xs text-[#94A3B8]"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#42D6A4] hover:bg-[#38b88d] text-[#080B10] font-semibold text-xs tracking-wide"
            >
              <span>Next: Business Challenges</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: BUSINESS CHALLENGES */}
      {currentStep === 3 && (
        <div className="p-6 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)] space-y-6">
          <div className="border-b border-[rgba(148,163,184,0.1)] pb-3">
            <h2 className="text-sm font-semibold text-[#F1F5F9]">Step 3: Business Challenges</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">Select all pain points that apply to this prospect.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {availableChallenges.map((challenge) => {
              const selected = formData.challenges.includes(challenge);
              return (
                <button
                  key={challenge}
                  type="button"
                  onClick={() => handleChallengeToggle(challenge)}
                  className={`p-3 rounded-lg border text-left transition-all flex items-start gap-2.5 ${
                    selected
                      ? "bg-[#151F2B] border-[#42D6A4] text-[#F1F5F9]"
                      : "bg-[#0D121A] border-[rgba(148,163,184,0.12)] text-[#94A3B8] hover:border-[rgba(148,163,184,0.25)]"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 ${
                      selected ? "bg-[#42D6A4] text-[#080B10]" : "border border-[rgba(148,163,184,0.3)]"
                    }`}
                  >
                    {selected && <CheckCircleIcon className="w-3 h-3 text-[#080B10]" />}
                  </div>
                  <span className="text-xs leading-snug">{challenge}</span>
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Additional Context or Custom Mandates</label>
            <textarea
              rows={2}
              value={formData.context_notes || ""}
              onChange={(e) => setFormData({ ...formData, context_notes: e.target.value })}
              placeholder="e.g. Board mandated on-premises data residency for PII transactions by Q3."
              className="w-full px-3.5 py-2 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.2)] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#42D6A4]"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 rounded-lg bg-[#0D121A] hover:bg-[#151F2B] text-xs text-[#94A3B8]"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#42D6A4] hover:bg-[#38b88d] text-[#080B10] font-semibold text-xs tracking-wide"
            >
              <span>Next: Stakeholders & Submit</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: STAKEHOLDERS & SUBMIT */}
      {currentStep === 4 && (
        <div className="p-6 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)] space-y-6">
          <div className="border-b border-[rgba(148,163,184,0.1)] pb-3">
            <h2 className="text-sm font-semibold text-[#F1F5F9]">Step 4: Stakeholder Priorities & Evaluation</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Select key decision makers to generate tailored perspectives and review preliminary inputs.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-2">Key Stakeholder Roles to Address</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {availableStakeholders.map((role) => {
                const selected = formData.stakeholder_priorities.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleStakeholderToggle(role)}
                    className={`px-3 py-2 rounded-lg border text-xs font-medium text-left transition-all ${
                      selected
                        ? "bg-[#151F2B] border-[#42D6A4] text-[#42D6A4]"
                        : "bg-[#0D121A] border-[rgba(148,163,184,0.15)] text-[#94A3B8]"
                    }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submission Summary Preview */}
          <div className="p-4 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.14)] space-y-2">
            <div className="text-xs font-semibold text-[#F1F5F9]">Evaluation Summary</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#94A3B8]">
              <div>Target Company: <span className="text-[#F1F5F9] font-medium">{formData.company_name || "(Unspecified)"}</span></div>
              <div>Current Platform: <span className="text-[#F1F5F9] font-medium">{formData.current_platform}</span></div>
              <div>Deployment: <span className="text-[#F1F5F9] font-medium">{formData.deployment_preference}</span></div>
              <div>Data Volume: <span className="text-[#F1F5F9] font-medium">{formData.approximate_data_volume}</span></div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 rounded-lg bg-[#0D121A] hover:bg-[#151F2B] text-xs text-[#94A3B8]"
            >
              Back
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#42D6A4] hover:bg-[#38b88d] disabled:opacity-50 text-[#080B10] font-bold text-xs tracking-wide shadow-lg shadow-[#42D6A4]/20 transition-all"
            >
              {submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#080B10] border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating Fit & Retrieving Evidence...</span>
                </>
              ) : (
                <>
                  <ShieldCheckIcon className="w-4 h-4" />
                  <span>Generate Evidence-Backed Assessment</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AssessmentWizardPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs text-[#64748B]">Loading wizard...</div>}>
      <AssessmentWizardContent />
    </Suspense>
  );
}
