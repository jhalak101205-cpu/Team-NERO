import React, { useState } from 'react';
import axios from 'axios';
import { Search, Sparkles, FileText, CheckCircle, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function DocumentSearch() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const sampleQuestions = [
    "Why do land disputes take so long in Punjab?",
    "What are the rules for rural land acquisition compensation under RFCTLARR 2013?",
    "How does land record digitization reduce litigation according to DILRMP guidelines?",
    "What is the impact of joint Khata partition on boundary disputes?"
  ];

  const handleAskQuestion = async (selectedQuestion) => {
    const q = selectedQuestion || question;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Send real POST request to FastAPI backend endpoint
      const response = await axios.post('http://localhost:8000/ask', {
        question: q
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 25000
      });

      if (response.data) {
        setResult(response.data);
      }
    } catch (err) {
      console.error("RAG Backend API error:", err);
      let errorMsg = "Unable to connect to backend server at http://localhost:8000. Ensure 'python rag_app/app.py' is running.";
      if (err.response && err.response.data && err.response.data.detail) {
        errorMsg = err.response.data.detail;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', borderLeft: '4px solid var(--accent-indigo)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
            <Sparkles size={22} color="#818cf8" />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#f8fafc' }}>RAG Semantic Document Search</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '850px', lineHeight: 1.6 }}>
          Powered by ChromaDB vector storage, local SentenceTransformers embeddings, and Google Gemini API (gemini-2.0-flash). Answers are strictly grounded in indexed land policy documents.
        </p>

        {/* Input & Semantic Search Button */}
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-hover)',
            borderRadius: '14px',
            padding: '0.5rem 0.75rem 0.5rem 1.25rem'
          }}>
            <Search size={22} color="#94a3b8" style={{ marginRight: '0.75rem' }} />
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
              placeholder="Ask any policy question e.g. 'Why do land disputes take so long in Punjab?'"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '1rem',
                fontFamily: 'var(--font-body)'
              }}
            />
            <button
              onClick={() => handleAskQuestion()}
              disabled={loading || !question.trim()}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Querying RAG & Gemini...</span>
                </>
              ) : (
                <>
                  <span>Semantic Search</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Sample Questions */}
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Try sample question:</span>
          {sampleQuestions.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuestion(sq);
                handleAskQuestion(sq);
              }}
              className="btn-chip"
            >
              "{sq}"
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert Box */}
      {error && (
        <div className="animate-fade-in" style={{
          padding: '1.25rem',
          borderRadius: '12px',
          background: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem'
        }}>
          <AlertCircle size={22} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ color: '#f43f5e', fontSize: '1rem', marginBottom: '0.35rem' }}>Backend Connection / RAG Error</h4>
            <p style={{ color: '#fecdd3', fontSize: '0.9rem', lineHeight: 1.5 }}>{error}</p>
          </div>
        </div>
      )}

      {/* Real Answer View */}
      {result && (
        <div className="animate-fade-in glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={22} color="#10b981" />
              <h3 style={{ fontSize: '1.25rem', color: '#f8fafc' }}>Grounded Gemini RAG Answer</h3>
            </div>
            <span className="badge badge-emerald">Gemini 2.0 Flash</span>
          </div>

          {/* Answer Text */}
          <div style={{ fontSize: '1rem', lineHeight: 1.7, color: '#e2e8f0', whiteSpace: 'pre-line', marginBottom: '1.75rem' }}>
            {result.answer}
          </div>

          {/* Sources List */}
          <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={16} color="#06b6d4" />
              Source Documents Used ({result.sources ? result.sources.length : 0})
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {result.sources && result.sources.length > 0 ? (
                result.sources.map((src, i) => (
                  <span key={i} className="badge badge-cyan" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                    📄 {src}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No document sources retrieved</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
