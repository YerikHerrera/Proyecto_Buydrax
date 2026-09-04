"""Schemas de autenticación (EP-01, EP-02)."""

from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from app.schemas.usuario import UsuarioPublic


class LoginRequest(BaseModel):
    correo: EmailStr
    contrasena: str = Field(..., min_length=1)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioPublic


class LogoutResponse(BaseModel):
    message: str = "Sesión cerrada correctamente"
