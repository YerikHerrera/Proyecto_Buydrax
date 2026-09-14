"""Esquemas de negocio."""

from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.esquemas.comunes import ORMModel as ORM


class ConfiguracionCreate(BaseModel):
    smlmv: Decimal
    auxilio_transporte: Decimal
    tope_exoneracion: Decimal
    pct_hora_extra_diurna: float = 0.25
    pct_hora_extra_nocturna: float = 0.75
    pct_recargo_nocturno_ordinario: float = 0.35
    pct_recargo_dominical: float = 0.75
    pct_hora_extra_diurna_dominical: float = 1.0
    pct_salud_empleado: float
    pct_pension_empleado: float
    nivel_arl_1: float
    nivel_arl_2: float
    nivel_arl_3: float
    nivel_arl_4: float
    nivel_arl_5: float
    anio_vigencia: int



class ConfiguracionUpdate(BaseModel):
    smlmv: Optional[Decimal] = None
    auxilio_transporte: Optional[Decimal] = None
    tope_exoneracion: Optional[Decimal] = None
    pct_hora_extra_diurna: Optional[float] = None
    pct_hora_extra_nocturna: Optional[float] = None
    pct_recargo_nocturno_ordinario: Optional[float] = None
    pct_recargo_dominical: Optional[float] = None
    pct_hora_extra_diurna_dominical: Optional[float] = None
    pct_salud_empleado: Optional[float] = None
    pct_pension_empleado: Optional[float] = None
    nivel_arl_1: Optional[float] = None
    nivel_arl_2: Optional[float] = None
    nivel_arl_3: Optional[float] = None
    nivel_arl_4: Optional[float] = None
    nivel_arl_5: Optional[float] = None



class ConfiguracionOut(ORM):
    id_configuracion: int
    smlmv: Decimal
    auxilio_transporte: Decimal
    tope_exoneracion: Decimal
    pct_hora_extra_diurna: float
    pct_hora_extra_nocturna: float
    pct_recargo_nocturno_ordinario: float
    pct_recargo_dominical: float
    pct_hora_extra_diurna_dominical: float
    pct_salud_empleado: float
    pct_pension_empleado: float
    nivel_arl_1: float
    nivel_arl_2: float
    nivel_arl_3: float
    nivel_arl_4: float
    nivel_arl_5: float
    anio_vigencia: int


# ---- Nómina (estructura; cálculo pendiente de fórmulas) ----

class MessageOut(BaseModel):
    message: str
    details: Optional[Any] = None



class DashboardOut(BaseModel):
    empleados_activos: int
    proyectos_activos: int
    horas_extra_pendientes: int
    novedades_pendientes: int
    nominas_borrador: int
    solicitudes_pendientes: int
