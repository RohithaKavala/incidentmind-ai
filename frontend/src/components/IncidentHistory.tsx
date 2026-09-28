import React from 'react';
import { Layers, CheckCircle2, ArrowRight, Trash2 } from 'lucide-react';
import type { Incident } from '../types';

interface IncidentHistoryProps {
  incidents: Incident[];
  onSelectIncident: (id: string) => void;
  onDeleteIncident: (id: string) => void;
}

export const IncidentHistory: React.FC<IncidentHistoryProps> = ({
  incidents,
  onSelectIncident,
  onDeleteIncident,
}) => {
  return (
    <div style={{ maxWidth: '1440px', margin: '24px auto', padding: '0 24px' }}>
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              color: '#818CF8',
              padding: '8px',
              borderRadius: '8px',
            }}>
              <Layers size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>
                Incident Registry & Archive
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Historical log of production software incidents and their Hindsight retention state
              </p>
            </div>
          </div>

          <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
            Total Recorded: <strong>{incidents.length}</strong>
          </span>
        </div>

        {incidents.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '48px 24px',
            border: '1px dashed var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-subtle)',
          }}>
            <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>No incidents recorded in database.</p>
            <p style={{ fontSize: '0.8rem', color: '#818CF8' }}>
              Submit an incident from the Workbench or load a Demo Scenario to begin!
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 16px' }}>Incident</th>
                  <th style={{ padding: '12px 16px' }}>Service</th>
                  <th style={{ padding: '12px 16px' }}>Severity</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Hindsight Retain</th>
                  <th style={{ padding: '12px 16px' }}>Timestamp</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((inc) => (
                  <tr
                    key={inc.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* Title */}
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#FFFFFF' }}>
                      {inc.title}
                    </td>

                    {/* Service */}
                    <td style={{ padding: '14px 16px' }}>
                      <span className="font-mono" style={{ color: '#A5B4FC', backgroundColor: 'rgba(99, 102, 241, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                        {inc.service}
                      </span>
                    </td>

                    {/* Severity */}
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${
                        inc.severity === 'CRITICAL' ? 'badge-critical' : inc.severity === 'HIGH' ? 'badge-high' : 'badge-medium'
                      }`}>
                        {inc.severity}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${inc.status === 'RESOLVED' ? 'badge-resolved' : 'badge-high'}`}>
                        {inc.status}
                      </span>
                    </td>

                    {/* Hindsight Retained Badge */}
                    <td style={{ padding: '14px 16px' }}>
                      {inc.resolution?.hindsight_retained ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#34D399',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}>
                          <CheckCircle2 size={14} />
                          Retained ({inc.resolution.hindsight_memory_id?.slice(0, 10)}...)
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>
                          Pending Resolution
                        </span>
                      )}
                    </td>

                    {/* Timestamp */}
                    <td style={{ padding: '14px 16px', color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
                      {new Date(inc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => onSelectIncident(inc.id)}
                          className="btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        >
                          View Workbench
                          <ArrowRight size={12} />
                        </button>
                        <button
                          onClick={() => onDeleteIncident(inc.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#64748B',
                            cursor: 'pointer',
                            padding: '6px',
                          }}
                          title="Delete incident"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
