"""Esquemas de negocio."""

from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.esquemas.comunes import ORMModel as ORM


class ContratoCreate(BaseModel):
    id_supervisor: Optional[int] = None
    id_proyecto: Optional[int] = None
    tipo_contrato: str
    salario: Decimal = Field(..., ge=0)
    fecha_inicio: date
    fecha_fin: Optional[date] = None
    obra_asignada: Optional[str] = None
    arl: str
    archivo_url: Optional[str] = None
    estado_contrato: str = "VIGENTE"



class ContratoUpdate(BaseModel):
    id_supervisor: Optional[int] = None
    id_proyecto: Optional[int] = None
    tipo_contrato: Optional[str] = None
    salario: Optional[Decimal] = None
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None
    obra_asignada: Optional[str] = None
    arl: Optional[str] = None
    archivo_url: Optional[str] = None
    estado_contrato: Optional[str] = None



class ContratoOut(ORM):
    id_contrato: int
    id_empleado: int
    id_supervisor: Optional[int] = None
    id_proyecto: Optional[int] = None
    tipo_contrato: str
    salario: Decimal
    fecha_inicio: date
    fecha_fin: Optional[date] = None
    obra_asignada: Optional[str] = None
    arl: str
    archivo_url: Optional[str] = None
    estado_contrato: str


# ---- Préstamo ----

class PrestamoCreate(BaseModel):
    tipo_obligacion: str
    valor_total: Decimal = Field(..., ge=0)
    numero_cuotas: int = Field(..., gt=0)
    valor_cuota: Decimal = Field(..., ge=0)
    saldo_pendiente: Decimal = Field(..., ge=0)
    fecha_inicio: date
    observacion: Optional[str] = None



class PrestamoUpdate(BaseModel):
    cuotas_pagadas: Optional[int] = None
    saldo_pendiente: Optional[Decimal] = None
    estado_prestamo: Optional[str] = None
    observacion: Optional[str] = None



class PrestamoOut(ORM):
    id_prestamo: int
    id_empleado: int
    tipo_obligacion: str
    valor_total: Decimal
    numero_cuotas: int
    valor_cuota: Decimal
    cuotas_pagadas: int
    saldo_pendiente: Decimal
    fecha_inicio: date
    observacion: Optional[str] = None
    estado_prestamo: str


# ---- Viático ----

class ViaticoCreate(BaseModel):
    id_proyecto: int
    concepto: str
    valor: Decimal = Field(..., ge=0)
    fecha: date
    soporte_url: Optional[str] = None



class ViaticoUpdate(BaseModel):
    estado_viatico: Optional[str] = None
    concepto: Optional[str] = None
    valor: Optional[Decimal] = None
    soporte_url: Optional[str] = None



class ViaticoOut(ORM):
    id_viatico: int
    id_empleado: int
    id_proyecto: int
    id_aprobado_por: Optional[int] = None
    concepto: str
    valor: Decimal
    fecha: date
    soporte_url: Optional[str] = None
    estado_viatico: str


# ---- Asignación ----
