"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  GitCompareIcon,
  ShieldCheckIcon,
  ExternalLinkIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon
} from "@/components/shared/Icons";
import { generateComparisonMatrix, fetchComparisonCompetitors } from "@/lib/api";
import { ComparisonResponse } from "@/lib/types";

const ALL_PRIORITIES = [
  "Cost predictability",
  "Vendor lock-in / portability",
  "Data sovereignty & deployment control",
  "Performance at stated volume",
  "Migration effort",
  "Governance & security"
];

const STAKEHOLDERS = [
  "CTO",
  "CIO",
  "CFO",
  "CISO",
  "Data Engineering Head",
  "Analytics Leader"
];

function ComparisonMatrixContent() {
  const searchParams = useSearchParams();
  const initialPlatform = searchParams.get("plat") || "Snowflake";
  const initialRole = searchParams.get("role") || "CFO";
  const assessmentId = searchParams.get("assessment_id") || undefined;

  const [currentPlatform, setCurrentPlatform] = useState<string>(initialPlatform);
  const [stakeholder, setStakeholder] = useState<string>(initialRole);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([
    "Data sovereignty & deployment control",
    "Vendor lock-in / portability",
    "Cost predictability"
  ]);
  const [competitors, setCompetitors] = useState<string[]>(["Snowflake", "Databricks", "Google BigQuery"]);
  const [comparison, setComparison] = useState<ComparisonResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComparisonCompetitors()
      .then((data) => {
        if (data.length > 0) setCompetitors(data);
      })
      .catch((err) => console.warn("Competitors fetch error", err));
  }, []);

  const handlePriorityToggle = (priority: string) => {
    if (selectedPriorities.includes(priority)) {
      if (selectedPriorities.length === 1) {
        toast.error("Please keep at least 1 priority selected");
        return;
      }
      setSelectedPriorities(selectedPriorities.filter((p) => p !== priority));
    } else {
      if (selectedPriorities.length >= 3) {
        toast.info("Showing top 3 priorities (recommended limit for buyer clarity)");
      }
      setSelectedPriorities([...selectedPriorities, priority]);
    }
  };

  const handleGenerate = () => {
    setLoading(true);
    generateComparisonMatrix({
      assessment_id: assessmentId,
      current_platform: currentPlatform,
      selected_priorities: selectedPriorities,
      stakeholder: stakeholder
    })
      .then((res) => {
        setComparison(res);
      })
      .catch((err) => {
        toast.error(err.message || "Failed to generate comparison");
      })
      .finally(() => setLoading(false));
  };

  // Run on mount or when parameters change
  useEffect(() => {
    handleGenerate();
  }, [currentPlatform, stakeholder, selectedPriorities.join(",")]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#42D6A4]/10 border border-[#42D6A4]/30 text-xs font-mono text-[#42D6A4] mb-2">
            <GitCompareIcon className="w-3.5 h-3.5 text-[#42D6A4]" />
            PRECISION COMPARISON MATRIX
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F1F5F9]">
            Comparison Matrix Engine
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Sourced side-by-side comparison across your stated priorities. Sourced from official vendor documentation.
          </p>
        </div>

        {/* Quick Link to Assessment */}
        <Link
          href="/assessments/new?preset=acme-bank"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#111923] hover:bg-[#151F2B] border border-[rgba(148,163,184,0.2)] text-xs font-medium text-[#F1F5F9] transition-all"
        >
          <SparklesIcon className="w-3.5 h-3.5 text-[#42D6A4]" />
          <span>Demo: Acme Bank (Snowflake)</span>
        </Link>
      </div>

      {/* Control Configuration Panel */}
      <div className="p-6 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)] space-y-5 corner-bracket">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
              1. Current Incumbent Platform
            </label>
            <div className="flex flex-wrap gap-2">
              {competitors.map((comp) => (
                <button
                  key={comp}
                  type="button"
                  onClick={() => setCurrentPlatform(comp)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    currentPlatform.toLowerCase() === comp.toLowerCase()
                      ? "bg-[#151F2B] border-[#42D6A4] text-[#42D6A4]"
                      : "bg-[#0D121A] border-[rgba(148,163,184,0.14)] text-[#94A3B8] hover:text-[#F1F5F9]"
                  }`}
                >
                  {comp}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
              2. Stakeholder Lens
            </label>
            <div className="flex flex-wrap gap-2">
              {STAKEHOLDERS.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setStakeholder(role)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    stakeholder === role
                      ? "bg-[#151F2B] border-[#60A5FA] text-[#60A5FA]"
                      : "bg-[#0D121A] border-[rgba(148,163,184,0.14)] text-[#94A3B8] hover:text-[#F1F5F9]"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-2">
            3. Select Top Priorities (Pick up to 3 for evaluation focus)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {ALL_PRIORITIES.map((p) => {
              const selected = selectedPriorities.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePriorityToggle(p)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                    selected
                      ? "bg-[#151F2B] border-[#42D6A4] text-[#F1F5F9]"
                      : "bg-[#0D121A] border-[rgba(148,163,184,0.12)] text-[#94A3B8] hover:border-[rgba(148,163,184,0.25)]"
                  }`}
                >
                  <span>{p}</span>
                  <span
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                      selected ? "bg-[#42D6A4] text-[#080B10] font-bold" : "border border-[#64748B]"
                    }`}
                  >
                    {selected ? "✓" : ""}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sourced Comparison Rows */}
      {comparison && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#64748B]">
              Sourced Architectural Comparison: {comparison.current_platform} vs. IOMETE
            </span>
            <span className="text-[10px] font-mono text-[#42D6A4] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#42D6A4] animate-pulse" />
              Viewing as {comparison.stakeholder}
            </span>
          </div>

          <div className="space-y-4">
            {comparison.rows.map((row, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)] space-y-4 slide-fade-in corner-bracket-subtle"
              >
                {/* Row Header: Priority Name + Stakeholder Impact */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(148,163,184,0.1)] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#60A5FA]">0{idx + 1}.</span>
                    <h3 className="text-sm font-bold text-[#F1F5F9]">{row.priority}</h3>
                  </div>
                  <div className="text-[11px] font-mono text-[#94A3B8] flex items-center gap-1">
                    <span className="text-[#64748B]">Impact on {comparison.stakeholder}:</span>
                    <span className="text-[#F1F5F9] italic">{row.why_this_matters_to_you}</span>
                  </div>
                </div>

                {/* Sourced Comparison Grid: Incumbent (Left) -> Connector -> IOMETE (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative">
                  {/* Competitor Column */}
                  <div className="p-4 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.1)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8]">
                        Current Stack: {comparison.current_platform}
                      </span>
                      {row.competitor_verification_status === "verified_official" ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-[#60A5FA] border border-blue-500/20">
                          Official Cited
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-[#F5B942] border border-amber-500/20">
                          Contract Review Needed
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      {row.competitor_position}
                    </p>

                    {row.competitor_source_url && (
                      <div className="pt-2 border-t border-[rgba(148,163,184,0.08)] flex items-center justify-between text-[10px]">
                        <span className="text-[#64748B] truncate max-w-[240px]">
                          {row.competitor_source_title}
                        </span>
                        <a
                          href={row.competitor_source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#60A5FA] hover:underline inline-flex items-center gap-1 shrink-0"
                        >
                          <span>Official Source</span>
                          <ExternalLinkIcon className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* IOMETE Column */}
                  <div className="p-4 rounded-lg bg-[#151F2B] border border-[#42D6A4]/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#42D6A4] font-bold">
                        IOMETE Sovereign Lakehouse
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#42D6A4]/10 text-[#42D6A4] border border-[#42D6A4]/25">
                        {row.iomete_evidence_id}
                      </span>
                    </div>

                    <p className="text-xs text-[#F1F5F9] leading-relaxed">
                      {row.iomete_position}
                    </p>

                    <div className="pt-2 border-t border-[rgba(148,163,184,0.12)] flex items-center justify-between text-[10px]">
                      <span className="text-[#94A3B8] truncate max-w-[240px]">
                        {row.iomete_source_title}
                      </span>
                      <a
                        href={row.iomete_source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#42D6A4] hover:underline inline-flex items-center gap-1 shrink-0 font-medium"
                      >
                        <span>Verified Documentation</span>
                        <ExternalLinkIcon className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Honest Context Panel (NEVER an auto-generated 'IOMETE wins' badge) */}
          <div className="p-5 rounded-xl bg-[#0D121A] border border-[rgba(148,163,184,0.14)] space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-[#42D6A4]" />
              <h4 className="text-xs font-semibold text-[#F1F5F9]">
                Evaluation Context (Not an Automated Verdict)
              </h4>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {comparison.context_summary}
            </p>

            <div className="pt-2 border-t border-[rgba(148,163,184,0.08)] space-y-1">
              <span className="text-[10px] font-mono text-[#F5B942] uppercase tracking-wider">
                Comparison Boundaries & Validation Notes:
              </span>
              <ul className="space-y-1 text-xs text-[#64748B]">
                {comparison.limitations.map((lim, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#F5B942]">•</span>
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparisonPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs text-[#64748B]">Loading Comparison Matrix...</div>}>
      <ComparisonMatrixContent />
    </Suspense>
  );
}
