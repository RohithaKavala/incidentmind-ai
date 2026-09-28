import React, { useState } from 'react';
import { Send, Terminal, Sparkles } from 'lucide-react';
import type { Incident, Severity } from '../types';

interface IncidentFormProps {
  onSubmit: (incidentData: Partial<Incident>) => Promise<void>;
  isSubmitting: boolean;
  prefillScenario?: any;
}

export const IncidentForm: React.FC<IncidentFormProps> = ({
  onSubmit,
  isSubmitting,
  prefillScenario,
}) => {
  const [title, setTitle] = useState(prefillScenario?.title || 'Payment Gateway Timeout & Pool Exhaustion');
  const [service, setService] = useState(prefillScenario?.service || 'payment-api');
  const [environment, setEnvironment] = useState(prefillScenario?.environment || 'production');
  const [severity, setSeverity] = useState<Severity>(prefillScenario?.severity || 'CRITICAL');
  const [symptoms, setSymptoms] = useState(prefillScenario?.symptoms || 'HTTP 504 Gateway Timeouts on /v1/checkout. Elevated latency (p99 > 14s). Sudden drop in completed order transactions.');
  const [errorLogs, setErrorLogs] = useState(prefillScenario?.error_logs || 'org.postgresql.util.PSQLException: Connection checkout timed out after 30000ms. HikariPool-1 - Connection is not available, request timed out after 30005ms.\n  at com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:213)\n  at com.payment.service.CheckoutService.processPayment(CheckoutService.java:84)');

  // Handle prefill updates when user clicks demo stepper
  React.useEffect(() => {
    if (prefillScenario) {
      setTitle(prefillScenario.title);
      setService(prefillScenario.service);
      setEnvironment(prefillScenario.environment);
      setSeverity(prefillScenario.severity);
      setSymptoms(prefillScenario.symptoms);
      setErrorLogs(prefillScenario.error_logs || '');
    }
  }, [prefillScenario]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !service || !symptoms) return;
    await onSubmit({
      title,
      service,
      environment,
      severity,
      symptoms,
      error_logs: errorLogs,
      metrics_snapshot: prefillScenario?.metrics_snapshot || { p99_latency_ms: 14200, error_rate_percent: 18.4 }
    });
  };

  const loadPreset = (presetNumber: 1 | 2 | 3) => {
    if (presetNumber === 1) {
      setTitle('Payment Gateway Timeout & Pool Exhaustion');
      setService('payment-api');
      setEnvironment('production');
      setSeverity('CRITICAL');
      setSymptoms('HTTP 504 Gateway Timeouts on /v1/checkout. Elevated latency (p99 > 14s). Sudden drop in completed order transactions.');
      setErrorLogs('org.postgresql.util.PSQLException: Connection checkout timed out after 30000ms. HikariPool-1 - Connection is not available, request timed out after 30005ms.\n  at com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:213)\n  at com.payment.service.CheckoutService.processPayment(CheckoutService.java:84)');
    } else if (presetNumber === 2) {
      setTitle('Payment API Checkout Latency Degradation');
      setService('payment-api');
      setEnvironment('production');
      setSeverity('CRITICAL');
      setSymptoms('Intermittent 504 timeouts and connection pool thread starvation during checkout batch processing.');
      setErrorLogs('HikariPool-1 - Connection is not available, request timed out after 30002ms.\n  at com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:213)\n  at com.payment.workers.RefundWebhookWorker.handleWebhook(RefundWebhookWorker.java:112)');
    } else {
      setTitle('Auth Gateway JWT Signature Mismatch');
      setService('auth-service');
      setEnvironment('production');
      setSeverity('HIGH');
      setSymptoms('Widespread 401 Unauthorized errors across all downstream microservices following cert rotation.');
      setErrorLogs('io.jsonwebtoken.security.SignatureException: JWT signature does not match locally computed signature.\n  at io.jsonwebtoken.impl.DefaultJwtParser.parse(DefaultJwtParser.java:352)');
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      {/* Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            color: '#818CF8',
            padding: '8px',
            borderRadius: '8px',
          }}>
            <Terminal size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
              Incident Submission Studio
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Submit an active production incident for cognitive Hindsight memory analysis
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Quick Presets:</span>
          <button
            type="button"
            onClick={() => loadPreset(1)}
            className="btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          >
            Incident 1 (Cold)
          </button>
          <button
            type="button"
            onClick={() => loadPreset(2)}
            className="btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          >
            Incident 2 (Warm)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          {/* Title */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Incident Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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

          {/* Service */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Service Name *
            </label>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
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

          {/* Environment */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Environment
            </label>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                color: '#FFFFFF',
                fontSize: '0.9rem',
              }}
            >
              <option value="production">production</option>
              <option value="staging">staging</option>
              <option value="us-east-1">us-east-1</option>
              <option value="eu-west-1">eu-west-1</option>
            </select>
          </div>

          {/* Severity */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Severity Level
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as Severity)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                color: '#FFFFFF',
                fontSize: '0.9rem',
              }}
            >
              <option value="CRITICAL">CRITICAL (SEV-1)</option>
              <option value="HIGH">HIGH (SEV-2)</option>
              <option value="MEDIUM">MEDIUM (SEV-3)</option>
              <option value="LOW">LOW (SEV-4)</option>
            </select>
          </div>
        </div>

        {/* Symptoms */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
            Reported Symptoms & Business Impact *
          </label>
          <textarea
            rows={2}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            required
            style={{
              width: '100%',
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              color: '#FFFFFF',
              fontSize: '0.9rem',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Error Logs */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
            Raw Error Logs / Stack Trace
          </label>
          <textarea
            rows={4}
            value={errorLogs}
            onChange={(e) => setErrorLogs(e.target.value)}
            className="font-mono"
            style={{
              width: '100%',
              backgroundColor: 'rgba(7, 9, 14, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              color: '#F87171',
              fontSize: '0.8rem',
              lineHeight: 1.5,
              resize: 'vertical',
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{ padding: '12px 24px', fontSize: '0.95rem' }}
          >
            {isSubmitting ? (
              <>
                <Sparkles size={18} className="animate-spin" />
                Querying Hindsight & Reasoning...
              </>
            ) : (
              <>
                <Send size={18} />
                Submit Incident & Analyze with Nexora
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
