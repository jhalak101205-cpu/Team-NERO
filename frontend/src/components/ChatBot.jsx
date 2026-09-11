import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Bot, Send, User, ShieldCheck, AlertCircle, Sparkles, RefreshCw, HelpCircle } from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  "What is the digitization percentage and active disputes in Punjab?",
  "Compare land record digitization between Karnataka and Bihar.",
  "Which state among the 5 has the lowest average resolution time?",
  "What is the ULPIN coverage in Kerala?", // Unlisted state to test strict grounding fallback
  "Explain what acquisition_delay_rate_pct means."
];

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I am the Grounded Land Governance Chatbot. I answer questions strictly using a fixed official statistics table for Punjab, Karnataka, Tamil Nadu, Bihar, and Rajasthan. I will never guess or extrapolate beyond this verified dataset.",
      grounded_in: "fixed_kpi_table",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (questionToSend) => {
    const queryText = (questionToSend || input).trim();
    if (!queryText || loading) return;

    setErrorMessage(null);
    setInput('');

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/chat', {
        question: queryText
      });

      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: res.data?.answer || "No response received.",
        grounded_in: res.data?.grounded_in || "fixed_kpi_table",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      const detail = err.response?.data?.detail || err.message || "Failed to contact backend";
      setErrorMessage(`Backend Error: ${detail}. Please ensure http://localhost:8000 is reachable.`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}>
              <Bot size={26} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', fontWeight: 700 }}>
                  Grounded AI Land Governance Chatbot
                </h2>
                <span className="badge badge-emerald" style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  Feature 3
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Strictly answers using a verified in-memory statistics table for 5 states: <strong>Punjab, Karnataka, Tamil Nadu, Bihar, and Rajasthan</strong>.
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.85rem',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: '#6ee7b7'
          }}>
            <ShieldCheck size={16} />
            <span>Zero Hallucination Guarantee</span>
          </div>
        </div>
      </div>

      {/* Suggested Questions */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <Sparkles size={14} color="#06b6d4" />
          <span>Quick prompt ideas:</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid var(--border-color)',
                color: '#cbd5e1',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-indigo)'; e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = '#cbd5e1'; }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Card */}
      <div className="glass-panel" style={{
        display: 'flex',
        flexDirection: 'column',
        height: '560px',
        overflow: 'hidden'
      }}>
        {/* Messages Scroll Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem'
        }}>
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  gap: '0.75rem',
                  alignItems: 'flex-start'
                }}
              >
                {!isUser && (
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <Bot size={18} color="#ffffff" />
                  </div>
                )}

                <div style={{
                  maxWidth: '75%',
                  background: isUser
                    ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                    : 'rgba(19, 27, 46, 0.95)',
                  border: isUser
                    ? '1px solid rgba(99, 102, 241, 0.5)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  padding: '1rem 1.25rem',
                  color: '#f8fafc',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                  {/* Sender Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    marginBottom: '0.4rem',
                    fontSize: '0.75rem',
                    color: isUser ? 'rgba(255, 255, 255, 0.8)' : 'var(--text-muted)'
                  }}>
                    <span style={{ fontWeight: 600 }}>{isUser ? 'You' : 'Grounded Assistant'}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Message Body */}
                  <div style={{
                    fontSize: '0.92rem',
                    lineHeight: '1.55',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {msg.text}
                  </div>

                  {/* Bot Grounding Badge */}
                  {!isUser && msg.grounded_in && (
                    <div style={{
                      marginTop: '0.75rem',
                      paddingTop: '0.5rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.72rem',
                      color: '#34d399'
                    }}>
                      <ShieldCheck size={13} />
                      <span>Grounded in fixed KPI table (zero external hallucination)</span>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <User size={18} color="#ffffff" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Bot size={18} color="#ffffff" />
              </div>
              <div style={{
                background: 'rgba(19, 27, 46, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px 16px 16px 4px',
                padding: '0.85rem 1.25rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.88rem'
              }}>
                <RefreshCw size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Consulting verified KPI table & generating grounded response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            borderTop: '1px solid rgba(239, 68, 68, 0.3)',
            borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '0.75rem 1.5rem',
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Input Bar */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-color)',
          background: 'rgba(11, 15, 25, 0.7)',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center'
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about Punjab, Karnataka, Tamil Nadu, Bihar, or Rajasthan land stats..."
            disabled={loading}
            style={{
              flex: 1,
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '0.85rem 1.25rem',
              color: '#f8fafc',
              fontSize: '0.92rem',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-indigo)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="btn-primary"
            style={{
              padding: '0.85rem 1.4rem',
              borderRadius: '12px',
              opacity: loading || !input.trim() ? 0.5 : 1
            }}
          >
            <Send size={16} />
            <span>Send</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
