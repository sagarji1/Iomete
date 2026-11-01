"use client";

import Link from "next/link";
import { SparklesIcon, ShieldCheckIcon } from "@/components/shared/Icons";

export default function Header() {
  return (
    <header className="h-16 bg-[#0D121A]/80 backdrop-blur-md border-b border-[rgba(148,163,184,0.14)] px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-[#94A3B8]">PLATFORM</span>
        <span className="text-[#64748B]">/</span>
        <span className="text-xs font-medium text-[#F1F5F9]">Sales Intelligence & Decision Platform</span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/assessments/new?preset=acme-bank"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#151F2B] hover:bg-[#1A2636] border border-[#42D6A4]/30 text-xs font-medium text-[#42D6A4] transition-colors"
        >
          <SparklesIcon className="w-3.5 h-3.5 text-[#42D6A4]" />
          <span>Demo Scenario: Acme Bank (Snowflake)</span>
        </Link>

        <Link
          href="/objections?q=We+already+use+Snowflake.+Why+should+we+consider+IOMETE%3F"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#111923] hover:bg-[#151F2B] border border-[rgba(148,163,184,0.2)] text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
        >
          <span>Objection: Snowflake?</span>
        </Link>
      </div>
    </header>
  );
}
