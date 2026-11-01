"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  HelpCircleIcon,
  CopyIcon,
  ExternalLinkIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
  ShieldCheckIcon
} from "@/components/shared/Icons";
import { analyseObjection } from "@/lib/api";
import { ObjectionAnalysisResponse } from "@/lib/types";

const PRESET_OBJECTIONS = [
  "We already use Snowflake. Why should we consider IOMETE?",
  "We cannot move sensitive data outside our infrastructure.",
  "Our cloud costs are already too high.",
  "We are concerned about vendor lock-in.",
  "We already have a working data architecture.",
  "How will migration affect our current operations?"
];

function ObjectionEngineContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q");
  const contextParam = searchParams.get("context");

  const [inputObjection, setInputObjection] = useState(
    queryParam || "We already use Snowflake. Why should we consider IOMETE?"
  );
  const [companyContext, setCompanyContext] = useState(contextParam || "Enterprise Banking / Snowflake");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ObjectionAnalysisResponse | null>(null);

  useEffect(() => {
    // Run initial analysis automatically on mount
    handleAnalyze(inputObjection, companyContext);
  }, []);

  const handleAnalyze = async (text: string, ctx?: string) => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const data = await analyseObjection(text, ctx || companyContext);
      setResult(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to analyze objection");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard!`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#42D6A4]/10 border border-[#42D6A4]/30 text-xs font-mono text-[#42D6A4] mb-2">
          <span className="w-2 h-2 rounded-full bg-[#42D6A4] animate-pulse" />
          DIFFERENTIATOR ENGINE
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#F1F5F9]">Objection-to-Proof Engine</h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Convert prospect skepticism into evidence-backed technical proof and actionable next steps.
        </p>
      </div>

      {/* Input Box & Quick Select Chips */}
      <div className="p-6 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)] space-y-4">
        <label className="block text-xs font-medium text-[#94A3B8]">
          Enter or Select Customer Objection
        </label>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inputObjection}
            onChange={(e) => setInputObjection(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAnalyze(inputObjection);
            }}
            placeholder="Type customer objection, e.g. We cannot move data out of our private cloud..."
            className="flex-1 px-4 py-2.5 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.2)] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#42D6A4]"
          />
          <button
            type="button"
            disabled={loading}
            onClick={() => handleAnalyze(inputObjection)}
            className="px-5 py-2.5 rounded-lg bg-[#42D6A4] hover:bg-[#38b88d] disabled:opacity-50 text-[#080B10] font-bold text-xs shrink-0 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-3.5 h-3.5 border-2 border-[#080B10] border-t-transparent rounded-full animate-spin" />
            ) : (
              <SparklesIcon className="w-3.5 h-3.5" />
            )}
            <span>Generate Proof</span>
          </button>
        </div>

        {/* Quick Objection Presets */}
        <div className="space-y-1.5 pt-2 border-t border-[rgba(148,163,184,0.1)]">
          <span className="text-[11px] font-mono text-[#64748B]">FREQUENT OBJECTIONS:</span>
          <div className="flex flex-wrap gap-2">
            {PRESET_OBJECTIONS.map((obj, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setInputObjection(obj);
                  handleAnalyze(obj);
                }}
                className={`text-left px-2.5 py-1.5 rounded-lg border text-xs transition-colors ${
                  inputObjection === obj
                    ? "bg-[#151F2B] border-[#42D6A4] text-[#42D6A4]"
                    : "bg-[#0D121A] border-[rgba(148,163,184,0.14)] text-[#94A3B8] hover:text-[#F1F5F9]"
                }`}
              >
                &ldquo;{obj}&rdquo;
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RESULT LAYOUT */}
      {result && (
        <div className="space-y-6">
          {/* Main Card: Category & Underlying Concern */}
          <div className="p-6 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.18)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(148,163,184,0.1)] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#60A5FA]">OBJECTION CLASSIFICATION</span>
                <h3 className="text-base font-bold text-[#F1F5F9] mt-0.5">{result.category}</h3>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#42D6A4]/10 text-[#42D6A4] border border-[#42D6A4]/25">
                {result.validation_status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.12)]">
                <span className="text-[10px] font-mono text-[#F5B942] uppercase tracking-wider">
                  Buyer&apos;s Underlying Concern
                </span>
                <p className="text-xs text-[#F1F5F9] mt-1.5 leading-relaxed">
                  {result.underlying_concern}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.12)]">
                <span className="text-[10px] font-mono text-[#60A5FA] uppercase tracking-wider">
                  Why This Matters to Deal Velocity
                </span>
                <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                  {result.why_this_matters}
                </p>
              </div>
            </div>

            {/* Relevant Capabilities */}
            <div>
              <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider">
                Relevant IOMETE Architectural Capabilities:
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.relevant_capabilities.map((cap, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-[#151F2B] text-xs font-mono text-[#42D6A4] border border-[#42D6A4]/20"
                  >
                    ✓ {cap}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Evidence & Sources Grid */}
          <div className="p-6 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)] space-y-4">
            <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.1)] pb-3">
              <h3 className="text-xs font-semibold text-[#F1F5F9]">Supporting Evidence & Official Sources</h3>
              <span className="text-[10px] font-mono text-[#42D6A4]">Verified iomete.com Links</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.supporting_evidence.map((ev, i) => (
                <div key={i} className="p-4 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.12)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#42D6A4]">{ev.id}</span>
                    <a
                      href={ev.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#60A5FA] hover:underline flex items-center gap-1"
                    >
                      <span>Read Doc</span>
                      <ExternalLinkIcon className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-[#F1F5F9] font-medium leading-snug">{ev.claim}</p>
                  <p className="text-[11px] text-[#94A3B8]">
                    <strong className="text-[#64748B]">Source:</strong> {ev.source_title}
                  </p>
                  <div className="text-[10px] text-[#F5B942]/90 pt-1 border-t border-[rgba(148,163,184,0.08)]">
                    <strong>Qualification:</strong> {ev.qualification_or_limitation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What We Still Need To Validate */}
          <div className="p-5 rounded-xl bg-[#0D121A] border border-[rgba(148,163,184,0.14)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#F5B942]">
              <AlertTriangleIcon className="w-4 h-4 text-[#F5B942]" />
              <span>What We Still Need to Validate (Honest Unknowns)</span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#94A3B8]">
              {result.limitations.map((lim, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#F5B942]">•</span>
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Sales Response (With Copy Action) */}
          <div className="p-6 rounded-xl bg-[#111923] border border-[#42D6A4]/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-[#42D6A4]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#42D6A4]">
                  Recommended Sales Response
                </h3>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(result.recommended_response, "sales response")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151F2B] hover:bg-[#1A2636] border border-[rgba(148,163,184,0.2)] text-xs text-[#F1F5F9] transition-colors"
              >
                <CopyIcon className="w-3.5 h-3.5" />
                <span>Copy Response</span>
              </button>
            </div>

            <div className="p-4 rounded-lg bg-[#080B10] border border-[rgba(148,163,184,0.1)] text-xs text-[#F1F5F9] leading-relaxed italic">
              &ldquo;{result.recommended_response}&rdquo;
            </div>

            {/* Next Sales Action */}
            <div className="p-3.5 rounded-lg bg-[#151F2B] border border-[rgba(148,163,184,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-[#60A5FA] uppercase tracking-wider">
                  Recommended Concrete Next Sales Action:
                </span>
                <p className="text-xs font-medium text-[#F1F5F9] mt-0.5">
                  {result.next_sales_action}
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(result.next_sales_action, "next sales action")}
                className="px-2.5 py-1 rounded bg-[#0D121A] text-xs text-[#94A3B8] hover:text-[#F1F5F9] shrink-0"
              >
                Copy Action
              </button>
            </div>
          </div>

          {/* Technical Discovery Questions */}
          <div className="p-6 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-[#F1F5F9]">Technical Discovery Questions</h3>
              <button
                type="button"
                onClick={() => copyToClipboard(result.discovery_questions.join("\n"), "discovery questions")}
                className="text-xs text-[#42D6A4] hover:underline flex items-center gap-1"
              >
                <CopyIcon className="w-3 h-3" />
                <span>Copy All Questions</span>
              </button>
            </div>
            <div className="space-y-2">
              {result.discovery_questions.map((q, i) => (
                <div key={i} className="p-3 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.1)] text-xs text-[#F1F5F9] flex items-start gap-2">
                  <span className="font-mono text-[#60A5FA]">{i + 1}.</span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ObjectionEnginePage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs text-[#64748B]">Loading engine...</div>}>
      <ObjectionEngineContent />
    </Suspense>
  );
}
