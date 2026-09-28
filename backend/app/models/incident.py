import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Text,
    Float,
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import relationship
from backend.app.core.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    title = Column(String(255), nullable=False, index=True)
    service = Column(String(100), nullable=False, index=True)
    environment = Column(String(50), nullable=False, default="production", index=True)
    severity = Column(String(20), nullable=False, default="HIGH", index=True)  # CRITICAL, HIGH, MEDIUM, LOW
    status = Column(String(30), nullable=False, default="INVESTIGATING", index=True)  # INVESTIGATING, MITIGATED, RESOLVED
    
    symptoms = Column(Text, nullable=False)
    error_logs = Column(Text, nullable=True)
    metrics_snapshot = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    analysis = relationship("IncidentAnalysis", back_populates="incident", uselist=False, cascade="all, delete-orphan")
    resolution = relationship("IncidentResolution", back_populates="incident", uselist=False, cascade="all, delete-orphan")
    recall_audits = relationship("MemoryRecallAudit", back_populates="incident", cascade="all, delete-orphan")


class IncidentAnalysis(Base):
    __tablename__ = "incident_analyses"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    incident_id = Column(String(36), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    
    summary = Column(Text, nullable=False)
    likely_root_cause = Column(Text, nullable=False)
    severity_assessment = Column(String(20), nullable=False, default="HIGH")
    confidence_score = Column(Float, nullable=False, default=0.85)
    
    evidence = Column(JSON, nullable=False, default=list)  # list of string evidence points
    recommended_actions = Column(JSON, nullable=False, default=list)  # list of {step: int, action: str, risk: str}
    
    historical_memory_used = Column(Boolean, default=False, nullable=False)
    recalled_memories = Column(JSON, nullable=True, default=list)  # list of memory objects
    memory_influence_explanation = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    incident = relationship("Incident", back_populates="analysis")


class IncidentResolution(Base):
    __tablename__ = "incident_resolutions"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    incident_id = Column(String(36), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    
    root_cause_confirmed = Column(Text, nullable=False)
    resolution_steps = Column(Text, nullable=False)
    prevention_steps = Column(Text, nullable=True)
    time_to_resolve_minutes = Column(Integer, nullable=True, default=30)
    outcome_status = Column(String(50), nullable=False, default="SUCCESSFUL_FIX")
    
    hindsight_memory_id = Column(String(100), nullable=True)
    hindsight_retained = Column(Boolean, default=False, nullable=False)
    retained_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    incident = relationship("Incident", back_populates="resolution")


class MemoryRecallAudit(Base):
    __tablename__ = "memory_recall_audits"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    incident_id = Column(String(36), ForeignKey("incidents.id", ondelete="SET NULL"), nullable=True, index=True)
    
    query = Column(Text, nullable=False)
    recalled_count = Column(Integer, default=0, nullable=False)
    recalled_units = Column(JSON, nullable=False, default=list)
    execution_time_ms = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    incident = relationship("Incident", back_populates="recall_audits")
