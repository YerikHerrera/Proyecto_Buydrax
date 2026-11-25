"""Endpoints de autenticación — EP-01, EP-02."""

from typing import Annotated, Optional

from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.nucleo.dependencias import DbSession
from app.esquemas.autenticacion import LoginRequest, LogoutResponse, TokenResponse
from app.servicios.servicio_autenticacion import ServicioAutenticacion

router = APIRouter(prefix="/auth", tags=["Autenticación"])
_bearer = HTTPBearer(auto_error=False)


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="EP-01 Iniciar sesión",
)
def login(body: LoginRequest, db: DbSession) -> TokenResponse:
    return ServicioAutenticacion(db).login(body)


@router.post(
    "/logout",
    response_model=LogoutResponse,
    summary="EP-02 Cerrar sesión",
)
def logout(
    db: DbSession,
    creds: Annotated[Optional[HTTPAuthorizationCredentials], Depends(_bearer)] = None,
) -> LogoutResponse:
    """Logout no debe fallar si el token está mal o la BD cambió de columnas."""
    _ = creds
    _ = db
    result = ServicioAutenticacion(db).logout()
    return LogoutResponse(**result)
