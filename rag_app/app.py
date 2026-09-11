import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import chromadb
import google.generativeai as genai

# 1. Load environment variables from .env file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_PATH = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=ENV_PATH)

CHROMA_DB_DIR = os.path.join(BASE_DIR, "chroma_db")
COLLECTION_NAME = "land_governance_docs"

# Initialize FastAPI application
app = FastAPI(
    title="Land Governance RAG Backend",
    description="Production RAG Backend powered by ChromaDB, SentenceTransformers, and Google Gemini API",
    version="1.0.0"
)

# 2. Configure CORS middleware so React frontend can make requests without cross-origin blocks
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and vector store
embedding_model = None
chroma_collection = None

@app.on_event("startup")
def startup_event():
    """Startup hook to load sentence-transformers embedding model and connect to persistent ChromaDB."""
    global embedding_model, chroma_collection
    
    print("==================================================")
    print("🚀 STARTING RAG BACKEND SERVER")
    print("==================================================")
    
    # Load sentence-transformers model locally
    print("🧠 Loading local sentence-transformers model ('all-MiniLM-L6-v2')...")
    embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
    print("✅ Embedding model ready.")
    
    # Connect to persistent ChromaDB collection
    print(f"🗄️ Connecting to persistent ChromaDB at '{CHROMA_DB_DIR}'...")
    if not os.path.exists(CHROMA_DB_DIR):
        os.makedirs(CHROMA_DB_DIR, exist_ok=True)
        
    chroma_client = chromadb.PersistentClient(path=CHROMA_DB_DIR)
    chroma_collection = chroma_client.get_or_create_collection(name=COLLECTION_NAME)
    print(f"✅ Connected to collection '{COLLECTION_NAME}' (Indexed Chunks: {chroma_collection.count()}).")
    print("==================================================")

# Pydantic schema for POST /ask request body
class AskRequest(BaseModel):
    question: str

@app.get("/")
@app.get("/health")
def health_check():
    """Health check endpoint displaying server status and total indexed chunks count."""
    chunk_count = chroma_collection.count() if chroma_collection else 0
    return {
        "status": "healthy",
        "collection": COLLECTION_NAME,
        "indexed_chunks": chunk_count,
        "message": "Land Governance RAG Server is running cleanly."
    }

@app.get("/search")
def search_debug(q: str = Query(..., description="Query string for raw semantic vector retrieval")):
    """
    Debug GET endpoint: Returns raw top-3 matching chunks from ChromaDB with distance scores and filenames.
    No LLM call is made here; useful for testing retrieval accuracy.
    """
    if not chroma_collection or chroma_collection.count() == 0:
        raise HTTPException(
            status_code=400,
            detail="No document chunks currently indexed in ChromaDB. Please run 'python ingest.py' first."
        )

    # Convert query into embedding vector
    query_vector = embedding_model.encode([q])[0].tolist()

    # Query ChromaDB collection
    results = chroma_collection.query(
        query_embeddings=[query_vector],
        n_results=min(3, chroma_collection.count())
    )

    retrieved_chunks = []
    if results and results.get("documents") and results["documents"][0]:
        docs = results["documents"][0]
        metas = results["metadatas"][0]
        distances = results["distances"][0] if "distances" in results else [0.0] * len(docs)

        for doc, meta, dist in zip(docs, metas, distances):
            retrieved_chunks.append({
                "source": meta.get("source", "unknown"),
                "chunk_id": meta.get("chunk_id", 0),
                "distance": round(dist, 4),
                "text": doc
            })

    return {
        "query": q,
        "results_count": len(retrieved_chunks),
        "chunks": retrieved_chunks
    }

@app.post("/ask")
def ask_question(request: AskRequest):
    """
    Main RAG Endpoint:
    1. Embeds question with sentence-transformers.
    2. Retrieves top 3 matching chunks from ChromaDB.
    3. Formats prompt context.
    4. Invokes Google Gemini API (gemini-2.0-flash) using google.generativeai SDK.
    5. Returns JSON: {"question": ..., "answer": ..., "sources": [...]}
    """
    question = request.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question string cannot be empty.")

    if not chroma_collection or chroma_collection.count() == 0:
        raise HTTPException(
            status_code=400,
            detail="No documents indexed in ChromaDB collection. Please add PDFs to sample_docs/ and run 'python ingest.py' first."
        )

    # 1. Retrieve Gemini API Key from environment (reload .env dynamically if changed)
    load_dotenv(dotenv_path=ENV_PATH, override=True)
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key or gemini_api_key.strip() == "" or gemini_api_key == "your_gemini_api_key_here":
        raise HTTPException(
            status_code=400,
            detail="GEMINI_API_KEY is not configured. Please set your Gemini API key in rag_app/.env"
        )

    # 2. Embed user question
    query_vector = embedding_model.encode([question])[0].tolist()

    # 3. Retrieve top 3 matching document chunks from ChromaDB
    results = chroma_collection.query(
        query_embeddings=[query_vector],
        n_results=min(3, chroma_collection.count())
    )

    retrieved_texts = []
    sources_set = set()

    if results and results.get("documents") and results["documents"][0]:
        docs = results["documents"][0]
        metas = results["metadatas"][0]
        for doc, meta in zip(docs, metas):
            source_file = meta.get("source", "Unknown Document")
            sources_set.add(source_file)
            retrieved_texts.append(f"[Source: {source_file}]\n{doc}")

    if not retrieved_texts:
        return {
            "question": question,
            "answer": "I don't have that information in the provided documents.",
            "sources": []
        }

    context_str = "\n\n---\n\n".join(retrieved_texts)

    # 4. Configure Google Gemini API SDK
    try:
        genai.configure(api_key=gemini_api_key)
        
        # System instruction enforcing strict grounding
        system_instruction = (
            "You are an expert land governance policy research assistant. "
            "Answer the user's question strictly using ONLY the provided context excerpts from land governance documents. "
            "If the provided context does not contain enough information to answer the question, state honestly: "
            "'I don't have that information in the provided documents.'"
        )

        prompt = f"{system_instruction}\n\nCONTEXT EXCERPTS:\n{context_str}\n\nUSER QUESTION: {question}\n\nANSWER:"

        # Call Gemini model (gemini-3.6-flash with fallback to gemini-2.5-flash / gemini-flash-latest)
        try:
            model = genai.GenerativeModel("gemini-3.6-flash")
            response = model.generate_content(prompt)
        except Exception as model_err:
            print(f"⚠️ gemini-3.6-flash fallback: {model_err}")
            try:
                model = genai.GenerativeModel("gemini-2.5-flash")
                response = model.generate_content(prompt)
            except Exception:
                model = genai.GenerativeModel("gemini-flash-latest")
                response = model.generate_content(prompt)

        
        answer_text = response.text.strip() if response and response.text else "No answer generated by Gemini API."

        return {
            "question": question,
            "answer": answer_text,
            "sources": sorted(list(sources_set))
        }

    except Exception as e:
        print(f"❌ Gemini API Error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Google Gemini API error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
