"""Esquemas de negocio."""

from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.esquemas.comunes import ORMModel as ORM


class NovedadCreate(BaseModel):
    tipo_novedad: str
    fecha_inicio: date
    fecha_fin: date
    total_dias: float = Field(..., gt=0)
    soporte_url: Optional[str] = None



class NovedadUpdate(BaseModel):
    estado_novedad: Optional[str] = None
    soporte_url: Optional[str] = None
    total_dias: Optional[float] = None



class NovedadOut(ORM):
    id_novedad: int
    id_empleado: int
    id_aprobado_por: Optional[int] = None
    tipo_novedad: str
    fecha_inicio: date
    fecha_fin: date
    total_dias: float
    soporte_url: Optional[str] = None
    estado_novedad: str


# ---- Hora extra ----

class HoraExtraCreate(BaseModel):
    motivo: str
    fecha_inicio: date
    fecha_fin: date
    cantidad_horas: float = Field(..., gt=0)
    tipo_hora: str
    archivo_soporte_url: str



class HoraExtraUpdate(BaseModel):
    estado_he: Optional[str] = None
    motivo: Optional[str] = None



class HoraExtraOut(ORM):
    id_hora_extra: int
    id_empleado: int
    id_aprobador: Optional[int] = None
    motivo: str
    fecha_inicio: date
    fecha_fin: date
    cantidad_horas: float
    tipo_hora: str
    archivo_soporte_url: str
    estado_he: str


# ---- Certificación ----
