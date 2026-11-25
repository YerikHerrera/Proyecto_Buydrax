from fastapi import APIRouter
from app.api.endpoints.empresas.gestion_empresas import router as gestion_router

router = APIRouter()
router.include_router(gestion_router)
