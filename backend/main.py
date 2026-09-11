import os
import sys
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

# Ensure both backend/ and project root are in Python module search path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
for path in [CURRENT_DIR, PROJECT_ROOT]:
    if path not in sys.path:
        sys.path.insert(0, path)

# Safely import the production RAG engine from rag_app without modifying rag_app
try:
    import rag_app.app as rag_module
except Exception as rag_err:
    print(f"⚠️ Note: rag_app module import: {rag_err}")
    rag_module = None

from services.gis_service import gis_service
from services.simulator_service import simulator_service

app = FastAPI(
    title="Team NERO - Land Governance Policy & Simulation API",
    description="SIH 2026 Problem Statement 26019 Backend API",
    version="1.0.0"
)

# Enable CORS for React frontend (localhost:5173 / localhost:5174 / localhost:5175 / localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    """Startup hook to initialize RAG embeddings & ChromaDB connection within the unified API server."""
    if rag_module:
        try:
            rag_module.startup_event()
            print("✅ Integrated RAG Engine (ChromaDB + SentenceTransformers) initialized successfully.")
        except Exception as e:
            print(f"⚠️ RAG Engine startup initialization note: {e}")

class SearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 3

class AskRequest(BaseModel):
    question: str

class ChatRequest(BaseModel):
    question: str

class CorridorRequest(BaseModel):
    points: List[List[float]]

class SimulatorRequest(BaseModel):
    project_domain: Optional[str] = "highway"
    ulpin_pct: Optional[float] = 68.2
    vector_pct: Optional[float] = 76.5
    dbt_days: Optional[float] = 90.0
    sia_days: Optional[float] = 60.0
    adr_rate: Optional[float] = 20.0
    govt_swap_pct: Optional[float] = 10.0
    custom_budget_cr: Optional[float] = None
    custom_land_ha: Optional[float] = None
    start_city: Optional[str] = "Point A (Origin)"
    end_city: Optional[str] = "Point B (Destination)"
    start_lat: Optional[float] = 30.9010
    start_lng: Optional[float] = 75.8573
    end_lat: Optional[float] = 31.3260
    end_lng: Optional[float] = 75.5762

@app.get("/")
def read_root():
    chunk_count = 0
    if rag_module and rag_module.chroma_collection:
        try:
            chunk_count = rag_module.chroma_collection.count()
        except Exception:
            chunk_count = 0
    return {
        "status": "online",
        "team": "Team NERO",
        "sih_ps": "26019 - Land Governance Policy Research & Simulation Platform",
        "feature_1_rag": "Active" if rag_module else "Offline",
        "feature_2_gis": "Active",
        "docs_indexed": chunk_count
    }

@app.get("/health")
@app.get("/api/health")
def health_check():
    chunk_count = 0
    if rag_module and rag_module.chroma_collection:
        try:
            chunk_count = rag_module.chroma_collection.count()
        except Exception:
            chunk_count = 0
    return {
        "status": "ok",
        "indexed_chunks": chunk_count,
        "gis_status": "ready",
        "rag_status": "ready" if rag_module else "unavailable"
    }

# Feature 1: RAG Smart Search
@app.post("/api/search")
def search_documents(req: SearchRequest):
    """Feature 1: Smart Document Search (RAG Engine API)"""
    if rag_module:
        return rag_module.search_debug(q=req.query)
    return {"results": [], "message": "RAG module unavailable"}

@app.get("/search")
@app.get("/api/search")
def search_documents_get(q: str = Query(..., description="Natural language search query")):
    """GET endpoint for testing of RAG search."""
    if rag_module:
        return rag_module.search_debug(q=q)
    return {"results": [], "message": "RAG module unavailable"}

@app.post("/ask")
def ask_rag_endpoint(req: AskRequest):
    """Main RAG Endpoint: Connects DocumentSearch component directly to rag_app with ChromaDB and Gemini"""
    if rag_module:
        return rag_module.ask_question(rag_module.AskRequest(question=req.question))
    return {
        "question": req.question,
        "answer": "RAG module is not loaded. Please verify sentence-transformers and chromadb.",
        "sources": []
    }

