from fastapi import APIRouter
from backend.app.api.v1.endpoints import incidents, memory, demo, health

api_router = APIRouter()

api_router.include_router(incidents.router, prefix="/incidents", tags=["Incidents"])
api_router.include_router(memory.router, prefix="/memory", tags=["Hindsight Memory"])
api_router.include_router(demo.router, prefix="/demo", tags=["Demo Automation"])
api_router.include_router(health.router, tags=["Health & Diagnostics"])
