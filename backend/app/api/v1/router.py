"""Router principal de la API v1 — todos los endpoints de la matriz."""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, roles, usuarios, domain

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(usuarios.router)
api_router.include_router(roles.router)
api_router.include_router(domain.router)
