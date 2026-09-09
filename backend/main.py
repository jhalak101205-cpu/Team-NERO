import os
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

from services.rag_service import RAGEngine

app = FastAPI(
    title="Team NERO - Land Governance Policy & Simulation API",
    description="SIH 2026 Problem Statement 26019 Backend API",
    version="1.0.0"
)

# Enable CORS for React frontend (localhost:5173 / localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG Engine with sample documents directory
DATA_DIR = os.path.join(os.path.dirname(__file__), "data", "sample_documents")
rag_engine = RAGEngine(data_dir=DATA_DIR)

class SearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 3

@app.get("/")
def read_root():
    return {
        "status": "online",
        "team": "Team NERO",
        "sih_ps": "26019 - Land Governance Policy Research & Simulation Platform",
        "feature_1_rag": "Active",
        "docs_indexed": len(rag_engine.chunks)
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "indexed_chunks": len(rag_engine.chunks)}

@app.post("/api/search")
def search_documents(req: SearchRequest):
    """Feature 1: Smart Document Search (RAG Engine API)"""
    results = rag_engine.search(query=req.query, top_k=req.top_k or 3)
    return results

@app.get("/api/search")
def search_documents_get(q: str = Query(..., description="Natural language search query")):
    """GET endpoint for easy testing of RAG search."""
    results = rag_engine.search(query=q, top_k=3)
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
