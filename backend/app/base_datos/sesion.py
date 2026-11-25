"""Sesión de base de datos y dependencia de FastAPI."""

from collections.abc import Generator
import time
import logging

from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.exc import OperationalError

from app.nucleo.configuracion import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    pool_recycle=300,
    pool_size=5,
    max_overflow=10,
    future=True,
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    class_=Session,
)


def wait_for_db(max_retries: int = 30, delay: float = 2.0) -> None:
    """Espera a que Postgres esté disponible (útil en Docker)."""
    for attempt in range(1, max_retries + 1):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            logger.info("Base de datos lista (intento %s)", attempt)
            return
        except OperationalError as e:
            logger.warning(
                "DB no disponible (intento %s/%s): %s", attempt, max_retries, e
            )
            if attempt == max_retries:
                raise
            time.sleep(delay)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
