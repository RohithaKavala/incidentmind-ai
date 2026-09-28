import time
from fastapi import APIRouter
from typing import List, Dict, Any

from backend.app.schemas.memory import (
    MemoryBankInfo,
    MemoryRecallRequest,
    MemoryRecallResponse,
    MemoryReflectRequest,
    MemoryReflectResponse,
)
from backend.app.services.hindsight_service import hindsight_service

router = APIRouter()


@router.get("/bank", response_model=MemoryBankInfo)
async def get_memory_bank_info():
    """Returns metadata and health of the Hindsight memory bank."""
    return hindsight_service.get_bank_info()


@router.get("/items", response_model=List[Dict[str, Any]])
async def list_retained_memories():
    """Lists all memories stored in the Hindsight memory bank."""
    return await hindsight_service.list_all_memories()


@router.post("/recall", response_model=MemoryRecallResponse)
async def test_recall(payload: MemoryRecallRequest):
    """
    Test bench endpoint to query Hindsight memory and observe
    multi-strategy similarity retrieval.
    """
    start_time = time.time()
    results = await hindsight_service.recall(
        query=payload.query,
        types=payload.types,
        tags=payload.tags,
        max_tokens=payload.max_tokens
    )
    exec_time = round((time.time() - start_time) * 1000, 2)
    return MemoryRecallResponse(
        query=payload.query,
        count=len(results),
        memories=results,
        execution_time_ms=exec_time
    )


@router.post("/reflect", response_model=MemoryReflectResponse)
async def test_reflect(payload: MemoryReflectRequest):
    """
    Invokes Hindsight's cognitive reflection mechanism
    to synthesize systemic patterns across retained incidents.
    """
    result = await hindsight_service.reflect(payload.query)
    return MemoryReflectResponse(
        query=payload.query,
        reflection=result.get("reflection", ""),
        disposition_summary=result.get("disposition_summary")
    )
