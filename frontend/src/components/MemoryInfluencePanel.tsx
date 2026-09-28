import React from 'react';
import { Brain, Database, ArrowUpRight, Sparkles, CheckCircle, Info } from 'lucide-react';
import type { IncidentAnalysis } from '../types';

interface MemoryInfluencePanelProps {
  analysis: IncidentAnalysis;
  onOpenExplorer: () => void;
}

export const MemoryInfluencePanel: React.FC<MemoryInfluencePanelProps> = ({
  analysis,
  onOpenExplorer,
}) => {
  const isMemoryUsed = analysis.historical_memory_used;

  return (
    <div
      className={isMemoryUsed ? 'glass-panel-glow' : 'glass-panel'}
      style={{
        padding: '24px',
        position: 'relative',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            backgroundColor: isMemoryUsed ? 'rgba(6, 182, 212, 0.2)' : 'rgba(100, 116, 139, 0.2)',
            color: isMemoryUsed ? '#22D3EE' : '#94A3B8',
            padding: '8px',
            borderRadius: '8px',
          }}>
            <Brain size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                Hindsight Memory Attribution
              </h3>
              {isMemoryUsed ? (
                <span className="badge badge-memory">
                  <Sparkles size={12} />
                  WARM RECALL (COGNITIVE MEMORY ACTIVE)
                </span>
              ) : (
                <span className="badge" style={{ backgroundColor: 'rgba(100, 116, 139, 0.2)', color: '#94A3B8' }}>
                  COLD START (FIRST-PRINCIPLES TRIAGE)
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
              Proof of persistent institutional memory and its influence on recommendation
            </p>
          </div>
        </div>

        <button
          onClick={onOpenExplorer}
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
        >
          <Database size={13} />
          Inspect Memory Bank
          <ArrowUpRight size={13} />
        </button>
      </div>

      {/* Memory Influence Explanation Banner */}
      <div style={{
        backgroundColor: isMemoryUsed ? 'rgba(6, 182, 212, 0.08)' : 'rgba(15, 23, 42, 0.6)',
        border: `1px solid ${isMemoryUsed ? 'rgba(6, 182, 212, 0.3)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <Info size={18} color={isMemoryUsed ? '#22D3EE' : '#64748B'} style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: isMemoryUsed ? '#22D3EE' : '#94A3B8',
              display: 'block',
              marginBottom: '4px',
            }}>
              {isMemoryUsed ? 'HOW HINDSIGHT SHAPED THIS ADVICE:' : 'COLD START EXPLANATION:'}
            </span>
            <p style={{ fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.6 }}>
              {analysis.memory_influence_explanation || (
                isMemoryUsed
                  ? 'Nexora recalled relevant prior incident postmortems from Hindsight, adapting verified root causes and proven mitigation steps.'
                  : 'Zero prior incident postmortems match this failure signature in Hindsight. Diagnosis was deduced heuristically. Retain this incident upon resolution to train the agent.'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Recalled Memories Breakdown */}
      {isMemoryUsed && analysis.recalled_memories && analysis.recalled_memories.length > 0 ? (
        <div>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
            Recalled Postmortems from Hindsight ({analysis.recalled_memories.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {analysis.recalled_memories.map((mem) => {
              const relevancePct = Math.round(mem.relevance_score * 100);
              return (
                <div
                  key={mem.memory_id}
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="font-mono" style={{ fontSize: '0.75rem', color: '#A5B4FC', fontWeight: 600 }}>
                        {mem.memory_id}
                      </span>
                      <span className="badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', fontSize: '0.65rem' }}>
                        TYPE: {mem.type}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Match Relevance:</span>
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: relevancePct >= 80 ? '#34D399' : '#FBBF24',
                      }}>
                        {relevancePct}%
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <p style={{ fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '8px', lineHeight: 1.5 }}>
                    {mem.summary}
                  </p>

                  {/* Extracted Takeaway */}
                  {mem.extracted_takeaway && (
                    <div style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.8rem',
                      color: '#6EE7B7',
                    }}>
                      <CheckCircle size={14} color="#10B981" />
                      <span>{mem.extracted_takeaway}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '24px 16px',
          border: '1px dashed var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-subtle)',
          fontSize: '0.85rem',
        }}>
          No prior episodic memories match this error signature yet.
          <br />
          <span style={{ color: '#818CF8', fontWeight: 500 }}>
            Resolve and retain this incident to seed Hindsight with this operational experience.
          </span>
        </div>
      )}
    </div>
  );
};
