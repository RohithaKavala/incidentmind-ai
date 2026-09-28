import logging
import time
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from backend.app.models.incident import Incident, IncidentAnalysis, IncidentResolution, MemoryRecallAudit
from backend.app.schemas.incident import IncidentResolutionCreate
from backend.app.services.hindsight_service import hindsight_service
from backend.app.services.llm_service import llm_service

logger = logging.getLogger(__name__)


class AgentService:
    """
    Central Cognitive Agent orchestrating Hindsight memory recall/retention
    and structured LLM reasoning.
    """

    async def analyze_incident(self, db: AsyncSession, incident_id: str) -> IncidentAnalysis:
        # 1. Fetch incident from DB
        stmt = (
            select(Incident)
            .where(Incident.id == incident_id)
            .options(selectinload(Incident.analysis), selectinload(Incident.resolution))
        )
        result = await db.execute(stmt)
        incident = result.scalar_one_or_none()
        if not incident:
            raise ValueError(f"Incident {incident_id} not found")

        # 2. Formulate targeted Hindsight recall query
        error_sample = (incident.error_logs or "")[:200]
        recall_query = f"{incident.service} {incident.title} {incident.symptoms} {error_sample}"
        
        start_time = time.time()
        # Query Hindsight memory bank
        recalled_memories = await hindsight_service.recall(
            query=recall_query,
            types=["experience", "observation"],
            tags=[f"service:{incident.service}"]
        )
        execution_time_ms = round((time.time() - start_time) * 1000, 2)

        # 3. Audit the recall event in PostgreSQL
        audit = MemoryRecallAudit(
            incident_id=incident.id,
            query=recall_query,
            recalled_count=len(recalled_memories),
            recalled_units=recalled_memories,
            execution_time_ms=execution_time_ms
        )
        db.add(audit)

        # 4. Invoke LLM reasoning service with current context + recalled memories
        incident_data = {
            "title": incident.title,
            "service": incident.service,
            "environment": incident.environment,
            "severity": incident.severity,
            "symptoms": incident.symptoms,
            "error_logs": incident.error_logs,
            "metrics_snapshot": incident.metrics_snapshot,
        }

        analysis_dict = await llm_service.generate_analysis(incident_data, recalled_memories)

        # 5. Persist or update IncidentAnalysis in DB
        analysis = incident.analysis
        if not analysis:
            analysis = IncidentAnalysis(
                incident_id=incident.id,
                summary=analysis_dict.get("summary", ""),
                likely_root_cause=analysis_dict.get("likely_root_cause", ""),
                severity_assessment=analysis_dict.get("severity_assessment", incident.severity),
                confidence_score=analysis_dict.get("confidence_score", 0.85),
                evidence=analysis_dict.get("evidence", []),
                recommended_actions=analysis_dict.get("recommended_actions", []),
                historical_memory_used=analysis_dict.get("historical_memory_used", False),
                recalled_memories=recalled_memories,
                memory_influence_explanation=analysis_dict.get("memory_influence_explanation", ""),
            )
            db.add(analysis)
            incident.analysis = analysis
        else:
            analysis.summary = analysis_dict.get("summary", "")
            analysis.likely_root_cause = analysis_dict.get("likely_root_cause", "")
            analysis.severity_assessment = analysis_dict.get("severity_assessment", incident.severity)
            analysis.confidence_score = analysis_dict.get("confidence_score", 0.85)
            analysis.evidence = analysis_dict.get("evidence", [])
            analysis.recommended_actions = analysis_dict.get("recommended_actions", [])
            analysis.historical_memory_used = analysis_dict.get("historical_memory_used", False)
            analysis.recalled_memories = recalled_memories
            analysis.memory_influence_explanation = analysis_dict.get("memory_influence_explanation", "")

        await db.commit()
        return analysis

    async def resolve_incident(
        self,
        db: AsyncSession,
        incident_id: str,
        res_data: IncidentResolutionCreate,
    ) -> Incident:
        stmt = (
            select(Incident)
            .where(Incident.id == incident_id)
            .options(selectinload(Incident.analysis), selectinload(Incident.resolution))
        )
        result = await db.execute(stmt)
        incident = result.scalar_one_or_none()
        if not incident:
            raise ValueError(f"Incident {incident_id} not found")

        # 1. Update incident status
        incident.status = "RESOLVED"
        incident.updated_at = datetime.utcnow()

        # 2. Retain postmortem experience into Hindsight
        postmortem_content = (
            f"[INCIDENT POSTMORTEM]\n"
            f"Incident ID: {incident.id}\n"
            f"Title: {incident.title}\n"
            f"Service: {incident.service}\n"
            f"Environment: {incident.environment}\n"
            f"Severity: {incident.severity}\n"
            f"Symptoms: {incident.symptoms}\n"
            f"Error Signature: {(incident.error_logs or '')[:400]}\n\n"
            f"[VERIFIED ROOT CAUSE]\n"
            f"{res_data.root_cause_confirmed}\n\n"
            f"[SUCCESSFUL RESOLUTION & ACTIONS APPLIED]\n"
            f"{res_data.resolution_steps}\n\n"
            f"[PREVENTION & TAKEAWAYS]\n"
            f"{res_data.prevention_steps or 'Standard postmortem review completed.'}\n"
            f"Resolution Outcome: {res_data.outcome_status}"
        )

        hindsight_res = await hindsight_service.retain(
            content=postmortem_content,
            context=f"Postmortem resolution for {incident.service} in {incident.environment}",
            tags=[
                f"service:{incident.service}",
                f"env:{incident.environment}",
                f"severity:{incident.severity}",
                "type:incident_postmortem",
                "outcome:resolved"
            ],
            metadata={
                "incident_id": incident.id,
                "service": incident.service,
                "title": incident.title,
                "resolved_at": datetime.utcnow().isoformat()
            }
        )

        # 3. Create or update resolution record in DB
        resolution = incident.resolution
        now = datetime.utcnow()
        if not resolution:
            resolution = IncidentResolution(
                incident_id=incident.id,
                root_cause_confirmed=res_data.root_cause_confirmed,
                resolution_steps=res_data.resolution_steps,
                prevention_steps=res_data.prevention_steps,
                time_to_resolve_minutes=res_data.time_to_resolve_minutes,
                outcome_status=res_data.outcome_status,
                hindsight_memory_id=hindsight_res.get("id"),
                hindsight_retained=True,
                retained_at=now,
                created_at=now
            )
            db.add(resolution)
            incident.resolution = resolution
        else:
            resolution.root_cause_confirmed = res_data.root_cause_confirmed
            resolution.resolution_steps = res_data.resolution_steps
            resolution.prevention_steps = res_data.prevention_steps
            resolution.time_to_resolve_minutes = res_data.time_to_resolve_minutes
            resolution.outcome_status = res_data.outcome_status
            resolution.hindsight_memory_id = hindsight_res.get("id")
            resolution.hindsight_retained = True
            resolution.retained_at = now

        await db.commit()
        return incident


agent_service = AgentService()
