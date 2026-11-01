"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  Node,
  Edge
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  CpuIcon,
  ShieldCheckIcon,
  DatabaseIcon,
  LayersIcon,
  AlertTriangleIcon
} from "@/components/shared/Icons";
import { generateArchitecture } from "@/lib/api";
import { ArchitectureResponse } from "@/lib/types";

// Custom Node Component styled for dark enterprise UI
function EnterpriseNode({ data }: { data: any }) {
  const isIomete = data.type === "iomete";
  const isStorage = data.type === "storage" || data.type === "iceberg";
  const isProprietary = data.type === "proprietary";

  return (
    <div
      className={`px-4 py-3 rounded-xl border shadow-lg min-w-[180px] max-w-[220px] transition-all ${
        isIomete
          ? "bg-[#151F2B] border-[#42D6A4] shadow-[#42D6A4]/15"
          : isStorage
          ? "bg-[#111923] border-[#60A5FA]/60"
          : isProprietary
          ? "bg-[#1C1417] border-[#F87171]/50"
          : "bg-[#111923] border-[rgba(148,163,184,0.2)]"
      }`}
    >
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-[#64748B] border-none" />
      <div className="flex items-center gap-1.5 mb-1">
        <span
          className={`w-2 h-2 rounded-full ${
            isIomete
              ? "bg-[#42D6A4] animate-pulse"
              : isStorage
              ? "bg-[#60A5FA]"
              : isProprietary
              ? "bg-[#F87171]"
              : "bg-[#94A3B8]"
          }`}
        />
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8]">
          {data.type || "Component"}
        </span>
      </div>
      <div className="text-xs font-bold text-[#F1F5F9] leading-tight">{data.label}</div>
      <div className="text-[10px] text-[#64748B] font-mono mt-0.5 truncate">{data.sublabel}</div>
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-[#64748B] border-none" />
    </div>
  );
}

function ArchitectureStudioContent() {
  const searchParams = useSearchParams();
  const deployParam = searchParams.get("deploy") || "On-premises";
  const platParam = searchParams.get("plat") || "Snowflake";

  const [deploymentPreference, setDeploymentPreference] = useState(deployParam);
  const [currentPlatform, setCurrentPlatform] = useState(platParam);
  const [activeTab, setActiveTab] = useState<"proposed" | "current">("proposed");
  const [diagramData, setDiagramData] = useState<ArchitectureResponse | null>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const nodeTypes = useMemo(() => ({ customNode: EnterpriseNode }), []);

  useEffect(() => {
    generateArchitecture(deploymentPreference, currentPlatform)
      .then((res) => {
        setDiagramData(res);
        // Default select the IOMETE node
        const defaultNode = res.proposed_lakehouse.nodes.find((n: any) => n.id === "iomete-platform");
        setSelectedNode(defaultNode || res.proposed_lakehouse.nodes[0]);
      })
      .catch((err) => console.warn("Architecture fetch error", err));
  }, [deploymentPreference, currentPlatform]);

  const nodes = useMemo(() => {
    if (!diagramData) return [];
    return activeTab === "proposed" ? diagramData.proposed_lakehouse.nodes : diagramData.current_state.nodes;
  }, [diagramData, activeTab]);

  const edges = useMemo(() => {
    if (!diagramData) return [];
    return activeTab === "proposed" ? diagramData.proposed_lakehouse.edges : diagramData.current_state.edges;
  }, [diagramData, activeTab]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Title & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#42D6A4]/10 border border-[#42D6A4]/30 text-xs font-mono text-[#42D6A4] mb-2">
            <CpuIcon className="w-3.5 h-3.5 text-[#42D6A4]" />
            INTERACTIVE REACT FLOW STUDIO
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F1F5F9]">Architecture Studio</h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Visualize decoupled lakehouse topology and data flows tailored to deployment preferences.
          </p>
        </div>

        {/* Current vs Proposed Switcher */}
        <div className="flex items-center p-1 rounded-lg bg-[#111923] border border-[rgba(148,163,184,0.18)]">
          <button
            type="button"
            onClick={() => setActiveTab("current")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "current"
                ? "bg-[#1C1417] text-[#F87171] border border-[#F87171]/40"
                : "text-[#94A3B8] hover:text-[#F1F5F9]"
            }`}
          >
            Current Siloed State ({currentPlatform})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("proposed")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "proposed"
                ? "bg-[#151F2B] text-[#42D6A4] border border-[#42D6A4]/40"
                : "text-[#94A3B8] hover:text-[#F1F5F9]"
            }`}
          >
            Proposed IOMETE Lakehouse
          </button>
        </div>
      </div>

      {/* Deployment Parameter Bar */}
      <div className="p-4 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono text-[#64748B]">DEPLOYMENT FOOTPRINT:</span>
          {["On-premises", "Private Cloud", "Hybrid"].map((pref) => (
            <button
              key={pref}
              type="button"
              onClick={() => setDeploymentPreference(pref)}
              className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                deploymentPreference === pref
                  ? "bg-[#42D6A4]/15 border-[#42D6A4] text-[#42D6A4]"
                  : "bg-[#0D121A] border-[rgba(148,163,184,0.15)] text-[#94A3B8]"
              }`}
            >
              {pref}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#64748B]">INCUMBENT:</span>
          <select
            value={currentPlatform}
            onChange={(e) => setCurrentPlatform(e.target.value)}
            className="px-2.5 py-1 rounded bg-[#0D121A] border border-[rgba(148,163,184,0.2)] text-xs text-[#F1F5F9]"
          >
            <option value="Snowflake">Snowflake</option>
            <option value="Databricks">Databricks</option>
            <option value="Google BigQuery">Google BigQuery</option>
          </select>
        </div>
      </div>

      {/* Canvas & Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* React Flow Canvas (3 Cols) */}
        <div className="lg:col-span-3 h-[520px] rounded-xl bg-[#080B10] border border-[rgba(148,163,184,0.18)] relative overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={(_, node) => setSelectedNode(node)}
            fitView
            attributionPosition="bottom-left"
          >
            <Background color="#1E293B" gap={20} size={1} />
            <Controls className="bg-[#111923] border border-[rgba(148,163,184,0.2)] fill-[#94A3B8] rounded" />
          </ReactFlow>

          {/* Canvas Floating Badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#0D121A]/90 backdrop-blur border border-[rgba(148,163,184,0.15)] text-[10px] font-mono text-[#94A3B8]">
            {activeTab === "proposed" ? "PROPOSED EVALUATION ARCHITECTURE" : "INCUMBENT CLOSED SILO"}
          </div>
        </div>

        {/* Selected Component Inspector Panel (1 Col) */}
        <div className="p-5 rounded-xl bg-[#111923] border border-[rgba(148,163,184,0.14)] flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#60A5FA] mb-1">
              Component Inspector
            </div>
            <h3 className="text-sm font-bold text-[#F1F5F9]">
              {selectedNode?.data?.label || "Select a node"}
            </h3>
            <p className="text-[11px] text-[#64748B] font-mono mt-0.5">
              {selectedNode?.data?.sublabel || "Click any node in the diagram to view technical specs"}
            </p>

            <div className="p-3.5 rounded-lg bg-[#0D121A] border border-[rgba(148,163,184,0.1)] mt-4 text-xs text-[#94A3B8] leading-relaxed">
              {selectedNode?.data?.description || "Visual data pipeline flow details appear here."}
            </div>
          </div>

          <div className="pt-4 border-t border-[rgba(148,163,184,0.1)] mt-4 space-y-2 text-[11px] text-[#64748B]">
            <div>Storage Format: <span className="text-[#F1F5F9]">Apache Iceberg / Parquet</span></div>
            <div>Query Protocol: <span className="text-[#F1F5F9]">ANSI SQL / Spark JDBC</span></div>
            <div>Isolation: <span className="text-[#42D6A4]">Customer Kubernetes Boundary</span></div>
          </div>
        </div>
      </div>

      {/* Mandatory Conceptual Disclaimer */}
      <div className="p-4 rounded-xl bg-[#0D121A] border border-[rgba(148,163,184,0.14)] text-xs text-[#94A3B8] flex items-start gap-3">
        <AlertTriangleIcon className="w-4 h-4 text-[#F5B942] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#F1F5F9]">Reference Architecture Disclaimer:</strong>{" "}
          This visual represents a conceptual reference architecture for evaluation purposes.
          It does not imply an automatically validated production deployment.
          Final network topology, storage IOPS, and Kubernetes sizing must be reviewed during technical discovery.
        </div>
      </div>
    </div>
  );
}

export default function ArchitectureStudioPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs text-[#64748B]">Loading Architecture Studio...</div>}>
      <ArchitectureStudioContent />
    </Suspense>
  );
}
