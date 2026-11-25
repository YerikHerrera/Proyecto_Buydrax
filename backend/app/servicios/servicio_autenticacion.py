"""Casos de uso de autenticación."""

from __future__ import annotations

import secrets
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.nucleo.dominio import extraer_dominio
from app.nucleo.excepciones import AuthenticationError, NotFoundError, ValidationAppError
from app.nucleo.seguridad import create_access_token, hash_password, verify_password
from app.nucleo.configuracion import get_settings
from app.repositorios.repositorio_usuarios import RepositorioUsuarios
from app.esquemas.autenticacion import LoginRequest, TokenResponse
from app.servicios.servicio_usuarios import to_usuario_public
from app.servicios.servicio_correo import enviar_correo
from app.modelos.recuperacion import RecuperacionPassword
from app.modelos.usuario import Usuario


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
        if not verify_password(data.contrasena, usuario.password_encriptado):
            raise AuthenticationError("Credenciales inválidas")

        usuario.ultimo_acceso = datetime.now(timezone.utc).replace(tzinfo=None)
        try:
            self.repo.commit()
            self.repo.refresh(usuario)
        except Exception:
            self.db.rollback()

        rol = usuario.perfil.nombre if usuario.perfil else None
        dominio = extraer_dominio(usuario.correo)
        token = create_access_token(
            subject=usuario.id_usuario,
            extra_claims={"rol": rol, "correo": usuario.correo, "dominio": dominio},
        )
        return TokenResponse(
            access_token=token,
            token_type="bearer",
            usuario=to_usuario_public(usuario),
        )

    def logout(self) -> dict:
        return {"message": "Sesión cerrada correctamente"}

    def solicitar_recuperacion(self, correo: str) -> dict:
        try:
            usuario = self.repo.get_by_correo(correo.strip().lower())
        except Exception:
            usuario = None
        if usuario and usuario.estado:
            token = secrets.token_urlsafe(32)
            exp = datetime.utcnow() + timedelta(hours=1)
            try:
                rec = RecuperacionPassword(
                    id_usuario=usuario.id_usuario,
                    token=token,
                    expira_en=exp,
                    usado=False,
                )
                self.db.add(rec)
                self.db.commit()
                settings = get_settings()
                base = (settings.frontend_url or "").rstrip("/")
                enlace = f"{base}/reset-password?token={token}"
                cuerpo = (
                    f"Hola {usuario.nombres},\n\n"
                    f"Token (1 hora): {token}\n"
                    f"Enlace: {enlace}\n\n"
                    f"Si no fuiste tú, ignora este mensaje.\n"
                )
                enviar_correo(usuario.correo, "Recuperar contraseña · Buydrax", cuerpo)
            except Exception:
                self.db.rollback()
        return {
            "message": "Si el correo existe en el sistema, enviamos instrucciones de recuperación."
        }

    def restablecer_password(self, token: str, nueva: str) -> dict:
        if not nueva or len(nueva) < 8:
            raise ValidationAppError("La contraseña debe tener al menos 8 caracteres")
        try:
            rec = (
                self.db.query(RecuperacionPassword)
                .filter(RecuperacionPassword.token == token, RecuperacionPassword.usado.is_(False))
                .first()
            )
        except Exception as exc:
            raise ValidationAppError(
                "Recuperación no disponible: crea la tabla recuperacion_password (script SQL)."
            ) from exc
        if rec is None:
            raise ValidationAppError("Token inválido o ya usado")
        if rec.expira_en < datetime.utcnow():
            raise ValidationAppError("Token expirado")
        usuario = self.db.get(Usuario, rec.id_usuario)
        if usuario is None:
            raise NotFoundError("Usuario no encontrado")
        usuario.password_encriptado = hash_password(nueva)
        rec.usado = True
        self.db.commit()
        return {"message": "Contraseña actualizada. Ya puedes iniciar sesión."}

    def login_google(
        self,
        correo: str,
        nombres: str | None = None,
        apellidos: str | None = None,
        id_token: str | None = None,
    ) -> TokenResponse:
        """Login con Google: requiere cuenta ya registrada en Buydrax.

        Si GOOGLE_CLIENT_ID está en settings, exige id_token y valida claims
        básicos (aud, iss, email). En producción conviene google-auth.
        """
        settings = get_settings()
        client_id = getattr(settings, "GOOGLE_CLIENT_ID", None) or getattr(
            settings, "google_client_id", None
        )

        correo = (correo or "").strip().lower()
        if id_token:
            try:
                import base64
                import json

                parts = id_token.split(".")
                if len(parts) < 2:
                    raise ValidationAppError("Token de Google inválido")
                pad = "=" * (-len(parts[1]) % 4)
                payload = json.loads(base64.urlsafe_b64decode(parts[1] + pad))
                email_token = (payload.get("email") or "").strip().lower()
                if email_token:
                    correo = email_token
                if client_id:
                    aud = payload.get("aud")
                    if aud != client_id and aud != [client_id]:
                        raise AuthenticationError("Token de Google no corresponde a esta aplicación")
                iss = payload.get("iss") or ""
                if iss and iss not in (
                    "accounts.google.com",
                    "https://accounts.google.com",
                ):
                    raise AuthenticationError("Emisor de token Google no reconocido")
                if payload.get("email_verified") is False:
                    raise AuthenticationError("El correo de Google no está verificado")
            except (ValidationAppError, AuthenticationError):
                raise
            except Exception as exc:
                raise ValidationAppError(f"No se pudo leer el token de Google: {exc}") from exc
        elif client_id:
            raise ValidationAppError(
                "Configura el inicio con Google en el frontend (id_token). "
                "El modo prompt de correo solo aplica sin GOOGLE_CLIENT_ID."
            )

        if not correo or "@" not in correo:
            raise ValidationAppError("Correo de Google inválido")
        usuario = self.repo.get_by_correo(correo)
        if usuario is None:
            raise AuthenticationError(
                "No hay cuenta Buydrax con ese correo de Google. Un admin debe registrarte."
            )
        if not usuario.estado:
            raise AuthenticationError("Usuario deshabilitado")
        usuario.ultimo_acceso = datetime.now(timezone.utc).replace(tzinfo=None)
        try:
            self.repo.commit()
            self.repo.refresh(usuario)
        except Exception:
            self.db.rollback()
        rol = usuario.perfil.nombre if usuario.perfil else None
        token = create_access_token(
            subject=usuario.id_usuario,
            extra_claims={
                "rol": rol,
                "correo": usuario.correo,
                "dominio": extraer_dominio(usuario.correo),
            },
        )
        return TokenResponse(
            access_token=token,
            token_type="bearer",
            usuario=to_usuario_public(usuario),
        )
