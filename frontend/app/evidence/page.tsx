"use client";

import { useState, useEffect } from "react";
import {
  FileTextIcon,
  ExternalLinkIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  CheckCircleIcon
} from "@/components/shared/Icons";
import { fetchEvidence } from "@/lib/api";
import { EvidenceItem } from "@/lib/types";

export default function EvidenceLibraryPage() {
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeItem, setActiveItem] = useState<EvidenceItem | null>(null);

  useEffect(() => {
    fetchEvidence()
      .then((data) => {
        setEvidenceList(data);
        if (data.length > 0) setActiveItem(data[0]);
      })
      .catch((err) => console.warn("Evidence fetch error", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    "All",
    "Open Architecture",
    "Data Sovereignty",
    "On-premises Deployment",
    "Cost Optimisation",
    "Governance and Security",
    "Apache Spark & Performance",
    "Architecture Migration",
    "Analytics and AI"
  ];

  const filtered = evidenceList.filter((item) => {
    const matchesCat = selectedCategory === "All" || item.capability_category === selectedCategory;
    const matchesQuery =
      searchQuery === "" ||
      item.claim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#42D6A4]/10 border border-[#42D6A4]/30 text-xs font-mono text-[#42D6A4] mb-2">
          <ShieldCheckIcon className="w-3.5 h-3.5 text-[#42D6A4]" />
          ACCURACY & AUDIT TRAILS
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#F1F5F9]">Evidence Library</h1>
        <p className="text-xs text-[#94A3B8] mt-0.5">
          Structured, verified capability claims referenced from official IOMETE technical documentation and architectural whitepapers.
        </p>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="p-4 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)] space-y-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search claims, formats (Iceberg, Spark, Sovereignty), or evidence IDs..."
          className="w-full px-4 py-2 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.2)] text-xs text-[#F1F5F9] focus:outline-none focus:border-[#42D6A4]"
        />

        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-[#42D6A4]/15 border border-[#42D6A4] text-[#42D6A4]"
                  : "bg-[#0D121A] border border-[rgba(148,163,184,0.14)] text-[#94A3B8] hover:text-[#F1F5F9]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: List (Left) + Detail View (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evidence List (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <div className="py-12 text-center text-xs text-[#64748B]">Loading evidence registry...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#94A3B8]">No matching claims found.</div>
          ) : (
            filtered.map((item) => {
              const isSelected = activeItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#151F2B] border-[#42D6A4] shadow-sm"
                      : "bg-[#111923] border-[rgba(148,163,184,0.12)] hover:border-[rgba(148,163,184,0.25)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-[#42D6A4]">{item.id}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0D121A] text-[#60A5FA] border border-[rgba(148,163,184,0.15)]">
                      {item.capability_category}
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold text-[#F1F5F9] leading-snug">{item.claim}</h3>
                  <p className="text-[11px] text-[#94A3B8] mt-1 line-clamp-2">{item.description}</p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-[rgba(148,163,184,0.08)] text-[10px] text-[#64748B]">
                    <span>Source: {item.source_title}</span>
                    <span className="text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Verified
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detail Panel (1 Col) */}
        <div className="p-6 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)] space-y-4 lg:sticky lg:top-24 h-fit">
          {activeItem ? (
            <>
              <div className="border-b border-[rgba(148,163,184,0.1)] pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#42D6A4]">{activeItem.id}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-[#42D6A4] border border-emerald-500/20">
                    Official Sourced
                  </span>
                </div>
                <h2 className="text-sm font-bold text-[#F1F5F9] mt-2 leading-snug">{activeItem.claim}</h2>
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider">
                  Technical Specification:
                </span>
                <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                  {activeItem.description}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.1)] space-y-1">
                <span className="text-[10px] font-mono text-[#F5B942] uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangleIcon className="w-3 h-3 text-[#F5B942]" />
                  Explicit Qualification:
                </span>
                <p className="text-xs text-[#94A3B8]">
                  {activeItem.qualification_or_limitation}
                </p>
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-[#64748B]">Source Reference:</div>
                <div className="font-medium text-[#F1F5F9]">{activeItem.source_title}</div>
                <a
                  href={activeItem.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#42D6A4] hover:underline pt-1"
                >
                  <span>Open Official Documentation</span>
                  <ExternalLinkIcon className="w-3 h-3" />
                </a>
              </div>

              <div className="pt-2 text-[10px] font-mono text-[#64748B]">
                Last Verified: {activeItem.last_verified_date}
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-xs text-[#64748B]">
              Select any claim from the library to view audit details and official URL references.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
