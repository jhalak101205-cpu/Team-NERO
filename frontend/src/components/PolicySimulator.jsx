import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  MapContainer, 
  TileLayer, 
  Polyline, 
  Marker, 
  Popup,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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
  Globe,
  Navigation,
  CheckCircle2,
  MapPin,
  Compass,
  Settings
} from 'lucide-react';

// Fix Leaflet default icon URLs in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Database of Major Indian Cities and Infrastructure Nodes
const INDIAN_CITIES_DB = {
  'MORADABAD': { lat: 28.8386, lng: 78.7733 },
  'DELHI': { lat: 28.6139, lng: 77.2090 },
  'NEW DELHI': { lat: 28.6139, lng: 77.2090 },
  'NCR': { lat: 28.6139, lng: 77.2090 },
  'LUDHIANA': { lat: 30.9010, lng: 75.8573 },
  'JALANDHAR': { lat: 31.3260, lng: 75.5762 },
  'MUMBAI': { lat: 19.0760, lng: 72.8777 },
  'PUNE': { lat: 18.5204, lng: 73.8567 },
  'BENGALURU': { lat: 12.9716, lng: 77.5946 },
  'BANGALORE': { lat: 12.9716, lng: 77.5946 },
  'CHENNAI': { lat: 13.0827, lng: 80.2707 },
  'HYDERABAD': { lat: 17.3850, lng: 78.4867 },
  'KOLKATA': { lat: 22.5726, lng: 88.3639 },
  'JAIPUR': { lat: 26.9124, lng: 75.7873 },
  'AHMEDABAD': { lat: 23.0225, lng: 72.5714 },
  'LUCKNOW': { lat: 26.8467, lng: 80.9462 },
  'VARANASI': { lat: 25.3176, lng: 82.9739 },
  'AGRA': { lat: 27.1767, lng: 78.0081 },
  'KANPUR': { lat: 26.4499, lng: 80.3319 },
  'CHANDIGARH': { lat: 30.7333, lng: 76.7794 },
  'AMRITSAR': { lat: 31.6340, lng: 74.8723 },
  'BHOPAL': { lat: 23.2599, lng: 77.4126 },
  'INDORE': { lat: 22.7196, lng: 75.8577 },
  'NAGPUR': { lat: 21.1458, lng: 79.0882 },
  'PATNA': { lat: 25.5941, lng: 85.1376 },
  'RANCHI': { lat: 23.3441, lng: 85.3096 },
  'BHUBANESWAR': { lat: 20.2961, lng: 85.8245 },
  'GUWAHATI': { lat: 26.1445, lng: 91.7362 },
  'DEHRADUN': { lat: 30.3165, lng: 78.0322 },
  'SHIMLA': { lat: 31.1048, lng: 77.1734 },
  'SURAT': { lat: 21.1702, lng: 72.8311 },
  'VADODARA': { lat: 22.3072, lng: 73.1812 },
  'COIMBATORE': { lat: 11.0168, lng: 76.9558 },
  'KOCHI': { lat: 9.9312, lng: 76.2673 },
  'THIRUVANANTHAPURAM': { lat: 8.5241, lng: 76.9366 },
  'VISAKHAPATNAM': { lat: 17.6868, lng: 83.2185 },
  'VIJAYAWADA': { lat: 16.5062, lng: 80.6480 },
  'MEERUT': { lat: 28.9845, lng: 77.7064 },
  'BAREILLY': { lat: 28.3670, lng: 79.4304 },
  'ALIGARH': { lat: 27.8974, lng: 78.0880 },
  'MATHURA': { lat: 27.4924, lng: 77.6737 },
  'GWALIOR': { lat: 26.2183, lng: 78.1828 },
  'KOTA': { lat: 25.2138, lng: 75.8648 },
  'NASHIK': { lat: 19.9975, lng: 73.7898 }
};

// Map View Auto-Fit Controller
function MapController({ startLat, startLng, endLat, endLng }) {
  const map = useMap();
  useEffect(() => {
    if (startLat && startLng && endLat && endLng) {
      try {
        map.fitBounds([
          [startLat, startLng],
          [endLat, endLng]
        ], { padding: [40, 40], maxZoom: 12 });
      } catch (e) {
        console.error("Leaflet fitBounds error:", e);
      }
    }
  }, [startLat, startLng, endLat, endLng, map]);
  return null;
}

