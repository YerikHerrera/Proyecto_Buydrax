"""Endpoints de usuarios — EP-03 … EP-06."""

from typing import Optional

from fastapi import APIRouter, Query

from app.nucleo.dependencias import AdminRrhhUser, CurrentUser, DbSession
from app.esquemas.comunes import PaginatedResponse
from app.esquemas.usuario import UsuarioCreate, UsuarioListFilters, UsuarioPublic, UsuarioUpdate
from app.servicios.servicio_usuarios import ServicioUsuarios

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])


@router.post(
    "",
    response_model=UsuarioPublic,
    status_code=201,
    summary="EP-03 Crear usuario",
)
def crear_usuario(
    body: UsuarioCreate,
    db: DbSession,
    actor: AdminRrhhUser,
) -> UsuarioPublic:
    """
    HU-01, HU-26 · POST /usuarios
    Actor: Admin_RRHH
    """
    return ServicioUsuarios(db).crear(body, actor)


@router.get(
    "",
    response_model=PaginatedResponse[UsuarioPublic],
    summary="EP-04 Listar usuarios",
)
def listar_usuarios(
    db: DbSession,
    actor: CurrentUser,
    nombre: Optional[str] = Query(default=None),
    correo: Optional[str] = Query(default=None),
    rol: Optional[str] = Query(default=None, description="ADMIN_RRHH|SUPERVISOR|CONTADOR|EMPLEADO"),
    estado: Optional[bool] = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
) -> PaginatedResponse[UsuarioPublic]:
    """
    HU-26 · GET /usuarios
    Actor: Usuario autorizado
    """
    filters = UsuarioListFilters(
        nombre=nombre,
        correo=correo,
        rol=rol,
        estado=estado,
        skip=skip,
        limit=limit,
    )
    return ServicioUsuarios(db).listar(filters, actor)


@router.get(
    "/{id_usuario}",
    response_model=UsuarioPublic,
    summary="EP-05 Consultar usuario",
)
def obtener_usuario(
    id_usuario: int,
    db: DbSession,
    actor: CurrentUser,
) -> UsuarioPublic:
    """
    HU-26 · GET /usuarios/{id}
    Actor: Usuario autorizado
    """
    return ServicioUsuarios(db).obtener(id_usuario, actor)


@router.patch(
    "/{id_usuario}",
    response_model=UsuarioPublic,
    summary="EP-06 Actualizar usuario",
)
def actualizar_usuario(
    id_usuario: int,
    body: UsuarioUpdate,
    db: DbSession,
    actor: AdminRrhhUser,
) -> UsuarioPublic:
    """
    HU-26 · PATCH /usuarios/{id}
    Actor: Admin_RRHH
    """
    return ServicioUsuarios(db).actualizar(id_usuario, body, actor)