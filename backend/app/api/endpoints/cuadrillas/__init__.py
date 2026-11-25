from fastapi import APIRouter

from app.api.endpoints.cuadrillas.gestion_cuadrillas import router as gestion_router

router = APIRouter()
router.include_router(gestion_router)
