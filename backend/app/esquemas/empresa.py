"""Esquemas Pydantic — empresas / dominios."""

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field, field_validator

from app.nucleo.dominio import normalizar_dominio


class EmpresaCreate(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=120)
    dominio: str = Field(..., min_length=3, max_length=120, description="ej. colcenter.com")
    tipo: Literal["EMPRESA", "EXTERNO"] = "EMPRESA"

    @field_validator("dominio")
    @classmethod
    def _dom(cls, v: str) -> str:
        d = normalizar_dominio(v)
        if not d:
            raise ValueError("Dominio requerido (ej. colcenter.com)")
        # Acepta "empresa.com" o nombres simples de prueba (se normalizan)
        if "." not in d:
            # Permite crear dominios de prueba sin TLD real
            d = f"{d}.local"
        if " " in d or len(d) < 3:
            raise ValueError("Dominio inválido (ej. colcenter.com)")
        return d

    @field_validator("nombre")
    @classmethod
    def _nom(cls, v: str) -> str:
        return v.strip()


class EmpresaUpdate(BaseModel):
    nombre: Optional[str] = Field(default=None, min_length=2, max_length=120)
    activo: Optional[bool] = None
    tipo: Optional[Literal["EMPRESA", "EXTERNO"]] = None


class EmpresaPublic(BaseModel):
    id_empresa: int
    nombre: str
    dominio: str
    tipo: str
    activo: bool
    creado_en: Optional[datetime] = None

    model_config = {"from_attributes": True}


class AdminParaDominioCreate(BaseModel):
    """EMPRESA crea un ADMIN_RRHH ligado a un dominio registrado."""
    id_empresa: int
    nombres: str = Field(..., min_length=1, max_length=60)
    apellidos: str = Field(..., min_length=1, max_length=60)
    correo: str = Field(..., min_length=5, max_length=100)
    contrasena: str = Field(..., min_length=6, max_length=128)
    area_responsable: str = Field(default="Gestión humana", max_length=60)
