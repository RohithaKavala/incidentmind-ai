import asyncio
import sys
from pathlib import Path

# Ensure root directory is on sys.path for direct execution
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from backend.app.core.database import Base
from backend.app.models.incident import Incident
from backend.app.schemas.incident import IncidentResolutionCreate
from backend.app.services.agent_service import agent_service
from backend.app.services.hindsight_service import hindsight_service


async def test_cold_to_warm_hindsight_incident_intelligence_flow():
    # 1. Setup in-memory SQLite database for testing
    test_engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async_session = async_sessionmaker(bind=test_engine, class_=AsyncSession, expire_on_commit=False)
    
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Clear Hindsight test bank
    hindsight_service.clear_bank_for_demo()
    assert len(await hindsight_service.list_all_memories()) == 0

    async with async_session() as session:
        # =========================================================================
        # PHASE 1: INCIDENT 1 (COLD START - NO MEMORIES IN HINDSIGHT)
        # =========================================================================
        incident1 = Incident(
            title="Payment Gateway Timeout & Pool Exhaustion",
            service="payment-api",
            environment="production",
            severity="CRITICAL",
            symptoms="HTTP 504 Gateway Timeouts on /v1/checkout. Elevated latency (p99 > 14s).",
            error_logs="org.postgresql.util.PSQLException: Connection checkout timed out after 30000ms. HikariPool-1 - Connection is not available, request timed out after 30005ms."
        )
        session.add(incident1)
        await session.commit()
        await session.refresh(incident1)

        # Agent analyzes Incident 1
        analysis1 = await agent_service.analyze_incident(session, incident1.id)
        
        # Verify Cold Start behavior
        assert analysis1.historical_memory_used is False
        assert len(analysis1.recalled_memories) == 0
        assert "Cold start" in analysis1.memory_influence_explanation or "No prior operational memory" in analysis1.memory_influence_explanation
        assert len(analysis1.recommended_actions) > 0
        print("\n[OK] Phase 1: Incident 1 Cold Analysis verified (No prior Hindsight memory).")

        # =========================================================================
        # PHASE 2: RESOLUTION & RETENTION INTO HINDSIGHT
        # =========================================================================
        resolution_payload = IncidentResolutionCreate(
            root_cause_confirmed="HikariCP connection pool was exhausted due to unclosed database connections in asynchronous refund batch worker.",
            resolution_steps="Increased pool to 150 and wrapped DB checkout in refund batch worker with try-finally release block.",
            prevention_steps="Configured leakDetectionThreshold=2000ms in HikariCP.",
            time_to_resolve_minutes=25,
            outcome_status="SUCCESSFUL_FIX"
        )
        resolved_incident = await agent_service.resolve_incident(session, incident1.id, resolution_payload)
        
        # Verify resolution & Hindsight retention
        assert resolved_incident.status == "RESOLVED"
        assert resolved_incident.resolution.hindsight_retained is True
        assert len(await hindsight_service.list_all_memories()) == 1
        print("[OK] Phase 2: Incident 1 resolved and postmortem retained into Hindsight bank.")

        # =========================================================================
        # PHASE 3: INCIDENT 2 (WARM RECALL - HINDSIGHT POWERS THE AGENT)
        # =========================================================================
        incident2 = Incident(
            title="Payment API Checkout Latency Degradation",
            service="payment-api",
            environment="production",
            severity="CRITICAL",
            symptoms="Spike in 504 errors on payment checkout endpoint with connection pool starvation.",
            error_logs="HikariPool-1 - Connection is not available, request timed out after 30002ms."
        )
        session.add(incident2)
        await session.commit()
        await session.refresh(incident2)

        # Agent analyzes Incident 2
        analysis2 = await agent_service.analyze_incident(session, incident2.id)

        # Verify Warm Recall behavior
        assert analysis2.historical_memory_used is True
        assert len(analysis2.recalled_memories) >= 1
        top_recalled = analysis2.recalled_memories[0]
        assert top_recalled["relevance_score"] >= 0.4
        assert "Hindsight recalled prior incident memory" in analysis2.memory_influence_explanation
        assert "HikariCP" in analysis2.likely_root_cause or "connection" in analysis2.likely_root_cause.lower()
        print("[OK] Phase 3: Incident 2 Warm Analysis verified! Hindsight memory successfully recalled and shaped the agent's diagnosis.")


if __name__ == "__main__":
    asyncio.run(test_cold_to_warm_hindsight_incident_intelligence_flow())
