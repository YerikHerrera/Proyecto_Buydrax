"""Esquemas de negocio."""

from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.esquemas.comunes import ORMModel as ORM

class EmpleadoCreate(BaseModel):
    id_usuario: int
    id_supervisor: Optional[int] = None
    tipo_documento: str = Field(..., max_length=10)
    numero_documento: str = Field(..., max_length=20)
    fecha_nacimiento: date
    calle: str = Field(..., max_length=100)
    barrio: Optional[str] = Field(None, max_length=60)
    ciudad: str = Field(..., max_length=60)
    telefono: str = Field(..., max_length=15)
    correo_personal: Optional[EmailStr] = None
    cargo: str = Field(..., max_length=60)
    fecha_ingreso: date
    salario: Decimal = Field(..., ge=0)
    forma_pago: str = Field(..., max_length=20)
    banco: Optional[str] = Field(None, max_length=60)
    numero_cuenta: Optional[str] = Field(None, max_length=30)
    estado_laboral: str = "ACTIVO"



class EmpleadoUpdate(BaseModel):
    id_supervisor: Optional[int] = None
    tipo_documento: Optional[str] = None
    numero_documento: Optional[str] = None
    fecha_nacimiento: Optional[date] = None
    calle: Optional[str] = None
    barrio: Optional[str] = None
    ciudad: Optional[str] = None
    telefono: Optional[str] = None
    correo_personal: Optional[EmailStr] = None
    cargo: Optional[str] = None
    fecha_ingreso: Optional[date] = None
    salario: Optional[Decimal] = Field(None, ge=0)
    forma_pago: Optional[str] = None
    banco: Optional[str] = None
    numero_cuenta: Optional[str] = None
    estado_laboral: Optional[str] = None



class EmpleadoOut(ORM):
    id_empleado: int
    id_usuario: int
    id_supervisor: Optional[int] = None
    tipo_documento: str
    numero_documento: str
    fecha_nacimiento: date
    calle: str
    barrio: Optional[str] = None
    ciudad: str
    telefono: str
    correo_personal: Optional[str] = None
    cargo: str
    fecha_ingreso: date
    salario: Decimal
    forma_pago: str
    banco: Optional[str] = None
    numero_cuenta: Optional[str] = None
    estado_laboral: str



class RetiroBody(BaseModel):
    estado_laboral: str = Field(default="RETIRADO")
    motivo: Optional[str] = None


# ---- Afiliación ----

class AfiliacionUpsert(BaseModel):
    eps: str
    fondo_pension: str
    arl: str
    caja_compensacion: str
    nivel_riesgo_arl: int = Field(..., ge=1, le=5)
    fecha_afiliacion: Optional[date] = None
    estado_afiliacion: str = "ACTIVO"



class AfiliacionOut(ORM):
    id_afiliacion: int
    id_empleado: int
    eps: str
    fondo_pension: str
    arl: str
    caja_compensacion: str
    nivel_riesgo_arl: int
    fecha_afiliacion: Optional[date] = None
    estado_afiliacion: str


# ---- Proyecto ----

class HistorialOut(ORM):
    id_historial: int
    id_empleado: int
    id_responsable: int
    tipo_movimiento: str
    valor_anterior: Optional[str] = None
    valor_nuevo: str
    fecha_movimiento: datetime
    observacion: Optional[str] = None



class CertificacionCreate(BaseModel):
    nombre: str
    fecha_emision: date
    fecha_vencimiento: date
    archivo_url: str
    tipo_archivo: str
    estado_certificacion: str = "ACTIVO"



class CertificacionUpdate(BaseModel):
    nombre: Optional[str] = None
    fecha_emision: Optional[date] = None
    fecha_vencimiento: Optional[date] = None
    archivo_url: Optional[str] = None
    tipo_archivo: Optional[str] = None
    estado_certificacion: Optional[str] = None



class CertificacionOut(ORM):
    id_certificacion: int
    id_empleado: int
    nombre: str
    fecha_emision: date
    fecha_vencimiento: date
    archivo_url: str
    tipo_archivo: str
    estado_certificacion: str


# ---- Contrato ----

class SupervisorOut(ORM):
    id_supervisor: int
    id_usuario: int
    numero_tarjeta_profesional: str
    cuadrilla_asignada: Optional[str] = None


