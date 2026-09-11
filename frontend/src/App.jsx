import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DocumentSearch from './components/DocumentSearch';
import GISCorrelationMap from './components/GISCorrelationMap';
import ChatBot from './components/ChatBot';

import PolicySimulator from './components/PolicySimulator';

export default function App() {
  const [activeTab, setActiveTab] = useState('map');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main style={{ paddingBottom: '3rem' }}>
        {activeTab === 'search' && <DocumentSearch />}

        {activeTab === 'map' && <GISCorrelationMap />}

        {activeTab === 'chatbot' && <ChatBot />}

        {activeTab === 'simulator' && <PolicySimulator />}
      </main>
    </div>
  );
}
