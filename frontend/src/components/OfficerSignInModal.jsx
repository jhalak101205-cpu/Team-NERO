import React, { useState } from 'react';
import { X, Lock, Shield, UserCheck, Key, CheckCircle, Building } from 'lucide-react';
import StateEmblem from './StateEmblem';

export default function OfficerSignInModal({ isOpen, onClose, currentOfficer, setCurrentOfficer }) {
  if (!isOpen) return null;

  const demoRoles = [
    {
      id: 'dolr_js',
      name: 'Shri R. K. Sharma, IAS',
      role: 'Joint Secretary (Land Governance)',
      department: 'Department of Land Resources (DoLR), MoRD',
      clearance: 'Level-4 (National Policy Oversight)',
      badgeColor: '#1d4ed8'
    },
    {
      id: 'dm_ludhiana',
      name: 'Ms. Ananya Roy, IAS',
      role: 'District Magistrate & Collector',
      department: 'District Revenue Administration, Ludhiana',
      clearance: 'Level-3 (District Cadastral & Lok Adalat)',
      badgeColor: '#059669'
    },
    {
      id: 'survey_officer',
      name: 'Er. Vikramaditya Patel',
      role: 'Chief Cadastral Survey Officer',
      department: 'DILRMP Drone & GIS Survey Directorate',
      clearance: 'Level-2 (Spatial Boundary & ULPIN Verification)',
      badgeColor: '#d97706'
    }
  ];

  const handleSelectRole = (officer) => {
    setCurrentOfficer(officer);
    onClose();
  };

  const handleLogout = () => {
    setCurrentOfficer(null);
    onClose();
  };

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
        maxWidth: '540px',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          background: '#0a194e',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '3px solid #1d4ed8'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: '#ffffff',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <StateEmblem width={22} height={26} color="#0a194e" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                MeriPehchaan / Parichay SSO
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#93c5fd', margin: '2px 0 0 0' }}>
                National Single Sign-On for Government Officials
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

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{
            background: '#f1f5f9',
            borderRadius: '10px',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            color: '#334155',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <Shield size={18} color="#0a194e" style={{ flexShrink: 0 }} />
            <span>
              Select an official role below for instant authenticated access to departmental views and simulation parameters.
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {demoRoles.map((role) => {
              const isSelected = currentOfficer?.id === role.id;
              return (
                <div
                  key={role.id}
                  onClick={() => handleSelectRole(role)}
                  style={{
                    border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    background: isSelected ? '#eff6ff' : '#ffffff',
                    borderRadius: '12px',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.12)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: role.badgeColor,
                      flexShrink: 0
                    }}>
                      <UserCheck size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                        {role.name}
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: role.badgeColor, marginTop: '2px' }}>
                        {role.role}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '3px' }}>
                        {role.department}
                      </div>
                      <div style={{
                        display: 'inline-block',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: '#475569',
                        background: '#e2e8f0',
                        borderRadius: '4px',
                        padding: '1px 6px',
                        marginTop: '6px'
                      }}>
                        {role.clearance}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span style={{
                      background: '#2563eb',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      borderRadius: '20px',
                      padding: '3px 8px'
                    }}>
                      ACTIVE
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {currentOfficer ? (
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1px solid #ef4444',
                color: '#ef4444',
                fontWeight: 600,
                fontSize: '0.85rem',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                cursor: 'pointer'
              }}
            >
              Sign Out
            </button>
          ) : <div />}
          <button
            onClick={onClose}
            style={{
              background: '#0a194e',
              border: 'none',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.85rem',
              borderRadius: '8px',
              padding: '0.55rem 1.25rem',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
