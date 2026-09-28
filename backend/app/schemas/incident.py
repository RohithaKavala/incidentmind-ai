from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime


class IncidentBase(BaseModel):
    title: str = Field(..., json_schema_extra={"example": "Payment Gateway Connection Timeout"})
    service: str = Field(..., json_schema_extra={"example": "payment-api"})
    environment: str = Field(default="production", json_schema_extra={"example": "production"})
    severity: str = Field(default="HIGH", json_schema_extra={"example": "CRITICAL"})
    symptoms: str = Field(..., json_schema_extra={"example": "HTTP 504 errors, pool timeout, elevated checkout latency"})
    error_logs: Optional[str] = Field(None, json_schema_extra={"example": "PSQLException: Connection checkout timed out after 30000ms"})
    metrics_snapshot: Optional[Dict[str, Any]] = Field(default_factory=dict)


class IncidentCreate(IncidentBase):
    pass


class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    symptoms: Optional[str] = None
    error_logs: Optional[str] = None
    metrics_snapshot: Optional[Dict[str, Any]] = None


class RecommendedAction(BaseModel):
    step: int
    action: str
    risk: str = "LOW"  # NONE, LOW, MEDIUM, HIGH


class RecalledMemoryItem(BaseModel):
    memory_id: str
    type: str = "experience"
    relevance_score: float = 0.0
    summary: str
    context: Optional[str] = None
    extracted_takeaway: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class IncidentAnalysisResponse(BaseModel):
    id: str
    incident_id: str
    summary: str
    likely_root_cause: str
    severity_assessment: str
    confidence_score: float
    evidence: List[str]
    recommended_actions: List[RecommendedAction]
    historical_memory_used: bool
    recalled_memories: List[RecalledMemoryItem] = []
    memory_influence_explanation: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class IncidentResolutionCreate(BaseModel):
    root_cause_confirmed: str = Field(..., json_schema_extra={"example": "HikariCP connection pool was exhausted due to unclosed DB checkout in refund batch job"})
    resolution_steps: str = Field(..., json_schema_extra={"example": "Increased pool ceiling to 150 and patched leak in refund batch worker"})
    prevention_steps: Optional[str] = Field(None, json_schema_extra={"example": "Configured leakDetectionThreshold=2500ms and added active connection alarm"})
    time_to_resolve_minutes: Optional[int] = 30
    outcome_status: str = Field(default="SUCCESSFUL_FIX", json_schema_extra={"example": "SUCCESSFUL_FIX"})


class IncidentResolutionResponse(BaseModel):
    id: str
    incident_id: str
    root_cause_confirmed: str
    resolution_steps: str
    prevention_steps: Optional[str]
    time_to_resolve_minutes: Optional[int]
    outcome_status: str
    hindsight_memory_id: Optional[str]
    hindsight_retained: bool
    retained_at: Optional[datetime]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class IncidentResponse(IncidentBase):
    id: str
    status: str
    created_at: datetime
    updated_at: datetime
    analysis: Optional[IncidentAnalysisResponse] = None
    resolution: Optional[IncidentResolutionResponse] = None

    model_config = ConfigDict(from_attributes=True)


class IncidentListResponse(BaseModel):
    total: int
    items: List[IncidentResponse]
