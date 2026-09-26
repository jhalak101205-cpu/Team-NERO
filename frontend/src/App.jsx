import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroOverview from './components/HeroOverview';
import GISCorrelationMap from './components/GISCorrelationMap';
import DocumentSearch from './components/DocumentSearch';
import PolicySimulator from './components/PolicySimulator';
import ChatBot from './components/ChatBot';
import EvaluatorGuideModal from './components/EvaluatorGuideModal';
import OfficerSignInModal from './components/OfficerSignInModal';
import ApiDocsModal from './components/ApiDocsModal';
import AskBhumiAIFloating from './components/AskBhumiAIFloating';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isEvaluatorGuideOpen, setIsEvaluatorGuideOpen] = useState(false);
  const [isOfficerSignInOpen, setIsOfficerSignInOpen] = useState(false);
  const [isApiDocsOpen, setIsApiDocsOpen] = useState(false);
  const [currentOfficer, setCurrentOfficer] = useState(null);
  const [lang, setLang] = useState('en');
  const [fontSize, setFontSize] = useState('1rem');

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-primary)',
      fontSize: fontSize,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Official Government Navbar matching user screenshot */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onOpenEvaluatorGuide={() => setIsEvaluatorGuideOpen(true)}
        onOpenOfficerSignIn={() => setIsOfficerSignInOpen(true)}
        onOpenApiDocs={() => setIsApiDocsOpen(true)}
        currentOfficer={currentOfficer}
        lang={lang}
        setLang={setLang}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />
      
      {/* Main Tab Content */}
      <main style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <HeroOverview 
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenEvaluatorGuide={() => setIsEvaluatorGuideOpen(true)}
            lang={lang}
          />
        )}

        {activeTab === 'map' && <GISCorrelationMap />}

        {activeTab === 'search' && <DocumentSearch />}

        {activeTab === 'simulator' && <PolicySimulator />}

        {activeTab === 'chatbot' && <ChatBot />}
      </main>

      {/* Footer */}
      <footer style={{
        background: '#060d24',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '2rem 1.5rem',
        color: '#64748b',
        fontSize: '0.82rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontWeight: 700, color: '#e2e8f0' }}>BhumiNexus Platform</span>
            <span>·</span>
            <span>Ministry of Rural Development & Department of Land Resources (DoLR)</span>
          </div>
          <div>
            Government of India
          </div>
          <div style={{ fontSize: '0.75rem', color: '#475569' }}>
            Designed for high-reliability MeghRaj NIC Cloud deployment with ISO 27001 data governance and ULPIN (Bhoo-Aadhar) interoperability.
          </div>
        </div>
      </footer>

      {/* Floating Action Button: Ask Bhumi AI */}
      <AskBhumiAIFloating onExpandToFull={() => setActiveTab('chatbot')} />

      {/* Modals */}
      <EvaluatorGuideModal 
        isOpen={isEvaluatorGuideOpen} 
        onClose={() => setIsEvaluatorGuideOpen(false)}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      <OfficerSignInModal 
        isOpen={isOfficerSignInOpen} 
        onClose={() => setIsOfficerSignInOpen(false)}
        currentOfficer={currentOfficer}
        setCurrentOfficer={setCurrentOfficer}
      />

      <ApiDocsModal 
        isOpen={isApiDocsOpen} 
        onClose={() => setIsApiDocsOpen(false)}
      />
    </div>
  );
}
