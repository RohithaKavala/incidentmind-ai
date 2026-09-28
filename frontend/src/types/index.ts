export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentStatus = 'INVESTIGATING' | 'MITIGATED' | 'RESOLVED';

export interface RecommendedAction {
  step: number;
  action: string;
  risk: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface RecalledMemoryItem {
  memory_id: string;
  type: string;
  relevance_score: number;
  summary: string;
  context?: string;
  extracted_takeaway?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface IncidentAnalysis {
  id: string;
  incident_id: string;
  summary: string;
  likely_root_cause: string;
  severity_assessment: Severity;
  confidence_score: number;
  evidence: string[];
  recommended_actions: RecommendedAction[];
  historical_memory_used: boolean;
  recalled_memories: RecalledMemoryItem[];
  memory_influence_explanation?: string;
  created_at: string;
}

export interface IncidentResolution {
  id: string;
  incident_id: string;
  root_cause_confirmed: string;
  resolution_steps: string;
  prevention_steps?: string;
  time_to_resolve_minutes?: number;
  outcome_status: string;
  hindsight_memory_id?: string;
  hindsight_retained: boolean;
  retained_at?: string;
  created_at: string;
}

export interface Incident {
  id: string;
  title: string;
  service: string;
  environment: string;
  severity: Severity;
  status: IncidentStatus;
  symptoms: string;
  error_logs?: string;
  metrics_snapshot?: Record<string, any>;
  created_at: string;
  updated_at: string;
  analysis?: IncidentAnalysis;
  resolution?: IncidentResolution;
}

export interface MemoryBankInfo {
  bank_id: string;
  name: string;
  mission?: string;
  total_memories: number;
  connected: boolean;
  provider: string;
  last_retained_at?: string;
}

export interface MemoryItem {
  id: string;
  type: string;
  content: string;
  context?: string;
  tags: string[];
  metadata: Record<string, any>;
  created_at?: string;
}

export interface DemoScenario {
  title: string;
  service: string;
  environment: string;
  severity: Severity;
  symptoms: string;
  error_logs?: string;
  metrics_snapshot?: Record<string, any>;
  description: string;
}
