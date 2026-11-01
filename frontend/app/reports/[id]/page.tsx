"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  FileTextIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
  ArrowRightIcon
} from "@/components/shared/Icons";
import { Suspense } from "react";
import { fetchCustomerReport } from "@/lib/api";

function CustomerReportContent({ id }: { id: string }) {

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomerReport(id)
      .then((data) => setReport(data))
      .catch((err) => setError(err.message || "Failed to load report"))
      .finally(() => setLoading(false));
  }, [id]);


  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-[#42D6A4] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#94A3B8] font-mono">Compiling executive evaluation document...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <AlertTriangleIcon className="w-8 h-8 text-[#F87171] mx-auto" />
        <h2 className="text-base font-bold text-[#F1F5F9]">Report Not Available</h2>
        <p className="text-xs text-[#94A3B8]">{error || "Could not retrieve the evaluation report."}</p>
        <Link href="/" className="inline-block px-4 py-2 rounded bg-[#151F2B] text-xs text-[#42D6A4]">
          Return to Command Centre
        </Link>
      </div>
    );
  }

  const {
    report_metadata,
    company_profile,
    executive_summary,
    fit_analysis,
    business_challenges,
    matched_capabilities,
    verified_evidence,
    cost_model_summary,
    architecture_summary,
    limitations_and_exclusions,
    missing_information_to_clarify,
    technical_discovery_questions,
    recommended_sales_action
  } = report;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 print:p-0 print:space-y-4">
      {/* Top Action Bar (Hidden during Print) */}
      <div className="flex items-center justify-between print:hidden">
        <Link
          href={`/assessments/${id}`}
          className="text-xs text-[#94A3B8] hover:text-[#F1F5F9] flex items-center gap-1.5"
        >
          <span>← Back to Assessment Details</span>
        </Link>


        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#42D6A4] hover:bg-[#38b88d] text-[#080B10] font-bold text-xs tracking-wide shadow-md transition-all"
        >
          <FileTextIcon className="w-3.5 h-3.5" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable Report Document Container */}
      <div className="p-8 sm:p-12 rounded-xl bg-[#0D121A] border border-[rgba(148,163,184,0.18)] print:border-none print:bg-white print:text-black space-y-8 shadow-2xl">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(148,163,184,0.15)] pb-6 print:border-gray-300">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-[#42D6A4] print:text-emerald-700">IOMETE PROOF</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#151F2B] text-[#94A3B8] border border-[rgba(148,163,184,0.15)] print:bg-gray-100 print:text-gray-700">
                TECHNICAL EVALUATION
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#F1F5F9] print:text-black mt-2">
              Preliminary Lakehouse Fit Assessment: {company_profile.company_name}
            </h1>
          </div>

          <div className="text-right text-xs font-mono text-[#64748B] print:text-gray-600">
            <div>REPORT ID: {report_metadata.report_id}</div>
            <div>DATE: {report_metadata.generated_at.split("T")[0]}</div>
          </div>
        </div>

        {/* Disclaimer Alert */}
        <div className="p-4 rounded-lg bg-[#111923] border border-[#F5B942]/30 print:bg-amber-50 print:border-amber-300 text-xs text-[#F5B942] print:text-amber-800 leading-relaxed">
          <strong className="block mb-1 uppercase font-mono tracking-wider">Evaluation Notice:</strong>
          {report_metadata.disclaimer}
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[#60A5FA] print:text-blue-700">
            1. Executive Evaluation Summary
          </h2>
          <p className="text-xs text-[#F1F5F9] print:text-gray-800 leading-relaxed">
            {executive_summary}
          </p>
        </div>

        {/* Company Profile & Fit Score Table */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[#60A5FA] print:text-blue-700">
            2. Customer Context & Fit Classification
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded bg-[#111923] print:bg-gray-50 border border-[rgba(148,163,184,0.1)] print:border-gray-200">
              <span className="text-[10px] font-mono text-[#64748B] block">CURRENT PLATFORM</span>
              <span className="font-semibold text-[#F1F5F9] print:text-black">{company_profile.current_platform}</span>
            </div>
            <div className="p-3 rounded bg-[#111923] print:bg-gray-50 border border-[rgba(148,163,184,0.1)] print:border-gray-200">
              <span className="text-[10px] font-mono text-[#64748B] block">DEPLOYMENT TARGET</span>
              <span className="font-semibold text-[#F1F5F9] print:text-black">{company_profile.deployment_preference}</span>
            </div>
            <div className="p-3 rounded bg-[#111923] print:bg-gray-50 border border-[rgba(148,163,184,0.1)] print:border-gray-200">
              <span className="text-[10px] font-mono text-[#64748B] block">DATA VOLUME</span>
              <span className="font-semibold text-[#F1F5F9] print:text-black">{company_profile.approximate_data_volume}</span>
            </div>
            <div className="p-3 rounded bg-[#111923] print:bg-gray-50 border border-[rgba(148,163,184,0.1)] print:border-gray-200">
              <span className="text-[10px] font-mono text-[#64748B] block">FIT CLASSIFICATION</span>
              <span className="font-bold text-[#42D6A4] print:text-emerald-700">{fit_analysis.classification}</span>
            </div>
          </div>
        </div>

        {/* Matched Capabilities & Official Evidence Sources */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[#60A5FA] print:text-blue-700">
            3. Grounded Architectural Capabilities & Verified Sources
          </h2>
          <div className="space-y-2.5">
            {matched_capabilities.map((mc: any, i: number) => (
              <div
                key={i}
                className="p-3.5 rounded-lg bg-[#111923] print:bg-gray-50 border border-[rgba(148,163,184,0.1)] print:border-gray-200 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#F1F5F9] print:text-black">{mc.capability_name}</span>
                  <span className="text-[10px] font-mono text-[#42D6A4] print:text-emerald-700">
                    {mc.evidence_ids.join(", ")}
                  </span>
                </div>
                <p className="text-[#94A3B8] print:text-gray-700 leading-snug">{mc.relevance_reason}</p>
                <div className="text-[10px] text-[#F5B942] print:text-amber-800">
                  <strong>Qualification:</strong> {mc.qualification}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Sourced Platform Comparison Matrix */}
        {report.comparison_matrix && report.comparison_matrix.rows && report.comparison_matrix.rows.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[#60A5FA] print:text-blue-700">
                4. Sourced Comparison Matrix ({company_profile.current_platform} vs IOMETE)
              </h2>
              <span className="text-[10px] font-mono text-[#64748B] print:text-gray-600">
                EVALUATED FOR: {report.comparison_matrix.stakeholder || "ENTERPRISE STAKEHOLDER"}
              </span>
            </div>

            <div className="border border-[rgba(148,163,184,0.15)] print:border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#111923] print:bg-gray-100 border-b border-[rgba(148,163,184,0.15)] print:border-gray-300 text-[10px] font-mono text-[#94A3B8] print:text-gray-700 uppercase tracking-wider">
                    <th className="p-3 w-1/4">Priority Dimension</th>
                    <th className="p-3 w-3/8 text-[#42D6A4] print:text-emerald-700">IOMETE Architectural Position</th>
                    <th className="p-3 w-3/8 text-[#94A3B8] print:text-gray-700">{company_profile.current_platform} Position</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(148,163,184,0.1)] print:divide-gray-200">
                  {report.comparison_matrix.rows.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-[#151F2B]/40 print:hover:bg-transparent">
                      <td className="p-3 align-top font-semibold text-[#F1F5F9] print:text-black">
                        <div>{row.priority}</div>
                        <div className="text-[10px] font-normal text-[#94A3B8] print:text-gray-600 mt-1 italic">
                          {row.why_this_matters_to_you || row.why_this_matters}
                        </div>
                      </td>
                      <td className="p-3 align-top text-[#F1F5F9] print:text-gray-900 space-y-1">
                        <div>{row.iomete_position}</div>
                        <div className="text-[10px] font-mono text-[#42D6A4] print:text-emerald-700">
                          Evidence: {row.iomete_evidence_id || (Array.isArray(row.iomete_evidence_ids) ? row.iomete_evidence_ids.join(", ") : "EVD-IOM-01")}
                        </div>
                      </td>
                      <td className="p-3 align-top text-[#94A3B8] print:text-gray-800 space-y-1">
                        <div>{row.competitor_position}</div>
                        <div className="text-[10px] font-mono text-[#64748B] print:text-gray-500">
                          Source: {row.competitor_source_title || row.competitor_source || "Official Documentation"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {report.comparison_matrix.context_summary && (
              <p className="text-[11px] text-[#94A3B8] print:text-gray-600 italic">
                Note: {report.comparison_matrix.context_summary}
              </p>
            )}
          </div>
        )}

        {/* Architecture & Cost Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-[#111923] print:bg-gray-50 border border-[rgba(148,163,184,0.1)] print:border-gray-200 space-y-2 text-xs">
            <h3 className="font-mono text-[10px] uppercase tracking-wider text-[#60A5FA] print:text-blue-700">
              5. Proposed Reference Architecture
            </h3>
            <div className="space-y-1 text-[#94A3B8] print:text-gray-700">
              <div>• Storage: <span className="text-[#F1F5F9] print:text-black">{architecture_summary.storage_layer}</span></div>
              <div>• Compute: <span className="text-[#F1F5F9] print:text-black">{architecture_summary.compute_engine}</span></div>
              <div>• Security: <span className="text-[#F1F5F9] print:text-black">{architecture_summary.security_model}</span></div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#111923] print:bg-gray-50 border border-[rgba(148,163,184,0.1)] print:border-gray-200 space-y-2 text-xs">
            <h3 className="font-mono text-[10px] uppercase tracking-wider text-[#60A5FA] print:text-blue-700">
              6. Workload Economics Summary
            </h3>
            <div className="space-y-1 text-[#94A3B8] print:text-gray-700">
              <div>• Current Est. Annual: <span className="text-[#F1F5F9] print:text-black">${cost_model_summary.current_estimated_annual.toLocaleString()}</span></div>
              <div>• Proposed Est. Annual: <span className="text-[#42D6A4] print:text-emerald-700 font-bold">${cost_model_summary.proposed_estimated_annual.toLocaleString()}</span></div>
              <div>• Projected Delta: <span className="text-[#60A5FA] print:text-blue-700 font-bold">${cost_model_summary.projected_annual_difference.toLocaleString()}</span></div>
              <div>• Est. Break-Even: <span className="text-[#F1F5F9] print:text-black">{cost_model_summary.break_even_months} Months</span></div>
            </div>
          </div>
        </div>

        {/* Discovery Questions & Recommended Next Sales Action */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[#60A5FA] print:text-blue-700">
            7. Discovery Blueprint & Next Sales Action
          </h2>
          <div className="space-y-1.5 text-xs text-[#94A3B8] print:text-gray-700">
            {technical_discovery_questions.map((q: string, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <span className="font-mono text-[#60A5FA] print:text-blue-700">{i + 1}.</span>
                <span>{q}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-lg bg-[#151F2B] print:bg-gray-100 border border-[#42D6A4]/30 print:border-gray-300 mt-4">
            <span className="text-[10px] font-mono text-[#42D6A4] print:text-emerald-700 uppercase tracking-wider block mb-1">
              Recommended Next Action:
            </span>
            <p className="text-xs font-semibold text-[#F1F5F9] print:text-black">
              {recommended_sales_action}
            </p>
          </div>
        </div>

        {/* Document Footer */}
        <div className="pt-6 border-t border-[rgba(148,163,184,0.1)] print:border-gray-300 text-center text-[10px] font-mono text-[#64748B] print:text-gray-500">
          IOMETE PROOF — Don&apos;t Pitch. Prove. © 2026. Sourced from official iomete.com documentation.
        </div>
      </div>
    </div>
  );
}

function CustomerReportWrapper({ params }: { params: Promise<{ id: string }> }) {
  const resolved = use(params);
  return <CustomerReportContent id={resolved.id} />;
}

export default function CustomerReportPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="py-16 text-center text-xs text-[#64748B]">Loading report...</div>}>
      <CustomerReportWrapper params={params} />
    </Suspense>
  );
}


