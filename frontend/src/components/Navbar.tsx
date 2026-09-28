import React from 'react';
import { ShieldAlert, Database, RefreshCw, Terminal, Layers } from 'lucide-react';
import type { MemoryBankInfo } from '../types';

interface NavbarProps {
  activeTab: 'workbench' | 'memory' | 'history';
  setActiveTab: (tab: 'workbench' | 'memory' | 'history') => void;
  bankInfo: MemoryBankInfo | null;
  onResetDemo: () => void;
  isResetting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  bankInfo,
  onResetDemo,
  isResetting,
}) => {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '12px 24px',
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
          }}>
            <ShieldAlert size={24} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                NEXORA
              </span>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '6px',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#A5B4FC',
                border: '1px solid rgba(99, 102, 241, 0.4)',
              }}>
                HINDSIGHT MEMORY AGENT
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
              AI Incident Intelligence & Institutional Memory
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('workbench')}
            className={activeTab === 'workbench' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Terminal size={16} />
            Incident Workbench
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={activeTab === 'memory' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Database size={16} />
            Hindsight Memory Bank
            {bankInfo && (
              <span style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '9999px',
                padding: '1px 6px',
                fontSize: '0.7rem',
                marginLeft: '4px',
              }}>
                {bankInfo.total_memories}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Layers size={16} />
            Incident Archive
          </button>
        </nav>

        {/* Live Status & Demo Reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Hindsight Status Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-subtle)',
            padding: '6px 12px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
          }}>
            <span className="pulse-indicator" style={{
              backgroundColor: bankInfo?.connected ? '#10B981' : '#F59E0B',
              boxShadow: bankInfo?.connected ? '0 0 10px #10B981' : '0 0 10px #F59E0B',
            }} />
            <span style={{ color: 'var(--text-muted)' }}>Hindsight Bank:</span>
            <span className="font-mono" style={{ color: '#E2E8F0', fontWeight: 600 }}>
              {bankInfo?.bank_id || 'nexora-incident-intelligence'}
            </span>
          </div>

          {/* 1-Click Demo Reset */}
          <button
            onClick={onResetDemo}
            disabled={isResetting}
            className="btn-secondary"
            title="Reset system state for a fresh demo run"
            style={{ padding: '8px 14px', fontSize: '0.8rem', color: '#94A3B8' }}
          >
            <RefreshCw size={14} className={isResetting ? 'animate-spin' : ''} />
            {isResetting ? 'Resetting...' : 'Reset Demo'}
          </button>
        </div>
      </div>
    </header>
  );
};
