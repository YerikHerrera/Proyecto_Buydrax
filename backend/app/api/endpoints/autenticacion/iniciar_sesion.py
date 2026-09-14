"""Endpoints de autenticación — EP-01, EP-02."""

from fastapi import APIRouter

from app.nucleo.dependencias import CurrentUser, DbSession
from app.esquemas.autenticacion import LoginRequest, LogoutResponse, TokenResponse
from app.servicios.servicio_autenticacion import ServicioAutenticacion

router = APIRouter(prefix="/auth", tags=["Autenticación"])


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="EP-01 Iniciar sesión",
)
def login(body: LoginRequest, db: DbSession) -> TokenResponse:
    """
    HU-01 · POST /auth/login

    - Credenciales válidas
    - Usuario habilitado (estado = true)
    - Devuelve token + datos públicos del usuario y su rol
    """
    return ServicioAutenticacion(db).login(body)


@router.post(
    "/logout",
    response_model=LogoutResponse,
    summary="EP-02 Cerrar sesión",
)
def logout(current_user: CurrentUser, db: DbSession) -> LogoutResponse:
    """
    HU-01 · POST /auth/logout

    Requiere token válido. Con JWT stateless la invalidación es del cliente.
    El endpoint existe por matriz definitiva (EP-02).
    """
    _ = current_user
    result = ServicioAutenticacion(db).logout()
    return LogoutResponse(**result)