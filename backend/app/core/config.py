from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "Nexora — AI Incident Intelligence Agent"
    API_V1_STR: str = "/api/v1"
    
    # PostgreSQL Configuration
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/nexora"
    FALLBACK_TO_SQLITE: bool = True
    SQLITE_URL: str = "sqlite+aiosqlite:///./nexora.db"
    
    # Hindsight Memory Configuration
    HINDSIGHT_BASE_URL: str = "http://localhost:8888"
    HINDSIGHT_API_KEY: Optional[str] = None
    HINDSIGHT_BANK_ID: str = "nexora-incident-intelligence"
    
    # LLM Configuration
    LLM_PROVIDER: str = "auto"  # 'gemini', 'openai', or 'auto'
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]

    model_config = SettingsConfigDict(env_file=".env", extra="allow")


settings = Settings()
