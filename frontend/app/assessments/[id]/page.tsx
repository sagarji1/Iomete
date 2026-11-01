"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ShieldCheckIcon,
  AlertTriangleIcon,
  HelpCircleIcon,
  ExternalLinkIcon,
  CpuIcon,
  DollarSignIcon,
  FileTextIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  GitCompareIcon
} from "@/components/shared/Icons";
import { fetchAssessmentById, generateComparisonMatrix } from "@/lib/api";
import { AssessmentRecord, ComparisonResponse } from "@/lib/types";


import { Suspense } from "react";

function AssessmentResultContent({ id }: { id: string }) {
  const [assessment, setAssessment] = useState<AssessmentRecord | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStakeholder, setActiveStakeholder] = useState<string>("");

  useEffect(() => {
    fetchAssessmentById(id)
      .then((data) => {
        setAssessment(data);
        const roles = Object.keys(data.stakeholder_perspectives || {});
        const role = roles.length > 0 ? roles[0] : "CTO";
        setActiveStakeholder(role);

        generateComparisonMatrix({
          assessment_id: data.id,
          current_platform: data.current_platform,
          selected_priorities: [
            "Data sovereignty & deployment control",
            "Vendor lock-in / portability",
            "Cost predictability"
          ],
          stakeholder: role
        }).then(setComparisonData).catch((e) => console.warn("Comparison fetch warning", e));
      })
      .catch((err) => {
        setError(err.message || "Failed to load assessment");
      })
      .finally(() => setLoading(false));
  }, [id]);



  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-16 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-[#42D6A4] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#94A3B8] font-mono">Running deterministic fit engine & ground truth synthesis...</p>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <AlertTriangleIcon className="w-8 h-8 text-[#F87171] mx-auto" />
        <h2 className="text-lg font-bold text-[#F1F5F9]">Assessment Not Found</h2>
        <p className="text-xs text-[#94A3B8]">{error || "Could not retrieve the requested assessment record."}</p>
        <Link href="/assessments/new" className="inline-block px-4 py-2 rounded bg-[#151F2B] text-xs text-[#42D6A4]">
          Run a New Assessment
        </Link>
      </div>
    );
  }

  const isStrongFit = assessment.fit_classification === "Strong potential fit";

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Top Banner & Fit Score Card */}
      <div className="p-6 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.18)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#94A3B8]">{assessment.industry}</span>
            <span className="text-[#64748B]">•</span>
            <span className="text-xs font-mono text-[#94A3B8]">{assessment.current_platform} user</span>
            <span className="text-[#64748B]">•</span>
            <span className="text-xs font-mono text-[#94A3B8]">{assessment.deployment_preference}</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F1F5F9]">{assessment.company_name}</h1>
          <p className="text-xs text-[#94A3B8] max-w-2xl leading-relaxed">
            {assessment.executive_summary}
          </p>
        </div>

        {/* Fit Score Badge & Meter */}
        <div className="p-4 rounded-xl bg-[#0D121A] border border-[rgba(148,163,184,0.14)] text-center min-w-[200px] shrink-0">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#64748B]">Fit Classification</div>
          <div
            className={`mt-1.5 px-2.5 py-1 rounded text-xs font-bold inline-block ${
              isStrongFit
                ? "bg-emerald-500/10 text-[#42D6A4] border border-emerald-500/25"
                : "bg-amber-500/10 text-[#F5B942] border border-amber-500/25"
            }`}
          >
            {assessment.fit_classification}
          </div>
          <div className="text-2xl font-bold font-mono text-[#F1F5F9] mt-2">
            {assessment.fit_score}<span className="text-xs text-[#64748B] font-normal">/100</span>
          </div>
          <p className="text-[10px] text-[#64748B] mt-1">Rule-grounded calculation</p>
        </div>
      </div>

      {/* Transparent Calculation Factor Explanation */}
      <div className="p-4 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.12)]">
        <div className="text-[10px] font-mono text-[#42D6A4] uppercase tracking-wider">
          Score Breakdown & Evaluation Factors
        </div>
        <p className="text-xs text-[#94A3B8] mt-1 font-mono leading-relaxed">
          {assessment.fit_explanation}
        </p>
      </div>

      {/* Action Shortcut Bar (P0 Golden Path) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <Link
          href={`/comparison?plat=${encodeURIComponent(assessment.current_platform)}&role=${encodeURIComponent(activeStakeholder || "CTO")}&assessment_id=${assessment.id}`}
          className="p-3 rounded-lg bg-[#151F2B] hover:bg-[#1A2636] border border-[#42D6A4]/40 flex items-center justify-between text-xs text-[#F1F5F9] group transition-all"
        >
          <div className="flex items-center gap-2">
            <GitCompareIcon className="w-4 h-4 text-[#42D6A4]" />
            <span className="font-semibold text-[#42D6A4]">Comparison Matrix</span>
          </div>
          <ArrowRightIcon className="w-3.5 h-3.5 text-[#42D6A4]" />
        </Link>

        <Link
          href={`/objections?q=We+already+use+${encodeURIComponent(assessment.current_platform)}.+Why+should+we+consider+IOMETE%3F&context=${encodeURIComponent(assessment.company_name)}`}
          className="p-3 rounded-lg bg-[#111923] hover:bg-[#151F2B] border border-[rgba(148,163,184,0.14)] flex items-center justify-between text-xs text-[#F1F5F9] group transition-all"
        >
          <div className="flex items-center gap-2">
            <HelpCircleIcon className="w-4 h-4 text-[#60A5FA]" />
            <span>Handle Objections</span>
          </div>
          <ArrowRightIcon className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#42D6A4]" />
        </Link>

        <Link
          href={`/architecture?deploy=${encodeURIComponent(assessment.deployment_preference)}&plat=${encodeURIComponent(assessment.current_platform)}`}
          className="p-3 rounded-lg bg-[#111923] hover:bg-[#151F2B] border border-[rgba(148,163,184,0.14)] flex items-center justify-between text-xs text-[#F1F5F9] group transition-all"
        >
          <div className="flex items-center gap-2">
            <CpuIcon className="w-4 h-4 text-[#42D6A4]" />
            <span>Architecture Studio</span>
          </div>
          <ArrowRightIcon className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#42D6A4]" />
        </Link>

        <Link
          href={`/costs?spend=${assessment.monthly_infrastructure_spend || 60000}`}
          className="p-3 rounded-lg bg-[#111923] hover:bg-[#151F2B] border border-[rgba(148,163,184,0.14)] flex items-center justify-between text-xs text-[#F1F5F9] group transition-all"
        >
          <div className="flex items-center gap-2">
            <DollarSignIcon className="w-4 h-4 text-[#F5B942]" />
            <span>Cost Explorer</span>
          </div>
          <ArrowRightIcon className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#42D6A4]" />
        </Link>

        <Link
          href={`/reports/${assessment.id}`}
          className="p-3 rounded-lg bg-[#111923] hover:bg-[#151F2B] border border-[rgba(148,163,184,0.14)] flex items-center justify-between text-xs text-[#F1F5F9] group transition-all"
        >
          <div className="flex items-center gap-2">
            <FileTextIcon className="w-4 h-4 text-[#A78BFA]" />
            <span>Export Report</span>
          </div>
          <ArrowRightIcon className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#42D6A4]" />
        </Link>
      </div>

      {/* Embedded Comparison Matrix Card (§7 of v2 spec) */}
      {comparisonData && (
        <div className="p-6 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.18)] space-y-4 corner-bracket">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(148,163,184,0.1)] pb-3">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#42D6A4] flex items-center gap-1.5">
                <GitCompareIcon className="w-3.5 h-3.5" />
                <span>CORE DIFFERENTIATOR — COMPARISON MATRIX</span>
              </div>
              <h2 className="text-sm font-bold text-[#F1F5F9] mt-0.5">
                {assessment.current_platform} vs. IOMETE Sovereign Lakehouse
              </h2>
            </div>
            <Link
              href={`/comparison?plat=${encodeURIComponent(assessment.current_platform)}&role=${encodeURIComponent(activeStakeholder || "CTO")}&assessment_id=${assessment.id}`}
              className="text-xs text-[#42D6A4] hover:underline flex items-center gap-1 font-mono"
            >
              <span>Open Full Comparison Studio</span>
              <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {comparisonData.rows.map((row, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.1)] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F1F5F9]">{row.priority}</span>
                  <span className="text-[10px] font-mono text-[#94A3B8]">
                    Lens: <strong className="text-[#60A5FA]">{comparisonData.stakeholder}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded bg-[#111923] border border-[rgba(148,163,184,0.08)]">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] block mb-1">
                      {assessment.current_platform}:
                    </span>
                    <p className="text-[#94A3B8] text-[11px] leading-relaxed">
                      {row.competitor_position}
                    </p>
                  </div>

                  <div className="p-3 rounded bg-[#151F2B] border border-[#42D6A4]/25">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#42D6A4] font-bold">
                        IOMETE:
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#42D6A4]/10 text-[#42D6A4]">
                        {row.iomete_evidence_id}
                      </span>
                    </div>
                    <p className="text-[#F1F5F9] text-[11px] leading-relaxed">
                      {row.iomete_position}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-[#64748B] italic pt-1">
                  Why this matters: {row.why_this_matters_to_you}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* Matched Capabilities & Official Evidence */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#F1F5F9]">Matched IOMETE Capabilities & Ground Truth</h2>
          <span className="text-[11px] font-mono text-[#64748B]">Official iomete.com Evidence</span>
        </div>

        <div className="space-y-3">
          {assessment.matched_capabilities.map((cap, i) => (
            <div key={i} className="p-5 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#42D6A4]" />
                  <span className="text-xs font-bold text-[#F1F5F9]">{cap.capability_name}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#151F2B] text-[#60A5FA] border border-[rgba(148,163,184,0.15)]">
                  {cap.category}
                </span>
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed">
                <strong className="text-[#F1F5F9]">Why this matters:</strong> {cap.relevance_reason}
              </p>

              <div className="p-3 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.1)] text-xs text-[#F5B942]/90 flex items-start gap-2">
                <AlertTriangleIcon className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#F5B942]" />
                <span><strong className="text-[#F5B942]">Qualification:</strong> {cap.qualification}</span>
              </div>

              {/* Supporting Evidence links for this capability */}
              <div className="flex flex-wrap gap-2 pt-1">
                {cap.evidence_ids.map((evId) => {
                  const evItem = assessment.evidence_references.find((e) => e.id === evId);
                  return (
                    <a
                      key={evId}
                      href={evItem?.source_url || "https://iomete.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#151F2B] hover:bg-[#1A2636] border border-[#42D6A4]/20 text-[11px] font-mono text-[#42D6A4] transition-colors"
                    >
                      <CheckCircleIcon className="w-3 h-3 text-[#42D6A4]" />
                      <span>{evId}: {evItem?.source_title || "Official Resource"}</span>
                      <ExternalLinkIcon className="w-3 h-3" />
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stakeholder Perspectives Tabs */}
      {Object.keys(assessment.stakeholder_perspectives || {}).length > 0 && (
        <div className="p-6 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)] space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.1)] pb-3">
            <h2 className="text-sm font-semibold text-[#F1F5F9]">Stakeholder-Specific Angles</h2>
            <span className="text-[11px] font-mono text-[#64748B]">Tailored Business Logic</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.keys(assessment.stakeholder_perspectives).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setActiveStakeholder(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeStakeholder === role
                    ? "bg-[#42D6A4]/15 border border-[#42D6A4] text-[#42D6A4]"
                    : "bg-[#0D121A] border border-[rgba(148,163,184,0.14)] text-[#94A3B8]"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="p-4 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.1)]">
            <span className="text-[10px] font-mono text-[#60A5FA] uppercase tracking-wider">
              {activeStakeholder} Value Proposition:
            </span>
            <p className="text-xs text-[#F1F5F9] mt-1 leading-relaxed">
              {assessment.stakeholder_perspectives[activeStakeholder]}
            </p>
          </div>
        </div>
      )}

      {/* Two Column: Limitations & Missing Information (Honesty & Accuracy) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Honest Limitations */}
        <div className="p-5 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#F5B942]">
            <AlertTriangleIcon className="w-4 h-4 text-[#F5B942]" />
            <span>Architectural Limitations & Boundaries</span>
          </div>
          <ul className="space-y-2 text-xs text-[#94A3B8]">
            {assessment.limitations.map((lim, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#F5B942] font-bold">•</span>
                <span>{lim}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Missing Information Checklist */}
        <div className="p-5 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#60A5FA]">
            <HelpCircleIcon className="w-4 h-4 text-[#60A5FA]" />
            <span>Missing Information To Validate</span>
          </div>
          <ul className="space-y-2 text-xs text-[#94A3B8]">
            {assessment.missing_information.map((info, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#60A5FA] font-bold">•</span>
                <span>{info}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Discovery Questions & Recommended Next Sales Action */}
      <div className="p-6 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)] space-y-4">
        <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.1)] pb-3">
          <h2 className="text-sm font-semibold text-[#F1F5F9]">Discovery Call Blueprint</h2>
          <span className="text-[11px] font-mono text-[#42D6A4]">Sales-Ready Execution</span>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-medium text-[#94A3B8]">Technical Questions for the Prospect:</span>
          <div className="space-y-1.5">
            {assessment.discovery_questions.map((q, i) => (
              <div key={i} className="p-2.5 rounded bg-[#0D121A] border border-[rgba(148,163,184,0.1)] text-xs text-[#F1F5F9] flex items-start gap-2">
                <span className="font-mono text-[#60A5FA]">{i + 1}.</span>
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#151F2B] border border-[#42D6A4]/30 space-y-1.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#42D6A4]">
            Recommended Immediate Sales Action:
          </div>
          <p className="text-xs font-medium text-[#F1F5F9] leading-relaxed">
            {assessment.recommended_sales_action}
          </p>
        </div>
      </div>
    </div>
  );
}

function AssessmentResultWrapper({ params }: { params: Promise<{ id: string }> }) {
  const resolved = use(params);
  return <AssessmentResultContent id={resolved.id} />;
}

export default function AssessmentResultPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="py-16 text-center text-xs text-[#64748B]">Loading assessment...</div>}>
      <AssessmentResultWrapper params={params} />
    </Suspense>
  );
}


