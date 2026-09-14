"""ENUMs de PostgreSQL usados por los modelos de negocio (nombres exactos del SQL auditado)."""

from sqlalchemy.dialects.postgresql import ENUM as PGEnum

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
