import React, { useState, useEffect } from 'react';
import { Database, Search, Sparkles, Compass } from 'lucide-react';
import { api } from '../api/client';
import type { MemoryBankInfo, MemoryItem } from '../types';

interface MemoryExplorerProps {
  bankInfo: MemoryBankInfo | null;
  onRefreshBank: () => void;
}

export const MemoryExplorer: React.FC<MemoryExplorerProps> = ({ bankInfo, onRefreshBank }) => {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Recall Sandbox State
  const [testQuery, setTestQuery] = useState('payment-api connection pool timeout');
  const [testRecallResults, setTestRecallResults] = useState<any[] | null>(null);
  const [isRecalling, setIsRecalling] = useState(false);
  const [recallExecTime, setRecallExecTime] = useState<number | null>(null);

  // Reflect Sandbox State
  const [reflectionResult, setReflectionResult] = useState<string | null>(null);
  const [isReflecting, setIsReflecting] = useState(false);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const items = await api.getMemoryItems();
      setMemories(items);
    } catch (err) {
      console.error('Failed to load memories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleTestRecall = async () => {
    if (!testQuery) return;
    setIsRecalling(true);
    try {
      const res = await api.recallMemories(testQuery);
      setTestRecallResults(res.memories);
      setRecallExecTime(res.execution_time_ms);
    } catch (err) {
      console.error('Recall error:', err);
    } finally {
      setIsRecalling(false);
    }
  };

  const handleTestReflect = async () => {
    setIsReflecting(true);
    try {
      const res = await api.reflectMemory('What are the recurring failure patterns and top vulnerabilities observed for production services?');
      setReflectionResult(res.reflection);
    } catch (err) {
      console.error('Reflect error:', err);
    } finally {
      setIsReflecting(false);
    }
  };

  // Collect unique tags
  const allTags = Array.from(new Set(memories.flatMap(m => m.tags || [])));

  const filteredMemories = memories.filter(m => {
    const matchesSearch = !searchQuery ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || (m.tags && m.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '24px auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Bank Header Card */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              color: '#818CF8',
              padding: '12px',
              borderRadius: '12px',
            }}>
              <Database size={28} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {bankInfo?.name || 'Nexora Incident Intelligence'}
                </h2>
                <span className="badge badge-memory">
                  BANK ID: {bankInfo?.bank_id || 'nexora-incident-intelligence'}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {bankInfo?.mission || 'Store and recall production incidents, architectural failure modes, root cause analyses, and verified resolutions.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block' }}>
                Total Retained Memories
              </span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#818CF8' }}>
                {memories.length}
              </span>
            </div>
            <button
              onClick={() => { fetchMemories(); onRefreshBank(); }}
              className="btn-secondary"
              style={{ padding: '8px 14px' }}
            >
              Refresh Bank
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Explorer Left, Sandboxes Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Left Column: Retained Memories Browser */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
              Retained Memories ({filteredMemories.length})
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
              Episodic & Experiential Store
            </span>
          </div>

          {/* Search & Tag Filter */}
          <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="text"
                placeholder="Search retained postmortems or memory IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px 10px 36px',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            {/* Tag Pills */}
            {allTags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <span
                  onClick={() => setSelectedTag(null)}
                  style={{
                    fontSize: '0.7rem',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    backgroundColor: selectedTag === null ? '#6366F1' : 'rgba(255, 255, 255, 0.05)',
                    color: selectedTag === null ? '#FFF' : '#94A3B8',
                  }}
                >
                  All Tags
                </span>
                {allTags.map(tag => (
                  <span
                    key={tag}
                    onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                    style={{
                      fontSize: '0.7rem',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      backgroundColor: tag === selectedTag ? '#6366F1' : 'rgba(255, 255, 255, 0.05)',
                      color: tag === selectedTag ? '#FFF' : '#94A3B8',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Memory List */}
          {loading ? (
            <p style={{ color: 'var(--text-subtle)', textAlign: 'center', padding: '40px' }}>Loading memory bank...</p>
          ) : filteredMemories.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px 24px',
              border: '1px dashed var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-subtle)',
            }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>No memories found matching filter.</p>
              <p style={{ fontSize: '0.8rem', color: '#818CF8' }}>
                Resolve an incident from the Workbench to commit an experience into Hindsight!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '600px', overflowY: 'auto', paddingRight: '4px' }}>
              {filteredMemories.map(mem => (
                <div
                  key={mem.id}
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="font-mono" style={{ fontSize: '0.8rem', color: '#818CF8', fontWeight: 600 }}>
                      {mem.id}
                    </span>
                    <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontSize: '0.65rem' }}>
                      TYPE: {mem.type}
                    </span>
                  </div>

                  <pre style={{
                    fontSize: '0.8rem',
                    color: '#CBD5E1',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.5,
                    marginBottom: '12px',
                    maxHeight: '180px',
                    overflowY: 'auto',
                    backgroundColor: 'rgba(7, 9, 14, 0.6)',
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                  }}>
                    {mem.content}
                  </pre>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {mem.tags?.map(t => (
                      <span key={t} style={{
                        fontSize: '0.65rem',
                        color: 'var(--text-subtle)',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Hindsight Recall & Reflect Sandboxes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Recall Sandbox */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                backgroundColor: 'rgba(6, 182, 212, 0.2)',
                color: '#22D3EE',
                padding: '8px',
                borderRadius: '8px',
              }}>
                <Search size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Interactive Recall Sandbox
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Test Hindsight's multi-strategy semantic & keyword retrieval
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Query memory bank..."
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                }}
              />
              <button
                onClick={handleTestRecall}
                disabled={isRecalling}
                className="btn-primary"
                style={{ padding: '10px 18px', fontSize: '0.85rem' }}
              >
                {isRecalling ? 'Recalling...' : 'Recall'}
              </button>
            </div>

            {testRecallResults !== null && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                    Results ({testRecallResults.length})
                  </span>
                  {recallExecTime !== null && (
                    <span style={{ fontSize: '0.75rem', color: '#10B981' }}>
                      Latency: {recallExecTime}ms
                    </span>
                  )}
                </div>

                {testRecallResults.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', textAlign: 'center', padding: '16px' }}>
                    0 memories matched the query.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto' }}>
                    {testRecallResults.map((r, i) => (
                      <div
                        key={i}
                        style={{
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(6, 182, 212, 0.3)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '10px 12px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span className="font-mono" style={{ fontSize: '0.75rem', color: '#22D3EE' }}>
                            {r.memory_id}
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34D399' }}>
                            {Math.round(r.relevance_score * 100)}% Match
                          </span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#E2E8F0', lineHeight: 1.4 }}>
                          {r.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Reflect Sandbox */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                color: '#34D399',
                padding: '8px',
                borderRadius: '8px',
              }}>
                <Compass size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Hindsight Cognitive Reflection
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Synthesize cross-incident systemic vulnerability models
                </p>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '14px', lineHeight: 1.5 }}>
              Hindsight's <code>client.reflect()</code> reasons across all retained postmortems to extract systemic failure modes and architectural takeaways.
            </p>

            <button
              onClick={handleTestReflect}
              disabled={isReflecting}
              className="btn-success"
              style={{ width: '100%', justifyContent: 'center', padding: '10px', marginBottom: '16px' }}
            >
              <Sparkles size={16} />
              {isReflecting ? 'Synthesizing Reflection...' : 'Trigger Cognitive Reflection'}
            </button>

            {reflectionResult && (
              <div style={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34D399', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Hindsight Reflection Synthesis:
                </span>
                <p style={{ fontSize: '0.85rem', color: '#E2E8F0', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {reflectionResult}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
