"""Endpoint de roles — EP-07."""

from fastapi import APIRouter

from app.core.dependencies import CurrentUser, DbSession
from app.schemas.usuario import RolPublic
from app.services.usuario_service import UsuarioService

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
    return UsuarioService(db).listar_roles(actor)
