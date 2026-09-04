"""Schemas de usuarios y roles (EP-03 … EP-07)."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.schemas.common import ORMModel


# Nombres de perfil soportados por el SQL de semillas
PERFILES_VALIDOS = {"ADMIN_RRHH", "SUPERVISOR", "CONTADOR", "EMPLEADO"}


class PerfilPublic(ORMModel):
    id_perfil: int
    nombre: str
    descripcion: Optional[str] = None


class UsuarioPublic(ORMModel):
    """Respuesta pública de usuario (sin password_hash)."""

    id_usuario: int
    id_perfil: Optional[int] = None
    nombres: str
    apellidos: str
    correo: EmailStr
    estado: bool
    ultimo_acceso: Optional[datetime] = None
    foto_perfil: Optional[str] = None
    idioma: str = "ES"
    perfil: Optional[PerfilPublic] = None
    # Rol efectivo derivado (nombre del perfil o "SIN_PERFIL")
    rol: Optional[str] = None


class UsuarioCreate(BaseModel):
    """
    Body de POST /usuarios (EP-03).
    - Campos de usuarios según SQL.
    - rol: nombre de perfil (ADMIN_RRHH | SUPERVISOR | CONTADOR | EMPLEADO).
    - Campos adicionales obligatorios cuando el rol es especializado.
    """

    nombres: str = Field(..., min_length=1, max_length=60)
    apellidos: str = Field(..., min_length=1, max_length=60)
    correo: EmailStr
    contrasena: str = Field(..., min_length=8, max_length=128)
    rol: str = Field(..., description="ADMIN_RRHH | SUPERVISOR | CONTADOR | EMPLEADO")
    idioma: str = Field(default="ES", max_length=5)
    foto_perfil: Optional[str] = Field(default=None, max_length=255)
    estado: bool = True

    # Campos de roles especializados (requeridos según rol)
    numero_tarjeta_profesional: Optional[str] = Field(default=None, max_length=30)
    cuadrilla_asignada: Optional[str] = Field(default=None, max_length=60)
    area_nomina: Optional[str] = Field(default=None, max_length=30)
    area_responsable: Optional[str] = Field(default=None, max_length=60)

    @field_validator("rol")
    @classmethod
    def validar_rol(cls, v: str) -> str:
        v_up = v.strip().upper()
        if v_up not in PERFILES_VALIDOS:
            raise ValueError(
                f"Rol inválido. Valores permitidos: {', '.join(sorted(PERFILES_VALIDOS))}"
            )
        return v_up


class UsuarioUpdate(BaseModel):
    """Body de PATCH /usuarios/{id} (EP-06). Solo campos modificables."""

    nombres: Optional[str] = Field(default=None, min_length=1, max_length=60)
    apellidos: Optional[str] = Field(default=None, min_length=1, max_length=60)
    correo: Optional[EmailStr] = None
    contrasena: Optional[str] = Field(default=None, min_length=8, max_length=128)
    rol: Optional[str] = None
    idioma: Optional[str] = Field(default=None, max_length=5)
    foto_perfil: Optional[str] = Field(default=None, max_length=255)
    estado: Optional[bool] = None

    # Campos de roles especializados (opcionales en update)
    numero_tarjeta_profesional: Optional[str] = Field(default=None, max_length=30)
    cuadrilla_asignada: Optional[str] = Field(default=None, max_length=60)
    area_nomina: Optional[str] = Field(default=None, max_length=30)
    area_responsable: Optional[str] = Field(default=None, max_length=60)

    @field_validator("rol")
    @classmethod
    def validar_rol(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        v_up = v.strip().upper()
        if v_up not in PERFILES_VALIDOS:
            raise ValueError(
                f"Rol inválido. Valores permitidos: {', '.join(sorted(PERFILES_VALIDOS))}"
            )
        return v_up


class UsuarioListFilters(BaseModel):
    nombre: Optional[str] = None
    correo: Optional[str] = None
    rol: Optional[str] = None
    estado: Optional[bool] = None
    skip: int = Field(default=0, ge=0)
    limit: int = Field(default=50, ge=1, le=200)


class RolPublic(ORMModel):
    id_perfil: int
    nombre: str
    descripcion: Optional[str] = None
