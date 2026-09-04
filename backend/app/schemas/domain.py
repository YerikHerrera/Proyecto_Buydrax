"""Schemas Pydantic de dominio (campos alineados al SQL auditado)."""

from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ORM(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# ---- Empleado ----
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
class SolicitudCreate(BaseModel):
    tipo_solicitud: str
    descripcion: str


class SolicitudUpdate(BaseModel):
    estado_solicitud: Optional[str] = None
    respuesta: Optional[str] = None


class SolicitudOut(ORM):
    id_solicitud: int
    id_solicitante: int
    id_gestor_por: Optional[int] = None
    tipo_solicitud: str
    descripcion: str
    fecha_creacion: datetime
    estado_solicitud: str
    respuesta: Optional[str] = None
    fecha_respuesta: Optional[datetime] = None


class NotificacionOut(ORM):
    id_notificacion: int
    id_destinatario: int
    tipo: str
    mensaje: str
    fecha_envio: datetime
    leida: bool


class NotificacionUpdate(BaseModel):
    leida: bool = True


# ---- Configuración ----
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


class HistorialOut(ORM):
    id_historial: int
    id_empleado: int
    id_responsable: int
    tipo_movimiento: str
    valor_anterior: Optional[str] = None
    valor_nuevo: str
    fecha_movimiento: datetime
    observacion: Optional[str] = None


class SupervisorOut(ORM):
    id_supervisor: int
    id_usuario: int
    numero_tarjeta_profesional: str
    cuadrilla_asignada: Optional[str] = None


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
