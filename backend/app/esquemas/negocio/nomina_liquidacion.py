"""Esquemas de negocio."""

from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.esquemas.comunes import ORMModel as ORM


class NominaCreate(BaseModel):
    id_obra: Optional[int] = None
    id_configuracion: int
    periodo_inicio: date
    periodo_fin: date
    tipo_nomina: str



class NominaUpdate(BaseModel):
    estado_nomina: Optional[str] = None



class NominaOut(ORM):
    id_nomina: int
    id_obra: Optional[int] = None
    id_configuracion: int
    id_admin_rrhh: int
    periodo_inicio: date
    periodo_fin: date
    tipo_nomina: str
    fecha_generacion: datetime
    estado_nomina: str
    total_pagado: Decimal
    cantidad_empleados: int



class DetalleNominaOut(ORM):
    id_detalle_nomina: int
    id_nomina: int
    id_empleado: int
    horas_ordinarias: float
    horas_extra: float
    dominicales_festivos: float
    viaticos: Decimal
    incapacidades: Decimal
    descuentos_prestamos: Decimal
    neto_pagar: Decimal



class DesprendibleOut(ORM):
    id_desprendible: int
    id_detalle_nomina: int
    id_empleado: int
    periodo_pago: str
    dias_liquidados: int
    fecha_pago: date
    neto_recibido: Decimal
    archivo_url: str
    firma_digital: str
    estado_descarga: str



class PilaOut(ORM):
    id_pila: int
    id_nomina: int
    periodo_inicio: date
    periodo_fin: date
    total_salud: Decimal
    total_pension: Decimal
    total_arl: Decimal
    total_paraestatales: Decimal
    archivo_txt: Optional[str] = None
    estado_validacion: str



class LiquidacionCreate(BaseModel):
    """Campos de entrada; montos calculados requieren fórmulas cerradas (pendiente)."""
    id_configuracion: int
    fecha_retiro: date
    motivo_retiro: str
    dias_trabajados: int
    # Montos: si las fórmulas siguen pendientes, el cliente Admin puede registrar
    # valores ya calculados externamente solo si la política del proyecto lo permite.
    # Por decisión cerrada: no inventamos fórmulas. Se exigen los montos del SQL.
    salario_promedio: Decimal = Field(..., ge=0)
    cesantias: Decimal = Field(..., ge=0)
    intereses_cesantias: Decimal = Field(..., ge=0)
    prima: Decimal = Field(..., ge=0)
    vacaciones: Decimal = Field(..., ge=0)
    indemnizacion: Decimal = Field(..., ge=0)
    dotacion_pendiente: Decimal = Field(default=0, ge=0)
    total_neto_pagar: Decimal = Field(..., ge=0)
    notas_adicionales: Optional[str] = None



class LiquidacionOut(ORM):
    id_liquidacion: int
    id_empleado: int
    id_configuracion: int
    fecha_retiro: date
    motivo_retiro: str
    salario_promedio: Decimal
    dias_trabajados: int
    cesantias: Decimal
    intereses_cesantias: Decimal
    prima: Decimal
    vacaciones: Decimal
    indemnizacion: Decimal
    dotacion_pendiente: Decimal
    total_neto_pagar: Decimal
    notas_adicionales: Optional[str] = None


