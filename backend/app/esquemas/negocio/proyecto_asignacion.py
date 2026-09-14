"""Esquemas de negocio."""

from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.esquemas.comunes import ORMModel as ORM


class ProyectoCreate(BaseModel):
    id_supervisor: int
    nombre: str
    descripcion: Optional[str] = None
    ubicacion_calle: str
    ubicacion_referencia: Optional[str] = None
    fecha_inicio: date
    fecha_fin: date
    estado_proyecto: str = "ACTIVO"



class ProyectoUpdate(BaseModel):
    id_supervisor: Optional[int] = None
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    ubicacion_calle: Optional[str] = None
    ubicacion_referencia: Optional[str] = None
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None
    estado_proyecto: Optional[str] = None



class ProyectoOut(ORM):
    id_proyecto: int
    id_supervisor: int
    nombre: str
    descripcion: Optional[str] = None
    ubicacion_calle: str
    ubicacion_referencia: Optional[str] = None
    fecha_inicio: date
    fecha_fin: date
    estado_proyecto: str


# ---- Asistencia ----

class AsignacionCreate(BaseModel):
    id_empleado: int
    cuadrilla: str
    rol_en_proyecto: str
    fecha_asignacion: date



class AsignacionOut(ORM):
    id_asignacion: int
    id_proyecto: int
    id_empleado: int
    cuadrilla: str
    rol_en_proyecto: str
    fecha_asignacion: date
    activo: bool


# ---- Observación / Evaluación ----
