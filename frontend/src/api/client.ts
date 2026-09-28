import type { Incident, IncidentAnalysis, MemoryBankInfo, MemoryItem, DemoScenario } from '../types';

const API_BASE = 'http://localhost:8000/api/v1';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    let message = errorText;
    try {
      const parsed = JSON.parse(errorText);
      message = parsed.detail || errorText;
    } catch {
      // ignore
    }
    throw new Error(message || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Incidents
  async getIncidents(): Promise<{ total: number; items: Incident[] }> {
    const res = await fetch(`${API_BASE}/incidents`);
    return handleResponse(res);
  },

  async getIncident(id: string): Promise<Incident> {
    const res = await fetch(`${API_BASE}/incidents/${id}`);
    return handleResponse(res);
  },

  async createIncident(payload: Partial<Incident>): Promise<Incident> {
    const res = await fetch(`${API_BASE}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async analyzeIncident(id: string): Promise<IncidentAnalysis> {
    const res = await fetch(`${API_BASE}/incidents/${id}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(res);
  },

  async resolveIncident(id: string, payload: {
    root_cause_confirmed: string;
    resolution_steps: string;
    prevention_steps?: string;
    time_to_resolve_minutes?: number;
    outcome_status?: string;
  }): Promise<Incident> {
    const res = await fetch(`${API_BASE}/incidents/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async deleteIncident(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/incidents/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok && res.status !== 204) {
      throw new Error('Failed to delete incident');
    }
  },

  // Hindsight Memory
  async getMemoryBankInfo(): Promise<MemoryBankInfo> {
    const res = await fetch(`${API_BASE}/memory/bank`);
    return handleResponse(res);
  },

  async getMemoryItems(): Promise<MemoryItem[]> {
    const res = await fetch(`${API_BASE}/memory/items`);
    return handleResponse(res);
  },

  async recallMemories(query: string, tags?: string[]): Promise<{ query: string; count: number; memories: any[]; execution_time_ms: number }> {
    const res = await fetch(`${API_BASE}/memory/recall`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, tags }),
    });
    return handleResponse(res);
  },

  async reflectMemory(query: string): Promise<{ query: string; reflection: string; disposition_summary?: string }> {
    const res = await fetch(`${API_BASE}/memory/reflect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    return handleResponse(res);
  },

  // Demo Scenarios & Reset
  async getScenarios(): Promise<Record<string, DemoScenario>> {
    const res = await fetch(`${API_BASE}/demo/scenarios`);
    return handleResponse(res);
  },

  async resetDemo(): Promise<{ status: string; message: string }> {
    const res = await fetch(`${API_BASE}/demo/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(res);
  },

  // Diagnostics
  async getHealth(): Promise<any> {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  }
};
