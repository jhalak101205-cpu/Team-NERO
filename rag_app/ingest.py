import os
import glob
import re
from typing import List, Dict, Any
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
import chromadb

# Define directory paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SAMPLE_DOCS_DIR = os.path.join(BASE_DIR, "sample_docs")
CHROMA_DB_DIR = os.path.join(BASE_DIR, "chroma_db")
COLLECTION_NAME = "land_governance_docs"

def extract_text_from_pdf(pdf_path: str) -> str:
    """Reads a PDF file using pypdf and extracts all textual content."""
    text = ""
    try:
        reader = PdfReader(pdf_path)
        for page_num, page in enumerate(reader.pages):
            page_text = page.extract_text()
            if page_text:
                text += f"\n--- Page {page_num + 1} ---\n" + page_text
    except Exception as e:
        print(f"❌ Error reading PDF {pdf_path}: {e}")
    return text

def extract_text_from_file(file_path: str) -> str:
    """Helper to extract text from PDF or TXT files."""
    if file_path.lower().endswith(".pdf"):
        return extract_text_from_pdf(file_path)
    elif file_path.lower().endswith(".txt"):
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    return ""

def split_text_into_chunks(text: str, chunk_size_words: int = 300, overlap_words: int = 50) -> List[str]:
    """
    Splits long document text into overlapping paragraph chunks.
    ~300 words per chunk with ~50 words overlap to preserve context across boundaries.
    """
    words = text.split()
    if not words:
        return []

    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size_words
        chunk_words = words[start:end]
        chunk_text = " ".join(chunk_words).strip()
        if chunk_text:
            chunks.append(chunk_text)
        start += (chunk_size_words - overlap_words)

    return chunks

def run_ingestion():
    """Main ingestion workflow: PDF extraction -> Chunking -> Embedding -> ChromaDB Indexing."""
    print("==================================================")
    print("🚀 LAND GOVERNANCE DOCUMENT INGESTION PIPELINE")
    print("==================================================")

    # 1. Ensure sample_docs folder exists
    if not os.path.exists(SAMPLE_DOCS_DIR):
        os.makedirs(SAMPLE_DOCS_DIR, exist_ok=True)
        print(f"📁 Created directory: {SAMPLE_DOCS_DIR}")

    # 2. Find all PDF and TXT files in sample_docs/
    pdf_files = glob.glob(os.path.join(SAMPLE_DOCS_DIR, "*.pdf"))
    txt_files = glob.glob(os.path.join(SAMPLE_DOCS_DIR, "*.txt"))
    all_files = pdf_files + txt_files

    if not all_files:
        print(f"⚠️ No PDF or TXT files found inside '{SAMPLE_DOCS_DIR}'.")
        print("   Please add your land governance PDF files to sample_docs/ and run 'python ingest.py' again.")
        return

    print(f"📄 Found {len(all_files)} document(s) to process in sample_docs/\n")

    # 3. Load local sentence-transformers embedding model (all-MiniLM-L6-v2)
    print("🧠 Loading local sentence-transformers model ('all-MiniLM-L6-v2')...")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    print("✅ Embedding model loaded successfully!\n")

    # 4. Initialize persistent ChromaDB client
    print(f"🗄️ Initializing ChromaDB persistent storage at '{CHROMA_DB_DIR}'...")
    chroma_client = chromadb.PersistentClient(path=CHROMA_DB_DIR)
    
    # Get or create persistent collection
    collection = chroma_client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"description": "Land Governance Policy Documents Vector Store"}
    )
    print(f"✅ Collection '{COLLECTION_NAME}' ready in ChromaDB.\n")

    all_chunks = []
    all_metadatas = []
    all_ids = []

    # 5. Process each document file
    for filepath in all_files:
        filename = os.path.basename(filepath)
        print(f"📖 Processing file: '{filename}'...")

        raw_text = extract_text_from_file(filepath)
        if not raw_text.strip():
            print(f"   ⚠️ Warning: File '{filename}' contained no readable text. Skipping.")
            continue

        file_chunks = split_text_into_chunks(raw_text, chunk_size_words=300, overlap_words=50)
        print(f"   ✂️ Extracted {len(file_chunks)} chunks from '{filename}'.")

        for idx, chunk_text in enumerate(file_chunks):
            chunk_id = f"{filename}_chunk_{idx}"
            all_chunks.append(chunk_text)
            all_metadatas.append({"source": filename, "chunk_id": idx})
            all_ids.append(chunk_id)

    if not all_chunks:
        print("❌ No valid text chunks generated across all documents.")
        return

    # 6. Generate embeddings using sentence-transformers
    print(f"\n⚡ Generating vector embeddings for {len(all_chunks)} total chunks using all-MiniLM-L6-v2...")
    embeddings = model.encode(all_chunks, show_progress_bar=True).tolist()

    # 7. Store chunks + embeddings + metadata in ChromaDB
    print(f"💾 Saving embeddings to ChromaDB collection '{COLLECTION_NAME}'...")
    collection.upsert(
        documents=all_chunks,
        embeddings=embeddings,
        metadatas=all_metadatas,
        ids=all_ids
    )

    print("==================================================")
    print(f"🎉 INGESTION COMPLETE! Indexed {len(all_chunks)} chunks from {len(all_files)} document(s).")
    print(f"🗄️ Database location: {CHROMA_DB_DIR}")
    print("==================================================")

if __name__ == "__main__":
    run_ingestion()
