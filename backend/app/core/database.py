import logging
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()

# Determine active database URL
active_db_url = settings.DATABASE_URL
engine = None
AsyncSessionLocal = None


def setup_engine():
    global engine, AsyncSessionLocal, active_db_url
    try:
        engine = create_async_engine(
            active_db_url,
            echo=False,
            future=True,
        )
        AsyncSessionLocal = async_sessionmaker(
            bind=engine,
            class_=AsyncSession,
            expire_on_commit=False,
            autoflush=False,
        )
        logger.info(f"Database engine initialized with {active_db_url.split('@')[-1] if '@' in active_db_url else active_db_url}")
    except Exception as e:
        if settings.FALLBACK_TO_SQLITE and "sqlite" not in active_db_url:
            logger.warning(f"Failed to initialize PostgreSQL engine ({e}). Falling back to SQLite for local development: {settings.SQLITE_URL}")
            active_db_url = settings.SQLITE_URL
            engine = create_async_engine(
                active_db_url,
                echo=False,
                future=True,
            )
            AsyncSessionLocal = async_sessionmaker(
                bind=engine,
                class_=AsyncSession,
                expire_on_commit=False,
                autoflush=False,
            )
        else:
            raise e


setup_engine()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for providing an async database session per request."""
    global AsyncSessionLocal
    if AsyncSessionLocal is None:
        setup_engine()
        
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """Initializes tables on startup."""
    global engine, active_db_url, AsyncSessionLocal
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables initialized successfully.")
    except Exception as e:
        if settings.FALLBACK_TO_SQLITE and "sqlite" not in active_db_url:
            logger.warning(f"PostgreSQL connection failed during table initialization: {e}. Switching to SQLite fallback.")
            active_db_url = settings.SQLITE_URL
            engine = create_async_engine(active_db_url, echo=False, future=True)
            AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            logger.info("SQLite fallback database initialized successfully.")
        else:
            raise e
