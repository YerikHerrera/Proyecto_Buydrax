"""Schemas de autenticación (EP-01, EP-02 + recuperación + Google)."""

from typing import Optional

from pydantic import BaseModel, Field, field_validator

from app.esquemas.usuario import UsuarioPublic


def _normalizar_correo(v: str) -> str:
    return (v or "").strip().lower()


def _es_correo_aceptable(v: str) -> bool:
    """
    Forma user@dominio.tld.
    Permite .local (usuario plataforma@buydrax.local) — EmailStr lo rechaza.
    """
    v = _normalizar_correo(v)
    if "@" not in v or " " in v or v.count("@") != 1:
        return False
    local, _, domain = v.partition("@")
    if not local or not domain:
        return False
    # al menos un punto en el dominio (buydrax.local, construandes.com.co)
    if "." not in domain:
        return False
    labels = domain.split(".")
    if any(not lab for lab in labels):
        return False
    return True


class LoginRequest(BaseModel):
    correo: str = Field(..., min_length=5, max_length=100)
    contrasena: str = Field(..., min_length=1)

    @field_validator("correo")
    @classmethod
    def validar_correo(cls, v: str) -> str:
        v = _normalizar_correo(v)
        if not _es_correo_aceptable(v):
            raise ValueError("Correo electrónico no válido")
        return v


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioPublic


class LogoutResponse(BaseModel):
    message: str = "Sesión cerrada correctamente"


class ForgotPasswordRequest(BaseModel):
    correo: str = Field(..., min_length=5, max_length=100)

    @field_validator("correo")
    @classmethod
    def validar_correo(cls, v: str) -> str:
        v = _normalizar_correo(v)
        if not _es_correo_aceptable(v):
            raise ValueError("Correo electrónico no válido")
        return v


class ForgotPasswordResponse(BaseModel):
    message: str


class ResetPasswordRequest(BaseModel):
    token: str = Field(..., min_length=10)
    nueva_contrasena: str = Field(..., min_length=8)


class GoogleLoginRequest(BaseModel):
    correo: str = Field(..., min_length=5, max_length=100)
    nombres: Optional[str] = None
    apellidos: Optional[str] = None
    id_token: Optional[str] = None

    @field_validator("correo")
    @classmethod
    def validar_correo(cls, v: str) -> str:
        v = _normalizar_correo(v)
        if not _es_correo_aceptable(v):
            raise ValueError("Correo electrónico no válido")
        return v
