from fastapi import APIRouter
from backend.app.core.config import settings
from backend.app.services.hindsight_service import hindsight_service

router = APIRouter()


@router.get("/health")
async def health_check():
    """System health and integration diagnostic status."""
    return {
        "status": "HEALTHY",
        "project": settings.PROJECT_NAME,
        "database": {
            "type": "PostgreSQL" if "postgresql" in settings.DATABASE_URL else "SQLite",
            "fallback_enabled": settings.FALLBACK_TO_SQLITE
        },
        "hindsight": {
            "bank_id": settings.HINDSIGHT_BANK_ID,
            "connected": hindsight_service.connected,
            "base_url": settings.HINDSIGHT_BASE_URL,
            "total_memories": len(await hindsight_service.list_all_memories())
        },
        "llm": {
            "provider": settings.LLM_PROVIDER,
            "gemini_configured": bool(settings.GEMINI_API_KEY),
            "openai_configured": bool(settings.OPENAI_API_KEY)
        }
    }
