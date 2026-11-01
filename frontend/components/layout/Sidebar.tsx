"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayersIcon,
  ShieldCheckIcon,
  BarChart3Icon,
  CpuIcon,
  DollarSignIcon,
  FileTextIcon,
  BuildingIcon,
  HelpCircleIcon,
  GitCompareIcon
} from "@/components/shared/Icons";

const navItems = [
  { name: "Overview", href: "/", icon: LayersIcon },
  { name: "New Assessment", href: "/assessments/new", icon: ShieldCheckIcon },
  { name: "Comparison Matrix", href: "/comparison", icon: GitCompareIcon },
  { name: "Objection-to-Proof", href: "/objections", icon: HelpCircleIcon },
  { name: "Cost Explorer", href: "/costs", icon: DollarSignIcon },
  { name: "Evidence Library", href: "/evidence", icon: FileTextIcon },
  { name: "Architecture Studio", href: "/architecture", icon: CpuIcon },
  { name: "Prospects", href: "/prospects", icon: BuildingIcon },
];


export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0A0F16] border-r border-[rgba(148,163,184,0.14)] flex flex-col shrink-0 min-h-screen z-20">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-[rgba(148,163,184,0.12)]">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <span className="text-[#42D6A4] font-bold text-sm tracking-wider">IO</span>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm tracking-tight text-[#F1F5F9]">IOMETE</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#42D6A4]/15 text-[#42D6A4] border border-[#42D6A4]/30">
              PROOF
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] font-mono">Don&apos;t Pitch. Prove.</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#64748B]">
          Decision Engines
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#151F2B] text-[#42D6A4] border border-[#42D6A4]/25 shadow-sm"
                  : "text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#111923]"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#42D6A4]" : "text-[#64748B]"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Status Footer */}
      <div className="p-4 border-t border-[rgba(148,163,184,0.12)] bg-[#080B10]/50 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#64748B]">Engine</span>
          <span className="flex items-center gap-1.5 text-[#42D6A4] font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#42D6A4] animate-pulse" />
            Deterministic
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#64748B]">Evidence Grounding</span>
          <span className="text-[#94A3B8] font-mono text-[10px]">iomete.com 100%</span>
        </div>
      </div>
    </aside>
  );
}
