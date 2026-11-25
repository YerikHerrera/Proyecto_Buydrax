"""Punto de entrada de la API Buydrax."""

from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.api.enrutador import api_router
from app.nucleo.configuracion import get_settings
from app.nucleo.excepciones import AppError, app_error_handler
from app.base_datos.sesion import wait_for_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("buydrax")

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        wait_for_db(max_retries=30, delay=2.0)
        logger.info("API lista — DB conectada")
    except Exception as e:
        logger.error("No se pudo conectar a la DB al arrancar: %s", e)
    yield


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description=(
        "API de Buydrax — Sistema de Gestión de RRHH. "
        "Implementación fiel al SQL auditado y a la matriz definitiva de APIs."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Orígenes permitidos (CORS). En dev incluimos localhost y 127.0.0.1.
_raw = (settings.frontend_url or "http://localhost:5173").split(",")
allow_origins = []
for o in _raw + [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]:
    o = o.strip()
    if o and o not in allow_origins:
        allow_origins.append(o)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.add_exception_handler(AppError, app_error_handler)

app.include_router(api_router, prefix=settings.api_prefix)



@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Error no controlado en %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=500,
        content={"error": {"code": "internal_error", "message": "Error interno del servidor"}},
    )

@app.get("/health", tags=["Sistema"])
def health():
    return {"status": "ok", "app": settings.app_name, "env": settings.app_env}
