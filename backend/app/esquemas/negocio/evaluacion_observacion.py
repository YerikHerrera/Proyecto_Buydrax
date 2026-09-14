"""Esquemas de negocio."""

from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.esquemas.comunes import ORMModel as ORM


class EvaluacionCreate(BaseModel):
    periodo: str
    puntaje_productividad: float
    puntaje_asistencia: float
    puntaje_calidad: float
    puntaje_general: float
    recomendacion: Optional[str] = None
    solicita_capacitacion: bool = False



class EvaluacionUpdate(BaseModel):
    puntaje_productividad: Optional[float] = None
    puntaje_asistencia: Optional[float] = None
    puntaje_calidad: Optional[float] = None
    puntaje_general: Optional[float] = None
    recomendacion: Optional[str] = None
    solicita_capacitacion: Optional[bool] = None



class EvaluacionOut(ORM):
    id_evaluacion: int
    id_empleado: int
    id_evaluador: int
    periodo: str
    puntaje_productividad: float
    puntaje_asistencia: float
    puntaje_calidad: float
    puntaje_general: float
    recomendacion: Optional[str] = None
    solicita_capacitacion: bool
    fecha_evaluacion: datetime


# ---- Solicitud / Notificación ----

class ObservacionCreate(BaseModel):
    tipo_observacion: str
    descripcion: str
    escalada: bool = False



class ObservacionUpdate(BaseModel):
    estado_observacion: Optional[str] = None
    escalada: Optional[bool] = None
    descripcion: Optional[str] = None



class ObservacionOut(ORM):
    id_observacion: int
    id_empleado: int
    id_supervisor: int
    tipo_observacion: str
    descripcion: str
    fecha: datetime
    escalada: bool
    estado_observacion: str


