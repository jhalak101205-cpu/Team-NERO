import React from 'react';
import { X, Award, CheckCircle, Database, Server, Cpu, Shield, Users, Layers, ExternalLink } from 'lucide-react';

export default function SIHInfoModal({ isOpen, onClose }) {
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
        maxWidth: '820px',
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
          borderBottom: '3px solid #f97316'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: '#f97316',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Award size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                Smart India Hackathon 2026
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#fed7aa', margin: '2px 0 0 0' }}>
                Problem Statement SIH26019 · Ministry of Rural Development & DoLR
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

        {/* Body */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1, lineHeight: 1.6 }}>
          {/* Highlight Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>TEAM</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0a194e', marginTop: '4px' }}>Team NERO</div>
              <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>BhumiNexus Platform</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>TARGET MINISTRY</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0a194e', marginTop: '4px' }}>MoRD & DoLR</div>
              <div style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 600 }}>Dept of Land Resources</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>DEPLOYMENT READINESS</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>MeghRaj NIC Cloud</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Microservices & PostGIS</div>
            </div>
          </div>

          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0a194e', marginBottom: '0.5rem' }}>
            Problem Statement SIH26019: Brief & Objectives
          </h4>
          <p style={{ fontSize: '0.88rem', color: '#334155', marginBottom: '1.25rem' }}>
            Land governance in India faces legacy bottlenecks: siloed cadastral maps, delayed dispute resolution across revenue courts and Lok Adalats, lack of predictive simulation before enacting policy amendments, and unstructured legal circulars. 
            <strong>BhumiNexus</strong> bridges this gap by unifying GIS spatial intelligence, zero-hallucination semantic search (RAG), and a dynamic what-if policy simulator.
          </p>

          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0a194e', marginBottom: '0.75rem' }}>
            Core Architectural Capabilities
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                <Layers size={18} color="#2563eb" />
                1. Cadastral GIS Engine
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                Correlates DILRMP digitized survey numbers, BhuNaksha GeoJSON boundaries, district disputes, and ULPIN (Bhoo-Aadhar) linkages.
              </p>
            </div>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                <Server size={18} color="#059669" />
                2. Fact-Anchored RAG
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                Strict context-grounded document retrieval engine verifying land acquisition laws (RFCTLARR 2013) with 0% hallucinations.
              </p>
            </div>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                <Cpu size={18} color="#d97706" />
                3. Policy Impact Simulator
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                What-if econometric modeling simulating stamp duty tweaks, digitization incentives, and multi-year revenue vs dispute backlog.
              </p>
            </div>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                <Shield size={18} color="#7c3aed" />
                4. Grounded AI Policy Bot
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                Departmental Q&A bot tethered strictly to verified statistical tables for Punjab, Karnataka, Tamil Nadu, Bihar, and Rajasthan.
              </p>
            </div>
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
