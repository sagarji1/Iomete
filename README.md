# IOMETE PROOF (v2) — Don't Pitch. Prove.
> **AI-Powered Enterprise Sales Intelligence & Product Experience Platform**  
> *Master Build Prompt v2 — HackCBS MVP Spec*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)](https://iomete-six.vercel.app/)
[![API Backend](https://img.shields.io/badge/API%20Live-Render-46E3B7?logo=render)](https://iomete.onrender.com/docs)
[![Python Tests](https://img.shields.io/badge/pytest-10%20passed-brightgreen)](#)
[![Next.js](https://img.shields.io/badge/Next.js-16%20Turbopack-black)](#)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688)](#)
[![Database](https://img.shields.io/badge/Datastore-Neon%20Serverless%20Postgres-00E599)](#)

* **Live Frontend Web App**: [https://iomete-six.vercel.app/](https://iomete-six.vercel.app/)
* **Live Backend API**: [https://iomete.onrender.com/](https://iomete.onrender.com/)
* **Interactive API Docs (Swagger)**: [https://iomete.onrender.com/docs](https://iomete.onrender.com/docs)

---

## 1. Executive Summary & Product Vision

IOMETE is an enterprise data lakehouse platform. Its prospects are usually already running Snowflake, Databricks, or BigQuery. The barrier to an enterprise sale isn't a missing feature — it's that enterprise buyers can't easily tell:
- Why IOMETE is relevant to **their business specifically**,
- How it relates to **their existing architecture**,
- Whether it improves **their cost structure**,
- Whether its deployment model matches their **security and data-sovereignty needs**,
- What the **practical next step** should be.

Generic pitch decks and generic chatbots don't demonstrate relevance — they just restate features. **IOMETE PROOF** turns a prospect's stated business problems into a **personalised, evidence-backed IOMETE evaluation**, so the buyer convinces themselves using sourced facts rather than sales language.

**Primary workflow**: `Overview` $\rightarrow$ `Company Assessment` $\rightarrow$ `Fit Analysis results` $\rightarrow$ `Comparison Matrix` $\rightarrow$ `Objection-to-Proof` $\rightarrow$ `Cost Explorer` $\rightarrow$ `Customer Report`.

---

## 2. Alignment with Non-Negotiable Judging Rubric (§2)

| Criterion | Weight | What to Prove | How IOMETE PROOF (v2) Implements It |
| :--- | :---: | :--- | :--- |
| **Practical Impact** | **35%** | Removes a real step from enterprise sales | Replaces weeks of qualification calls with a scoped evaluation recommending a zero-risk **side-by-side coexistence pilot** on heavy workloads. |
| **Buyer Clarity** | **25%** | A stranger understands the result & next action | Explainable scoring factors, tailored stakeholder lenses (CTO, CIO, CFO, CISO), and clear recommended next sales actions. |
| **Accuracy** | **25%** | Sourced claims, visible assumptions, unknowns admitted | 100% sourced from official `iomete.com` documentation and public competitor citations (`competitor_registry.json`). Zero invented benchmarks. Honest flags when data requires contract review. |
| **Working Execution** | **15%** | One complete workflow actually runs, end to end | Live Next.js 16 + FastAPI + SQLite stack, 10/10 passing tests, zero dead buttons or broken links. |

---

## 3. "Precision Instrument" Visual Design (§4)

Inspired by Phenomenon Studio's BioForge biotech aesthetic — biotech-grade precision applied to an enterprise data platform:
- **Colour Tokens**: Background `#080B10` · Secondary `#0D121A` · Sidebar `#0A0F16` · Card `#111923` · Elevated `#151F2B` · Text Primary `#F1F5F9` · Text Secondary `#94A3B8` · Text Muted `#64748B` · Accent Primary `#42D6A4` (lab-verified indicator) · Accent Secondary `#60A5FA` · Border `rgba(148,163,184,0.14)`.
- **Typography**: Strict **Geist Mono** for every number, spec, metric, currency, and evidence ID. Interface text in Inter/Geist Sans.
- **Blueprint Grid Texture**: Low-opacity dot grid on large empty backgrounds (`bg-blueprint-grid`).
- **Corner-Bracket Module Headers**: Framing modules with industrial corner brackets (`.corner-bracket`).
- **Schematic Connector Lines**: Thin right-angled pipeline visual linking workflow steps (`01. Prospect` $\rightarrow$ `02. Assessment` $\rightarrow$ `03. Fit` $\rightarrow$ `04. Comparison` $\rightarrow$ `05. Proof` $\rightarrow$ `06. Recommend`).
- **Restrained Motion**: Subtle 8px slides and fades without distracting bounce effects.

---

## 4. Key Modules & Differentiators

### 1. Command Centre (`/`)
- Real-time pipeline visual and aggregate metrics (assessments completed, strong-fit prospects, discovery required).
- Quick loader for demo scenarios (**Acme Bank**, **Nova Retail**, **Vertex Health**).

### 2. Company Assessment Wizard (`/assessments/new`)
- 5-step guided wizard: Company Profile, Current Data Environment, Business Challenges (multi-select + free text), Stakeholder Priorities (CTO, CIO, CFO, CISO, Data Eng Head), and Execution state.

### 3. Core Engine: IOMETE Fit Analysis (`/assessments/[id]`)
- Explainable classification: *Strong potential fit*, *Potential fit*, *Discovery required*, *Insufficient evidence*.
- Matched business requirements against official IOMETE capabilities with full source references.
- Honest limitations, missing info alerts, and technical discovery call questions.

### 4. Comparison Matrix Engine (`/comparison`) — *New Core Differentiator (§7)*
- Compares IOMETE head-to-head against incumbent platforms (**Snowflake**, **Databricks**, **Google BigQuery**) across the prospect's top 3 selected priorities.
- Uses public, verified citations from `competitor_registry.json`.
- Displays *context over verdicts*: no automated "IOMETE wins" badges or fake star ratings.
- Unverified items explicitly marked: `"Not independently verified — confirm with the prospect's current contract"`.

### 5. Objection-to-Proof Engine (`/objections`)
- Real-time objection resolver grounding responses in official documentation.
- Maps buyer objection to underlying concern, relevant capability, qualification, and concrete next sales action.
- "Copy response" and "Generate technical discovery questions" actions.

### 6. Architecture Studio (`/architecture`) — P1
- Interactive **React Flow** architecture canvas showing data sources, ingestion, object storage, Apache Iceberg, Apache Spark, SQL analytics, and BI tools.
- Live toggle between *Current State* and *Proposed IOMETE Architecture*.

### 7. Cost Explorer (`/costs`)
- Transparent workload economics calculator with Recharts visualization.
- Sensitivity analysis across offload percentages, break-even timeline, and assumptions/exclusions panel.

### 8. Customer Report (`/reports/[id]`)
- Executive-ready printable and PDF-exportable document containing company profile, fit analysis, verified evidence, embedded Comparison Matrix rows, architecture overview, and commercial disclaimer.

---

## 5. Technology Stack & Project Structure

```
iomete/
├── backend/
│   ├── app/
│   │   ├── api/routes/          # health, assessments, comparison, objections, evidence, architecture, cost, reports
│   │   ├── core/                # config, database, security
│   │   ├── data/                # seed_evidence.json, competitor_registry.json, demo_prospects.json
│   │   ├── models/              # assessment.py, evidence.py, prospect.py
│   │   ├── schemas/             # assessment.py, comparison.py, objection.py, cost.py
│   │   ├── services/            # assessment_engine, comparison_engine, objection_engine, evidence_service, cost_service, ai_provider, report_service
│   │   └── main.py
│   ├── tests/
│   │   ├── test_api.py          # Deterministic engine tests (9 tests)
│   │   └── test_golden_path.py  # End-to-end golden path workflow test
│   ├── pytest.ini
│   └── requirements.txt
└── frontend/
    ├── app/                     # App Router pages: /, /assessments, /comparison, /objections, /architecture, /costs, /evidence, /reports
    ├── components/              # Precision UI components (layout, shared, icons)
    ├── lib/                     # api.ts, types.ts
    ├── globals.css              # BioForge precision tokens & blueprint grid
    └── package.json
```

---

## 6. Local Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+ & npm

### Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate      # Windows (or: source venv/bin/activate on Linux/macOS)
pip install -r requirements.txt
pytest -v                    # Verify 10/10 tests pass
uvicorn app.main:app --host 127.0.0.1 --port 8000
```
Backend API docs available at: `http://127.0.0.1:8000/docs`

### Frontend Setup
```bash
cd frontend
npm install
npm run build
npm run start -- -p 3000
```
Application accessible at: `http://localhost:3000`

---

## 7. Final Hackathon Demonstration Script (2–3 Minutes) (§18)

> **Persona**: A bank (**Acme Bank**) currently on **Snowflake**, worried about escalating cloud cost, data sovereignty, and vendor lock-in. The judge plays the prospective customer.

1. **Enter Acme Bank's Profile**:
   - Go to `http://localhost:3000/assessments/new`.
   - Click **"Load Acme Bank Demo Scenario"** to instantly populate realistic inputs (120 TB, On-Premises/Private Cloud, Snowflake).
2. **Generate the Fit Analysis**:
   - Step through the wizard and click **"Generate Fit Analysis"**.
   - Show the calculated **"Strong potential fit"** classification with explainable scoring factors and matched capabilities.
3. **Open the Comparison Matrix**:
   - Navigate to `/comparison` or click the embedded card in the Fit Analysis.
   - Select priorities: **"Data sovereignty & deployment control"**, **"Vendor lock-in / portability"**, **"Cost predictability"**.
   - Review the sourced, row-by-row comparison against Snowflake.
4. **Open the Supporting Evidence Links**:
   - Click the evidence badges (e.g., `EVD-IOM-05: Sovereign Lakehouse Proof at Scale`) to demonstrate grounded documentation.
5. **Enter Customer Objection**:
   - Navigate to `/objections`.
   - Submit: *"We already use Snowflake. Why should we consider IOMETE?"*
6. **Show Evidence-Backed Response & Unresolved Questions**:
   - Observe the classified underlying concern, verified evidence, honest unresolved technical questions, and click **"Copy Response"**.
7. **Open Conceptual Architecture**:
   - Navigate to `/architecture` to see the React Flow lakehouse diagram responding to on-premises deployment.
8. **Run the Cost Explorer**:
   - Navigate to `/costs`, view the workload offload slider, Recharts graph, and review the transparent assumptions panel.
9. **Generate Customer Report**:
   - Navigate to `/reports/[id]` to view the unified executive document containing Fit + Comparison Matrix + Cost + Evidence. Click **"Print / Save as PDF"**.
10. **Close on Recommended Next Sales Action**:
    - Highlight the recommended next step: **"Propose a 30-day side-by-side coexistence pilot on non-critical batch analytics."**

**End on**: *IOMETE PROOF — Don't Pitch. Prove.*
