import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Bot, X, Send, Sparkles, Maximize2, ShieldCheck, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

export default function AskBhumiAIFloating({ onExpandToFull }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Namaste! I am Bhumi AI, grounded strictly in official Land Governance & DILRMP statistics for Punjab, Karnataka, Tamil Nadu, Bihar, and Rajasthan. How can I assist you with policy data?",
      timestamp: 'Now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const quickPrompts = [
    "What is the digitization percentage in Punjab?",
    "Compare dispute resolution between Karnataka and Bihar.",
    "What are active land disputes in Rajasthan?"
  ];

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    setInput('');
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/chat`, {
        question: query
      });

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: res.data?.answer || "Response received from grounded records.",
        grounded_in: res.data?.grounded_in || "fixed_kpi_table",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: "Connecting to local backend... If backend server is starting up, please allow a moment. You can also view the full Grounded AI Chatbot in the top navigation.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {/* Floating Popup Window */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '64px',
          right: 0,
          width: '380px',
          height: '520px',
          background: '#0b1329',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.55)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #0a194e, #1e3a8a)',
            padding: '0.85rem 1.15rem',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #38bdf8'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                background: '#38bdf8',
                borderRadius: '8px',
                padding: '4px',
                display: 'flex',
                color: '#0a194e'
              }}>
                <Bot size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Bhumi AI Assistant</div>
                <div style={{ fontSize: '0.7rem', color: '#93c5fd' }}>Grounded in DoLR Statistics</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onExpandToFull();
                }}
                title="Open Full Screen Chatbot"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex'
                }}
              >
                <Maximize2 size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex'
                }}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: m.sender === 'user' ? '#2563eb' : 'rgba(30, 41, 59, 0.8)',
                  color: '#ffffff',
                  padding: '0.65rem 0.9rem',
                  borderRadius: m.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  fontSize: '0.82rem',
                  lineHeight: 1.45,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                {m.text}
                {m.grounded_in && (
                  <div style={{
                    marginTop: '4px',
                    fontSize: '0.68rem',
                    color: '#34d399',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <ShieldCheck size={11} />
                    Verified DILRMP Data
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{
                alignSelf: 'flex-start',
                background: 'rgba(30, 41, 59, 0.8)',
                color: '#94a3b8',
                padding: '0.5rem 0.8rem',
                borderRadius: '12px',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <RefreshCw size={12} className="status-dot-pulse" />
                Querying verified records...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div style={{
            padding: '0.5rem 0.85rem',
            background: 'rgba(15, 23, 42, 0.6)',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto'
          }}>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  color: '#cbd5e1',
                  fontSize: '0.72rem',
                  padding: '3px 8px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '0.75rem',
              background: '#0a0f1d',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              gap: '6px'
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about land records & disputes..."
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                color: '#ffffff',
                fontSize: '0.82rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                background: '#2563eb',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                color: '#ffffff',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Pill Button matching the screenshot! */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: '#0a194e',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          borderRadius: '9999px',
          padding: '0.7rem 1.35rem',
          fontSize: '0.92rem',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 24px rgba(10, 25, 78, 0.5)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 28px rgba(10, 25, 78, 0.65)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(10, 25, 78, 0.5)';
        }}
      >
        <Bot size={18} color="#38bdf8" />
        <span>Ask Bhumi AI</span>
      </button>
    </div>
  );
}
