import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DocumentSearch from './components/DocumentSearch';
import GISCorrelationMap from './components/GISCorrelationMap';

export default function App() {
  const [activeTab, setActiveTab] = useState('search');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main style={{ paddingBottom: '3rem' }}>
        {activeTab === 'search' && <DocumentSearch />}

        {activeTab === 'map' && <GISCorrelationMap />}

        {activeTab === 'chatbot' && (
          <div style={{ maxWidth: '1200px', margin: '3rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
            <div className="glass-panel" style={{ padding: '3rem' }}>
              <h2 style={{ fontSize: '1.8rem', color: '#f8fafc', marginBottom: '1rem' }}>Feature 3: Grounded AI Chatbot</h2>
              <p style={{ color: 'var(--text-muted)' }}>Ready to build in Step 3!</p>
            </div>
          </div>
        )}

        {activeTab === 'simulator' && (
          <div style={{ maxWidth: '1200px', margin: '3rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
            <div className="glass-panel" style={{ padding: '3rem' }}>
              <h2 style={{ fontSize: '1.8rem', color: '#f8fafc', marginBottom: '1rem' }}>Feature 4: Policy Simulator</h2>
              <p style={{ color: 'var(--text-muted)' }}>Ready to build in Step 4!</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
