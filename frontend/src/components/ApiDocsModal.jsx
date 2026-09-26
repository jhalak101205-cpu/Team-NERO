import React, { useState } from 'react';
import { X, Code, Terminal, Check, Copy, Globe, Cpu, Database } from 'lucide-react';

export default function ApiDocsModal({ isOpen, onClose }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const endpoints = [
    {
      method: 'POST',
      path: '/ask',
      desc: 'Fact-anchored RAG document semantic question answering with source citations.',
      request: `{\n  "question": "Why do land disputes take so long in Punjab?"\n}`,
      response: `{\n  "answer": "Land dispute delays in Punjab are primarily caused by...",\n  "grounded_sources": ["DILRMP_Punjab_Evaluation_2024.pdf", "Revenue_Act_Ch4.pdf"],\n  "confidence_score": 0.98\n}`
    },
    {
      method: 'POST',
      path: '/chat',
      desc: 'Grounded departmental chatbot responding strictly from official state KPI metrics.',
      request: `{\n  "question": "What is the digitization percentage and active disputes in Punjab?"\n}`,
      response: `{\n  "answer": "In Punjab, land records digitization is at 94.2% with 8,420 active disputes...",\n  "grounded_in": "fixed_kpi_table",\n  "state": "Punjab"\n}`
    },
    {
      method: 'GET',
      path: '/api/gis/correlation',
      desc: 'Retrieves multi-state GIS spatial layer and dispute correlation indices.',
      request: `/* GET Request Parameters */\n?state=all&metric=dispute_density&resolution=district`,
      response: `{\n  "status": "success",\n  "cloud_node": "meghraj-nic-delhi-01",\n  "records": 5,\n  "cadastral_coverage_pct": 94.2\n}`
    }
  ];

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(6, 11, 25, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '1.5rem'
    }}>
      <div style={{
        background: '#ffffff',
        color: '#0f172a',
        width: '100%',
        maxWidth: '780px',
        maxHeight: '90vh',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          background: '#0a194e',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '3px solid #06b6d4'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: '#06b6d4',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Code size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                BhumiNexus API Documentation
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#a5f3fc', margin: '2px 0 0 0' }}>
                MeghRaj NIC Cloud API Specifications · RESTful Interfaces
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
            color: '#475569'
          }}>
            Base URL: <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', fontWeight: 600, color: '#0f172a' }}>http://localhost:8000</code> or <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', fontWeight: 600, color: '#0f172a' }}>https://api.bhumi-nexus.gov.in</code> (MeghRaj NIC Cloud Gateway).
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {endpoints.map((ep, idx) => (
              <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{
                  background: '#f8fafc',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      background: ep.method === 'POST' ? '#dbeafe' : '#dcfce7',
                      color: ep.method === 'POST' ? '#1d4ed8' : '#15803d',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}>
                      {ep.method}
                    </span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>
                      {ep.path}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>JSON Payload</span>
                </div>
                <div style={{ padding: '1rem' }}>
                  <p style={{ fontSize: '0.85rem', color: '#334155', margin: '0 0 0.75rem 0' }}>
                    {ep.desc}
                  </p>
                  <div style={{
                    background: '#0b1120',
                    color: '#e2e8f0',
                    borderRadius: '8px',
                    padding: '0.85rem 1rem',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    position: 'relative',
                    overflowX: 'auto'
                  }}>
                    <button
                      onClick={() => handleCopy(ep.request, idx)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {copiedIndex === idx ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      {copiedIndex === idx ? 'Copied' : 'Copy'}
                    </button>
                    <pre style={{ margin: 0 }}>{ep.request}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              background: '#0a194e',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
