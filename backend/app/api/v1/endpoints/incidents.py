from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from typing import Optional, List

from backend.app.core.database import get_db
from backend.app.models.incident import Incident
from backend.app.schemas.incident import (
    IncidentCreate,
    IncidentResponse,
    IncidentListResponse,
    IncidentAnalysisResponse,
    IncidentResolutionCreate,
)
from backend.app.services.agent_service import agent_service

router = APIRouter()


@router.post("", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
@router.post("/", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
async def create_incident(
    payload: IncidentCreate,
    db: AsyncSession = Depends(get_db)
):
    """Creates a new incident record in the system."""
    incident = Incident(
        title=payload.title,
        service=payload.service,
        environment=payload.environment,
        severity=payload.severity,
        symptoms=payload.symptoms,
        error_logs=payload.error_logs,
        metrics_snapshot=payload.metrics_snapshot,
        status="INVESTIGATING"
    )
    db.add(incident)
    await db.commit()
    await db.refresh(incident)
    
    # Reload with relationships
    stmt = (
        select(Incident)
        .where(Incident.id == incident.id)
        .options(selectinload(Incident.analysis), selectinload(Incident.resolution))
    )
    res = await db.execute(stmt)
    return res.scalar_one()


@router.get("", response_model=IncidentListResponse, include_in_schema=False)
@router.get("/", response_model=IncidentListResponse)
async def list_incidents(
    service: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """Lists incidents with optional filtering and pagination."""
    query = (
        select(Incident)
        .options(selectinload(Incident.analysis), selectinload(Incident.resolution))
        .order_by(desc(Incident.created_at))
    )
    if service:
        query = query.where(Incident.service == service)
    if severity:
        query = query.where(Incident.severity == severity)
    if status_filter:
        query = query.where(Incident.status == status_filter)

    result = await db.execute(query.offset(offset).limit(limit))
    items = result.scalars().all()
    
    # Count total
    count_query = select(Incident)
    if service:
        count_query = count_query.where(Incident.service == service)
    if severity:
        count_query = count_query.where(Incident.severity == severity)
    if status_filter:
        count_query = count_query.where(Incident.status == status_filter)
    count_res = await db.execute(count_query)
    total = len(count_res.scalars().all())

    return IncidentListResponse(total=total, items=items)


@router.get("/{incident_id}", response_model=IncidentResponse)
async def get_incident(
    incident_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Retrieves an incident by its ID along with diagnosis and resolution."""
    stmt = (
        select(Incident)
        .where(Incident.id == incident_id)
        .options(selectinload(Incident.analysis), selectinload(Incident.resolution))
    )
    result = await db.execute(stmt)
    incident = result.scalar_one_or_none()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident


@router.post("/{incident_id}/analyze", response_model=IncidentAnalysisResponse)
async def analyze_incident(
    incident_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Triggers the Nexora AI Agent to analyze the incident.
    Recalls previous experiences from Hindsight, synthesizes context,
    and returns a structured root cause and action plan.
    """
    try:
        analysis = await agent_service.analyze_incident(db, incident_id)
        return analysis
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/{incident_id}/resolve", response_model=IncidentResponse)
async def resolve_incident(
    incident_id: str,
    resolution_data: IncidentResolutionCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Resolves an incident and retains the verified root cause and fix
    into Hindsight memory so future incidents can benefit.
    """
    try:
        incident = await agent_service.resolve_incident(db, incident_id, resolution_data)
        return incident
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resolution failed: {str(e)}")


@router.delete("/{incident_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_incident(
    incident_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Deletes an incident from the database."""
    stmt = select(Incident).where(Incident.id == incident_id)
    result = await db.execute(stmt)
    incident = result.scalar_one_or_none()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    await db.delete(incident)
    await db.commit()
    return None
