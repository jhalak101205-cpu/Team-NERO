import React from 'react';
import { X, CheckCircle, BookOpen, Sparkles, Award, FileText, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export default function EvaluatorGuideModal({ isOpen, onClose, onSelectTab }) {
  if (!isOpen) return null;

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
        maxWidth: '760px',
        maxHeight: '90vh',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          background: 'linear-gradient(135deg, #0a194e, #1e3a8a)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '3px solid #f59e0b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'rgba(245, 158, 11, 0.25)',
              padding: '0.5rem',
              borderRadius: '8px',
              display: 'flex'
            }}>
              <BookOpen size={22} color="#f59e0b" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>SIH 2026 Evaluator Guide</h3>
              <p style={{ fontSize: '0.78rem', color: '#93c5fd', margin: '2px 0 0 0' }}>
                Quick Evaluation Walkthrough · Problem Statement SIH26019 · Team NERO
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

        {/* Modal Body */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1, lineHeight: 1.6 }}>
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <Award size={24} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                Key Problem Statement Focus (SIH26019)
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>
                Department of Land Resources (DoLR), Ministry of Rural Development requires a national platform transforming disparate cadastral records, DILRMP data, and litigation registers into actionable, evidence-based policy intelligence.
              </p>
            </div>
          </div>

          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0a194e', marginBottom: '0.75rem' }}>
            Recommended Evaluation Steps
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.9rem', marginBottom: '1.5rem' }}>
            <div 
              onClick={() => { onSelectTab('map'); onClose(); }}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                  background: '#eff6ff',
                  color: '#2563eb',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}>Step 1</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#0f172a' }}>Explore GIS Correlation Map</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>View multi-state cadastral saturation, dispute heatmaps, and land classification layers.</div>
                </div>
              </div>
              <ArrowRight size={18} color="#2563eb" />
            </div>

            <div 
              onClick={() => { onSelectTab('search'); onClose(); }}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                  background: '#f0fdf4',
                  color: '#16a34a',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}>Step 2</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#0f172a' }}>Test Fact-Anchored RAG Search</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Query land acquisition laws (RFCTLARR 2013), DILRMP guidelines with 0% hallucinations.</div>
                </div>
              </div>
              <ArrowRight size={18} color="#16a34a" />
            </div>

            <div 
              onClick={() => { onSelectTab('simulator'); onClose(); }}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                  background: '#fef3c7',
                  color: '#d97706',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}>Step 3</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#0f172a' }}>Run Dynamic Policy Simulator</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Slide stamp duty and digitisation parameters to model multi-year revenue and resolution impacts.</div>
                </div>
              </div>
              <ArrowRight size={18} color="#d97706" />
            </div>

            <div 
              onClick={() => { onSelectTab('chatbot'); onClose(); }}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                  background: '#f5f3ff',
                  color: '#7c3aed',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}>Step 4</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#0f172a' }}>Ask Bhumi AI (Grounded Bot)</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Ask state-wise comparison queries grounded strictly in verified statistical KPIs.</div>
                </div>
              </div>
              <ArrowRight size={18} color="#7c3aed" />
            </div>
          </div>

          <div style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '10px',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <ShieldCheck size={22} color="#059669" />
            <span style={{ fontSize: '0.85rem', color: '#065f46', fontWeight: 500 }}>
              Architecture verified for MeghRaj NIC Cloud compliance, ISO 27001 data governance, and API interoperability with BhuNaksha & ULPIN.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem'
        }}>
          <button 
            onClick={onClose}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Close Guide
          </button>
          <button 
            onClick={() => { onSelectTab('map'); onClose(); }}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              background: '#f59e0b',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Start Demo Tour
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
