import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings
from backend.app.core.database import init_db
from backend.app.services.hindsight_service import hindsight_service
from backend.app.api.v1.router import api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("nexora")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Nexora AI Incident Intelligence Agent...")
    # Initialize relational database tables (PostgreSQL / SQLite fallback)
    await init_db()
    # Ensure Hindsight memory bank exists
    await hindsight_service.ensure_bank_exists()
    logger.info(f"Nexora Agent Engine ready. Hindsight bank: '{settings.HINDSIGHT_BANK_ID}'")
    yield
    logger.info("Shutting down Nexora Agent Engine...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI Incident Intelligence Agent powered by Hindsight persistent memory.",
    version="1.0.0",
    lifespan=lifespan,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {
        "agent": settings.PROJECT_NAME,
        "status": "ONLINE",
        "docs": "/docs",
        "api_v1": settings.API_V1_STR,
        "hindsight_bank": settings.HINDSIGHT_BANK_ID
    }
