"""Modelos de dominio restantes — fieles al SQL auditado Buydrax."""

from datetime import date, datetime, time
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    Time,
    UniqueConstraint,
    CheckConstraint,
)
from sqlalchemy.dialects.postgresql import ENUM as PGEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

# ---------------------------------------------------------------------------
# ENUMs PostgreSQL (nombres exactos del SQL auditado)
# ---------------------------------------------------------------------------
estado_proyecto_enum = PGEnum(
    "ACTIVO", "FINALIZADO", "SUSPENDIDO", name="estado_proyecto_enum", create_type=False
)
estado_laboral_enum = PGEnum(
    "ACTIVO", "INCAPACITADO", "RETIRADO", name="estado_laboral_enum", create_type=False
)
tipo_movimiento_enum = PGEnum(
    "CAMBIO_CARGO",
    "CAMBIO_OBRA",
    "CAMBIO_SUPERVISOR",
    "CAMBIO_ESTADO",
    "INGRESO",
    "RETIRO",
    name="tipo_movimiento_enum",
    create_type=False,
)
estado_certificacion_enum = PGEnum(
    "ACTIVO", "PROXIMO_VENCER", "VENCIDO", name="estado_certificacion_enum", create_type=False
)
estado_asistencia_enum = PGEnum(
    "PRESENTE", "RETARDO", "INASISTENCIA", name="estado_asistencia_enum", create_type=False
)
tipo_novedad_enum = PGEnum(
    "INCAPACIDAD_EPS",
    "INCAPACIDAD_ARL",
    "PERMISO_REMUNERADO",
    "PERMISO_NO_REMUNERADO",
    "AUSENCIA_INJUSTIFICADA",
    name="tipo_novedad_enum",
    create_type=False,
)
estado_novedad_enum = PGEnum(
    "PENDIENTE", "APROBADA", "RECHAZADA", name="estado_novedad_enum", create_type=False
)
tipo_hora_enum = PGEnum(
    "DIURNA",
    "NOCTURNA",
    "DOMINICAL",
    "FESTIVA",
    "DIURNA_DOMINICAL",
    name="tipo_hora_enum",
    create_type=False,
)
estado_he_enum = PGEnum(
    "PENDIENTE", "APROBADA", "RECHAZADA", name="estado_he_enum", create_type=False
)
tipo_observacion_enum = PGEnum(
    "COMENTARIO",
    "LLAMADO_ATENCION",
    "INCIDENCIA",
    "RECONOCIMIENTO",
    name="tipo_observacion_enum",
    create_type=False,
)
estado_observacion_enum = PGEnum(
    "REGISTRADA", "NOTIFICADA", "RESUELTA", name="estado_observacion_enum", create_type=False
)
estado_contrato_enum = PGEnum(
    "VIGENTE", "PROXIMO_VENCER", "FINALIZADO", "LIQUIDADO", name="estado_contrato_enum", create_type=False
)
tipo_obligacion_enum = PGEnum(
    "PRESTAMO_EMPRESA",
    "ANTICIPO",
    "EMBARGO_JUDICIAL",
    name="tipo_obligacion_enum",
    create_type=False,
)
estado_prestamo_enum = PGEnum(
    "ACTIVO", "TERMINADO", "SUSPENDIDO", name="estado_prestamo_enum", create_type=False
)
estado_viatico_enum = PGEnum(
    "PENDIENTE", "APROBADO", "RECHAZADO", name="estado_viatico_enum", create_type=False
)
motivo_retiro_enum = PGEnum(
    "RENUNCIA",
    "DESPIDO_JUSTA_CAUSA",
    "DESPIDO_SIN_CAUSA",
    "MUTUO_ACUERDO",
    name="motivo_retiro_enum",
    create_type=False,
)
tipo_nomina_enum = PGEnum(
    "QUINCENAL", "MENSUAL", name="tipo_nomina_enum", create_type=False
)
estado_nomina_enum = PGEnum(
    "BORRADOR", "APROBADA", "PAGADA", name="estado_nomina_enum", create_type=False
)
estado_descarga_enum = PGEnum(
    "GENERADO", "DESCARGADO", name="estado_descarga_enum", create_type=False
)
estado_validacion_enum = PGEnum(
    "PENDIENTE", "VALIDADO", "CON_ERRORES", name="estado_validacion_enum", create_type=False
)
tipo_solicitud_enum = PGEnum(
    "CORRECCION_DATOS",
    "CAMBIO_TURNO",
    "CAMBIO_PROYECTO",
    "RECURSOS",
    "CAPACITACION",
    "PERMISO",
    name="tipo_solicitud_enum",
    create_type=False,
)
estado_solicitud_enum = PGEnum(
    "PENDIENTE", "EN_REVISION", "APROBADA", "RECHAZADA", name="estado_solicitud_enum", create_type=False
)
tipo_notificacion_enum = PGEnum(
    "PAGO_NOMINA",
    "ALERTA_CONTRATO",
    "ALERTA_CERT",
    "CAMBIO_TURNO",
    "SOLICITUD_RESPONDIDA",
    name="tipo_notificacion_enum",
    create_type=False,
)


