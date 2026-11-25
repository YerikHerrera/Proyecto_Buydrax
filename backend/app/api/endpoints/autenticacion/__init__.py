from fastapi import APIRouter

from app.api.endpoints.autenticacion.iniciar_sesion import router as login_router
from app.api.endpoints.autenticacion.recuperacion import router as recuperacion_router
from app.api.endpoints.autenticacion.google import router as google_router

router = APIRouter()
router.include_router(login_router)
router.include_router(recuperacion_router)
router.include_router(google_router)
