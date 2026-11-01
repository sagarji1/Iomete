"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BuildingIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowRightIcon,
  DatabaseIcon,
  CpuIcon
} from "@/components/shared/Icons";
import { fetchDemoProspects } from "@/lib/api";
import { DemoProspect } from "@/lib/types";

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<DemoProspect[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDemoProspects()
      .then((data) => setProspects(data))
      .catch((err) => console.warn("Failed to load prospects", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#42D6A4]/10 border border-[#42D6A4]/30 text-xs font-mono text-[#42D6A4] mb-2">
          <BuildingIcon className="w-3.5 h-3.5 text-[#42D6A4]" />
          PRE-SEEDED EVALUATION SCENARIOS
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#F1F5F9]">Demo Prospects Directory</h1>
        <p className="text-xs text-[#94A3B8] mt-0.5">
          Fictional enterprise profiles built to demonstrate multi-platform differentiation (Snowflake, Databricks, BigQuery) across regulated industries.
        </p>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-3.5 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.12)] text-xs text-[#94A3B8] flex items-center justify-between">
        <span>Fictional demonstration companies created for evaluation purposes. Not actual IOMETE customers.</span>
        <span className="text-[10px] font-mono text-[#60A5FA]">SAMPLE PROFILES</span>
      </div>

      {/* 3 Prospect Cards */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#64748B]">Loading demo profiles...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {prospects.map((p) => {
            const isBank = p.company_name.includes("Bank");
            const isRetail = p.company_name.includes("Retail");
            const isHealth = p.company_name.includes("Health");

            const accentColor = isBank ? "text-[#42D6A4]" : isRetail ? "text-[#60A5FA]" : "text-[#A78BFA]";
            const borderColor = isBank
              ? "border-[#42D6A4]/30 hover:border-[#42D6A4]"
              : isRetail
              ? "border-[#60A5FA]/30 hover:border-[#60A5FA]"
              : "border-[#A78BFA]/30 hover:border-[#A78BFA]";

            return (
              <div
                key={p.id}
                className={`p-6 rounded-xl bg-[#111923] border ${borderColor} flex flex-col justify-between transition-all space-y-4`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
                      {p.industry}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0D121A] text-[#94A3B8] border border-[rgba(148,163,184,0.1)]">
                      {p.approximate_data_volume}
                    </span>
                  </div>

                  <h2 className={`text-lg font-bold ${accentColor}`}>{p.company_name}</h2>

                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    {p.context_notes}
                  </p>

                  <div className="p-3 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.08)] space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Incumbent:</span>
                      <span className="text-[#F1F5F9] font-medium">{p.current_platform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Deployment:</span>
                      <span className="text-[#F1F5F9] font-medium">{p.deployment_preference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Est. Monthly Spend:</span>
                      <span className="text-[#42D6A4] font-mono font-medium">${p.monthly_infrastructure_spend.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Challenge Chips */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#64748B]">PRIMARY CHALLENGES:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {p.challenges.slice(0, 3).map((ch, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-[#151F2B] text-[10px] text-[#94A3B8]">
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[rgba(148,163,184,0.1)]">
                  <Link
                    href={`/assessments/new?preset=${p.id.replace("prospect-", "")}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#151F2B] hover:bg-[#1A2636] border border-[rgba(148,163,184,0.2)] text-xs font-semibold text-[#F1F5F9] hover:text-[#42D6A4] transition-all"
                  >
                    <SparklesIcon className="w-3.5 h-3.5 text-[#42D6A4]" />
                    <span>Run Evaluation with this Scenario</span>
                    <ArrowRightIcon className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
