import os
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

try:
    from services.rag_service import RAGEngine
    DATA_DIR = os.path.join(os.path.dirname(__file__), "data", "sample_documents")
    rag_engine = RAGEngine(data_dir=DATA_DIR)
except Exception:
    rag_engine = None

from services.gis_service import gis_service

app = FastAPI(
    title="Team NERO - Land Governance Policy & Simulation API",
    description="SIH 2026 Problem Statement 26019 Backend API",
    version="1.0.0"
)

# Enable CORS for React frontend (localhost:5173 / localhost:5174 / localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 3

class AskRequest(BaseModel):
    question: str

class CorridorRequest(BaseModel):
    points: List[List[float]]

@app.get("/")
def read_root():
    return {
        "status": "online",
        "team": "Team NERO",
        "sih_ps": "26019 - Land Governance Policy Research & Simulation Platform",
        "feature_1_rag": "Active" if rag_engine else "External rag_app available",
        "feature_2_gis": "Active",
        "docs_indexed": len(rag_engine.chunks) if rag_engine else 0
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "indexed_chunks": len(rag_engine.chunks) if rag_engine else 0,
        "gis_status": "ready"
    }

# Feature 1: RAG Smart Search
@app.post("/api/search")
def search_documents(req: SearchRequest):
    """Feature 1: Smart Document Search (RAG Engine API)"""
    if rag_engine:
        return rag_engine.search(query=req.query, top_k=req.top_k or 3)
    return {"results": [], "message": "Run rag_app/app.py for standalone ChromaDB RAG"}

@app.get("/api/search")
def search_documents_get(q: str = Query(..., description="Natural language search query")):
    """GET endpoint for easy testing of RAG search."""
    if rag_engine:
        return rag_engine.search(query=q, top_k=3)
    return {"results": [], "message": "Run rag_app/app.py for standalone ChromaDB RAG"}

@app.post("/ask")
def ask_rag_endpoint(req: AskRequest):
    """Fallback endpoint for DocumentSearch component"""
    return {
        "answer": "Land Governance RAG response: To execute full Gemini 2.0 Flash embeddings, verify your GEMINI_API_KEY in rag_app/.env and launch 'python rag_app/app.py'.",
        "sources": ["india_land_governance_assessment_world_bank_report.pdf", "rfctlarr_act_and_tamil_nadu_rules_compilation_2013.pdf"]
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