// Custom Waypoint Marker Icons
const originIcon = L.divIcon({
  className: 'custom-origin-icon',
  html: `<div style="background:#10b981; width:16px; height:16px; border-radius:50%; border:3px solid #ffffff; box-shadow:0 0 12px rgba(16,185,129,0.9);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const destIcon = L.divIcon({
  className: 'custom-dest-icon',
  html: `<div style="background:#ef4444; width:16px; height:16px; border-radius:50%; border:3px solid #ffffff; box-shadow:0 0 12px rgba(239,68,68,0.9);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

export default function PolicySimulator() {
  // Sector Domain State
  const [selectedDomain, setSelectedDomain] = useState('highway');
  const [domains, setDomains] = useState([]);

  // Spatial Route Alignment State (Point A to Point B) - Defaults to Moradabad -> Delhi
  const [startCity, setStartCity] = useState('MORADABAD');
  const [endCity, setEndCity] = useState('DELHI');
  const [startLat, setStartLat] = useState(28.8386);
  const [startLng, setStartLng] = useState(78.7733);
  const [endLat, setEndLat] = useState(26.9124); // Delhi NCR / Central coordinates
  const [endLng, setEndLng] = useState(77.2090);

  // Custom Scope State
  const [customBudgetCr, setCustomBudgetCr] = useState('');
  const [customLandHa, setCustomLandHa] = useState('');

  // Slider Input States
  const [ulpinPct, setUlpinPct] = useState(68.2);
  const [vectorPct, setVectorPct] = useState(76.5);
  const [dbtDays, setDbtDays] = useState(90);
  const [siaDays, setSiaDays] = useState(60);
  const [adrRate, setAdrRate] = useState(20);
  const [govtSwapPct, setGovtSwapPct] = useState(10);

  // Active View Tab: 'admin' (Land Governance) or 'socio' (Citizen Impact USP)
  const [viewTab, setViewTab] = useState('admin');

  // Simulation API Output
  const [simResult, setSimResult] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeScenarioId, setActiveScenarioId] = useState(null);

  // Fetch preset scenarios & initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [scenariosRes, domainsRes] = await Promise.all([
        axios.get('http://localhost:8000/api/simulator/scenarios').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/simulator/domains').catch(() => ({ data: [] }))
      ]);

      if (scenariosRes.data) setScenarios(scenariosRes.data);
      if (domainsRes.data) setDomains(domainsRes.data);

      await runSimulation(selectedDomain, ulpinPct, vectorPct, dbtDays, siaDays, adrRate, govtSwapPct, customBudgetCr, customLandHa, startCity, endCity, startLat, startLng, endLat, endLng);
    } catch (err) {
      console.error("Error loading simulator initial data:", err);
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async (domain, uPct, vPct, dDays, sDays, aRate, gSwap, budgetCr, landHa, sCity, eCity, sLat, sLng, eLat, eLng) => {
    try {
      const payload = {
        project_domain: domain,
        ulpin_pct: uPct,
        vector_pct: vPct,
        dbt_days: dDays,
        sia_days: sDays,
        adr_rate: aRate,
        govt_swap_pct: gSwap,
        custom_budget_cr: budgetCr ? parseFloat(budgetCr) : null,
        custom_land_ha: landHa ? parseFloat(landHa) : null,
        start_city: sCity,
        end_city: eCity,
        start_lat: parseFloat(sLat),
        start_lng: parseFloat(sLng),
        end_lat: parseFloat(eLat),
        end_lng: parseFloat(eLng)
      };

      const res = await axios.post('http://localhost:8000/api/simulator/predict', payload);
      if (res.data) setSimResult(res.data);
    } catch (err) {
      console.error("Simulation API error:", err);
    }
  };

  // Handle start city text input & auto coordinate resolution
  const handleStartCityChange = (val) => {
    setStartCity(val);
    if (!val) return;
    const clean = val.trim().toUpperCase();
    for (const [key, coords] of Object.entries(INDIAN_CITIES_DB)) {
      if (clean === key || clean.includes(key) || key.includes(clean)) {
        setStartLat(coords.lat);
        setStartLng(coords.lng);
        break;
      }
    }
  };

  // Handle end city text input & auto coordinate resolution
  const handleEndCityChange = (val) => {
    setEndCity(val);
    if (!val) return;
    const clean = val.trim().toUpperCase();
    for (const [key, coords] of Object.entries(INDIAN_CITIES_DB)) {
      if (clean === key || clean.includes(key) || key.includes(clean)) {
        setEndLat(coords.lat);
        setEndLng(coords.lng);
        break;
      }
    }
  };

  // Select Quick Corridor Preset
  const handleSelectCorridor = (sName, sLat, sLng, eName, eLat, eLng) => {
    setStartCity(sName);
    setStartLat(sLat);
    setStartLng(sLng);
    setEndCity(eName);
    setEndLat(eLat);
    setEndLng(eLng);
  };

  // Slider Change Handler
  const handleSliderChange = (setter, value) => {
    setActiveScenarioId(null);
    setter(value);
  };

  // Sector Change Handler
  const handleDomainChange = (domainId) => {
    setSelectedDomain(domainId);
    runSimulation(domainId, ulpinPct, vectorPct, dbtDays, siaDays, adrRate, govtSwapPct, customBudgetCr, customLandHa, startCity, endCity, startLat, startLng, endLat, endLng);
  };

  // Debounced execution when inputs settle
  useEffect(() => {
    const timer = setTimeout(() => {
      runSimulation(selectedDomain, ulpinPct, vectorPct, dbtDays, siaDays, adrRate, govtSwapPct, customBudgetCr, customLandHa, startCity, endCity, startLat, startLng, endLat, endLng);
    }, 150);
    return () => clearTimeout(timer);
  }, [selectedDomain, ulpinPct, vectorPct, dbtDays, siaDays, adrRate, govtSwapPct, customBudgetCr, customLandHa, startCity, endCity, startLat, startLng, endLat, endLng]);

  // Apply Preset Scenario
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
    setSelectedDomain('highway');
    setStartCity('MORADABAD');
    setEndCity('DELHI');
    setStartLat(28.8386);
    setStartLng(78.7733);
    setEndLat(28.6139);
    setEndLng(77.2090);
    setUlpinPct(68.2);
    setVectorPct(76.5);
    setDbtDays(90);
    setSiaDays(60);
    setAdrRate(20);
    setGovtSwapPct(10);
    setCustomBudgetCr('');
    setCustomLandHa('');
  };

  const admin = simResult?.administrative_metrics;
  const socio = simResult?.socio_economic_usp_metrics;
  const routeLoc = simResult?.route_location;
  const currentDomain = simResult?.domain;

  const mapCenter = [(startLat + endLat) / 2, (startLng + endLng) / 2];

  return (
    <div style={{ maxWidth: '1440px', margin: '2rem auto 4rem auto', padding: '0 1.5rem' }}>
      
      {/* 1. HEADER BANNER */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '1.25rem' }}>
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
                  Spatial Policy & Acquisition Simulator
                </h2>
                <span className="badge badge-purple" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                  Point A → B Feasibility
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                Predictive Governance & Citizen Impact Engine for DoLR & Ministry of Rural Development (SIH 2026 PS 26019)
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

      {/* 2. DIVERSE POLICY SECTOR SELECTOR BAR */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
          <Globe size={15} color="#38bdf8" />
          <span>Select Infrastructure & Policy Project Sector:</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
          {domains.map((dom) => {
            const isSelected = selectedDomain === dom.id;
            return (
              <button
                key={dom.id}
                onClick={() => handleDomainChange(dom.id)}
                style={{
                  textAlign: 'left',
                  padding: '0.85rem',
                  borderRadius: '10px',
                  background: isSelected ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.15))' : 'rgba(15, 23, 42, 0.6)',
                  border: isSelected ? '1px solid #818cf8' : '1px solid var(--border-color)',
                  color: isSelected ? '#ffffff' : '#cbd5e1',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? '0 4px 14px rgba(99, 102, 241, 0.25)' : 'none'
                }}
              >
                <div style={{ fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{dom.name.split(" ")[0]} {dom.name.split(" ").slice(1).join(" ")}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: isSelected ? '#c084fc' : 'var(--text-muted)', marginTop: '0.25rem', fontWeight: 600 }}>
                  {dom.category}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN SPLIT GRID (CONTROL PANEL ON LEFT + ANALYTICS ON RIGHT) */}
      <div style={{ display: 'grid', gridTemplateColumns: '410px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* ================= LEFT CONTROLS ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {/* Spatial Route / Location Marker Panel (Point A to Point B) */}
          <div className="glass-panel" style={{ padding: '1.25rem', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
            <div style={{ color: '#34d399', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Navigation size={17} />
              <span>Project Route & Location Selector (Point A → B)</span>
            </div>

            {/* Quick Corridor Selection Presets */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Popular Corridor Presets:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                <button
                  type="button"
                  onClick={() => handleSelectCorridor('MORADABAD', 28.8386, 78.7733, 'DELHI', 28.6139, 77.2090)}
                  style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#a7f3d0', fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  📍 Moradabad → Delhi
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCorridor('DELHI', 28.6139, 77.2090, 'JAIPUR', 26.9124, 75.7873)}
                  style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', color: '#bae6fd', fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  📍 Delhi → Jaipur
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCorridor('MUMBAI', 19.0760, 72.8777, 'PUNE', 18.5204, 73.8567)}
                  style={{ background: 'rgba(192, 132, 252, 0.15)', border: '1px solid rgba(192, 132, 252, 0.4)', color: '#e9d5ff', fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  📍 Mumbai → Pune
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCorridor('LUDHIANA', 30.9010, 75.8573, 'JALANDHAR', 31.3260, 75.5762)}
                  style={{ background: 'rgba(251, 191, 36, 0.15)', border: '1px solid rgba(251, 191, 36, 0.4)', color: '#fef08a', fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  📍 Ludhiana → Jalandhar
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Point A (Origin)</label>
                <input 
                  type="text"
                  value={startCity}
                  onChange={(e) => handleStartCityChange(e.target.value)}
                  placeholder="e.g. MORADABAD"
                  style={{
                    width: '100%',
                    background: 'rgba(30, 41, 59, 0.7)',
                    border: '1px solid var(--border-color)',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '6px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Point B (Destination)</label>
                <input 
                  type="text"
                  value={endCity}
                  onChange={(e) => handleEndCityChange(e.target.value)}
                  placeholder="e.g. DELHI"
                  style={{
                    width: '100%',
                    background: 'rgba(30, 41, 59, 0.7)',
                    border: '1px solid var(--border-color)',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '6px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Custom Scope (Budget & Land) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Base Budget (₹ Cr)</label>
                <input 
                  type="number"
                  placeholder={`Default: ${currentDomain?.base_project_cost_cr || 500}`}
                  value={customBudgetCr}
                  onChange={(e) => setCustomBudgetCr(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid var(--border-color)',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    padding: '0.35rem 0.6rem',
                    borderRadius: '6px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Land Needed (ha)</label>
                <input 
                  type="number"
                  placeholder={`Default: ${currentDomain?.total_project_land_ha || 1800}`}
                  value={customLandHa}
                  onChange={(e) => setCustomLandHa(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid var(--border-color)',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    padding: '0.35rem 0.6rem',
                    borderRadius: '6px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

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
              <span>Policy Reform Levers</span>
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

        {/* ================= RIGHT PREDICTIVE DASHBOARD ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* SPATIAL LOCATION SUITABILITY BANNER */}
          {routeLoc && (
            <div className="glass-panel" style={{ padding: '1.1rem', border: `1px solid ${routeLoc.suitability_color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Compass size={20} color={routeLoc.suitability_color} />
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: routeLoc.suitability_color }}>
                    {routeLoc.suitability_rating} ({routeLoc.suitability_score}%)
                  </span>
                </div>
                <span className="badge badge-emerald">
                  Corridor Distance: {routeLoc.route_distance_km} km
                </span>
              </div>
              
              <div style={{ fontSize: '0.82rem', color: '#f8fafc', lineHeight: '1.45', background: 'rgba(15, 23, 42, 0.6)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                {routeLoc.optimal_recommendation}
              </div>
            </div>
          )}

          {/* INTERACTIVE ROUTE ALIGNMENT PREVIEW MAP */}
          <div style={{ position: 'relative', height: '240px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
            <MapContainer 
              center={mapCenter} 
              zoom={8} 
              style={{ width: '100%', height: '100%', background: '#0f172a' }}
              scrollWheelZoom={false}
            >
              <TileLayer 
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                attribution="Esri World Street Map"
              />
              <MapController startLat={startLat} startLng={startLng} endLat={endLat} endLng={endLng} />
              <Marker position={[startLat, startLng]} icon={originIcon}>
                <Popup><strong>{startCity}</strong><br/>Corridor Start (Point A)</Popup>
              </Marker>
              <Marker position={[endLat, endLng]} icon={destIcon}>
                <Popup><strong>{endCity}</strong><br/>Corridor End (Point B)</Popup>
              </Marker>
              <Polyline 
                positions={[[startLat, startLng], [endLat, endLng]]}
                pathOptions={{ color: '#10b981', weight: 4, opacity: 0.85, dashArray: '6, 6' }}
              />
            </MapContainer>
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              zIndex: 1000,
              background: 'rgba(15, 23, 42, 0.85)',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: '#ffffff',
              fontWeight: 600,
              backdropFilter: 'blur(6px)'
            }}>
              🟢 {startCity} → 🔴 {endCity} ({routeLoc?.route_distance_km || 160.2} km)
            </div>
          </div>

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
                      Acquisition Completion Trajectory (S-Curve) — {currentDomain?.name}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Cumulative Land Parcel Acquisition Completion over Project Months
                    </p>
                  </div>
                  <span className="badge badge-emerald">Sector Predictive Model</span>
                </div>

                <div style={{ width: '100%', height: '240px' }}>
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
                      <Area type="monotone" dataKey="baseline_pct" name={`Baseline Trajectory (${admin.baseline_months} M)`} stroke="#ef4444" fillOpacity={1} fill="url(#baselineGrad)" strokeWidth={2} strokeDasharray="4 4" />
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
                    <span>Citizen & Human Impact Predictor — {currentDomain?.name}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#d1fae5', marginTop: '0.2rem' }}>
                    Predictive analysis of direct social welfare, household expense savings, traffic decongestion, and job creation.
                  </p>
                </div>
                <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.2)', padding: '0.35rem 0.75rem', borderRadius: '20px', fontWeight: 600 }}>
                  Social Impact Assessment (SIA)
                </span>
              </div>

              {/* 4 Socio-Economic Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                
                {/* Socio KPI 1: Primary Sector Metric */}
                <div className="glass-panel" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentDomain?.primary_metric_label || 'Daily Fuel Saved'}</span>
                    <Fuel size={16} color="#38bdf8" />
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#38bdf8' }}>
                    {socio.domain_primary_str}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#34d399', marginTop: '0.2rem' }}>
                    ₹ {socio.annual_household_savings_rs.toLocaleString()}/yr per family
                  </div>
                </div>

                {/* Socio KPI 2: Secondary Sector Metric */}
                <div className="glass-panel" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentDomain?.secondary_metric_label || 'Traffic Decongestion'}</span>
                    <Car size={16} color="#34d399" />
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#34d399' }}>
                    {socio.domain_secondary_str}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {socio.baseline_travel_time_mins}m → {socio.simulated_travel_time_mins}m peak commute
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
                    {socio.direct_construction_jobs.toLocaleString()} Direct
                  </div>
                </div>

                {/* Socio KPI 4: Farm Income */}
                <div className="glass-panel" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Agri & Land Appreciation</span>
                    <Wheat size={16} color="#f59e0b" />
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f59e0b' }}>
                    +{socio.farm_income_boost_pct}% <span style={{ fontSize: '0.75rem', color: '#fef3c7' }}>Income</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Land Value: {socio.surrounding_land_appreciation_mult}x
                  </div>
                </div>

              </div>

              {/* Employment Creation Multiplier Bar Chart */}
              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: '#f8fafc', fontWeight: 700, marginBottom: '0.75rem' }}>
                  Employment Creation Breakdown (Direct Sector vs Indirect Supply Chain)
                </h4>
                
                <div style={{ width: '100%', height: '180px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={[
                        { name: 'Direct Execution Jobs', jobs: socio.direct_construction_jobs },
                        { name: 'Indirect Supply Chain Jobs', jobs: socio.indirect_logistics_jobs },
                        { name: 'Total Employment Multiplier', jobs: socio.total_jobs_created }
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
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Crop Loss & Supply Efficiency</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#34d399', marginTop: '0.2rem' }}>
                    {socio.perishable_crop_loss_reduction_pct}% <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Saved</span>
                  </div>
                  <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    Optimized transport prevents supply chain and agricultural crop losses.
                  </p>
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '0.85rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Land Value Appreciation</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#c084fc', marginTop: '0.2rem' }}>
                    {socio.surrounding_land_appreciation_mult}x <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Multiplier</span>
                  </div>
                  <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    Circle rate appreciation for surrounding landholders.
                  </p>
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '0.85rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Household Expense Reduction</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f59e0b', marginTop: '0.2rem' }}>
                    ₹ {socio.annual_household_savings_rs.toLocaleString()} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ yr</span>
                  </div>
                  <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    Out-of-pocket annual transport & energy expense reduction per family.
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
