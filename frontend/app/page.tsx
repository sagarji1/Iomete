"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheckIcon,
  ArrowRightIcon,
  HelpCircleIcon,
  SparklesIcon,
  BuildingIcon,
  FileTextIcon,
  CpuIcon,
  GitCompareIcon,
  DollarSignIcon
} from "@/components/shared/Icons";
import { fetchAssessments } from "@/lib/api";
import { AssessmentRecord } from "@/lib/types";

export default function OverviewPage() {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessments()
      .then((data) => {
        setAssessments(data);
      })
      .catch((err) => {
        console.warn("Could not fetch real assessments, showing empty or fallback:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const strongFitCount = assessments.filter((a) => a.fit_classification === "Strong potential fit").length;
  const validationNeededCount = assessments.filter(
    (a) => a.fit_classification === "Potential fit — further validation needed" || a.fit_classification === "Discovery required"
  ).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome & Primary CTA Banner with BioForge Blueprint Texture */}
      <div className="relative overflow-hidden rounded-xl border border-[rgba(148,163,184,0.18)] bg-blueprint-grid p-8 corner-bracket">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#42D6A4]/10 border border-[#42D6A4]/30 text-xs font-mono text-[#42D6A4]">
            <span className="w-2 h-2 rounded-full bg-[#42D6A4] animate-pulse" />
            MEASURED SALES INTELLIGENCE ENGINE (v2)
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F1F5F9]">
            Don&apos;t Pitch. <span className="text-gradient-mint">Prove.</span>
          </h1>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            Eliminate traditional enterprise sales friction. IOMETE PROOF analyzes prospective enterprise architecture,
            grounds fit claims in verified documentation, and gives buyers transparent evidence and actionable next steps.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/assessments/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#42D6A4] hover:bg-[#38b88d] text-[#080B10] font-semibold text-xs tracking-wide transition-all shadow-lg shadow-[#42D6A4]/20"
            >
              <span>Start New Assessment</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              href="/assessments/new?preset=acme-bank"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#151F2B] hover:bg-[#1A2636] border border-[#42D6A4]/30 text-xs font-medium text-[#42D6A4] transition-all"
            >
              <SparklesIcon className="w-4 h-4 text-[#42D6A4]" />
              <span>Load Acme Bank (Snowflake Demo)</span>
            </Link>
            <Link
              href="/comparison?plat=Snowflake"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#111923] hover:bg-[#151F2B] border border-[rgba(148,163,184,0.2)] text-xs font-medium text-[#F1F5F9] transition-all"
            >
              <GitCompareIcon className="w-4 h-4 text-[#60A5FA]" />
              <span>Comparison Matrix</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Workflow Chain (6 Steps per §4 & §16 of v2) */}
      <div className="p-5 rounded-xl bg-[#0D121A] border border-[rgba(148,163,184,0.14)] corner-bracket-subtle">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-mono uppercase tracking-wider text-[#64748B]">
            Sales Decision Pipeline (P0 Golden Path)
          </div>
          <span className="text-[10px] font-mono text-[#42D6A4]">6 Sourced Stages</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <div className="p-3 rounded-lg bg-[#111923] border border-[rgba(148,163,184,0.12)] space-y-1">
            <div className="flex items-center justify-between text-[10px] text-[#64748B] font-mono">
              <span>01. PROSPECT</span>
              <BuildingIcon className="w-3 h-3 text-[#60A5FA]" />
            </div>
            <p className="text-xs font-semibold text-[#F1F5F9]">Company</p>
            <p className="text-[10px] text-[#94A3B8]">Incumbent & volume</p>
          </div>

          <div className="p-3 rounded-lg bg-[#111923] border border-[rgba(148,163,184,0.12)] space-y-1">
            <div className="flex items-center justify-between text-[10px] text-[#64748B] font-mono">
              <span>02. ASSESSMENT</span>
              <FileTextIcon className="w-3 h-3 text-[#94A3B8]" />
            </div>
            <p className="text-xs font-semibold text-[#F1F5F9]">Constraints</p>
            <p className="text-[10px] text-[#94A3B8]">Storage & spend</p>
          </div>

          <div className="p-3 rounded-lg bg-[#111923] border border-[rgba(148,163,184,0.12)] space-y-1">
            <div className="flex items-center justify-between text-[10px] text-[#64748B] font-mono">
              <span>03. FIT</span>
              <ShieldCheckIcon className="w-3 h-3 text-[#42D6A4]" />
            </div>
            <p className="text-xs font-semibold text-[#F1F5F9]">Fit Analysis</p>
            <p className="text-[10px] text-[#42D6A4]">Deterministic score</p>
          </div>

          <div className="p-3 rounded-lg bg-[#151F2B] border border-[#42D6A4]/30 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-[#42D6A4] font-mono">
              <span>04. COMPARISON</span>
              <GitCompareIcon className="w-3 h-3 text-[#42D6A4]" />
            </div>
            <p className="text-xs font-semibold text-[#42D6A4]">Matrix Engine</p>
            <p className="text-[10px] text-[#94A3B8]">Sourced tradeoffs</p>
          </div>

          <div className="p-3 rounded-lg bg-[#111923] border border-[rgba(148,163,184,0.12)] space-y-1">
            <div className="flex items-center justify-between text-[10px] text-[#64748B] font-mono">
              <span>05. PROOF</span>
              <HelpCircleIcon className="w-3 h-3 text-[#F5B942]" />
            </div>
            <p className="text-xs font-semibold text-[#F1F5F9]">Objection & Cost</p>
            <p className="text-[10px] text-[#94A3B8]">Evidence-grounded</p>
          </div>

          <div className="p-3 rounded-lg bg-[#111923] border border-[rgba(148,163,184,0.12)] space-y-1">
            <div className="flex items-center justify-between text-[10px] text-[#64748B] font-mono">
              <span>06. RECOMMEND</span>
              <CpuIcon className="w-3 h-3 text-[#A78BFA]" />
            </div>
            <p className="text-xs font-semibold text-[#F1F5F9]">Pilot Action</p>
            <p className="text-[10px] text-[#94A3B8]">Customer report</p>
          </div>
        </div>
      </div>


      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)]">
          <div className="text-[11px] font-mono text-[#64748B]">TOTAL ASSESSMENTS</div>
          <div className="text-2xl font-bold text-[#F1F5F9] mt-2 font-mono">{loading ? "..." : assessments.length}</div>
          <div className="text-[11px] text-[#42D6A4] mt-1 flex items-center gap-1">
            <span>Live evaluated records</span>
          </div>
        </div>
        <div className="p-5 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)]">
          <div className="text-[11px] font-mono text-[#64748B]">STRONG POTENTIAL FIT</div>
          <div className="text-2xl font-bold text-[#42D6A4] mt-2 font-mono">{loading ? "..." : strongFitCount}</div>
          <div className="text-[11px] text-[#94A3B8] mt-1">Score ≥ 75/100</div>
        </div>
        <div className="p-5 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)]">
          <div className="text-[11px] font-mono text-[#64748B]">DISCOVERY / VALIDATION</div>
          <div className="text-2xl font-bold text-[#F5B942] mt-2 font-mono">{loading ? "..." : validationNeededCount}</div>
          <div className="text-[11px] text-[#94A3B8] mt-1">Specific unknowns flagged</div>
        </div>
        <div className="p-5 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)]">
          <div className="text-[11px] font-mono text-[#64748B]">VERIFIED CLAIMS</div>
          <div className="text-2xl font-bold text-[#60A5FA] mt-2 font-mono">8 Claims</div>
          <div className="text-[11px] text-[#94A3B8] mt-1">100% sourced from official docs</div>
        </div>
      </div>

      {/* Two Column Layout: Recent Assessments & Most Common Customer Objections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Assessments */}
        <div className="p-6 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#F1F5F9]">Recent Assessments</h2>
              <Link href="/assessments/new" className="text-xs text-[#42D6A4] hover:underline font-medium">
                + New
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-[#64748B]">Loading assessments...</div>
            ) : assessments.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <p className="text-xs text-[#94A3B8]">No assessments saved yet in this session.</p>
                <Link
                  href="/assessments/new?preset=acme-bank"
                  className="inline-block px-3 py-1.5 rounded bg-[#151F2B] border border-[#42D6A4]/30 text-xs text-[#42D6A4]"
                >
                  Load Acme Bank (Demo)
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {assessments.slice(0, 4).map((a) => (
                  <Link
                    key={a.id}
                    href={`/assessments/${a.id}`}
                    className="block p-3.5 rounded-lg bg-[#0D121A] hover:bg-[#151F2B] border border-[rgba(148,163,184,0.1)] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#F1F5F9]">{a.company_name}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          a.fit_classification === "Strong potential fit"
                            ? "bg-emerald-500/10 text-[#42D6A4] border border-emerald-500/20"
                            : "bg-amber-500/10 text-[#F5B942] border border-amber-500/20"
                        }`}
                      >
                        {a.fit_classification}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#64748B]">
                      <span>{a.current_platform}</span>
                      <span>•</span>
                      <span>{a.deployment_preference}</span>
                      <span>•</span>
                      <span>{a.approximate_data_volume}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[rgba(148,163,184,0.1)] mt-4">
            <Link
              href="/prospects"
              className="text-xs text-[#94A3B8] hover:text-[#F1F5F9] flex items-center justify-between"
            >
              <span>View all 3 pre-seeded demo prospects</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Most Common Customer Objections */}
        <div className="p-6 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#F1F5F9]">Most Common Customer Objections</h2>
              <span className="text-[11px] font-mono text-[#64748B]">Evidence-Backed</span>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  text: "We already use Snowflake. Why should we consider IOMETE?",
                  category: "Incumbent Platform Differentiation"
                },
                {
                  text: "We cannot move sensitive data outside our infrastructure.",
                  category: "Data Sovereignty & On-Premises"
                },
                {
                  text: "Our cloud costs are already too high.",
                  category: "Compute Economics"
                },
                {
                  text: "We are concerned about vendor lock-in.",
                  category: "Apache Iceberg Open Formats"
                }
              ].map((obj, i) => (
                <Link
                  key={i}
                  href={`/objections?q=${encodeURIComponent(obj.text)}`}
                  className="block p-3 rounded-lg bg-[#0D121A] hover:bg-[#151F2B] border border-[rgba(148,163,184,0.1)] transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#60A5FA]">{obj.category}</span>
                    <ArrowRightIcon className="w-3 h-3 text-[#64748B] group-hover:text-[#42D6A4] transition-colors" />
                  </div>
                  <p className="text-xs text-[#F1F5F9] font-medium mt-1">&ldquo;{obj.text}&rdquo;</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[rgba(148,163,184,0.1)] mt-4">
            <Link
              href="/objections"
              className="text-xs text-[#42D6A4] hover:underline flex items-center justify-between"
            >
              <span>Open Interactive Objection-to-Proof Engine</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
