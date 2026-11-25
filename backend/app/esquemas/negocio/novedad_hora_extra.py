
"""Esquemas de negocio: Novedad y HoraExtra."""

from datetime import date
from pydantic import BaseModel, ConfigDict


class NovedadCreate(BaseModel):
    tipo_novedad: str
    fecha_inicio: date
    fecha_fin: date
    total_dias: float
    soporte_url: str | None = None


class NovedadUpdate(BaseModel):
    tipo_novedad: str | None = None
    fecha_inicio: date | None = None
    fecha_fin: date | None = None
    total_dias: float | None = None
    soporte_url: str | None = None
    estado_novedad: str | None = None
    id_aprobado_por: int | None = None


class NovedadOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_novedad: int
    id_empleado: int
    id_aprobado_por: int | None
    tipo_novedad: str
    fecha_inicio: date
    fecha_fin: date
    total_dias: float
    soporte_url: str | None
    estado_novedad: str


# ==========================================
# ESQUEMAS DE HORAS EXTRA
# ==========================================

class HoraExtraCreate(BaseModel):
    motivo: str
    fecha_inicio: date
    fecha_fin: date
    cantidad_horas: float
    tipo_hora: str
    archivo_soporte_url: str


class HoraExtraUpdate(BaseModel):
    motivo: str | None = None
    fecha_inicio: date | None = None
    fecha_fin: date | None = None
    cantidad_horas: float | None = None
    tipo_hora: str | None = None
    archivo_soporte_url: str | None = None
    estado_he: str | None = None
    id_aprobador: int | None = None


class HoraExtraOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_hora_extra: int
    id_empleado: int
    id_aprobador: int | None
    motivo: str
    fecha_inicio: date
    fecha_fin: date
    cantidad_horas: float
    tipo_hora: str
    archivo_soporte_url: str
    estado_he: str