# ---------------------------------------------------------------------------
# Tablas de dominio
# ---------------------------------------------------------------------------
class Proyecto(Base):
    __tablename__ = "proyecto"

    id_proyecto: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_supervisor: Mapped[int] = mapped_column(
        Integer, ForeignKey("supervisor.id_supervisor", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False
    )
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    descripcion: Mapped[str | None] = mapped_column(Text, nullable=True)
    ubicacion_calle: Mapped[str] = mapped_column(String(100), nullable=False)
    ubicacion_referencia: Mapped[str | None] = mapped_column(String(100), nullable=True)
    fecha_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_fin: Mapped[date] = mapped_column(Date, nullable=False)
    estado_proyecto: Mapped[str] = mapped_column(estado_proyecto_enum, nullable=False, default="ACTIVO")


class Empleado(Base):
    __tablename__ = "empleado"

    id_empleado: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_usuario: Mapped[int] = mapped_column(
        Integer, ForeignKey("usuarios.id_usuario", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False, unique=True
    )
    id_supervisor: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("supervisor.id_supervisor", ondelete="SET NULL", onupdate="CASCADE"), nullable=True
    )
    tipo_documento: Mapped[str] = mapped_column(String(10), nullable=False)
    numero_documento: Mapped[str] = mapped_column(String(20), nullable=False, unique=True)
    fecha_nacimiento: Mapped[date] = mapped_column(Date, nullable=False)
    calle: Mapped[str] = mapped_column(String(100), nullable=False)
    barrio: Mapped[str | None] = mapped_column(String(60), nullable=True)
    ciudad: Mapped[str] = mapped_column(String(60), nullable=False)
    telefono: Mapped[str] = mapped_column(String(15), nullable=False)
    correo_personal: Mapped[str | None] = mapped_column(String(100), nullable=True)
    cargo: Mapped[str] = mapped_column(String(60), nullable=False)
    fecha_ingreso: Mapped[date] = mapped_column(Date, nullable=False)
    salario: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    forma_pago: Mapped[str] = mapped_column(String(20), nullable=False)
    banco: Mapped[str | None] = mapped_column(String(60), nullable=True)
    numero_cuenta: Mapped[str | None] = mapped_column(String(30), nullable=True)
    estado_laboral: Mapped[str] = mapped_column(estado_laboral_enum, nullable=False, default="ACTIVO")


class Afiliacion(Base):
    __tablename__ = "afiliacion"

    id_afiliacion: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False, unique=True
    )
    eps: Mapped[str] = mapped_column(String(60), nullable=False)
    fondo_pension: Mapped[str] = mapped_column(String(60), nullable=False)
    arl: Mapped[str] = mapped_column(String(60), nullable=False)
    caja_compensacion: Mapped[str] = mapped_column(String(60), nullable=False)
    nivel_riesgo_arl: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    fecha_afiliacion: Mapped[date | None] = mapped_column(Date, nullable=True)
    estado_afiliacion: Mapped[str] = mapped_column(String(20), nullable=False, default="ACTIVO")


