from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete
from typing import Dict, Any

from backend.app.core.database import get_db
from backend.app.models.incident import Incident, IncidentAnalysis, IncidentResolution, MemoryRecallAudit
from backend.app.services.hindsight_service import hindsight_service

router = APIRouter()

SCENARIOS: Dict[str, Dict[str, Any]] = {
    "1": {
        "title": "Payment Gateway Timeout & Pool Exhaustion",
        "service": "payment-api",
        "environment": "production",
        "severity": "CRITICAL",
        "symptoms": "HTTP 504 Gateway Timeouts on /v1/checkout. Elevated latency (p99 > 14s). Sudden drop in completed order transactions.",
        "error_logs": "org.postgresql.util.PSQLException: Connection checkout timed out after 30000ms. HikariPool-1 - Connection is not available, request timed out after 30005ms.\n  at com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:213)\n  at com.payment.service.CheckoutService.processPayment(CheckoutService.java:84)",
        "metrics_snapshot": {
            "active_connections": 100,
            "max_pool_size": 100,
            "idle_connections": 0,
            "p99_latency_ms": 14200,
            "error_rate_percent": 18.4
        },
        "description": "Novel incident on payment-api. Demonstrates COLD triage when Hindsight has zero prior knowledge."
    },
    "2": {
        "title": "Payment API High Latency & Pool Saturation",
        "service": "payment-api",
        "environment": "production",
        "severity": "CRITICAL",
        "symptoms": "Intermittent 504 timeouts and connection pool thread starvation during checkout batch processing.",
        "error_logs": "HikariPool-1 - Connection is not available, request timed out after 30002ms.\n  at com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:213)\n  at com.payment.workers.RefundWebhookWorker.handleWebhook(RefundWebhookWorker.java:112)",
        "metrics_snapshot": {
            "active_connections": 100,
            "max_pool_size": 100,
            "idle_connections": 0,
            "p99_latency_ms": 12850,
            "error_rate_percent": 15.2
        },
        "description": "Recurring incident on payment-api. Demonstrates WARM recall when Hindsight recalls Incident 1's postmortem."
    },
    "3": {
        "title": "Auth Gateway JWT Verification Failure",
        "service": "auth-service",
        "environment": "production",
        "severity": "HIGH",
        "symptoms": "Widespread 401 Unauthorized errors across all downstream microservices following cert rotation.",
        "error_logs": "io.jsonwebtoken.security.SignatureException: JWT signature does not match locally computed signature.\n  at io.jsonwebtoken.impl.DefaultJwtParser.parse(DefaultJwtParser.java:352)\n  at com.auth.filter.JwtAuthenticationFilter.doFilter(JwtAuthenticationFilter.java:62)",
        "metrics_snapshot": {
            "auth_failure_rate": 84.5,
            "token_verification_time_ms": 420
        },
        "description": "Authentication failure mode to demonstrate multi-service domain separation in memory bank."
    }
}


@router.get("/scenarios")
async def list_scenarios():
    """Returns available hackathon demo scenarios."""
    return SCENARIOS


@router.post("/reset")
async def reset_demo(db: AsyncSession = Depends(get_db)):
    """
    Clears all incident records and purges memory bank
    to reset the system for a fresh live hackathon presentation.
    """
    await db.execute(delete(MemoryRecallAudit))
    await db.execute(delete(IncidentResolution))
    await db.execute(delete(IncidentAnalysis))
    await db.execute(delete(Incident))
    await db.commit()

    hindsight_service.clear_bank_for_demo()
    return {"status": "SUCCESS", "message": "Demo state reset: All incidents and memories cleared."}
