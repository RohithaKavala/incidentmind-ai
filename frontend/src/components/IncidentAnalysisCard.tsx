import React, { useState } from 'react';
import { CheckSquare, Square, AlertOctagon, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import type { Incident, IncidentAnalysis } from '../types';

interface IncidentAnalysisCardProps {
  incident: Incident;
  analysis: IncidentAnalysis;
  onOpenResolve: () => void;
}

export const IncidentAnalysisCard: React.FC<IncidentAnalysisCardProps> = ({
  incident,
  analysis,
  onOpenResolve,
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps(prev =>
      prev.includes(stepNumber) ? prev.filter(s => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const confidencePct = Math.round(analysis.confidence_score * 100);

  return (
    <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
      {/* Top Banner with Confidence & Status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '16px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
              AI TRIAGE REPORT & RECOMMENDATION
            </span>
            <span className={`badge ${
              analysis.severity_assessment === 'CRITICAL' ? 'badge-critical' : 'badge-high'
            }`}>
              {analysis.severity_assessment}
            </span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
            {incident.title}
          </h3>
        </div>

        {/* Confidence Meter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 16px',
            textAlign: 'right',
          }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
              Diagnosis Confidence
            </span>
            <span style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              color: confidencePct >= 90 ? '#34D399' : '#FBBF24',
            }}>
              {confidencePct}%
            </span>
          </div>

          {/* Action Trigger */}
          {incident.status !== 'RESOLVED' ? (
            <button
              onClick={onOpenResolve}
              className="btn-success"
              style={{ padding: '10px 18px', fontSize: '0.85rem' }}
            >
              <CheckCircle2 size={16} />
              Resolve & Retain Fix
            </button>
          ) : (
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#34D399',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 14px',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <ShieldCheck size={16} />
              Resolved & Retained in Hindsight
            </div>
          )}
        </div>
      </div>

      {/* Likely Root Cause Card */}
      <div style={{
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <AlertOctagon size={18} color="#F87171" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F87171', letterSpacing: '0.02em' }}>
            LIKELY ROOT CAUSE
          </span>
        </div>
        <p style={{ fontSize: '0.95rem', color: '#FEE2E2', lineHeight: 1.6 }}>
          {analysis.likely_root_cause}
        </p>
      </div>

      {/* Evidence Breakdown */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
          Diagnostic Evidence
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {analysis.evidence.map((point, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '0.85rem',
                color: '#CBD5E1',
              }}
            >
              <Activity size={16} color="#6366F1" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Action Plan Checklist */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Recommended Action Plan (Mitigation Checklist)
          </h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
            {completedSteps.length} of {analysis.recommended_actions.length} completed
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {analysis.recommended_actions.map((act) => {
            const isDone = completedSteps.includes(act.step);
            return (
              <div
                key={act.step}
                onClick={() => toggleStep(act.step)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: isDone ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                  backgroundColor: isDone ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {isDone ? (
                    <CheckSquare size={18} color="#10B981" />
                  ) : (
                    <Square size={18} color="#64748B" />
                  )}
                  <div>
                    <span style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: isDone ? '#94A3B8' : '#F8FAFC',
                      textDecoration: isDone ? 'line-through' : 'none',
                    }}>
                      Step {act.step}: {act.action}
                    </span>
                  </div>
                </div>

                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: act.risk === 'NONE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: act.risk === 'NONE' ? '#34D399' : '#FBBF24',
                  border: `1px solid ${act.risk === 'NONE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                }}>
                  RISK: {act.risk}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
