import React from 'react';
import { 
  BookOpen, 
  Lock, 
  UserCheck, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  FileText,
  Search,
  Map,
  Sliders,
  Bot
} from 'lucide-react';
import StateEmblem from './StateEmblem';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenEvaluatorGuide, 
  onOpenOfficerSignIn, 
  onOpenApiDocs, 
  currentOfficer,
  lang,
  setLang,
  fontSize,
  setFontSize
}) {
  const isHindi = lang === 'hi';

  const navItems = [
    { 
      id: 'home', 
      label: isHindi ? 'गृह (अवलोकन)' : 'Home (Overview)' 
    },
    { 
      id: 'map', 
      label: isHindi ? 'राष्ट्रीय डैशबोर्ड (GIS)' : 'National Dashboard' 
    },
    { 
      id: 'search', 
      label: isHindi ? 'दस्तावेज़ खोज (RAG)' : 'RAG Smart Search' 
    },
    { 
      id: 'simulator', 
      label: isHindi ? 'नीति सिम्युलेटर' : 'Policy Simulator' 
    },
    { 
      id: 'api-docs', 
      label: isHindi ? 'एपीआई दस्तावेज़ीकरण' : 'API Documentation',
      isModal: true,
      action: onOpenApiDocs
    },
  ];

  return (
    <header style={{ width: '100%', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }}>
      {/* Main Government Branding Row */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0.85rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        {/* Left: Ashoka Emblem & Official Titles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Emblem Box */}
          <div style={{
            width: '48px',
            height: '54px',
            border: '1.5px solid #cbd5e1',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
          }}>
            <StateEmblem width={34} height={42} color="#0a194e" />
          </div>

          {/* Titles Block */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <span 
                onClick={() => setActiveTab('home')}
                style={{
                  fontSize: '1.55rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  letterSpacing: '-0.02em',
                  fontFamily: 'var(--font-heading)'
                }}
              >
                <span style={{ color: '#0a194e' }}>Bhumi</span>
                <span style={{ color: '#1d4ed8' }}>Nexus</span>
              </span>
            </div>

            <div style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#334155',
              marginTop: '1px'
            }}>
              {isHindi 
                ? 'राष्ट्रीय भूमि अनुसंधान एवं नीति नवाचार मंच · National Land Research & Policy Innovation Platform'
                : 'राष्ट्रीय भूमि अनुसंधान एवं नीति नवाचार मंच · National Land Research & Policy Innovation Platform'
              }
            </div>

            <div style={{
              fontSize: '0.74rem',
              color: '#64748b',
              marginTop: '1px'
            }}>
              Ministry of Rural Development & Department of Land Resources (DoLR), Government of India
            </div>
          </div>
        </div>

        {/* Right: Language, Evaluator Guide & Officer Sign In Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          {/* Language Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            padding: '5px 12px',
            borderRadius: '8px',
            fontSize: '0.82rem'
          }}>
            <span
              onClick={() => setLang('hi')}
              style={{
                cursor: 'pointer',
                fontWeight: isHindi ? 700 : 500,
                color: isHindi ? '#ea580c' : '#475569',
                textDecoration: isHindi ? 'underline' : 'none'
              }}
            >
              हिन्दी
            </span>
            <span style={{ color: '#cbd5e1' }}>|</span>
            <span
              onClick={() => setLang('en')}
              style={{
                cursor: 'pointer',
                fontWeight: !isHindi ? 700 : 500,
                color: !isHindi ? '#ea580c' : '#475569',
                textDecoration: !isHindi ? 'underline' : 'none'
              }}
            >
              English
            </span>
          </div>

          {/* Evaluator Guide Button */}
          <button
            onClick={onOpenEvaluatorGuide}
            style={{
              background: '#f59e0b',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.6rem 1.15rem',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#d97706'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f59e0b'}
          >
            <BookOpen size={16} />
            <span>{isHindi ? 'मूल्यांकनकर्ता गाइड' : 'Evaluator Guide'}</span>
          </button>

          {/* Officer Sign In Button */}
          <button
            onClick={onOpenOfficerSignIn}
            style={{
              background: currentOfficer ? '#047857' : '#0a194e',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.6rem 1.15rem',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(10, 25, 78, 0.25)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!currentOfficer) e.currentTarget.style.background = '#0f2771';
            }}
            onMouseLeave={(e) => {
              if (!currentOfficer) e.currentTarget.style.background = '#0a194e';
            }}
          >
            {currentOfficer ? <UserCheck size={16} /> : <Lock size={16} />}
            <span>
              {currentOfficer 
                ? (isHindi ? 'अधिकारी: ' : 'Officer: ') + currentOfficer.name.split(',')[0]
                : (isHindi ? 'अधिकारी साइन इन' : 'Officer Sign In')}
            </span>
          </button>
        </div>
      </div>

      {/* 4. Primary Dark Navy Navigation Bar */}
      <nav style={{
        background: '#061138',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', overflowX: 'auto' }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.isModal) {
                    item.action();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                style={{
                  background: 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #f97316' : '3px solid transparent',
                  padding: '0.85rem 1.1rem',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#94a3b8';
                }}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right MeghRaj NIC Cloud Status */}
        <div style={{ padding: '0.4rem 0' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '9999px',
            padding: '4px 12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            color: '#e2e8f0',
            fontWeight: 500
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#22c55e',
              display: 'inline-block'
            }} className="status-dot-pulse" />
            <span>MeghRaj NIC Cloud: <strong style={{ color: '#ffffff' }}>Active</strong></span>
          </div>
        </div>
      </nav>
    </header>
  );
}
