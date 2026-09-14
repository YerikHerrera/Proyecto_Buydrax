"""Endpoint de roles — EP-07."""

from fastapi import APIRouter

from app.nucleo.dependencias import CurrentUser, DbSession
from app.esquemas.usuario import RolPublic
from app.servicios.servicio_usuarios import ServicioUsuarios

router = APIRouter(prefix="/roles", tags=["Roles"])


@router.get(
    "",
    response_model=list[RolPublic],
    summary="EP-07 Consultar roles",
)
def listar_roles(
    db: DbSession,
    actor: CurrentUser,
) -> list[RolPublic]:
    """
    HU-26 · GET /roles
    Actor: Usuario autorizado
    Devuelve los perfiles soportados por el modelo (tabla perfil).
    """
    return ServicioUsuarios(db).listar_roles(actor)