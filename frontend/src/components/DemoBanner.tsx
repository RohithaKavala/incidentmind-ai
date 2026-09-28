import React from 'react';
import { Sparkles, ArrowRight, Database } from 'lucide-react';

interface DemoBannerProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  hasRetainedMemories: boolean;
  onOpenExplorer: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  currentStep,
  onSelectStep,
  hasRetainedMemories,
  onOpenExplorer,
}) => {
  return (
    <div style={{
      maxWidth: '1440px',
      margin: '20px auto 0',
      padding: '0 24px',
    }}>
      <div style={{
        background: 'linear-gradient(90deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid var(--border-active)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
      }}>
        {/* Banner Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            color: '#818CF8',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>
                HACKATHON DEMO WALKTHROUGH
              </span>
              <span className="badge badge-memory" style={{ fontSize: '0.65rem' }}>
                COGNITIVE MEMORY SHOWCASE
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Follow this 3-step sequence to demonstrate how Hindsight transforms cold guessing into hyper-accurate triage:
            </p>
          </div>
        </div>

        {/* Interactive Steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Step 1 */}
          <button
            onClick={() => onSelectStep(1)}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: currentStep === 1 ? '1px solid #6366F1' : '1px solid var(--border-subtle)',
              backgroundColor: currentStep === 1 ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
              color: currentStep === 1 ? '#FFFFFF' : '#94A3B8',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: currentStep === 1 ? '#6366F1' : '#334155',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
            }}>1</span>
            Incident 1 (Cold Start)
          </button>

          <ArrowRight size={14} color="#475569" />

          {/* Step 2 */}
          <button
            onClick={() => onSelectStep(2)}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: currentStep === 2 ? '1px solid #10B981' : '1px solid var(--border-subtle)',
              backgroundColor: currentStep === 2 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: currentStep === 2 ? '#FFFFFF' : '#94A3B8',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: hasRetainedMemories ? '#10B981' : (currentStep === 2 ? '#10B981' : '#334155'),
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
            }}>
              {hasRetainedMemories ? '✓' : '2'}
            </span>
            Resolve & Retain in Hindsight
          </button>

          <ArrowRight size={14} color="#475569" />

          {/* Step 3 */}
          <button
            onClick={() => onSelectStep(3)}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: currentStep === 3 ? '1px solid #06B6D4' : '1px solid var(--border-subtle)',
              backgroundColor: currentStep === 3 ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: currentStep === 3 ? '#FFFFFF' : '#94A3B8',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: currentStep === 3 ? '#06B6D4' : '#334155',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
            }}>3</span>
            Incident 2 (Warm Recall)
          </button>

          {/* Direct Link to Bank */}
          <button
            onClick={onOpenExplorer}
            className="btn-secondary"
            style={{ padding: '7px 12px', fontSize: '0.75rem', marginLeft: '8px' }}
          >
            <Database size={13} />
            View Bank
          </button>
        </div>
      </div>
    </div>
  );
};
