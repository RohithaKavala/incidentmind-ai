import React, { useState } from 'react';
import { X, ShieldCheck, Database, Sparkles } from 'lucide-react';
import type { Incident } from '../types';

interface ResolutionModalProps {
  incident: Incident;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    root_cause_confirmed: string;
    resolution_steps: string;
    prevention_steps?: string;
    time_to_resolve_minutes?: number;
    outcome_status?: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export const ResolutionModal: React.FC<ResolutionModalProps> = ({
  incident,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [rootCause, setRootCause] = useState(
    'HikariCP connection pool was exhausted due to unclosed database connections in asynchronous refund batch worker.'
  );
  const [resolutionSteps, setResolutionSteps] = useState(
    'Increased pool limit to 150 temporarily; patched the connection leak in RefundWebhookWorker.ts by wrapping db checkout in try-finally block.'
  );
  const [preventionSteps, setPreventionSteps] = useState(
    'Added HikariCP connection leak detection alarm set at 2000ms.'
  );
  const [timeToResolve, setTimeToResolve] = useState<number>(25);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rootCause || !resolutionSteps) return;
    await onSubmit({
      root_cause_confirmed: rootCause,
      resolution_steps: resolutionSteps,
      prevention_steps: preventionSteps,
      time_to_resolve_minutes: Number(timeToResolve) || 30,
      outcome_status: 'SUCCESSFUL_FIX',
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px',
    }}>
      <div className="glass-panel" style={{
        maxWidth: '680px',
        width: '100%',
        padding: '28px',
        backgroundColor: '#0D121F',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        boxShadow: '0 0 40px rgba(16, 185, 129, 0.15)',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            color: '#34D399',
            padding: '10px',
            borderRadius: '10px',
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>
              Incident Resolution & Postmortem
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Record the verified fix and retain it into Hindsight long-term memory
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Confirmed Root Cause */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Confirmed Root Cause *
            </label>
            <textarea
              rows={3}
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              required
              style={{
                width: '100%',
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                color: '#FFFFFF',
                fontSize: '0.9rem',
              }}
            />
          </div>

          {/* Resolution Steps Applied */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Resolution & Runbook Actions Applied *
            </label>
            <textarea
              rows={3}
              value={resolutionSteps}
              onChange={(e) => setResolutionSteps(e.target.value)}
              required
              style={{
                width: '100%',
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                color: '#FFFFFF',
                fontSize: '0.9rem',
              }}
            />
          </div>

          {/* Prevention Steps */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Prevention Measures & Alarms Added
            </label>
            <input
              type="text"
              value={preventionSteps}
              onChange={(e) => setPreventionSteps(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                color: '#FFFFFF',
                fontSize: '0.9rem',
              }}
            />
          </div>

          {/* MTTR */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Time to Resolve (Minutes)
            </label>
            <input
              type="number"
              value={timeToResolve}
              onChange={(e) => setTimeToResolve(Number(e.target.value))}
              style={{
                width: '160px',
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                color: '#FFFFFF',
                fontSize: '0.9rem',
              }}
            />
          </div>

          {/* Hindsight Retain Notification Callout */}
          <div style={{
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <Database size={20} color="#818CF8" />
            <span style={{ fontSize: '0.8rem', color: '#C7D2FE', lineHeight: 1.5 }}>
              Upon clicking Resolve, Nexora executes <strong>client.retain()</strong> in Hindsight, committing this postmortem to the <strong>nexora-incident-intelligence</strong> bank so future incidents on <em>{incident.service}</em> recall this verified fix.
            </span>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-success"
              style={{ padding: '12px 24px' }}
            >
              {isSubmitting ? (
                <>
                  <Sparkles size={18} className="animate-spin" />
                  Retaining in Hindsight...
                </>
              ) : (
                <>
                  <Database size={18} />
                  Save & Retain in Hindsight
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
