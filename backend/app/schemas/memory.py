from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class MemoryBankInfo(BaseModel):
    bank_id: str
    name: Optional[str] = "Nexora Incident Intelligence"
    mission: Optional[str] = None
    total_memories: int = 0
    connected: bool = True
    provider: str = "Hindsight Memory Engine"
    last_retained_at: Optional[datetime] = None


class MemoryItem(BaseModel):
    id: str
    type: str  # experience, observation, world
    content: str
    context: Optional[str] = None
    tags: List[str] = []
    metadata: Dict[str, Any] = {}
    created_at: Optional[str] = None


class MemoryRecallRequest(BaseModel):
    query: str = Field(..., example="payment-api database connection timeout HikariPool")
    types: Optional[List[str]] = Field(default=["experience", "observation"])
    tags: Optional[List[str]] = None
    max_tokens: int = 2048


class MemoryRecallResponse(BaseModel):
    query: str
    count: int
    memories: List[Dict[str, Any]]
    execution_time_ms: float


class MemoryReflectRequest(BaseModel):
    query: str = Field(..., example="What are the top recurring failure patterns across production services?")


class MemoryReflectResponse(BaseModel):
    query: str
    reflection: str
    disposition_summary: Optional[str] = None
