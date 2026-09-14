"""Punto de entrada de la API Buydrax."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.enrutador import api_router
from app.nucleo.configuracion import get_settings
from app.nucleo.excepciones import AppError, app_error_handler

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description=(
        "API de Buydrax — Bloque 1: Autenticación y Usuarios. "
        "Implementación fiel al SQL auditado y a la matriz definitiva de APIs."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restringir en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(AppError, app_error_handler)

app.include_router(api_router, prefix=settings.api_prefix)


@app.get("/health", tags=["Sistema"])
def health():
    return {"status": "ok", "app": settings.app_name, "env": settings.app_env}