# Feature 3: Grounded AI Chatbot Endpoint
@app.post("/chat")
@app.post("/api/chat")
def chat_endpoint(req: ChatRequest):
    """Feature 3: Grounded AI Chatbot Endpoint connected directly to rag_app fixed KPI table"""
    if rag_module and hasattr(rag_module, "chat_endpoint"):
        return rag_module.chat_endpoint(rag_module.ChatRequest(question=req.question))
    return {
        "question": req.question,
        "answer": "Chat module is not loaded.",
        "grounded_in": "fixed_kpi_table"
    }

# Feature 2: GIS Land Intelligence & Correlation Platform Endpoints
@app.get("/api/gis/national-summary")
@app.get("/api/gis/summary")
def get_gis_summary(
    state: Optional[str] = Query(None, description="State ID"),
    district: Optional[str] = Query(None, description="District ID")
):
    """Regional & National Land Cover & Modernization KPIs"""
    return gis_service.get_summary(state_id=state, district_id=district)

@app.get("/api/gis/temporal-trends")
def get_gis_temporal_trends(
    state: Optional[str] = Query(None, description="State ID (optional)"),
    district: Optional[str] = Query(None, description="District ID (optional)")
):
    """Multi-Year Historical Trend Analysis (2005-06 to 2023-24) computed dynamically from raw dataset"""
    return gis_service.get_temporal_trends(state_id=state, district_id=district)

@app.post("/api/gis/sync")
def post_gis_sync():
    """Trigger pipeline sync with National Open Data Portal"""
    return gis_service.sync_data_pipeline()

@app.get("/api/gis/states")
def get_gis_states():
    """List of all Indian states with geospatial centroids and districts"""
    return gis_service.get_states()

@app.get("/api/gis/districts")
def get_gis_districts(state: str = Query(..., description="State ID")):
    """Districts list for selected state"""
    return gis_service.get_districts_by_state(state_id=state)

@app.get("/api/gis/geojson")
def get_gis_geojson(
    level: str = Query("national", description="Level: national, state, district"),
    id: str = Query("all_india", description="Entity ID"),
    category: Optional[str] = Query(None, description="Category filter (e.g. urban, rural_agri, forest, govt_land, disputed)")
):
    """Serve GeoJSON feature collection with land use polygons and property attributes"""
    return gis_service.get_geojson(level=level, entity_id=id, category_filter=category)

@app.post("/api/gis/corridor-analysis")
def post_corridor_analysis(req: CorridorRequest):
    """Analyze proposed highway/road corridor route for government land bank vs litigation conflict"""
    return gis_service.analyze_corridor(points=req.points)

# Feature 4: Policy & Acquisition Simulator Endpoints (Dual Engine + Spatial Alignment)
@app.post("/api/simulator/predict")
def post_simulator_predict(req: SimulatorRequest):
    """Predict administrative land governance, Point A to B route alignment, and socio-economic citizen impact metrics"""
    return simulator_service.predict(
        project_domain=req.project_domain or "highway",
        ulpin_pct=req.ulpin_pct if req.ulpin_pct is not None else 68.2,
        vector_pct=req.vector_pct if req.vector_pct is not None else 76.5,
        dbt_days=req.dbt_days if req.dbt_days is not None else 90.0,
        sia_days=req.sia_days if req.sia_days is not None else 60.0,
        adr_rate=req.adr_rate if req.adr_rate is not None else 20.0,
        govt_swap_pct=req.govt_swap_pct if req.govt_swap_pct is not None else 10.0,
        custom_budget_cr=req.custom_budget_cr,
        custom_land_ha=req.custom_land_ha,
        start_city=req.start_city,
        end_city=req.end_city,
        start_lat=req.start_lat,
        start_lng=req.start_lng,
        end_lat=req.end_lat,
        end_lng=req.end_lng
    )

@app.get("/api/simulator/domains")
def get_simulator_domains():
    """List 5 diverse infrastructure policy domain options"""
    return simulator_service.get_domains()

@app.get("/api/simulator/scenarios")
def get_simulator_scenarios():
    """List pre-configured scenario templates for quick simulation"""
    return simulator_service.get_scenarios()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

