"""Casos de uso de autenticación (EP-01, EP-02)."""

from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.core.exceptions import AuthenticationError
from app.core.security import create_access_token, verify_password
from app.repositories.usuario_repository import UsuarioRepository
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.usuario import UsuarioPublic
from app.services.usuario_service import to_usuario_public


class AuthService:
    def __init__(self, db: Session):
        self.repo = UsuarioRepository(db)
        self.db = db

    def login(self, data: LoginRequest) -> TokenResponse:
        usuario = self.repo.get_by_correo(data.correo)
        if usuario is None:
            raise AuthenticationError("Credenciales inválidas")

        if not usuario.estado:
            raise AuthenticationError("Usuario deshabilitado")

        if not verify_password(data.contrasena, usuario.password_hash):
            raise AuthenticationError("Credenciales inválidas")

        # Actualizar último acceso
        usuario.ultimo_acceso = datetime.now(timezone.utc).replace(tzinfo=None)
        self.repo.commit()
        self.repo.refresh(usuario)

        rol = usuario.perfil.nombre if usuario.perfil else None
        token = create_access_token(
            subject=usuario.id_usuario,
            extra_claims={
                "rol": rol,
                "correo": usuario.correo,
            },
        )

        return TokenResponse(
            access_token=token,
            token_type="bearer",
            usuario=to_usuario_public(usuario),
        )

    def logout(self) -> dict:
        """
        Con JWT stateless el logout es del lado del cliente
        (descartar el token). Se mantiene el endpoint por matriz (EP-02).
        Si en el futuro se usa lista negra / sesión en BD, aquí se invalidaría.
        """
        return {"message": "Sesión cerrada correctamente"}
