import React from 'react';
import DocumentSearch from './components/DocumentSearch';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem 1rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#f8fafc', fontWeight: 700 }}>Land Governance Research Platform</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Production RAG System (FastAPI + ChromaDB + Gemini 2.0 Flash)</p>
      </header>
      
      <main>
        <DocumentSearch />
      </main>
    </div>
  );
}