class HistorialLaboral(Base):
    __tablename__ = "historial_laboral"

    id_historial: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_responsable: Mapped[int] = mapped_column(
        Integer, ForeignKey("supervisor.id_supervisor", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False
    )
    tipo_movimiento: Mapped[str] = mapped_column(tipo_movimiento_enum, nullable=False)
    valor_anterior: Mapped[str | None] = mapped_column(String(100), nullable=True)
    valor_nuevo: Mapped[str] = mapped_column(String(100), nullable=False)
    fecha_movimiento: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    observacion: Mapped[str | None] = mapped_column(String(255), nullable=True)


class Certificacion(Base):
    __tablename__ = "certificacion"

    id_certificacion: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    fecha_emision: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_vencimiento: Mapped[date] = mapped_column(Date, nullable=False)
    archivo_url: Mapped[str] = mapped_column(String(255), nullable=False)
    tipo_archivo: Mapped[str] = mapped_column(String(10), nullable=False)
    estado_certificacion: Mapped[str] = mapped_column(
        estado_certificacion_enum, nullable=False, default="ACTIVO"
    )


class Asistencia(Base):
    __tablename__ = "asistencia"

    id_asistencia: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_creado_por: Mapped[int] = mapped_column(
        Integer, ForeignKey("usuarios.id_usuario", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False
    )
    fecha: Mapped[date] = mapped_column(Date, nullable=False)
    hora_entrada: Mapped[time] = mapped_column(Time, nullable=False)
    hora_salida: Mapped[time | None] = mapped_column(Time, nullable=True)
    estado_asistencia: Mapped[str] = mapped_column(estado_asistencia_enum, nullable=False)
    observacion: Mapped[str | None] = mapped_column(String(255), nullable=True)
    fecha_creacion: Mapped[datetime] = mapped_column(DateTime, nullable=False)


class Turno(Base):
    __tablename__ = "turno"

    id_turno: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_proyecto: Mapped[int] = mapped_column(
        Integer, ForeignKey("proyecto.id_proyecto", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_asignado_por: Mapped[int] = mapped_column(
        Integer, ForeignKey("usuarios.id_usuario", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False
    )
    tipo_turno: Mapped[str] = mapped_column(String(20), nullable=False)
    hora_inicio: Mapped[time] = mapped_column(Time, nullable=False)
    hora_fin: Mapped[time] = mapped_column(Time, nullable=False)
    fecha: Mapped[date] = mapped_column(Date, nullable=False)


class Novedad(Base):
    __tablename__ = "novedad"

    id_novedad: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_aprobado_por: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("usuarios.id_usuario", ondelete="SET NULL", onupdate="CASCADE"), nullable=True
    )
    tipo_novedad: Mapped[str] = mapped_column(tipo_novedad_enum, nullable=False)
    fecha_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_fin: Mapped[date] = mapped_column(Date, nullable=False)
    total_dias: Mapped[float] = mapped_column(Float, nullable=False)
    soporte_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    estado_novedad: Mapped[str] = mapped_column(estado_novedad_enum, nullable=False, default="PENDIENTE")


class HoraExtra(Base):
    __tablename__ = "hora_extra"

    id_hora_extra: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_aprobador: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("supervisor.id_supervisor", ondelete="SET NULL", onupdate="CASCADE"), nullable=True
    )
    motivo: Mapped[str] = mapped_column(String(255), nullable=False)
    fecha_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_fin: Mapped[date] = mapped_column(Date, nullable=False)
    cantidad_horas: Mapped[float] = mapped_column(Float, nullable=False)
    tipo_hora: Mapped[str] = mapped_column(tipo_hora_enum, nullable=False)
    archivo_soporte_url: Mapped[str] = mapped_column(String(255), nullable=False)
    estado_he: Mapped[str] = mapped_column(estado_he_enum, nullable=False, default="PENDIENTE")


class Observacion(Base):
    __tablename__ = "observacion"

    id_observacion: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_supervisor: Mapped[int] = mapped_column(
        Integer, ForeignKey("supervisor.id_supervisor", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False
    )
    tipo_observacion: Mapped[str] = mapped_column(tipo_observacion_enum, nullable=False)
    descripcion: Mapped[str] = mapped_column(Text, nullable=False)
    fecha: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    escalada: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    estado_observacion: Mapped[str] = mapped_column(
        estado_observacion_enum, nullable=False, default="REGISTRADA"
    )


class EvaluacionDesempeno(Base):
    __tablename__ = "evaluacion_desempeno"

    id_evaluacion: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_evaluador: Mapped[int] = mapped_column(
        Integer, ForeignKey("supervisor.id_supervisor", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False
    )
    periodo: Mapped[str] = mapped_column(String(20), nullable=False)
    puntaje_productividad: Mapped[float] = mapped_column(Float, nullable=False)
    puntaje_asistencia: Mapped[float] = mapped_column(Float, nullable=False)
    puntaje_calidad: Mapped[float] = mapped_column(Float, nullable=False)
    puntaje_general: Mapped[float] = mapped_column(Float, nullable=False)
    recomendacion: Mapped[str | None] = mapped_column(Text, nullable=True)
    solicita_capacitacion: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    fecha_evaluacion: Mapped[datetime] = mapped_column(DateTime, nullable=False)


class AsignacionProyecto(Base):
    __tablename__ = "asignacion_proyecto"
    __table_args__ = (UniqueConstraint("id_proyecto", "id_empleado", name="uq_asignacion"),)

    id_asignacion: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_proyecto: Mapped[int] = mapped_column(
        Integer, ForeignKey("proyecto.id_proyecto", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    cuadrilla: Mapped[str] = mapped_column(String(60), nullable=False)
    rol_en_proyecto: Mapped[str] = mapped_column(String(60), nullable=False)
    fecha_asignacion: Mapped[date] = mapped_column(Date, nullable=False)
    activo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)


class Configuracion(Base):
    __tablename__ = "configuracion"

    id_configuracion: Mapped[int] = mapped_column(Integer, primary_key=True)
    smlmv: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    auxilio_transporte: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    tope_exoneracion: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    pct_hora_extra_diurna: Mapped[float] = mapped_column(Float, nullable=False, default=0.25)
    pct_hora_extra_nocturna: Mapped[float] = mapped_column(Float, nullable=False, default=0.75)
    pct_recargo_nocturno_ordinario: Mapped[float] = mapped_column(Float, nullable=False, default=0.35)
    pct_recargo_dominical: Mapped[float] = mapped_column(Float, nullable=False, default=0.75)
    pct_hora_extra_diurna_dominical: Mapped[float] = mapped_column(Float, nullable=False, default=1.00)
    pct_salud_empleado: Mapped[float] = mapped_column(Float, nullable=False)
    pct_pension_empleado: Mapped[float] = mapped_column(Float, nullable=False)
    nivel_arl_1: Mapped[float] = mapped_column(Float, nullable=False)
    nivel_arl_2: Mapped[float] = mapped_column(Float, nullable=False)
    nivel_arl_3: Mapped[float] = mapped_column(Float, nullable=False)
    nivel_arl_4: Mapped[float] = mapped_column(Float, nullable=False)
    nivel_arl_5: Mapped[float] = mapped_column(Float, nullable=False)
    anio_vigencia: Mapped[int] = mapped_column(Integer, nullable=False, unique=True)


class Contrato(Base):
    __tablename__ = "contrato"

    id_contrato: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_supervisor: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("supervisor.id_supervisor", ondelete="SET NULL", onupdate="CASCADE"), nullable=True
    )
    id_proyecto: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("proyecto.id_proyecto", ondelete="SET NULL", onupdate="CASCADE"), nullable=True
    )
    tipo_contrato: Mapped[str] = mapped_column(String(30), nullable=False)
    salario: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    fecha_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_fin: Mapped[date | None] = mapped_column(Date, nullable=True)
    obra_asignada: Mapped[str | None] = mapped_column(String(100), nullable=True)
    arl: Mapped[str] = mapped_column(String(60), nullable=False)
    archivo_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    estado_contrato: Mapped[str] = mapped_column(estado_contrato_enum, nullable=False, default="VIGENTE")


class Prestamo(Base):
    __tablename__ = "prestamo"

    id_prestamo: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    tipo_obligacion: Mapped[str] = mapped_column(tipo_obligacion_enum, nullable=False)
    valor_total: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    numero_cuotas: Mapped[int] = mapped_column(Integer, nullable=False)
    valor_cuota: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    cuotas_pagadas: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    saldo_pendiente: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    fecha_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    observacion: Mapped[str | None] = mapped_column(String(255), nullable=True)
    estado_prestamo: Mapped[str] = mapped_column(estado_prestamo_enum, nullable=False, default="ACTIVO")


class Viatico(Base):
    __tablename__ = "viatico"

    id_viatico: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_proyecto: Mapped[int] = mapped_column(
        Integer, ForeignKey("proyecto.id_proyecto", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False
    )
    id_aprobado_por: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("usuarios.id_usuario", ondelete="SET NULL", onupdate="CASCADE"), nullable=True
    )
    concepto: Mapped[str] = mapped_column(String(60), nullable=False)
    valor: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    fecha: Mapped[date] = mapped_column(Date, nullable=False)
    soporte_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    estado_viatico: Mapped[str] = mapped_column(estado_viatico_enum, nullable=False, default="PENDIENTE")


class Liquidacion(Base):
    __tablename__ = "liquidacion"

    id_liquidacion: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_configuracion: Mapped[int] = mapped_column(
        Integer, ForeignKey("configuracion.id_configuracion", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False
    )
    fecha_retiro: Mapped[date] = mapped_column(Date, nullable=False)
    motivo_retiro: Mapped[str] = mapped_column(motivo_retiro_enum, nullable=False)
    salario_promedio: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    dias_trabajados: Mapped[int] = mapped_column(Integer, nullable=False)
    cesantias: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    intereses_cesantias: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    prima: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    vacaciones: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    indemnizacion: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    dotacion_pendiente: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=0)
    total_neto_pagar: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    notas_adicionales: Mapped[str | None] = mapped_column(String(200), nullable=True)


class Nomina(Base):
    __tablename__ = "nomina"

    id_nomina: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_obra: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("proyecto.id_proyecto", ondelete="SET NULL", onupdate="CASCADE"), nullable=True
    )
    id_configuracion: Mapped[int] = mapped_column(
        Integer, ForeignKey("configuracion.id_configuracion", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False
    )
    id_admin_rrhh: Mapped[int] = mapped_column(
        Integer, ForeignKey("admin_rrhh.id_admin_rrhh", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False
    )
    periodo_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    periodo_fin: Mapped[date] = mapped_column(Date, nullable=False)
    tipo_nomina: Mapped[str] = mapped_column(tipo_nomina_enum, nullable=False)
    fecha_generacion: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    estado_nomina: Mapped[str] = mapped_column(estado_nomina_enum, nullable=False, default="BORRADOR")
    total_pagado: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False, default=0)
    cantidad_empleados: Mapped[int] = mapped_column(Integer, nullable=False, default=0)


class DetalleNomina(Base):
    __tablename__ = "detalle_nomina"
    __table_args__ = (UniqueConstraint("id_nomina", "id_empleado", name="uq_detalle_nomina"),)

    id_detalle_nomina: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_nomina: Mapped[int] = mapped_column(
        Integer, ForeignKey("nomina.id_nomina", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    horas_ordinarias: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    horas_extra: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    dominicales_festivos: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    viaticos: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=0)
    incapacidades: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=0)
    descuentos_prestamos: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=0)
    neto_pagar: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)


class Desprendible(Base):
    __tablename__ = "desprendible"

    id_desprendible: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_detalle_nomina: Mapped[int] = mapped_column(
        Integer, ForeignKey("detalle_nomina.id_detalle_nomina", ondelete="CASCADE", onupdate="CASCADE"), nullable=False, unique=True
    )
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    periodo_pago: Mapped[str] = mapped_column(String(30), nullable=False)
    dias_liquidados: Mapped[int] = mapped_column(Integer, nullable=False)
    fecha_pago: Mapped[date] = mapped_column(Date, nullable=False)
    neto_recibido: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    archivo_url: Mapped[str] = mapped_column(String(255), nullable=False)
    firma_digital: Mapped[str] = mapped_column(String(255), nullable=False)
    estado_descarga: Mapped[str] = mapped_column(estado_descarga_enum, nullable=False, default="GENERADO")


class Pila(Base):
    __tablename__ = "pila"

    id_pila: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_nomina: Mapped[int] = mapped_column(
        Integer, ForeignKey("nomina.id_nomina", ondelete="CASCADE", onupdate="CASCADE"), nullable=False, unique=True
    )
    periodo_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    periodo_fin: Mapped[date] = mapped_column(Date, nullable=False)
    total_salud: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    total_pension: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    total_arl: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    total_paraestatales: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    archivo_txt: Mapped[str | None] = mapped_column(String(255), nullable=True)
    estado_validacion: Mapped[str] = mapped_column(estado_validacion_enum, nullable=False, default="PENDIENTE")


class AporteEmpleado(Base):
    __tablename__ = "aporte_empleado"
    __table_args__ = (UniqueConstraint("id_pila", "id_empleado", name="uq_aporte_pila_empleado"),)

    id_aporte: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_pila: Mapped[int] = mapped_column(
        Integer, ForeignKey("pila.id_pila", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    ibc: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    dias_cotizados: Mapped[int] = mapped_column(Integer, nullable=False)
    tarifa_arl: Mapped[float] = mapped_column(Float, nullable=False)
    aportes_salud: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    aportes_pension: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    aportes_arl: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    aportes_paraestatales: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)


class Solicitud(Base):
    __tablename__ = "solicitud"

    id_solicitud: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_solicitante: Mapped[int] = mapped_column(
        Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_gestor_por: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("usuarios.id_usuario", ondelete="SET NULL", onupdate="CASCADE"), nullable=True
    )
    tipo_solicitud: Mapped[str] = mapped_column(tipo_solicitud_enum, nullable=False)
    descripcion: Mapped[str] = mapped_column(Text, nullable=False)
    fecha_creacion: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    estado_solicitud: Mapped[str] = mapped_column(estado_solicitud_enum, nullable=False, default="PENDIENTE")
    respuesta: Mapped[str | None] = mapped_column(Text, nullable=True)
    fecha_respuesta: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)


class Notificacion(Base):
    __tablename__ = "notificacion"

    id_notificacion: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_destinatario: Mapped[int] = mapped_column(
        Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    tipo: Mapped[str] = mapped_column(tipo_notificacion_enum, nullable=False)
    mensaje: Mapped[str] = mapped_column(Text, nullable=False)
    fecha_envio: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    leida: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)


class CambioConfiguracion(Base):
    __tablename__ = "cambio_configuracion"

    id_cambio: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_configuracion: Mapped[int] = mapped_column(
        Integer, ForeignKey("configuracion.id_configuracion", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_modificado_por: Mapped[int] = mapped_column(
        Integer, ForeignKey("usuarios.id_usuario", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False
    )
    campo: Mapped[str] = mapped_column(String(60), nullable=False)
    valor_anterior: Mapped[str] = mapped_column(String(100), nullable=False)
    valor_nuevo: Mapped[str] = mapped_column(String(100), nullable=False)
    fecha_cambio: Mapped[datetime] = mapped_column(DateTime, nullable=False)
