# Land Governance RAG Application (SIH 2026 PS 26019)

A production-grade Retrieval-Augmented Generation (RAG) backend built for policy research on Indian land governance, DILRMP modernization, and land dispute reduction.

---

## 🛠️ Tech Stack
- **Backend Framework:** Python 3.9+ & FastAPI
- **Vector Database:** ChromaDB (Persistent local storage)
- **Embeddings:** `sentence-transformers` (`all-MiniLM-L6-v2` - 100% free & local)
- **PDF Extraction:** `pypdf`
- **LLM Generator:** Google Gemini API (`gemini-2.0-flash` free tier) via `google-generativeai` SDK
- **Environment Management:** `python-dotenv`

---

## 📂 File Structure
```
rag_app/
├── sample_docs/              # Place your PDF / TXT land policy documents here
├── ingest.py                 # Document processing & ChromaDB vector indexing script
├── app.py                    # FastAPI server exposing GET /health, GET /search, POST /ask
├── requirements.txt          # Python dependencies
├── .env.example               # Template for GEMINI_API_KEY
├── .env                      # Local environment configuration file
└── README.md                 # Setup instructions
```

---

## 🚀 Setup & Execution Guide (Step-by-Step)

### Step 1: Install Dependencies
Open terminal in the `rag_app` folder (or workspace root):

```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate        # On Mac/Linux
# OR on Windows: venv\Scripts\activate

# Install all required Python packages
pip install -r rag_app/requirements.txt
```

---

### Step 2: Configure Your Free Gemini API Key
1. Get a free API key from [Google AI Studio](https://aistudio.google.com/).
2. Open `rag_app/.env` (or copy `.env.example` to `.env`).
3. Set your key:
   ```env
   GEMINI_API_KEY=AIzaSy...your_actual_api_key...
   ```

---

### Step 3: Run Document Ingestion
Place your land governance PDF files (e.g., Punjab Land Dispute Reports, DILRMP Guidelines, RFCTLARR Act) into `rag_app/sample_docs/`. Then run:

```bash
python rag_app/ingest.py
```

You will see verbose progress messages showing:
- Which PDF file is being extracted
- Number of text chunks generated
- Embedding generation with `all-MiniLM-L6-v2`
- Saved vector index inside `rag_app/chroma_db`

---

### Step 4: Start the FastAPI Server
Run the FastAPI backend server:

```bash
python rag_app/app.py
```
> Server runs live on **`http://localhost:8000`**

---

### Step 5: Test Endpoints

#### 1. Health Check & Indexed Chunk Count
```bash
curl http://localhost:8000/health
```

#### 2. Debug Raw Vector Search (No LLM Call)
```bash
curl "http://localhost:8000/search?q=why%20do%20land%20disputes%20take%20so%20long%20in%20Punjab"
```

#### 3. Ask RAG Question (Calls Gemini API + ChromaDB)
```bash
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "Why do land disputes take so long in Punjab?"}'
```
