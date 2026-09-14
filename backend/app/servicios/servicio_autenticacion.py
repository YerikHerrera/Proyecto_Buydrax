"""Casos de uso de autenticación (EP-01, EP-02)."""

from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.nucleo.excepciones import AuthenticationError
from app.nucleo.seguridad import create_access_token, verify_password
from app.repositorios.repositorio_usuarios import RepositorioUsuarios
from app.esquemas.autenticacion import LoginRequest, TokenResponse
from app.esquemas.usuario import UsuarioPublic
from app.servicios.servicio_usuarios import to_usuario_public


class ServicioAutenticacion:
    def __init__(self, db: Session):
        self.repo = RepositorioUsuarios(db)
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
