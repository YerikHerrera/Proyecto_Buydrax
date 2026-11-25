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
    api_prefix: str = "/api"

    # Base de datos
    database_url: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/buydrax"

    # JWT
    secret_key: str = "INSECURE-CHANGE-ME-IN-PRODUCTION"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 480  # 8 horas

    # SMTP (recuperación de contraseña)
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = ""

    # Google OAuth (GIS)
    google_client_id: str = ""

    # Front (enlaces en correos)
    frontend_url: str = "http://127.0.0.1:5173"


@lru_cache
def get_settings() -> Settings:
    return Settings()
