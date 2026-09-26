# 🇮🇳 BhumiNexus
### National Digital Platform for Research, Policy Innovation & Evidence-Based Land Governance

<br>
Links of our other REPOs : 
<br>
Collaborative Space - https://github.com/padmasri-web/collaborativeSpace-
<br>
DashBoard - https://github.com/jhalak101205-cpu/SIH_Frontend
<br>

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026-orange.svg)](https://sih.gov.in/)
[![Problem Statement](https://img.shields.io/badge/Problem%20Statement-SIH26019-blue.svg)](https://sih.gov.in/)
[![Theme](https://img.shields.io/badge/Theme-Smart%20Automation-brightgreen.svg)](https://sih.gov.in/)
[![Ministry](https://img.shields.io/badge/Ministry-DoLR%20%2F%20MoRD-blue.svg)](https://dolr.gov.in/)

---

## 📌 Problem Overview

* **Problem Statement ID:** `SIH26019`
* **Title:** National Digital Platform for Research, Policy Innovation, and Evidence-Based Land Governance
* **Ministry / Department:** Ministry of Rural Development & Department of Land Resources (DoLR)
* **Category:** Software
* **Theme:** Smart Automation

### 🎯 The Challenge
India has vast volumes of land administration data — legacy cadastral maps, spatial datasets, satellite imagery, and land records under DILRMP. However, this wealth of data remains trapped in departmental silos. There is virtually no centralized, collaborative platform for researchers, policy-makers, and district administrators to evaluate land policy outcomes, predict bottlenecks, or conduct applied spatial research.

### 💡 Our Solution
**BhumiNexus** is a unified knowledge-to-policy engine. It bridges raw land governance data with actionable policy decisions through:
1. **AI Semantic Search (RAG):** Context-aware discovery across land policies, case studies, and legal frameworks.
2. **GIS Correlation Layers:** Interactive geospatial choropleths and corridor analysis connecting digitization with land litigation reduction.
3. **Evidence-Based Policy Simulator:** Machine-learning-powered "what-if" scenario analysis forecasting reform impacts before rollout.
4. **KPI-Grounded Conversational Assistant:** Fact-anchored policy chatbot preventing hallucinations.

---

## 🗺️ Architectural & Workflow Flowcharts

### 1. High-Level System Architecture Flowchart
The following flowchart illustrates the full-stack architecture connecting the React frontend, FastAPI backend services, AI RAG vector engine, and spatial GIS pipelines:

```mermaid
flowchart TD
    subgraph Frontend["🖥️ Frontend Application (React 19 + Vite + TailwindCSS)"]
        UI["BhumiNexus Core Dashboard"]
        GISComp["GIS Map Explorer (Leaflet.js + Recharts)"]
        SimComp["Policy & Route Simulator (Dynamic Sliders & Canvas)"]
        RAGComp["Document Research & Ask Bhumi AI"]
        ModalComp["SIH Architecture & Evaluator Modals"]
    end

    subgraph BackendAPI["⚙️ Backend API Gateway (FastAPI on Port 8000)"]
        Router["FastAPI Application (main.py)"]
        CORS["CORS & Network Binding (0.0.0.0)"]
        HealthRoute["/api/health & /api/gis/overview"]
        RAGRoute["/ask & /chat (RAG Engine)"]
        GISRoute["/api/gis/states, /geojson, /corridor-analysis"]
        SimRoute["/api/simulator/predict & /scenarios"]
    end

    subgraph IntelligenceLayer["🧠 Analytics & AI Engines"]
        subgraph RAGModule["RAG Semantic Search (rag_app)"]
            Embedder["Sentence-Transformers (all-MiniLM-L6-v2)"]
            ChromaDB[("ChromaDB Vector Store (Policy Chunks)")]
            LLM["Google Gemini API (Context Synthesis)"]
        end

        subgraph GISModule["GIS & Spatial Engine (services/gis_service.py)"]
            GeoJSONStore[("GeoJSON & Shapefile Layers")]
            CorridorEngine["Corridor Conflict & LULC Analyzer"]
            TemporalModel["DILRMP Digitization vs Dispute Correlation"]
        end

        subgraph SimModule["Policy Simulator (services/simulator_service.py)"]
            MLModel["Scikit-Learn Regression & Risk Model"]
            CityCoords[("National Indian City Coordinates DB")]
            SocioEconomic["Citizen Socio-Economic Impact Forecaster"]
        end
    end

    UI --> BackendAPI
    GISComp --> GISRoute
    SimComp --> SimRoute
    RAGComp --> RAGRoute
    
    RAGRoute --> RAGModule
    Embedder --> ChromaDB
    ChromaDB --> LLM
    
    GISRoute --> GISModule
    GISModule --> GeoJSONStore
    
    SimRoute --> SimModule
    SimModule --> MLModel
```

---

### 2. Ecosystem Alignment Flowchart (DoLR Cross-Platform Pipeline)
Rather than building an isolated silo, BhumiNexus acts as the analytical policy brain connecting feeds across the Department of Land Resources digital governance pipeline:

```mermaid
flowchart LR
    A["SIH26018\nLegacy Land Record OCR & Digitization"] -->|Clean Structured Records & RoRs| D["BhumiNexus (SIH26019)\nNational Research & Policy Engine"]
    B["SIH26016\nLand Acquisition & R&R Tracker"] -->|Real-time Acquisition Milestones & Awards| D
    C["SIH26015\nSRISHTI-DRISHTI Satellite Imagery"] -->|Geospatial Cadastral & Watershed Layers| D
    D --> E["🏛️ Evidence-Based Policy Directives"]
    D --> F["🧪 Predictive Infrastructure Alignment Simulations"]
    D --> G["📚 Open Policy Research Repository"]
```

---

### 3. AI Semantic Search & RAG Knowledge Flowchart
The knowledge ingestion and query synthesis pipeline powering natural language search with source citations:

```mermaid
sequenceDiagram
    autonumber
    actor Officer as 🧑‍💼 Policy Maker / Researcher
    participant UI as 💻 Document Search / Chat UI
    participant API as ⚙️ FastAPI /ask Endpoint
    participant ST as 🔤 Sentence-Transformers
    participant DB as 🗄️ ChromaDB Vector Store
    participant Gemini as 🤖 Google Gemini LLM

    Note over DB: Offline Ingestion: DILRMP Acts, RFCTLARR 2013, Land Guidelines indexed into 500-token chunks
    Officer->>UI: Submit natural language query (e.g., "RFCTLARR 2013 compensation multipliers")
    UI->>API: POST /ask { question: "..." }
    API->>ST: Generate 384-dimensional vector embedding
    ST-->>API: Dense Query Vector
    API->>DB: Query top_k=3 nearest neighbor chunks (Cosine Similarity)
    DB-->>API: Context excerpts + Source Citations + Metadata
    API->>Gemini: Prompt: Grounded Context + Question + Strict Non-Hallucination Policy
    Gemini-->>API: Synthesized Plain-Language Policy Answer
    API-->>UI: Return JSON { answer, sources: [...] }
    UI-->>Officer: Render Answer with Citation Badges & Relevance Score
```

---

### 4. GIS Spatial Correlation & Corridor Analysis Pipeline Flowchart
How geospatial land layers, digitized RoR statistics, and highway corridor conflict points are evaluated:

```mermaid
flowchart TD
    Input["User Selects State/District OR Clicks Highway Alignment Points"] --> RouteChoice{"Analysis Type?"}
    
    RouteChoice -->|Choropleth Correlation| FetchState["Query /api/gis/states & /api/gis/summary"]
    RouteChoice -->|Highway Corridor Planning| PostPoints["POST /api/gis/corridor-analysis { points: [[lat, lng], ...] }"]
    
    FetchState --> ComputeMetrics["Correlate Digitization % with Active Dispute Decline"]
    ComputeMetrics --> RenderMap["Render Leaflet Choropleth Map + LULC Donut Chart + Temporal Trend Line"]
    
    PostPoints --> SpatialIntersect["Calculate Bounding Box & Polygon Intersection across Land Banks"]
    SpatialIntersect --> ConflictScore["Determine Government Land Swap % vs Disputed Tribal/Private Parcels"]
    ConflictScore --> ReturnCorridor["Output Litigation Delay Forecast & Optimal Alignment Score"]
```

---

### 5. Predictive Policy Risk Simulator Pipeline Flowchart
Step-by-step workflow of the interactive policy sandbox simulating land acquisition timelines:

```mermaid
flowchart LR
    Sliders["Adjust Policy Levers:\n• ULPIN Saturation %\n• Vector Cadastral Maps %\n• Direct Benefit Transfer (DBT) Days\n• Social Impact Assessment (SIA) Days\n• ADR Settlement Rate %\n• Govt Land Bank Swap %"] --> Engine["simulator_service.py"]
    
    Engine --> Regression["Multivariate Regression Model\n(Trained on DoLR Acquisition Delays)"]
    
    Regression --> Out1["📊 Predicted Acquisition Timeline (Months)"]
    Regression --> Out2["⚠️ Litigation Risk Probability (%)"]
    Regression --> Out3["💰 Estimated Compensation Outlay (₹ Cr)"]
    Regression --> Out4["👥 Citizen Socio-Economic Impact Projections"]
    
    Out1 --> Visuals["Update Real-Time Policy Charts & Risk Badges in Frontend"]
    Out2 --> Visuals
    Out3 --> Visuals
    Out4 --> Visuals
```

---

### 6. User Persona Workspaces & Role Matrix
How different stakeholders utilize BhumiNexus:

```mermaid
mindmap
  root((BhumiNexus Platform))
    🏛️ Policy Makers
      Simulate acquisition reforms
      Evaluate national DILRMP KPIs
      Review inter-state benchmark rankings
    🎓 Academic Researchers
      Query semantic legal repository
      Download empirical GIS correlation datasets
      Generate academic paper citations
    🏢 District Administrators
      Track tehsil-level dispute resolution timelines
      Identify local land record bottlenecks
      Validate corridor alignment feasibility
    👥 General Citizens & Landholders
      Check ULPIN & Bhu-Aadhar verification status
      Query vernacular rights via Grounded Chatbot
      Review public compensation entitlement matrices
```

---

## 🛠️ Technology Stack

| Layer | Technologies | Justification |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, TailwindCSS, Lucide Icons | High-performance, clean UI with responsive dashboards |
| **Backend** | Python 3.10+, FastAPI, Uvicorn | Asynchronous, lightweight REST API with native AI/ML integration |
| **GIS & Mapping** | Leaflet.js, OpenStreetMap, GeoJSON | Lightweight, interactive geospatial choropleth rendering |
| **Data Visualization** | Recharts | Smooth temporal trendlines, LULC donut charts, and risk bars |
| **AI / Search** | Sentence-Transformers, ChromaDB, Gemini API | Strict fact-grounded RAG pipeline with verified source citations |
| **Simulation ML** | Scikit-learn, Pandas, NumPy | Fast, explainable regression and risk-classification models |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Git

### 1. Unified One-Click Hosting
Start both the Frontend and Backend servers with automatic port detection:

```bash
# Start on Localhost & LAN
./start_local.sh

# Stop all background services
./stop_local.sh
```

### 2. Manual Startup

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit **`http://localhost:5173`** (or your LAN IP `http://192.168.88.2:5173`) to explore the platform.

---

## 📄 License
Smart India Hackathon 2026 Open Innovation Framework / Government of India Digital Initiatives.
