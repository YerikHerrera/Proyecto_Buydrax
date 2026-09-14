"""Esquemas de negocio."""

from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.esquemas.comunes import ORMModel as ORM


class AsistenciaCreate(BaseModel):
    fecha: date
    hora_entrada: time
    hora_salida: Optional[time] = None
    estado_asistencia: str
    observacion: Optional[str] = None



class AsistenciaOut(ORM):
    id_asistencia: int
    id_empleado: int
    id_creado_por: int
    fecha: date
    hora_entrada: time
    hora_salida: Optional[time] = None
    estado_asistencia: str
    observacion: Optional[str] = None
    fecha_creacion: datetime


# ---- Turno ----

class TurnoCreate(BaseModel):
    id_empleado: int
    id_proyecto: int
    tipo_turno: str
    hora_inicio: time
    hora_fin: time
    fecha: date



class TurnoUpdate(BaseModel):
    tipo_turno: Optional[str] = None
    hora_inicio: Optional[time] = None
    hora_fin: Optional[time] = None
    fecha: Optional[date] = None
    id_proyecto: Optional[int] = None



class TurnoOut(ORM):
    id_turno: int
    id_empleado: int
    id_proyecto: int
    id_asignado_por: int
    tipo_turno: str
    hora_inicio: time
    hora_fin: time
    fecha: date


# ---- Novedad ----
