"""Dependencias de FastAPI: DB, usuario actual, roles."""

from typing import Annotated, Optional

from fastapi import Depends, Header
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.exceptions import AuthenticationError, AuthorizationError
from app.core.security import decode_access_token
from app.db.session import get_db
from app.models import Usuario
from app.repositories.usuario_repository import UsuarioRepository

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    db: Annotated[Session, Depends(get_db)],
    credentials: Annotated[
        Optional[HTTPAuthorizationCredentials], Depends(bearer_scheme)
    ] = None,
) -> Usuario:
    if credentials is None or not credentials.credentials:
        raise AuthenticationError("Token de autenticación requerido")

    try:
        payload = decode_access_token(credentials.credentials)
    except ValueError as exc:
        raise AuthenticationError(str(exc)) from exc

    sub = payload.get("sub")
    if sub is None:
        raise AuthenticationError("Token inválido")

    try:
        id_usuario = int(sub)
    except (TypeError, ValueError) as exc:
        raise AuthenticationError("Token inválido") from exc

    repo = UsuarioRepository(db)
    usuario = repo.get_by_id(id_usuario)
    if usuario is None:
        raise AuthenticationError("Usuario no encontrado")
    if not usuario.estado:
        raise AuthenticationError("Usuario deshabilitado")
    return usuario


def require_roles(*roles_permitidos: str):
    """Factory de dependencia que exige uno de los roles dados."""

    def _checker(usuario: Annotated[Usuario, Depends(get_current_user)]) -> Usuario:
        rol = usuario.perfil.nombre if usuario.perfil else None
        if rol not in roles_permitidos:
            raise AuthorizationError(
                f"Se requiere uno de los roles: {', '.join(roles_permitidos)}"
            )
        return usuario

    return _checker


# Atajos tipados
CurrentUser = Annotated[Usuario, Depends(get_current_user)]
AdminRrhhUser = Annotated[Usuario, Depends(require_roles("ADMIN_RRHH"))]
DbSession = Annotated[Session, Depends(get_db)]
