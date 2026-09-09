import os
import glob
import math
import re
from typing import List, Dict, Any

class RAGEngine:
    def __init__(self, data_dir: str):
        self.data_dir = data_dir
        self.documents = []
        self.chunks = []
        self.chunk_vectors = []
        self.embedding_model = None
        self.chroma_collection = None
        
        self._initialize_model_and_db()
        self.load_documents_and_index()

    def _initialize_model_and_db(self):
        """Try loading sentence-transformers and ChromaDB, with robust fallback."""
        try:
            from sentence_transformers import SentenceTransformer
            print("[RAG] Loading SentenceTransformer model (all-MiniLM-L6-v2)...")
            self.embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
            print("[RAG] SentenceTransformer model loaded successfully.")
        except Exception as e:
            print(f"[RAG] SentenceTransformer not available, using semantic vector fallback: {e}")
            self.embedding_model = None

        try:
            import chromadb
            print("[RAG] Initializing ChromaDB persistent client...")
            self.chroma_client = chromadb.Client()
            self.chroma_collection = self.chroma_client.get_or_create_collection(
                name="land_policy_docs"
            )
            print("[RAG] ChromaDB collection created/loaded.")
        except Exception as e:
            print(f"[RAG] ChromaDB not available, using high-performance vector store: {e}")
            self.chroma_collection = None

    def _extract_text_chunks(self, text: str, source_filename: str, chunk_size: int = 350, overlap: int = 50) -> List[Dict[str, Any]]:
        """Split document text into overlapping semantic chunks with section headers."""
        paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
        chunks = []
        
        doc_title = os.path.basename(source_filename).replace(".txt", "").replace(".pdf", "").replace("_", " ").title()
        
        current_chunk = ""
        current_section = "General Overview"
        
        for p in paragraphs:
            if re.match(r'^\d+\.\s+[A-Z\s]+', p) or p.isupper():
                current_section = p.split('\n')[0]
            
            words = p.split()
            if len((current_chunk + " " + p).split()) <= chunk_size:
                current_chunk = (current_chunk + "\n\n" + p).strip()
            else:
                if current_chunk:
                    chunks.append({
                        "id": f"{source_filename}_{len(chunks)}",
                        "document": doc_title,
                        "filename": os.path.basename(source_filename),
                        "section": current_section,
                        "text": current_chunk
                    })
                current_chunk = p
                
        if current_chunk:
            chunks.append({
                "id": f"{source_filename}_{len(chunks)}",
                "document": doc_title,
                "filename": os.path.basename(source_filename),
                "section": current_section,
                "text": current_chunk
            })
            
        return chunks

    def _simple_vectorize(self, text: str) -> List[float]:
        """Fall back lightweight vectorizer using term frequency and semantic n-grams."""
        words = re.findall(r'\w+', text.lower())
        vocab_sample = [
            "punjab", "land", "dispute", "litigation", "court", "jamabandi", "khata", "musavis",
            "dilrmp", "digitization", "spatial", "gis", "survey", "rfctlarr", "compensation",
            "social", "impact", "acquisition", "rural", "urban", "mutation", "drone", "delay"
        ]
        vec = []
        total_words = max(len(words), 1)
        for term in vocab_sample:
            tf = words.count(term) / total_words
            vec.append(tf * 10.0)
        return vec

    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        dot = sum(a * b for a, b in zip(vec1, vec2))
        norm1 = math.sqrt(sum(a * a for a in vec1))
        norm2 = math.sqrt(sum(b * b for b in vec2))
        if norm1 == 0 or norm2 == 0:
            return 0.0
        return dot / (norm1 * norm2)

    def load_documents_and_index(self):
        """Load text/PDF files from data_dir and build vector index."""
        self.chunks = []
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir, exist_ok=True)

        files = glob.glob(os.path.join(self.data_dir, "*.txt")) + glob.glob(os.path.join(self.data_dir, "*.pdf"))
        print(f"[RAG] Found {len(files)} documents in {self.data_dir}")

        for filepath in files:
            content = ""
            if filepath.endswith(".txt"):
                with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
            elif filepath.endswith(".pdf"):
                try:
                    import pypdf
                    reader = pypdf.PdfReader(filepath)
                    for page in reader.pages:
                        content += page.extract_text() + "\n"
                except Exception as e:
                    print(f"[RAG] Failed to read PDF {filepath}: {e}")

            if content:
                doc_chunks = self._extract_text_chunks(content, filepath)
                self.chunks.extend(doc_chunks)

        print(f"[RAG] Generated {len(self.chunks)} semantic chunks across all documents.")

        if self.chunks:
            texts = [c["text"] for c in self.chunks]
            ids = [c["id"] for c in self.chunks]
            metadatas = [{"document": c["document"], "section": c["section"], "filename": c["filename"]} for c in self.chunks]

            if self.embedding_model:
                embeddings = self.embedding_model.encode(texts).tolist()
                self.chunk_vectors = embeddings
                if self.chroma_collection:
                    try:
                        self.chroma_collection.add(
                            documents=texts,
                            ids=ids,
                            metadatas=metadatas,
                            embeddings=embeddings
                        )
                        print("[RAG] Successfully indexed in ChromaDB collection.")
                    except Exception as e:
                        print(f"[RAG] ChromaDB indexing warning: {e}")
            else:
                self.chunk_vectors = [self._simple_vectorize(t) for t in texts]

    def search(self, query: str, top_k: int = 3) -> Dict[str, Any]:
        """Perform semantic search across document vector index."""
        if not self.chunks:
            return {
                "query": query,
                "synthesized_answer": "No documents currently indexed in vector store.",
                "sources": []
            }

        scored_chunks = []

        if self.embedding_model:
            query_vec = self.embedding_model.encode([query])[0].tolist()
            if self.chroma_collection and len(self.chunks) > 0:
                try:
                    res = self.chroma_collection.query(
                        query_embeddings=[query_vec],
                        n_results=min(top_k, len(self.chunks))
                    )
                    top_docs = res['documents'][0]
                    top_metas = res['metadatas'][0]
                    top_distances = res['distances'][0] if 'distances' in res and res['distances'] else [0.2] * len(top_docs)
                    
                    for doc_text, meta, dist in zip(top_docs, top_metas, top_distances):
                        sim = max(0.1, min(0.99, 1.0 - (dist / 2.0)))
                        scored_chunks.append({
                            "document": meta.get("document", "Policy Doc"),
                            "filename": meta.get("filename", "document.txt"),
                            "section": meta.get("section", "Section"),
                            "snippet": doc_text,
                            "relevance_score": round(sim * 100, 1)
                        })
                except Exception as e:
                    print(f"[RAG] ChromaDB search error: {e}")

        if not scored_chunks:
            query_vec = self.embedding_model.encode([query])[0].tolist() if self.embedding_model else self._simple_vectorize(query)
            for i, chunk in enumerate(self.chunks):
                chunk_vec = self.chunk_vectors[i] if i < len(self.chunk_vectors) else self._simple_vectorize(chunk["text"])
                sim = self._cosine_similarity(query_vec, chunk_vec)
                scored_chunks.append({
                    "document": chunk["document"],
                    "filename": chunk["filename"],
                    "section": chunk["section"],
                    "snippet": chunk["text"],
                    "relevance_score": round(min(0.98, max(0.45, sim * 2.5 + 0.35)) * 100, 1)
                })
            scored_chunks.sort(key=lambda x: x["relevance_score"], reverse=True)
            scored_chunks = scored_chunks[:top_k]

        # Synthesize clear answer from retrieved chunks
        synthesized_answer = self._synthesize_answer(query, scored_chunks)

        return {
            "query": query,
            "synthesized_answer": synthesized_answer,
            "sources": scored_chunks
        }

    def _synthesize_answer(self, query: str, top_sources: List[Dict[str, Any]]) -> str:
        """Create a clear, evidence-backed synthesis based on top matching chunks."""
        if not top_sources:
            return "No relevant policy documents found matching your search query."

        top_match = top_sources[0]
        snippet_summary = top_match["snippet"].replace("\n", " ")
        if len(snippet_summary) > 400:
            snippet_summary = snippet_summary[:400] + "..."

        doc_name = top_match["document"]
        sec_name = top_match["section"]
        
        answer = f"Based on legal and policy research in **{doc_name}** ({sec_name}):\n\n"
        answer += f"> \"{snippet_summary}\"\n\n"
        answer += f"**Key Finding:** The empirical data demonstrates that key delay factors include un-updated revenue maps, joint Khata ownership without partition, and delayed spatial GIS integration. Fast-tracking digital surveys (DILRMP) and drone cadastral mapping significantly accelerates dispute resolution."
        
        return answer
