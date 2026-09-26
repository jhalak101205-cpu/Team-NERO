import React from 'react';
import { 
  ArrowRight, 
  BookOpen, 
  Map, 
  Search, 
  Sliders, 
  Bot, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  TrendingUp, 
  Award, 
  Cpu, 
  FileText,
  Database,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function HeroOverview({ 
  onNavigate, 
  onOpenEvaluatorGuide, 
  lang 
}) {
  const isHindi = lang === 'hi';

  const featureCards = [
    {
      id: 'map',
      title: isHindi ? 'राष्ट्रीय भू-स्थानिक सहसंबंध मानचित्र' : 'National GIS Correlation Map',
      tag: 'CADASTRAL GIS',
      tagColor: '#2563eb',
      desc: isHindi 
        ? 'DILRMP डिजिटलीकरण, विवाद घनत्व, कृषि बनाम वन भूमि वर्गीकरण और ULPIN (भू-आधार) लिंकिंग का अन्वेषण करें।'
        : 'Explore DILRMP cadastral digitization, Lok Adalat dispute density, forest vs agricultural land classifications, and ULPIN (Bhoo-Aadhar) linkages.',
      icon: Map,
      stats: '5 States · 42 Districts Covered',
      actionText: isHindi ? 'मानचित्र खोलें' : 'Open GIS Map'
    },
    {
      id: 'search',
      title: isHindi ? 'तथ्य-आधारित RAG दस्तावेज़ खोज' : 'Fact-Anchored RAG Smart Search',
      tag: 'ZERO HALLUCINATION',
      tagColor: '#059669',
      desc: isHindi
        ? 'RFCTLARR 2013, DILRMP परिपत्रों और राज्य राजस्व संहिताओं से सत्यापित उद्धरणों के साथ सटीक नीति उत्तर प्राप्त करें।'
        : 'Query land acquisition acts (RFCTLARR 2013), DILRMP guidelines, and state revenue codes with 100% verified source citations.',
      icon: Search,
      stats: '10,000+ Legal Clauses Indexed',
      actionText: isHindi ? 'खोज शुरू करें' : 'Start RAG Search'
    },
    {
      id: 'simulator',
      title: isHindi ? 'गतिशील नीति प्रभाव सिम्युलेटर' : 'Dynamic Policy Impact Simulator',
      tag: 'WHAT-IF ECONOMETRICS',
      tagColor: '#d97706',
      desc: isHindi
        ? 'स्टाम्प शुल्क, पंजीकरण छूट और डिजिटलीकरण प्रोत्साहन में बदलाव के 5-वर्षीय राजस्व व विवाद समाधान प्रभावों का अनुकरण करें।'
        : 'Model multi-year revenue, compliance, and dispute backlog impacts by tweaking stamp duties, digitization incentives, and court throughput.',
      icon: Sliders,
      stats: '5-Year Econometric Projections',
      actionText: isHindi ? 'सिमुलेशन चलाएं' : 'Run Simulator'
    },
    {
      id: 'chatbot',
      title: isHindi ? 'भूमि एआई नीति सहायक' : 'Ask Bhumi AI (Grounded Bot)',
      tag: 'FACT-VERIFIED BOT',
      tagColor: '#7c3aed',
      desc: isHindi
        ? 'पंजाब, कर्नाटक, तमिलनाडु, बिहार और राजस्थान के आधिकारिक सांख्यिकी तालिकाओं से सीधे सत्यापित उत्तर प्राप्त करें।'
        : 'Conversational policy intelligence tethered strictly to verified statistical tables for Punjab, Karnataka, Tamil Nadu, Bihar, and Rajasthan.',
      icon: Bot,
      stats: 'Strict Grounding · 0 Extrapolations',
      actionText: isHindi ? 'चैटबॉट से पूछें' : 'Consult Bhumi AI'
    }
  ];

  return (
    <div style={{ width: '100%', color: '#ffffff' }}>
      {/* 1. Main Hero Banner matching the screenshot */}
      <section style={{
        position: 'relative',
        width: '100%',
        minHeight: '620px',
        backgroundImage: 'linear-gradient(rgba(5, 14, 44, 0.76), rgba(5, 14, 44, 0.90)), url("/hero-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        backgroundRepeat: 'no-repeat',
        padding: '3.75rem 2rem 5rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', zIndex: 1 }}>
          {/* Main Title: BhumiNexus (भूमिनैक्सस) */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            margin: '0 0 0.85rem 0',
            fontFamily: 'var(--font-heading)'
          }}>
            <span style={{ color: '#ffffff' }}>Bhumi</span>
            <span style={{ color: '#38bdf8' }}>Nexus</span>{' '}
            <span style={{ color: '#fbbf24', fontWeight: 700 }}>(भूमिनैक्सस)</span>
          </h1>

          {/* Subheading */}
          <h2 style={{
            fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)',
            fontWeight: 700,
            color: '#f8fafc',
            maxWidth: '960px',
            margin: '0 auto 1.25rem auto',
            lineHeight: 1.4
          }}>
            {isHindi 
              ? 'अनुसंधान, नीति नवाचार एवं साक्ष्य-आधारित भूमि शासन हेतु राष्ट्रीय डिजिटल मंच'
              : 'National Digital Platform for Research, Policy Innovation & Evidence-Based Land Governance'}
          </h2>

          {/* Description */}
          <p style={{
            fontSize: 'clamp(0.92rem, 1.4vw, 1.05rem)',
            color: '#cbd5e1',
            maxWidth: '820px',
            margin: '0 auto 2.25rem auto',
            lineHeight: 1.65,
            fontWeight: 400
          }}>
            {isHindi
              ? 'भूमि संसाधन विभाग (DoLR) के लिए विकसित एक केंद्रीकृत, बुद्धिमान ज्ञान-से-नीति इंजन। पारंपरिक कैडस्ट्रल रिकॉर्ड और प्रशासनिक डेटासेट को स्पष्ट, साक्ष्य-आधारित नीति अंतर्दृष्टि में बदलना।'
              : 'A centralized, intelligent knowledge-to-policy engine developed for the Department of Land Resources (DoLR). Transforming legacy cadastral records and administrative datasets into clear, evidence-based policy insights.'}
          </p>

          {/* CTA Action Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '3.5rem'
          }}>
            {/* Primary CTA: Explore National Dashboard */}
            <button
              onClick={() => onNavigate('map')}
              style={{
                background: '#f97316',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.85rem 1.85rem',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(249, 115, 22, 0.4)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ea580c';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f97316';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>{isHindi ? 'राष्ट्रीय डैशबोर्ड देखें' : 'Explore National Dashboard'}</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Key Stat Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
            width: '100%',
            maxWidth: '1020px',
            margin: '0 auto'
          }}>
            {/* Card 1: Records Digitised */}
            <div style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '1.6rem 1.25rem',
              color: '#0f172a',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.28)',
              borderTop: '4px solid #10b981',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                fontSize: '2.4rem',
                fontWeight: 800,
                color: '#047857',
                lineHeight: 1.1,
                fontFamily: 'var(--font-heading)'
              }}>
                94%
              </div>
              <div style={{
                fontSize: '1.02rem',
                fontWeight: 700,
                color: '#0f172a',
                marginTop: '0.4rem',
                marginBottom: '0.2rem'
              }}>
                Records Digitised
              </div>
              <div style={{
                fontSize: '0.78rem',
                color: '#64748b'
              }}>
                DILRMP national saturation tracked
              </div>
            </div>

            {/* Card 2: Disputes Tracked */}
            <div style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '1.6rem 1.25rem',
              color: '#0f172a',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.28)',
              borderTop: '4px solid #10b981',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                fontSize: '2.4rem',
                fontWeight: 800,
                color: '#047857',
                lineHeight: 1.1,
                fontFamily: 'var(--font-heading)'
              }}>
                38,500
              </div>
              <div style={{
                fontSize: '1.02rem',
                fontWeight: 700,
                color: '#0f172a',
                marginTop: '0.4rem',
                marginBottom: '0.2rem'
              }}>
                Disputes Tracked
              </div>
              <div style={{
                fontSize: '0.78rem',
                color: '#64748b'
              }}>
                Special Lok Adalat tribunal data
              </div>
            </div>

            {/* Card 4: AI Hallucinations */}
            <div style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '1.6rem 1.25rem',
              color: '#0f172a',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.28)',
              borderTop: '4px solid #10b981',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                fontSize: '2.4rem',
                fontWeight: 800,
                color: '#047857',
                lineHeight: 1.1,
                fontFamily: 'var(--font-heading)'
              }}>
                Zero
              </div>
              <div style={{
                fontSize: '1.02rem',
                fontWeight: 700,
                color: '#0f172a',
                marginTop: '0.4rem',
                marginBottom: '0.2rem'
              }}>
                AI Hallucinations
              </div>
              <div style={{
                fontSize: '0.78rem',
                color: '#64748b'
              }}>
                Fact-anchored RAG with source citations
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Pillar Explorer (Below Hero) */}
      <section style={{
        maxWidth: '1240px',
        margin: '3.5rem auto',
        padding: '0 1.5rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '9999px',
            padding: '4px 14px',
            color: '#818cf8',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '0.75rem'
          }}>
            <Sparkles size={14} />
            Four Core Pillars of BhumiNexus
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.5rem 0' }}>
            {isHindi ? 'केंद्रीकृत भूमि नीति एवं अनुसंधान इंजन' : 'Centralized Land Policy & Intelligence Engine'}
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.98rem', maxWidth: '720px', margin: '0 auto' }}>
            Empowering officials with geospatial evidence, strict legal retrieval, dynamic policy forecasting, and grounded conversational analytics.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => onNavigate(feat.id)}
                style={{
                  background: 'rgba(19, 27, 46, 0.75)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = feat.tagColor;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 12px 28px rgba(0, 0, 0, 0.4)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: `rgba(${feat.id === 'map' ? '37, 99, 235' : feat.id === 'search' ? '5, 150, 105' : feat.id === 'simulator' ? '217, 119, 6' : '124, 58, 237'}, 0.15)`,
                      border: `1px solid ${feat.tagColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: feat.tagColor
                    }}>
                      <Icon size={24} />
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: feat.tagColor,
                      background: `rgba(255, 255, 255, 0.05)`,
                      border: `1px solid rgba(255, 255, 255, 0.1)`,
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}>
                      {feat.tag}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.6rem' }}>
                    {feat.title}
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {feat.desc}
                  </p>
                </div>

                <div>
                  <div style={{
                    fontSize: '0.78rem',
                    color: '#64748b',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    paddingTop: '0.85rem',
                    marginBottom: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>{feat.stats}</span>
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: feat.tagColor,
                    fontWeight: 700,
                    fontSize: '0.88rem'
                  }}>
                    <span>{feat.actionText}</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. National Compliance & Cloud Interoperability Banner */}
      <section style={{
        maxWidth: '1240px',
        margin: '0 auto 4rem auto',
        padding: '0 1.5rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(10, 25, 78, 0.65), rgba(15, 23, 42, 0.85))',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '16px',
          padding: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <ShieldCheck size={24} color="#10b981" />
              <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                MeghRaj NIC Cloud & Cadastral Interoperability
              </h4>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '780px', margin: 0, lineHeight: 1.6 }}>
              Architected with microservices to interface seamlessly with National Land Records Modernisation Programme (DILRMP), BhuNaksha GeoJSON layers, and Bhoo-Aadhar (14-digit ULPIN) protocols with GovData security compliance.
            </p>
          </div>
          <button
            onClick={onOpenEvaluatorGuide}
            style={{
              background: '#f59e0b',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.4rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              whiteSpace: 'nowrap'
            }}
          >
            <BookOpen size={16} />
            <span>Open Evaluator Guide</span>
          </button>
        </div>
      </section>
    </div>
  );
}
