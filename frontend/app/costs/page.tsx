"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import {
  DollarSignIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  HelpCircleIcon
} from "@/components/shared/Icons";
import { calculateCostScenario } from "@/lib/api";
import { CostScenarioResponse } from "@/lib/types";

function CostExplorerContent() {
  const searchParams = useSearchParams();
  const spendParam = parseFloat(searchParams.get("spend") || "60000");

  const [computeSpend, setComputeSpend] = useState<number>(spendParam * 0.65);
  const [storageSpend, setStorageSpend] = useState<number>(spendParam * 0.20);
  const [transferSpend, setTransferSpend] = useState<number>(spendParam * 0.15);
  const [licensing, setLicensing] = useState<number>(50000);
  const [staffing, setStaffing] = useState<number>(100000);
  const [offloadPct, setOffloadPct] = useState<number>(0.70);
  const [migrationCost, setMigrationCost] = useState<number>(35000);

  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState<CostScenarioResponse | null>(null);

  const runCalculation = () => {
    setLoading(true);
    calculateCostScenario({
      current_monthly_compute_spend: computeSpend,
      current_monthly_storage_spend: storageSpend,
      current_monthly_data_transfer_spend: transferSpend,
      current_annual_platform_licensing: licensing,
      current_annual_staffing_cost: staffing,
      target_workload_offload_percent: offloadPct,
      estimated_migration_cost: migrationCost
    })
      .then((res) => setScenario(res))
      .catch((err) => console.warn("Cost scenario error", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    runCalculation();
  }, [computeSpend, storageSpend, transferSpend, licensing, staffing, offloadPct, migrationCost]);

  const chartData = scenario?.breakdown.map((item) => ({
    category: item.category.split(" ")[0],
    "Current Annual": item.current_annual,
    "Proposed Lakehouse": item.proposed_annual
  })) || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#42D6A4]/10 border border-[#42D6A4]/30 text-xs font-mono text-[#42D6A4] mb-2">
          <DollarSignIcon className="w-3.5 h-3.5 text-[#42D6A4]" />
          TRANSPARENT SCENARIO MODELLING
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#F1F5F9]">Cost Explorer</h1>
        <p className="text-xs text-[#94A3B8] mt-0.5">
          Model workload compute economics based on transparent instance parameters without arbitrary blanket savings claims.
        </p>
      </div>

      {/* KPI Cards */}
      {scenario && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)]">
            <span className="text-[10px] font-mono text-[#64748B]">CURRENT ANNUAL BASELINE</span>
            <div className="text-2xl font-bold font-mono text-[#F1F5F9] mt-1.5">
              ${scenario.current_estimated_annual_cost.toLocaleString()}
            </div>
            <p className="text-[10px] text-[#94A3B8] mt-1">Sum of current compute, storage, egress & licensing</p>
          </div>

          <div className="p-5 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)]">
            <span className="text-[10px] font-mono text-[#64748B]">PROPOSED LAKEHOUSE RUN-RATE</span>
            <div className="text-2xl font-bold font-mono text-[#42D6A4] mt-1.5">
              ${scenario.proposed_estimated_annual_cost.toLocaleString()}
            </div>
            <p className="text-[10px] text-[#94A3B8] mt-1">Based on {intPct(offloadPct)}% workload offload</p>
          </div>

          <div className="p-5 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)]">
            <span className="text-[10px] font-mono text-[#64748B]">EST. ANNUAL RUN-RATE DELTA</span>
            <div className="text-2xl font-bold font-mono text-[#60A5FA] mt-1.5">
              ${scenario.annual_difference.toLocaleString()}
            </div>
            <p className="text-[10px] text-[#94A3B8] mt-1">Modeled infrastructure reduction</p>
          </div>

          <div className="p-5 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)]">
            <span className="text-[10px] font-mono text-[#64748B]">ESTIMATED BREAK-EVEN</span>
            <div className="text-2xl font-bold font-mono text-[#F5B942] mt-1.5">
              {scenario.break_even_months ? `${scenario.break_even_months} Months` : "Immediate"}
            </div>
            <p className="text-[10px] text-[#94A3B8] mt-1">Factoring ${migrationCost.toLocaleString()} pilot budget</p>
          </div>
        </div>
      )}

      {/* Inputs & Visuals Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders / Inputs Form (1 Col) */}
        <div className="p-6 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)] space-y-4">
          <div className="border-b border-[rgba(148,163,184,0.1)] pb-3">
            <h2 className="text-xs font-semibold text-[#F1F5F9] uppercase tracking-wider font-mono">
              Scenario Inputs
            </h2>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#94A3B8]">Monthly Compute Spend</span>
              <span className="font-mono text-[#F1F5F9]">${Math.round(computeSpend).toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="200000"
              step="1000"
              value={computeSpend}
              onChange={(e) => setComputeSpend(parseFloat(e.target.value))}
              className="w-full accent-[#42D6A4]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#94A3B8]">Monthly Storage Spend</span>
              <span className="font-mono text-[#F1F5F9]">${Math.round(storageSpend).toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="2000"
              max="80000"
              step="500"
              value={storageSpend}
              onChange={(e) => setStorageSpend(parseFloat(e.target.value))}
              className="w-full accent-[#42D6A4]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#94A3B8]">Monthly Data Egress / Transfer</span>
              <span className="font-mono text-[#F1F5F9]">${Math.round(transferSpend).toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="50000"
              step="500"
              value={transferSpend}
              onChange={(e) => setTransferSpend(parseFloat(e.target.value))}
              className="w-full accent-[#42D6A4]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#94A3B8]">Candidate Workload Offload</span>
              <span className="font-mono text-[#42D6A4]">{intPct(offloadPct)}%</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="1.00"
              step="0.05"
              value={offloadPct}
              onChange={(e) => setOffloadPct(parseFloat(e.target.value))}
              className="w-full accent-[#42D6A4]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#94A3B8]">One-Time Pilot & Migration Budget</span>
              <span className="font-mono text-[#F1F5F9]">${Math.round(migrationCost).toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="100000"
              step="5000"
              value={migrationCost}
              onChange={(e) => setMigrationCost(parseFloat(e.target.value))}
              className="w-full accent-[#42D6A4]"
            />
          </div>
        </div>

        {/* Recharts Bar Chart & Breakdown (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-[#F1F5F9] uppercase tracking-wider font-mono">
                Annual Cost Component Comparison ($ USD)
              </h2>
              <span className="text-[10px] font-mono text-[#64748B]">Transparent Modeling</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <XAxis dataKey="category" stroke="#64748B" fontSize={11} />
                  <YAxis
                    stroke="#64748B"
                    fontSize={11}
                    tickFormatter={(v) => `$${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0D121A",
                      borderColor: "rgba(148,163,184,0.2)",
                      borderRadius: "8px",
                      fontSize: "12px"
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Bar dataKey="Current Annual" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Proposed Lakehouse" fill="#42D6A4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sensitivity Table */}
          {scenario && (
            <div className="pt-4 border-t border-[rgba(148,163,184,0.1)] mt-4">
              <span className="text-[10px] font-mono text-[#60A5FA] uppercase tracking-wider block mb-2">
                Sensitivity to Workload Offload Ratio:
              </span>
              <div className="grid grid-cols-4 gap-2 text-center">
                {scenario.sensitivity_analysis.map((s, idx) => (
                  <div key={idx} className="p-2 rounded bg-[#0D121A] border border-[rgba(148,163,184,0.1)]">
                    <div className="text-[10px] font-mono text-[#94A3B8]">{s.offload_percent} Offload</div>
                    <div className="text-xs font-mono font-bold text-[#42D6A4] mt-0.5">
                      ${Math.round(s.annual_savings).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assumptions & Exclusions Panels */}
      {scenario && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-[#0D121A] border border-[rgba(148,163,184,0.14)] space-y-2">
            <span className="text-xs font-semibold text-[#F1F5F9] flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-[#42D6A4]" />
              <span>Explicit Financial Assumptions</span>
            </span>
            <ul className="space-y-1.5 text-xs text-[#94A3B8]">
              {scenario.assumptions.map((asm, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#42D6A4]">•</span>
                  <span>{asm}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-[#0D121A] border border-[rgba(148,163,184,0.14)] space-y-2">
            <span className="text-xs font-semibold text-[#F5B942] flex items-center gap-2">
              <AlertTriangleIcon className="w-4 h-4 text-[#F5B942]" />
              <span>Exclusions & Transparent Boundaries</span>
            </span>
            <ul className="space-y-1.5 text-xs text-[#94A3B8]">
              {scenario.limitations_and_exclusions.map((exc, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#F5B942]">•</span>
                  <span>{exc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function intPct(val: number) {
  return Math.round(val * 100);
}

export default function CostExplorerPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs text-[#64748B]">Loading Cost Explorer...</div>}>
      <CostExplorerContent />
    </Suspense>
  );
}
