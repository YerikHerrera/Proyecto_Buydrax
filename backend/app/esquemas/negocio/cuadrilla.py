"""Esquemas de cuadrillas."""

from datetime import date
from typing import Optional

from pydantic import BaseModel, Field

from app.esquemas.comunes import ORMModel as ORM


class CuadrillaCreate(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=80)
    descripcion: Optional[str] = Field(default=None, max_length=200)
    id_supervisor: Optional[int] = None


class CuadrillaUpdate(BaseModel):
    nombre: Optional[str] = Field(default=None, min_length=1, max_length=80)
    descripcion: Optional[str] = Field(default=None, max_length=200)
    id_supervisor: Optional[int] = None
    activo: Optional[bool] = None


class CuadrillaOut(ORM):
    id_cuadrilla: int
    nombre: str
    descripcion: Optional[str] = None
    id_supervisor: Optional[int] = None
    activo: bool


class CuadrillaProyectoLink(BaseModel):
    id_proyecto: int
    fecha_inicio: Optional[date] = None


class CuadrillaProyectoOut(ORM):
    id_cuadrilla_proyecto: int
    id_cuadrilla: int
    id_proyecto: int
    activo: bool
    fecha_inicio: date
    fecha_fin: Optional[date] = None
    # enriquecidos en servicio (opcionales)
    nombre_cuadrilla: Optional[str] = None
    nombre_proyecto: Optional[str] = None
    empleados_activos: Optional[int] = None


class DesvincularOpciones(BaseModel):
    """Si forzar=True, retira empleados activos y luego desvincula."""
    forzar: bool = False
