import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DemoBanner } from './components/DemoBanner';
import { StatsBar } from './components/StatsBar';
import { IncidentForm } from './components/IncidentForm';
import { IncidentAnalysisCard } from './components/IncidentAnalysisCard';
import { MemoryInfluencePanel } from './components/MemoryInfluencePanel';
import { ResolutionModal } from './components/ResolutionModal';
import { MemoryExplorer } from './components/MemoryExplorer';
import { IncidentHistory } from './components/IncidentHistory';
import { api } from './api/client';
import type { Incident, MemoryBankInfo, DemoScenario } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workbench' | 'memory' | 'history'>('workbench');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [bankInfo, setBankInfo] = useState<MemoryBankInfo | null>(null);
  const [scenarios, setScenarios] = useState<Record<string, DemoScenario>>({});
  const [activeScenario, setActiveScenario] = useState<DemoScenario | null>(null);
  
  // Demo State
  const [currentDemoStep, setCurrentDemoStep] = useState<number>(1);
  const [isResetting, setIsResetting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  // Initial load
  const loadData = async () => {
    try {
      const [incRes, bankRes, scenRes] = await Promise.all([
        api.getIncidents(),
        api.getMemoryBankInfo(),
        api.getScenarios(),
      ]);
      setIncidents(incRes.items);
      setBankInfo(bankRes);
      setScenarios(scenRes);

      // Default select the latest incident if available
      if (incRes.items.length > 0 && !selectedIncident) {
        setSelectedIncident(incRes.items[0]);
      }
    } catch (err) {
      console.error('Initialization error:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAndAnalyze = async (incidentData: Partial<Incident>) => {
    setIsSubmitting(true);
    try {
      // 1. Create incident in DB
      const created = await api.createIncident(incidentData);
      
      // 2. Trigger AI analysis with Hindsight recall
      await api.analyzeIncident(created.id);
      
      // 3. Reload full incident object
      const full = await api.getIncident(created.id);
      setSelectedIncident(full);
      
      // 4. Refresh global incident list and bank info
      await loadData();
      
      // If we were on step 1, advance demo to step 2 (Resolve)
      if (currentDemoStep === 1) {
        setCurrentDemoStep(2);
      }
    } catch (err) {
      alert(`Error submitting incident: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolve = async (payload: {
    root_cause_confirmed: string;
    resolution_steps: string;
    prevention_steps?: string;
    time_to_resolve_minutes?: number;
    outcome_status?: string;
  }) => {
    if (!selectedIncident) return;
    setIsResolving(true);
    try {
      const updated = await api.resolveIncident(selectedIncident.id, payload);
      setSelectedIncident(updated);
      setIsResolveModalOpen(false);
      
      // Refresh list & bank stats
      await loadData();
      
      // Advance demo to step 3 (Warm Recurrence)
      if (currentDemoStep === 2) {
        setCurrentDemoStep(3);
        if (scenarios['2']) {
          setActiveScenario(scenarios['2']);
        }
      }
    } catch (err) {
      alert(`Resolution error: ${err}`);
    } finally {
      setIsResolving(false);
    }
  };

  const handleSelectDemoStep = (step: number) => {
    setCurrentDemoStep(step);
    setActiveTab('workbench');
    if (step === 1 && scenarios['1']) {
      setActiveScenario(scenarios['1']);
    } else if (step === 2) {
      if (selectedIncident) {
        setIsResolveModalOpen(true);
      } else if (scenarios['1']) {
        setActiveScenario(scenarios['1']);
      }
    } else if (step === 3 && scenarios['2']) {
      setActiveScenario(scenarios['2']);
    }
  };

  const handleResetDemo = async () => {
    if (!confirm('Reset all incidents and clear Hindsight memory bank for a fresh demo run?')) return;
    setIsResetting(true);
    try {
      await api.resetDemo();
      setSelectedIncident(null);
      setCurrentDemoStep(1);
      if (scenarios['1']) {
        setActiveScenario(scenarios['1']);
      }
      await loadData();
    } catch (err) {
      alert(`Reset failed: ${err}`);
    } finally {
      setIsResetting(false);
    }
  };

  const handleDeleteIncident = async (id: string) => {
    try {
      await api.deleteIncident(id);
      if (selectedIncident?.id === id) {
        setSelectedIncident(null);
      }
      await loadData();
    } catch (err) {
      alert(`Delete failed: ${err}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bankInfo={bankInfo}
        onResetDemo={handleResetDemo}
        isResetting={isResetting}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '40px' }}>
        {/* Hackathon Stepper Banner */}
        <DemoBanner
          currentStep={currentDemoStep}
          onSelectStep={handleSelectDemoStep}
          hasRetainedMemories={(bankInfo?.total_memories || 0) > 0}
          onOpenExplorer={() => setActiveTab('memory')}
        />

        {/* Global Operational Metrics Bar */}
        <StatsBar
          incidents={incidents}
          bankInfo={bankInfo}
        />

        {/* TAB 1: INCIDENT WORKBENCH */}
        {activeTab === 'workbench' && (
          <div style={{
            maxWidth: '1440px',
            margin: '24px auto 0',
            padding: '0 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}>
            {/* Top: Incident Submission Studio */}
            <IncidentForm
              onSubmit={handleCreateAndAnalyze}
              isSubmitting={isSubmitting}
              prefillScenario={activeScenario}
            />

            {/* Bottom: Analysis & Memory Attribution Layout */}
            {selectedIncident && selectedIncident.analysis && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
                gap: '24px',
                alignItems: 'start',
              }}>
                {/* Left: AI Diagnosis & Action Plan */}
                <IncidentAnalysisCard
                  incident={selectedIncident}
                  analysis={selectedIncident.analysis}
                  onOpenResolve={() => setIsResolveModalOpen(true)}
                />

                {/* Right: Hindsight Cognitive Memory Attribution */}
                <MemoryInfluencePanel
                  analysis={selectedIncident.analysis}
                  onOpenExplorer={() => setActiveTab('memory')}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: HINDSIGHT MEMORY BANK EXPLORER */}
        {activeTab === 'memory' && (
          <MemoryExplorer
            bankInfo={bankInfo}
            onRefreshBank={loadData}
          />
        )}

        {/* TAB 3: INCIDENT ARCHIVE */}
        {activeTab === 'history' && (
          <IncidentHistory
            incidents={incidents}
            onSelectIncident={(id) => {
              const target = incidents.find(i => i.id === id);
              if (target) {
                setSelectedIncident(target);
                setActiveTab('workbench');
              }
            }}
            onDeleteIncident={handleDeleteIncident}
          />
        )}
      </main>

      {/* Resolution & Postmortem Modal */}
      {selectedIncident && (
        <ResolutionModal
          incident={selectedIncident}
          isOpen={isResolveModalOpen}
          onClose={() => setIsResolveModalOpen(false)}
          onSubmit={handleResolve}
          isSubmitting={isResolving}
        />
      )}

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '20px 24px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-subtle)',
      }}>
        <span>Nexora AI Incident Intelligence Agent &copy; 2026. Built with FastAPI, React, PostgreSQL & </span>
        <strong style={{ color: '#818CF8' }}>Hindsight (Vectorize.io)</strong>
      </footer>
    </div>
  );
};

export default App;
