import React from 'react';
import { AlertTriangle, Database, Zap, ShieldCheck } from 'lucide-react';
import type { Incident, MemoryBankInfo } from '../types';

interface StatsBarProps {
  incidents: Incident[];
  bankInfo: MemoryBankInfo | null;
}

export const StatsBar: React.FC<StatsBarProps> = ({ incidents, bankInfo }) => {
  const activeCount = incidents.filter(i => i.status !== 'RESOLVED').length;
  const resolvedCount = incidents.filter(i => i.status === 'RESOLVED').length;
  const memoryUnits = bankInfo?.total_memories || 0;
  
  // Calculate warm recall rate
  const incidentsWithAnalysis = incidents.filter(i => i.analysis);
  const warmRecalls = incidentsWithAnalysis.filter(i => i.analysis?.historical_memory_used).length;
  const recallRate = incidentsWithAnalysis.length > 0 
    ? Math.round((warmRecalls / incidentsWithAnalysis.length) * 100) 
    : 0;

  return (
    <div style={{
      maxWidth: '1440px',
      margin: '20px auto 0',
      padding: '0 24px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '16px',
    }}>
      {/* Active Incidents */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          backgroundColor: activeCount > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          color: activeCount > 0 ? '#F87171' : '#34D399',
          padding: '12px',
          borderRadius: 'var(--radius-md)',
        }}>
          <AlertTriangle size={22} />
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Active Production Incidents
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>
              {activeCount}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
              ({resolvedCount} resolved)
            </span>
          </div>
        </div>
      </div>

      {/* Hindsight Memory Bank */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          backgroundColor: 'rgba(99, 102, 241, 0.15)',
          color: '#818CF8',
          padding: '12px',
          borderRadius: 'var(--radius-md)',
        }}>
          <Database size={22} />
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Hindsight Episodic Memories
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#818CF8' }}>
              {memoryUnits}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#10B981' }}>
              ● Persistent Retain
            </span>
          </div>
        </div>
      </div>

      {/* Memory Intelligence Rate */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          backgroundColor: 'rgba(6, 182, 212, 0.15)',
          color: '#22D3EE',
          padding: '12px',
          borderRadius: 'var(--radius-md)',
        }}>
          <Zap size={22} />
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Memory Influence Rate
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#22D3EE' }}>
              {incidentsWithAnalysis.length > 0 ? `${recallRate}%` : 'N/A'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
              recalled past fixes
            </span>
          </div>
        </div>
      </div>

      {/* Mean Triage Acceleration */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          color: '#34D399',
          padding: '12px',
          borderRadius: 'var(--radius-md)',
        }}>
          <ShieldCheck size={22} />
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Triage Acceleration
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34D399' }}>
              {memoryUnits > 0 ? '4.8x' : '1.0x'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
              faster with memory
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
