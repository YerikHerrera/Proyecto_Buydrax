"""Configuración central de la aplicación (sin secretos hardcodeados)."""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # App
    app_name: str = "Buydrax API"
    app_env: str = "development"
    debug: bool = False
    api_prefix: str = "/api/v1"

    # Base de datos
    database_url: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/buydrax"

    # JWT
    secret_key: str = "INSECURE-CHANGE-ME-IN-PRODUCTION"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 480  # 8 horas


@lru_cache
def get_settings() -> Settings:
    return Settings()
