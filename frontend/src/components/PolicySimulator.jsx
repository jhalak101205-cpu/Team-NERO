import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Cell,
  Legend 
} from 'recharts';
import { 
  Sliders, 
  Zap, 
  ShieldCheck, 
  TrendingDown, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  Building2, 
  Users, 
  Fuel, 
  Briefcase, 
  Car, 
  Wheat, 
  Sparkles, 
  Printer, 
  RefreshCcw,
  CheckCircle2
} from 'lucide-react';

export default function PolicySimulator() {
  // Slider Input States
  const [ulpinPct, setUlpinPct] = useState(68.2);
  const [vectorPct, setVectorPct] = useState(76.5);
  const [dbtDays, setDbtDays] = useState(90);
  const [siaDays, setSiaDays] = useState(60);
  const [adrRate, setAdrRate] = useState(20);
  const [govtSwapPct, setGovtSwapPct] = useState(10);

  // Active View Tab: 'admin' (Land Governance) or 'socio' (Citizen Impact USP)
  const [viewTab, setViewTab] = useState('admin');

  // Simulation API Data
  const [simResult, setSimResult] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeScenarioId, setActiveScenarioId] = useState(null);

  // Fetch preset scenarios & initial baseline prediction
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const scenariosRes = await axios.get('http://localhost:8000/api/simulator/scenarios').catch(() => ({ data: [] }));
      if (scenariosRes.data) setScenarios(scenariosRes.data);

      await runSimulation(ulpinPct, vectorPct, dbtDays, siaDays, adrRate, govtSwapPct);
    } catch (err) {
      console.error("Error loading simulator initial data:", err);
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async (uPct, vPct, dDays, sDays, aRate, gSwap) => {
    try {
      const res = await axios.post('http://localhost:8000/api/simulator/predict', {
        ulpin_pct: uPct,
        vector_pct: vPct,
        dbt_days: dDays,
        sia_days: sDays,
        adr_rate: aRate,
        govt_swap_pct: gSwap
      });
      if (res.data) setSimResult(res.data);
    } catch (err) {
      console.error("Simulation API error:", err);
    }
  };

  // Slider Change Handlers
  const handleSliderChange = (setter, value) => {
    setActiveScenarioId(null);
    setter(value);
  };

  // Trigger simulation update when sliders settle
  useEffect(() => {
    const timer = setTimeout(() => {
      runSimulation(ulpinPct, vectorPct, dbtDays, siaDays, adrRate, govtSwapPct);
    }, 150);
    return () => clearTimeout(timer);
  }, [ulpinPct, vectorPct, dbtDays, siaDays, adrRate, govtSwapPct]);

  // Handle Preset Scenario Select
  const applyScenario = (sc) => {
    setActiveScenarioId(sc.id);
    setUlpinPct(sc.ulpin_pct);
    setVectorPct(sc.vector_pct);
    setDbtDays(sc.dbt_days);
    setSiaDays(sc.sia_days);
    setAdrRate(sc.adr_rate);
    setGovtSwapPct(sc.govt_swap_pct);
  };

  // Reset to Baseline
  const resetToBaseline = () => {
    setActiveScenarioId(null);
    setUlpinPct(68.2);
    setVectorPct(76.5);
    setDbtDays(90);
    setSiaDays(60);
    setAdrRate(20);
    setGovtSwapPct(10);
  };

  const admin = simResult?.administrative_metrics;
  const socio = simResult?.socio_economic_usp_metrics;

  return (
    <div style={{ maxWidth: '1440px', margin: '2rem auto 4rem auto', padding: '0 1.5rem' }}>
      
      {/* 1. HEADER BANNER */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
            }}>
              <Sliders size={26} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', fontWeight: 700 }}>
                  Policy & Acquisition Simulator
                </h2>
                <span className="badge badge-purple" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                  Feature 4 Dual Engine
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                Evidence-Based Policy Reform Sandbox for DoLR & Ministry of Rural Development (SIH 2026 PS 26019)
              </p>
            </div>
          </div>

          {/* Dual Engine View Switcher */}
          <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.8)', padding: '0.35rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setViewTab('admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: viewTab === 'admin' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                color: viewTab === 'admin' ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Building2 size={16} />
              <span>🏛️ Administrative Feasibility</span>
            </button>
            
            <button
              onClick={() => setViewTab('socio')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: viewTab === 'socio' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
                color: viewTab === 'socio' ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Users size={16} />
              <span>👥 Citizen Socio-Economic Impact (USP)</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. MAIN SPLIT GRID (CONTROL PANEL ON LEFT + ANALYTICS ON RIGHT) */}
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* ================= LEFT POLICY CONTROL SANDBOX ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {/* Preset Quick Scenarios */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f8fafc', fontWeight: 700, fontSize: '0.9rem' }}>
                <Zap size={16} color="#f59e0b" />
                <span>Preset Policy Scenarios</span>
              </div>
              <button
                onClick={resetToBaseline}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <RefreshCcw size={12} />
                <span>Reset</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {scenarios.map((sc) => {
                const isActive = activeScenarioId === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => applyScenario(sc)}
                    style={{
                      textAlign: 'left',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'rgba(30, 41, 59, 0.5)',
                      border: isActive ? '1px solid #818cf8' : '1px solid var(--border-color)',
                      color: isActive ? '#ffffff' : '#cbd5e1',
                      fontSize: '0.8rem',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div>{sc.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      {sc.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Policy Reform Sliders */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.92rem', marginBottom: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sliders size={17} color="#6366f1" />
              <span>Policy Leverage Levers</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Slider 1: ULPIN Saturation */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.8rem' }}>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>ULPIN (Bhu-Aadhaar) Saturation</span>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>{ulpinPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={ulpinPct}
                  onChange={(e) => handleSliderChange(setUlpinPct, parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  <span>0%</span>
                  <span>Baseline: 68.2%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Slider 2: Cadastral Vectorization */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.8rem' }}>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Cadastral GIS Vectorization</span>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>{vectorPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={vectorPct}
                  onChange={(e) => handleSliderChange(setVectorPct, parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#34d399', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  <span>0%</span>
                  <span>Baseline: 76.5%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Slider 3: Compensation DBT Speed */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.8rem' }}>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Compensation DBT Payout Speed</span>
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>{dbtDays} Days</span>
                </div>
                <input
                  type="range"
                  min="7"
                  max="180"
                  step="1"
                  value={dbtDays}
                  onChange={(e) => handleSliderChange(setDbtDays, parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  <span>7 Days (Express)</span>
                  <span>Baseline: 90 Days</span>
                  <span>180 Days</span>
                </div>
              </div>

              {/* Slider 4: Tehsil SIA SLA */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.8rem' }}>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Tehsil SIA & Title SLA</span>
                  <span style={{ color: '#c084fc', fontWeight: 700 }}>{siaDays} Days</span>
                </div>
                <input
                  type="range"
                  min="7"
                  max="120"
                  step="1"
                  value={siaDays}
                  onChange={(e) => handleSliderChange(setSiaDays, parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#c084fc', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  <span>7 Days</span>
                  <span>Baseline: 60 Days</span>
                  <span>120 Days</span>
                </div>
              </div>

              {/* Slider 5: Revenue Fast-Track ADR */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.8rem' }}>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Revenue Court Fast-Track ADR</span>
                  <span style={{ color: '#818cf8', fontWeight: 700 }}>{adrRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={adrRate}
                  onChange={(e) => handleSliderChange(setAdrRate, parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#818cf8', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  <span>0%</span>
                  <span>Baseline: 20%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Slider 6: Govt Land Swap Priority */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.8rem' }}>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Govt Land Bank Swap Priority</span>
                  <span style={{ color: '#f43f5e', fontWeight: 700 }}>{govtSwapPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={govtSwapPct}
                  onChange={(e) => handleSliderChange(setGovtSwapPct, parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#f43f5e', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  <span>0%</span>
                  <span>Baseline: 10%</span>
                  <span>100%</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ================= RIGHT PREDICTIVE ANALYTICS DASHBOARD ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* VIEW TAB 1: 🏛️ ADMINISTRATIVE LAND GOVERNANCE */}
          {viewTab === 'admin' && admin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* 4 Top KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                
                {/* KPI 1: Timeline */}
                <div className="glass-panel" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Acquisition Timeline</span>
                    <Clock size={16} color="#38bdf8" />
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc' }}>
                    {admin.simulated_months} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Months</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <TrendingDown size={14} />
                    <span>Saved {admin.months_saved} Months</span>
                  </div>
                </div>

                {/* KPI 2: Cost Savings */}
                <div className="glass-panel" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Budget Overruns Saved</span>
                    <DollarSign size={16} color="#34d399" />
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#34d399' }}>
                    ₹ {admin.savings_cr} <span style={{ fontSize: '0.8rem', color: '#a7f3d0' }}>Cr</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Total Budget: ₹ {admin.simulated_project_cost_cr} Cr
                  </div>
                </div>

                {/* KPI 3: Litigation Risk */}
                <div className="glass-panel" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Litigation Risk Index</span>
                    <AlertTriangle size={16} color={admin.risk_color} />
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: admin.risk_color }}>
                    {admin.risk_level} <span style={{ fontSize: '0.85rem' }}>({admin.simulated_risk_pct}%)</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Baseline Risk: 34.2%
                  </div>
                </div>

                {/* KPI 4: Govt Land Swap */}
                <div className="glass-panel" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Govt Land Bank Swap</span>
                    <Building2 size={16} color="#c084fc" />
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#c084fc' }}>
                    {admin.govt_land_ha_used} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ha</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {ulpinPct}% ULPIN Verified
                  </div>
                </div>

              </div>

              {/* Acquisition Timeline S-Curve Chart (Recharts AreaChart) */}
              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', color: '#f8fafc', fontWeight: 700 }}>
                      Acquisition Completion Trajectory (S-Curve)
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Cumulative Land Parcel Acquisition Completion over Project Months (0 - 30 M)
                    </p>
                  </div>
                  <span className="badge badge-emerald">Real-Time Predictive Curve</span>
                </div>

                <div style={{ width: '100%', height: '260px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={admin.s_curve_timeline}>
                      <defs>
                        <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="simulatedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="%" domain={[0, 100]} />
                      <RechartsTooltip 
                        contentStyle={{ background: '#0f172a', border: '1px solid #34d399', borderRadius: '8px' }}
                        labelStyle={{ color: '#ffffff' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                      <Area type="monotone" dataKey="baseline_pct" name="Baseline Trajectory (24.5 M)" stroke="#ef4444" fillOpacity={1} fill="url(#baselineGrad)" strokeWidth={2} strokeDasharray="4 4" />
                      <Area type="monotone" dataKey="simulated_pct" name="Simulated Reform Trajectory" stroke="#10b981" fillOpacity={1} fill="url(#simulatedGrad)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Financial Cost Overrun Stacked Comparison Bar Chart */}
              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: '#f8fafc', fontWeight: 700, marginBottom: '0.75rem' }}>
                  Project Budget Overrun & Escalation Comparison (₹ Crores)
                </h4>

                <div style={{ width: '100%', height: '180px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      layout="vertical"
                      data={[
                        { name: 'Baseline (Status Quo)', cost: admin.base_project_cost_cr, fill: '#ef4444' },
                        { name: 'Simulated Reform', cost: admin.simulated_project_cost_cr, fill: '#10b981' }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} unit=" Cr" />
                      <YAxis type="category" dataKey="name" stroke="#cbd5e1" tick={{ fontSize: 11 }} width={160} />
                      <RechartsTooltip 
                        contentStyle={{ background: '#0f172a', border: '1px solid #818cf8', borderRadius: '8px' }}
                      />
                      <Bar dataKey="cost" name="Project Cost (₹ Cr)" radius={[0, 6, 6, 0]}>
                        <Cell fill="#ef4444" />
                        <Cell fill="#10b981" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}

          {/* VIEW TAB 2: 👥 CITIZEN & SOCIO-ECONOMIC IMPACT (YOUR USP) */}
          {viewTab === 'socio' && socio && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* USP Banner */}
              <div style={{
                background: 'linear-gradient(135deg, #059669, #047857)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={18} />
                    <span>Citizen & Human Impact Predictor (SIH 2026 Platform USP)</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#d1fae5', marginTop: '0.2rem' }}>
                    Forecasts direct social welfare, fuel conservation, traffic decongestion, and local employment creation.
                  </p>
                </div>
                <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.2)', padding: '0.35rem 0.75rem', borderRadius: '20px', fontWeight: 600 }}>
                  Social Impact Assessment (SIA)
                </span>
              </div>

              {/* 4 Socio-Economic Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                
                {/* Socio KPI 1: Fuel Saved */}
                <div className="glass-panel" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Daily Fuel Conserved</span>
                    <Fuel size={16} color="#38bdf8" />
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#38bdf8' }}>
                    {socio.daily_fuel_saved_liters.toLocaleString()} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>L/Day</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#34d399', marginTop: '0.2rem' }}>
                    ₹ {socio.annual_household_savings_rs.toLocaleString()}/yr per family
                  </div>
                </div>

                {/* Socio KPI 2: Traffic Decongestion */}
                <div className="glass-panel" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Traffic Decongestion</span>
                    <Car size={16} color="#34d399" />
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#34d399' }}>
                    {socio.traffic_decongestion_pct}% <span style={{ fontSize: '0.75rem', color: '#a7f3d0' }}>Cut</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {socio.baseline_travel_time_mins}m $\rightarrow$ {socio.simulated_travel_time_mins}m peak commute
                  </div>
                </div>

                {/* Socio KPI 3: Job Creation */}
                <div className="glass-panel" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Employment Created</span>
                    <Briefcase size={16} color="#c084fc" />
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#c084fc' }}>
                    {socio.total_jobs_created.toLocaleString()} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Jobs</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {socio.direct_construction_jobs.toLocaleString()} Direct Construction
                  </div>
                </div>

                {/* Socio KPI 4: Farm Income */}
                <div className="glass-panel" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Agri Income Boost</span>
                    <Wheat size={16} color="#f59e0b" />
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f59e0b' }}>
                    +{socio.farm_income_boost_pct}% <span style={{ fontSize: '0.75rem', color: '#fef3c7' }}>Income</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Land Appreciation: {socio.surrounding_land_appreciation_mult}x
                  </div>
                </div>

              </div>

              {/* Employment Creation Multiplier Bar Chart */}
              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: '#f8fafc', fontWeight: 700, marginBottom: '0.75rem' }}>
                  Local Job Creation Breakdown (Direct Infrastructure vs Indirect Logistics)
                </h4>
                
                <div style={{ width: '100%', height: '180px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={[
                        { name: 'Direct Construction', jobs: socio.direct_construction_jobs },
                        { name: 'Indirect Logistics & Warehousing', jobs: socio.indirect_logistics_jobs },
                        { name: 'Total Employment', jobs: socio.total_jobs_created }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                      <RechartsTooltip 
                        contentStyle={{ background: '#0f172a', border: '1px solid #10b981', borderRadius: '8px' }}
                      />
                      <Bar dataKey="jobs" fill="#10b981" radius={[6, 6, 0, 0]}>
                        <Cell fill="#6366f1" />
                        <Cell fill="#38bdf8" />
                        <Cell fill="#10b981" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Agricultural & Household Impact Grid */}
              <div className="glass-panel" style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '0.85rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Crop Loss Reduction</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#34d399', marginTop: '0.2rem' }}>
                    {socio.perishable_crop_loss_reduction_pct}% <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Saved</span>
                  </div>
                  <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    Faster road transport avoids post-harvest perishable crop loss.
                  </p>
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '0.85rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Land Value Appreciation</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#c084fc', marginTop: '0.2rem' }}>
                    {socio.surrounding_land_appreciation_mult}x <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Multiplier</span>
                  </div>
                  <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    Circle rate appreciation for surrounding rural landholders.
                  </p>
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '0.85rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Household Travel Savings</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f59e0b', marginTop: '0.2rem' }}>
                    ₹ {socio.annual_household_savings_rs.toLocaleString()} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ yr</span>
                  </div>
                  <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    Out-of-pocket commuter transport expense reduction per family.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* GROUNDED AI EXECUTIVE SUMMARY & EXPORT BUTTON */}
          {simResult && (
            <div className="glass-panel" style={{ padding: '1.25rem', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#818cf8', fontWeight: 700, fontSize: '0.9rem' }}>
                  <Sparkles size={18} />
                  <span>Grounded AI Executive Narrative & Brief</span>
                </div>
                <button
                  onClick={() => window.print()}
                  className="btn-primary"
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Printer size={14} />
                  <span>Export Policy Brief (PDF)</span>
                </button>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#f8fafc', lineHeight: '1.55', background: 'rgba(15, 23, 42, 0.6)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                {simResult.executive_summary}
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
