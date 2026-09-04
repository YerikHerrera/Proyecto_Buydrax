-- ============================================================
-- BUYDRAX - BASE DE DATOS FINAL
-- Versión corregida: roles especializados, afiliación y validaciones
-- ============================================================

-- 0. CONEXIÓN A LA BASE DE DATOS
-- La base 'buydrax' debe existir y este script debe ejecutarse
-- conectado directamente a ella desde DBeaver.
-- No se incluyen CREATE DATABASE ni \c para mantener compatibilidad
-- con el editor SQL de DBeaver.

-- Ejecución transaccional: si ocurre un error, puede hacerse ROLLBACK
-- antes del COMMIT final para evitar una carga parcial.
BEGIN;

-- BASE DE DATOS BUYDRAX (ADAPTADA A POSTGRESQL)
-- 1. ELIMINACIÓN PREVIA (OPCIONAL EN CASO DE RECREACIÓN)
DROP TABLE IF EXISTS permiso CASCADE;
DROP TABLE IF EXISTS accion CASCADE;
DROP TABLE IF EXISTS modulo CASCADE;
DROP TABLE IF EXISTS perfil CASCADE;
DROP TABLE IF EXISTS cambio_configuracion CASCADE;
DROP TABLE IF EXISTS notificacion CASCADE;
DROP TABLE IF EXISTS solicitud CASCADE;
DROP TABLE IF EXISTS aporte_empleado CASCADE;
DROP TABLE IF EXISTS pila CASCADE;
DROP TABLE IF EXISTS desprendible CASCADE;
DROP TABLE IF EXISTS detalle_nomina CASCADE;
DROP TABLE IF EXISTS nomina CASCADE;
DROP TABLE IF EXISTS liquidacion CASCADE;
DROP TABLE IF EXISTS viatico CASCADE;
DROP TABLE IF EXISTS prestamo CASCADE;
DROP TABLE IF EXISTS contrato CASCADE;
DROP TABLE IF EXISTS configuracion CASCADE;
DROP TABLE IF EXISTS asignacion_proyecto CASCADE;
DROP TABLE IF EXISTS evaluacion_desempeno CASCADE;
DROP TABLE IF EXISTS observacion CASCADE;
DROP TABLE IF EXISTS hora_extra CASCADE;
DROP TABLE IF EXISTS novedad CASCADE;
DROP TABLE IF EXISTS turno CASCADE;
DROP TABLE IF EXISTS asistencia CASCADE;
DROP TABLE IF EXISTS certificacion CASCADE;
DROP TABLE IF EXISTS historial_laboral CASCADE;
DROP TABLE IF EXISTS afiliacion CASCADE;
DROP TABLE IF EXISTS empleado CASCADE;
DROP TABLE IF EXISTS admin_rrhh CASCADE;
DROP TABLE IF EXISTS contador CASCADE;
DROP TABLE IF EXISTS supervisor CASCADE;
DROP TABLE IF EXISTS proyecto CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- ELIMINACIÓN DE TIPOS ENUM
DROP TYPE IF EXISTS estado_proyecto_enum CASCADE;
DROP TYPE IF EXISTS estado_laboral_enum CASCADE;
DROP TYPE IF EXISTS tipo_movimiento_enum CASCADE;
DROP TYPE IF EXISTS estado_certificacion_enum CASCADE;
DROP TYPE IF EXISTS estado_asistencia_enum CASCADE;
DROP TYPE IF EXISTS tipo_novedad_enum CASCADE;
DROP TYPE IF EXISTS estado_novedad_enum CASCADE;
DROP TYPE IF EXISTS tipo_hora_enum CASCADE;
DROP TYPE IF EXISTS estado_he_enum CASCADE;
DROP TYPE IF EXISTS tipo_observacion_enum CASCADE;
DROP TYPE IF EXISTS estado_observacion_enum CASCADE;
DROP TYPE IF EXISTS estado_contrato_enum CASCADE;
DROP TYPE IF EXISTS tipo_obligacion_enum CASCADE;
DROP TYPE IF EXISTS estado_prestamo_enum CASCADE;
DROP TYPE IF EXISTS estado_viatico_enum CASCADE;
DROP TYPE IF EXISTS motivo_retiro_enum CASCADE;
DROP TYPE IF EXISTS tipo_nomina_enum CASCADE;
DROP TYPE IF EXISTS estado_nomina_enum CASCADE;
DROP TYPE IF EXISTS estado_descarga_enum CASCADE;
DROP TYPE IF EXISTS estado_validacion_enum CASCADE;
DROP TYPE IF EXISTS tipo_solicitud_enum CASCADE;
DROP TYPE IF EXISTS estado_solicitud_enum CASCADE;
DROP TYPE IF EXISTS tipo_notificacion_enum CASCADE;

-- 2. CREACIÓN DE TIPOS ENUMERADOS
CREATE TYPE estado_proyecto_enum AS ENUM ('ACTIVO', 'FINALIZADO', 'SUSPENDIDO');
CREATE TYPE estado_laboral_enum AS ENUM ('ACTIVO', 'INCAPACITADO', 'RETIRADO');
CREATE TYPE tipo_movimiento_enum AS ENUM ('CAMBIO_CARGO', 'CAMBIO_OBRA', 'CAMBIO_SUPERVISOR', 'CAMBIO_ESTADO', 'INGRESO', 'RETIRO');
CREATE TYPE estado_certificacion_enum AS ENUM ('ACTIVO', 'PROXIMO_VENCER', 'VENCIDO');
CREATE TYPE estado_asistencia_enum AS ENUM ('PRESENTE', 'RETARDO', 'INASISTENCIA');
CREATE TYPE tipo_novedad_enum AS ENUM ('INCAPACIDAD_EPS', 'INCAPACIDAD_ARL', 'PERMISO_REMUNERADO', 'PERMISO_NO_REMUNERADO', 'AUSENCIA_INJUSTIFICADA');
CREATE TYPE estado_novedad_enum AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA');
CREATE TYPE tipo_hora_enum AS ENUM ('DIURNA', 'NOCTURNA', 'DOMINICAL', 'FESTIVA', 'DIURNA_DOMINICAL');
CREATE TYPE estado_he_enum AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA');
CREATE TYPE tipo_observacion_enum AS ENUM ('COMENTARIO', 'LLAMADO_ATENCION', 'INCIDENCIA', 'RECONOCIMIENTO');
CREATE TYPE estado_observacion_enum AS ENUM ('REGISTRADA', 'NOTIFICADA', 'RESUELTA');
CREATE TYPE estado_contrato_enum AS ENUM ('VIGENTE', 'PROXIMO_VENCER', 'FINALIZADO', 'LIQUIDADO');
CREATE TYPE tipo_obligacion_enum AS ENUM ('PRESTAMO_EMPRESA', 'ANTICIPO', 'EMBARGO_JUDICIAL');
CREATE TYPE estado_prestamo_enum AS ENUM ('ACTIVO', 'TERMINADO', 'SUSPENDIDO');
CREATE TYPE estado_viatico_enum AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');
CREATE TYPE motivo_retiro_enum AS ENUM ('RENUNCIA', 'DESPIDO_JUSTA_CAUSA', 'DESPIDO_SIN_CAUSA', 'MUTUO_ACUERDO');
CREATE TYPE tipo_nomina_enum AS ENUM ('QUINCENAL', 'MENSUAL');
CREATE TYPE estado_nomina_enum AS ENUM ('BORRADOR', 'APROBADA', 'PAGADA');
CREATE TYPE estado_descarga_enum AS ENUM ('GENERADO', 'DESCARGADO');
CREATE TYPE estado_validacion_enum AS ENUM ('PENDIENTE', 'VALIDADO', 'CON_ERRORES');
CREATE TYPE tipo_solicitud_enum AS ENUM ('CORRECCION_DATOS', 'CAMBIO_TURNO', 'CAMBIO_PROYECTO', 'RECURSOS', 'CAPACITACION', 'PERMISO');
CREATE TYPE estado_solicitud_enum AS ENUM ('PENDIENTE', 'EN_REVISION', 'APROBADA', 'RECHAZADA');
CREATE TYPE tipo_notificacion_enum AS ENUM ('PAGO_NOMINA', 'ALERTA_CONTRATO', 'ALERTA_CERT', 'CAMBIO_TURNO', 'SOLICITUD_RESPONDIDA');

-- 3. CREACIÓN DE TABLAS

-- ============================================================
-- AUTORIZACIÓN
-- Catálogo técnico de perfiles, módulos y acciones
-- ============================================================

CREATE TABLE perfil (
    id_perfil    SERIAL PRIMARY KEY,
    nombre       VARCHAR(30)  NOT NULL UNIQUE,
    descripcion  VARCHAR(150) NULL
);

CREATE TABLE modulo (
    id_modulo    SERIAL PRIMARY KEY,
    nombre       VARCHAR(50)  NOT NULL UNIQUE,
    descripcion  VARCHAR(150) NULL
);

CREATE TABLE accion (
    id_accion    SERIAL PRIMARY KEY,
    nombre       VARCHAR(30)  NOT NULL UNIQUE,
    descripcion  VARCHAR(150) NULL
);

CREATE TABLE permiso (
    id_permiso  SERIAL PRIMARY KEY,
    id_perfil   INT NOT NULL REFERENCES perfil(id_perfil)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    id_modulo   INT NOT NULL REFERENCES modulo(id_modulo)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    id_accion   INT NOT NULL REFERENCES accion(id_accion)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT uq_permiso_perfil_modulo_accion
        UNIQUE (id_perfil, id_modulo, id_accion)
);

CREATE TABLE usuarios (
    id_usuario        SERIAL PRIMARY KEY,
    id_perfil         INT             NULL REFERENCES perfil(id_perfil) ON DELETE RESTRICT ON UPDATE CASCADE,
    nombres           VARCHAR(60)     NOT NULL,
    apellidos         VARCHAR(60)     NOT NULL,
    correo            VARCHAR(100)    NOT NULL UNIQUE,
    password_hash     VARCHAR(255)    NOT NULL,
    estado            BOOLEAN         NOT NULL DEFAULT TRUE,
    ultimo_acceso     TIMESTAMP       NULL,
    foto_perfil       VARCHAR(255)    NULL,
    idioma            VARCHAR(5)      NOT NULL DEFAULT 'ES'
);

-- ROLES ESPECIALIZADOS
-- usuarios conserva la identidad; estas tablas almacenan los atributos específicos de cada rol.
CREATE TABLE supervisor (
    id_supervisor              SERIAL PRIMARY KEY,
    id_usuario                 INT NOT NULL UNIQUE
        REFERENCES usuarios(id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE,
    numero_tarjeta_profesional VARCHAR(30) NOT NULL,
    cuadrilla_asignada         VARCHAR(60) NULL
);

CREATE TABLE contador (
    id_contador                SERIAL PRIMARY KEY,
    id_usuario                 INT NOT NULL UNIQUE
        REFERENCES usuarios(id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE,
    numero_tarjeta_profesional VARCHAR(30) NOT NULL,
    area_nomina                VARCHAR(30) NOT NULL
);

CREATE TABLE admin_rrhh (
    id_admin_rrhh              SERIAL PRIMARY KEY,
    id_usuario                 INT NOT NULL UNIQUE
        REFERENCES usuarios(id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE,
    area_responsable           VARCHAR(60) NOT NULL
);

CREATE TABLE proyecto (
    id_proyecto           SERIAL PRIMARY KEY,
    id_supervisor         INT             NOT NULL REFERENCES supervisor(id_supervisor) ON DELETE RESTRICT ON UPDATE CASCADE,
    nombre                VARCHAR(100)    NOT NULL,
    descripcion           TEXT            NULL,
    ubicacion_calle       VARCHAR(100)    NOT NULL,
    ubicacion_referencia  VARCHAR(100)    NULL,
    fecha_inicio          DATE            NOT NULL,
    fecha_fin             DATE            NOT NULL,
    estado_proyecto       estado_proyecto_enum NOT NULL DEFAULT 'ACTIVO',
    CONSTRAINT ck_proyecto_fechas CHECK (fecha_inicio < fecha_fin)
);

CREATE TABLE empleado (
    id_empleado       SERIAL PRIMARY KEY,
    id_usuario        INT             NOT NULL UNIQUE REFERENCES usuarios(id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE,
    id_supervisor     INT             NULL REFERENCES supervisor(id_supervisor) ON DELETE SET NULL ON UPDATE CASCADE,
    tipo_documento    VARCHAR(10)     NOT NULL,
    numero_documento  VARCHAR(20)     NOT NULL UNIQUE,
    fecha_nacimiento  DATE            NOT NULL,
    calle             VARCHAR(100)    NOT NULL,
    barrio            VARCHAR(60)     NULL,
    ciudad            VARCHAR(60)     NOT NULL,
    telefono          VARCHAR(15)     NOT NULL,
    correo_personal   VARCHAR(100)    NULL,
    cargo             VARCHAR(60)     NOT NULL,
    fecha_ingreso     DATE            NOT NULL,
    salario           NUMERIC(12,2)   NOT NULL,
    forma_pago        VARCHAR(20)     NOT NULL,
    banco             VARCHAR(60)     NULL,
    numero_cuenta     VARCHAR(30)     NULL,
    estado_laboral    estado_laboral_enum NOT NULL DEFAULT 'ACTIVO',
    CONSTRAINT ck_empleado_salario_no_negativo CHECK (salario >= 0)
);

-- NUEVA TABLA: AFILIACION
CREATE TABLE afiliacion (
    id_afiliacion     SERIAL PRIMARY KEY,
    id_empleado       INT             NOT NULL UNIQUE REFERENCES empleado(id_empleado) ON DELETE CASCADE ON UPDATE CASCADE,
    eps               VARCHAR(60)     NOT NULL,
    fondo_pension     VARCHAR(60)     NOT NULL,
    arl               VARCHAR(60)     NOT NULL,
    caja_compensacion VARCHAR(60)     NOT NULL,
    nivel_riesgo_arl  INT             NOT NULL DEFAULT 1,
    fecha_afiliacion  DATE            NULL DEFAULT CURRENT_DATE,
    CONSTRAINT ck_afiliacion_nivel_arl CHECK (nivel_riesgo_arl BETWEEN 1 AND 5),
    estado_afiliacion VARCHAR(20)     NOT NULL DEFAULT 'ACTIVO'
);

CREATE TABLE historial_laboral (
    id_historial      SERIAL PRIMARY KEY,
    id_empleado       INT             NOT NULL REFERENCES empleado(id_empleado) ON DELETE CASCADE ON UPDATE CASCADE,
    id_responsable    INT             NOT NULL REFERENCES supervisor(id_supervisor) ON DELETE RESTRICT ON UPDATE CASCADE,
    tipo_movimiento   tipo_movimiento_enum NOT NULL,
    valor_anterior    VARCHAR(100)    NULL,
    valor_nuevo       VARCHAR(100)    NOT NULL,
    fecha_movimiento  TIMESTAMP       NOT NULL,
    observacion       VARCHAR(255)    NULL
);

CREATE TABLE certificacion (
    id_certificacion      SERIAL PRIMARY KEY,
    id_empleado           INT             NOT NULL REFERENCES empleado(id_empleado) ON DELETE CASCADE ON UPDATE CASCADE,
    nombre                VARCHAR(100)    NOT NULL,
    fecha_emision         DATE            NOT NULL,
    fecha_vencimiento     DATE            NOT NULL,
    archivo_url           VARCHAR(255)    NOT NULL,
    tipo_archivo          VARCHAR(10)     NOT NULL,
    estado_certificacion  estado_certificacion_enum NOT NULL DEFAULT 'ACTIVO'
);

CREATE TABLE asistencia (
    id_asistencia     SERIAL PRIMARY KEY,
    id_empleado       INT             NOT NULL REFERENCES empleado(id_empleado) ON DELETE CASCADE ON UPDATE CASCADE,
    id_creado_por     INT             NOT NULL REFERENCES usuarios(id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE,
    fecha             DATE            NOT NULL,
    hora_entrada      TIME            NOT NULL,
    hora_salida       TIME            NULL,
    estado_asistencia estado_asistencia_enum NOT NULL,
    observacion       VARCHAR(255)    NULL,
    fecha_creacion    TIMESTAMP       NOT NULL
);

CREATE TABLE turno (
    id_turno          SERIAL PRIMARY KEY,
    id_empleado       INT             NOT NULL REFERENCES empleado(id_empleado) ON DELETE CASCADE ON UPDATE CASCADE,
    id_proyecto       INT             NOT NULL REFERENCES proyecto(id_proyecto) ON DELETE CASCADE ON UPDATE CASCADE,
    id_asignado_por   INT             NOT NULL REFERENCES usuarios(id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE,
    tipo_turno        VARCHAR(20)     NOT NULL,
    hora_inicio       TIME            NOT NULL,
    hora_fin          TIME            NOT NULL,
    fecha             DATE            NOT NULL
);

CREATE TABLE novedad (
    id_novedad        SERIAL PRIMARY KEY,
    id_empleado       INT             NOT NULL REFERENCES empleado(id_empleado) ON DELETE CASCADE ON UPDATE CASCADE,
    id_aprobado_por   INT             NULL REFERENCES usuarios(id_usuario) ON DELETE SET NULL ON UPDATE CASCADE,
    tipo_novedad      tipo_novedad_enum NOT NULL,
    fecha_inicio      DATE            NOT NULL,
    fecha_fin         DATE            NOT NULL,
    total_dias        DOUBLE PRECISION NOT NULL,
    soporte_url       VARCHAR(255)    NULL,
    estado_novedad    estado_novedad_enum NOT NULL DEFAULT 'PENDIENTE',
    -- Las novedades pueden iniciar y finalizar el mismo día.
    CONSTRAINT ck_novedad_fechas CHECK (fecha_inicio <= fecha_fin),
    CONSTRAINT ck_novedad_total_dias CHECK (total_dias > 0)
);

CREATE TABLE hora_extra (
    id_hora_extra       SERIAL PRIMARY KEY,
    id_empleado         INT             NOT NULL REFERENCES empleado(id_empleado) ON DELETE CASCADE ON UPDATE CASCADE,
    id_aprobador        INT             NULL REFERENCES supervisor(id_supervisor) ON DELETE SET NULL ON UPDATE CASCADE,
    motivo              VARCHAR(255)    NOT NULL,
    fecha_inicio        DATE            NOT NULL,
    fecha_fin           DATE            NOT NULL,
    cantidad_horas      DOUBLE PRECISION NOT NULL,
    tipo_hora           tipo_hora_enum  NOT NULL,
    archivo_soporte_url VARCHAR(255)    NOT NULL,
    estado_he           estado_he_enum  NOT NULL DEFAULT 'PENDIENTE',
    -- Las horas extra pueden corresponder a una sola jornada.
    CONSTRAINT ck_hora_extra_fechas CHECK (fecha_inicio <= fecha_fin),
    CONSTRAINT ck_hora_extra_cantidad CHECK (cantidad_horas > 0)
);

CREATE TABLE observacion (
    id_observacion      SERIAL PRIMARY KEY,
    id_empleado         INT             NOT NULL REFERENCES empleado(id_empleado) ON DELETE CASCADE ON UPDATE CASCADE,
    id_supervisor       INT             NOT NULL REFERENCES supervisor(id_supervisor) ON DELETE RESTRICT ON UPDATE CASCADE,
    tipo_observacion    tipo_observacion_enum NOT NULL,
    descripcion         TEXT            NOT NULL,
    fecha               TIMESTAMP       NOT NULL,
    escalada            BOOLEAN         NOT NULL DEFAULT FALSE,
    estado_observacion  estado_observacion_enum NOT NULL DEFAULT 'REGISTRADA'
);

CREATE TABLE evaluacion_desempeno (
    id_evaluacion           SERIAL PRIMARY KEY,
    id_empleado             INT             NOT NULL REFERENCES empleado(id_empleado) ON DELETE CASCADE ON UPDATE CASCADE,
    id_evaluador            INT             NOT NULL REFERENCES supervisor(id_supervisor) ON DELETE RESTRICT ON UPDATE CASCADE,
    periodo                 VARCHAR(20)     NOT NULL,
    puntaje_productividad   DOUBLE PRECISION NOT NULL,
    puntaje_asistencia      DOUBLE PRECISION NOT NULL,
    puntaje_calidad         DOUBLE PRECISION NOT NULL,
    puntaje_general         DOUBLE PRECISION NOT NULL,
    recomendacion           TEXT            NULL,
    solicita_capacitacion   BOOLEAN         NOT NULL DEFAULT FALSE,
    fecha_evaluacion        TIMESTAMP       NOT NULL
);

CREATE TABLE asignacion_proyecto (
    id_asignacion     SERIAL PRIMARY KEY,
    id_proyecto       INT             NOT NULL REFERENCES proyecto(id_proyecto) ON DELETE CASCADE ON UPDATE CASCADE,
    id_empleado       INT             NOT NULL REFERENCES empleado(id_empleado) ON DELETE CASCADE ON UPDATE CASCADE,
    cuadrilla         VARCHAR(60)     NOT NULL,
    rol_en_proyecto   VARCHAR(60)     NOT NULL,
    fecha_asignacion  DATE            NOT NULL,
    activo            BOOLEAN         NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_asignacion UNIQUE (id_proyecto, id_empleado)
);

CREATE TABLE configuracion (
    id_configuracion              SERIAL PRIMARY KEY,
    smlmv                         NUMERIC(12,2)   NOT NULL,
    auxilio_transporte            NUMERIC(10,2)   NOT NULL,
    tope_exoneracion              NUMERIC(12,2)   NOT NULL,
    pct_hora_extra_diurna         DOUBLE PRECISION NOT NULL DEFAULT 0.25,
    pct_hora_extra_nocturna       DOUBLE PRECISION NOT NULL DEFAULT 0.75,
    pct_recargo_nocturno_ordinario DOUBLE PRECISION NOT NULL DEFAULT 0.35,
    pct_recargo_dominical         DOUBLE PRECISION NOT NULL DEFAULT 0.75,
    pct_hora_extra_diurna_dominical DOUBLE PRECISION NOT NULL DEFAULT 1.00,
    pct_salud_empleado            DOUBLE PRECISION NOT NULL,
    pct_pension_empleado          DOUBLE PRECISION NOT NULL,
    nivel_arl_1                   DOUBLE PRECISION NOT NULL,
    nivel_arl_2                   DOUBLE PRECISION NOT NULL,
    nivel_arl_3                   DOUBLE PRECISION NOT NULL,
    nivel_arl_4                   DOUBLE PRECISION NOT NULL,
    nivel_arl_5                   DOUBLE PRECISION NOT NULL,
    anio_vigencia                 INT             NOT NULL UNIQUE
);

CREATE TABLE contrato (
    id_contrato       SERIAL PRIMARY KEY,
    id_empleado       INT             NOT NULL REFERENCES empleado(id_empleado) ON DELETE CASCADE ON UPDATE CASCADE,
    id_supervisor     INT             NULL REFERENCES supervisor(id_supervisor) ON DELETE SET NULL ON UPDATE CASCADE,
    id_proyecto       INT             NULL REFERENCES proyecto(id_proyecto) ON DELETE SET NULL ON UPDATE CASCADE,
    tipo_contrato     VARCHAR(30)     NOT NULL,
    salario           NUMERIC(12,2)   NOT NULL,
    fecha_inicio      DATE            NOT NULL,
    fecha_fin         DATE            NULL,
	obra_asignada     VARCHAR(100)        NULL,
    arl               VARCHAR(60)     NOT NULL,
    archivo_url       VARCHAR(255)    NULL,
    estado_contrato   estado_contrato_enum NOT NULL DEFAULT 'VIGENTE',
    CONSTRAINT ck_contrato_fechas CHECK (fecha_fin IS NULL OR fecha_inicio < fecha_fin)
);

CREATE TABLE prestamo (
    id_prestamo       SERIAL PRIMARY KEY,
    id_empleado       INT             NOT NULL REFERENCES empleado(id_empleado) ON DELETE CASCADE ON UPDATE CASCADE,
    tipo_obligacion   tipo_obligacion_enum NOT NULL,
    valor_total       NUMERIC(12,2)   NOT NULL,
    numero_cuotas     INT             NOT NULL,
    valor_cuota       NUMERIC(12,2)   NOT NULL,
    cuotas_pagadas    INT             NOT NULL DEFAULT 0,
    saldo_pendiente   NUMERIC(12,2)   NOT NULL,
    fecha_inicio      DATE            NOT NULL,
    observacion       VARCHAR(255)    NULL,
    estado_prestamo   estado_prestamo_enum NOT NULL DEFAULT 'ACTIVO'
);

CREATE TABLE viatico (
    id_viatico        SERIAL PRIMARY KEY,
    id_empleado       INT             NOT NULL REFERENCES empleado(id_empleado) ON DELETE CASCADE ON UPDATE CASCADE,
    id_proyecto       INT             NOT NULL REFERENCES proyecto(id_proyecto) ON DELETE RESTRICT ON UPDATE CASCADE,
    id_aprobado_por   INT             NULL REFERENCES usuarios(id_usuario) ON DELETE SET NULL ON UPDATE CASCADE,
    concepto          VARCHAR(60)     NOT NULL,
    valor             NUMERIC(10,2)   NOT NULL,
    fecha             DATE            NOT NULL,
    soporte_url       VARCHAR(255)    NULL,
    estado_viatico    estado_viatico_enum NOT NULL DEFAULT 'PENDIENTE'
);

CREATE TABLE liquidacion (
    id_liquidacion        SERIAL PRIMARY KEY,
    id_empleado           INT             NOT NULL REFERENCES empleado(id_empleado) ON DELETE CASCADE ON UPDATE CASCADE,
    id_configuracion      INT             NOT NULL REFERENCES configuracion(id_configuracion) ON DELETE RESTRICT ON UPDATE CASCADE,
    fecha_retiro          DATE            NOT NULL,
    motivo_retiro         motivo_retiro_enum NOT NULL,
    salario_promedio      NUMERIC(12,2)   NOT NULL,
    dias_trabajados       INT             NOT NULL,
    cesantias             NUMERIC(12,2)   NOT NULL,
    intereses_cesantias   NUMERIC(12,2)   NOT NULL,
    prima                 NUMERIC(12,2)   NOT NULL,
    vacaciones            NUMERIC(12,2)   NOT NULL,
    indemnizacion         NUMERIC(12,2)   NOT NULL,
    dotacion_pendiente    NUMERIC(12,2)   NOT NULL DEFAULT 0,
    total_neto_pagar      NUMERIC(12,2)   NOT NULL,
    notas_adicionales     VARCHAR(200)    NULL,
    CONSTRAINT ck_liquidacion_valores_no_negativos CHECK (
        salario_promedio >= 0
        AND cesantias >= 0
        AND intereses_cesantias >= 0
        AND prima >= 0
        AND vacaciones >= 0
        AND indemnizacion >= 0
        AND dotacion_pendiente >= 0
        AND total_neto_pagar >= 0
    )
);

CREATE TABLE nomina (
    id_nomina             SERIAL PRIMARY KEY,
    id_obra               INT             NULL REFERENCES proyecto(id_proyecto) ON DELETE SET NULL ON UPDATE CASCADE,
    id_configuracion      INT             NOT NULL REFERENCES configuracion(id_configuracion) ON DELETE RESTRICT ON UPDATE CASCADE,
    id_admin_rrhh         INT             NOT NULL REFERENCES admin_rrhh(id_admin_rrhh) ON DELETE RESTRICT ON UPDATE CASCADE,
    periodo_inicio        DATE            NOT NULL,
    periodo_fin           DATE            NOT NULL,
    tipo_nomina           tipo_nomina_enum NOT NULL,
    fecha_generacion      TIMESTAMP       NOT NULL,
    estado_nomina         estado_nomina_enum NOT NULL DEFAULT 'BORRADOR',
    total_pagado          NUMERIC(14,2)   NOT NULL DEFAULT 0,
    cantidad_empleados    INT             NOT NULL DEFAULT 0
);

CREATE TABLE detalle_nomina (
    id_detalle_nomina     SERIAL PRIMARY KEY,
    id_nomina             INT             NOT NULL REFERENCES nomina(id_nomina) ON DELETE CASCADE ON UPDATE CASCADE,
    id_empleado           INT             NOT NULL REFERENCES empleado(id_empleado) ON DELETE CASCADE ON UPDATE CASCADE,
    horas_ordinarias      DOUBLE PRECISION NOT NULL DEFAULT 0,
    horas_extra           DOUBLE PRECISION NOT NULL DEFAULT 0,
    dominicales_festivos  DOUBLE PRECISION NOT NULL DEFAULT 0,
    viaticos              NUMERIC(10,2)   NOT NULL DEFAULT 0,
    incapacidades         NUMERIC(10,2)   NOT NULL DEFAULT 0,
    descuentos_prestamos  NUMERIC(10,2)   NOT NULL DEFAULT 0,
    neto_pagar            NUMERIC(12,2)   NOT NULL,
    CONSTRAINT uq_detalle_nomina UNIQUE (id_nomina, id_empleado)
);

CREATE TABLE desprendible (
    id_desprendible       SERIAL PRIMARY KEY,
    id_detalle_nomina     INT             NOT NULL UNIQUE REFERENCES detalle_nomina(id_detalle_nomina) ON DELETE CASCADE ON UPDATE CASCADE,
    id_empleado           INT             NOT NULL REFERENCES empleado(id_empleado) ON DELETE CASCADE ON UPDATE CASCADE,
    periodo_pago          VARCHAR(30)     NOT NULL,
    dias_liquidados       INT             NOT NULL,
    fecha_pago            DATE            NOT NULL,
    neto_recibido         NUMERIC(12,2)   NOT NULL,
    archivo_url           VARCHAR(255)    NOT NULL,
    firma_digital         VARCHAR(255)    NOT NULL,
    estado_descarga       estado_descarga_enum NOT NULL DEFAULT 'GENERADO'
);

CREATE TABLE pila (
    id_pila               SERIAL PRIMARY KEY,
    id_nomina             INT             NOT NULL UNIQUE REFERENCES nomina(id_nomina) ON DELETE CASCADE ON UPDATE CASCADE,
    periodo_inicio        DATE            NOT NULL,
    periodo_fin           DATE            NOT NULL,
    total_salud           NUMERIC(12,2)   NOT NULL,
    total_pension         NUMERIC(12,2)   NOT NULL,
    total_arl             NUMERIC(12,2)   NOT NULL,
    total_paraestatales   NUMERIC(12,2)   NOT NULL,
    archivo_txt           VARCHAR(255)    NULL,
    estado_validacion     estado_validacion_enum NOT NULL DEFAULT 'PENDIENTE'
);

CREATE TABLE aporte_empleado (
    id_aporte               SERIAL PRIMARY KEY,
    id_pila                 INT             NOT NULL REFERENCES pila(id_pila) ON DELETE CASCADE ON UPDATE CASCADE,
    id_empleado             INT             NOT NULL REFERENCES empleado(id_empleado) ON DELETE CASCADE ON UPDATE CASCADE,
    ibc                     NUMERIC(12,2)   NOT NULL,
    dias_cotizados          INT             NOT NULL,
    tarifa_arl              DOUBLE PRECISION NOT NULL,
    aportes_salud           NUMERIC(10,2)   NOT NULL,
    aportes_pension         NUMERIC(10,2)   NOT NULL,
    aportes_arl             NUMERIC(10,2)   NOT NULL,
    aportes_paraestatales   NUMERIC(10,2)   NOT NULL,
    CONSTRAINT ck_aporte_dias_cotizados CHECK (dias_cotizados BETWEEN 1 AND 30),
    CONSTRAINT uq_aporte_pila_empleado UNIQUE (id_pila, id_empleado)
);

CREATE TABLE solicitud (
    id_solicitud      SERIAL PRIMARY KEY,
    id_solicitante    INT             NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    id_gestor_por     INT             NULL REFERENCES usuarios(id_usuario) ON DELETE SET NULL ON UPDATE CASCADE,
    tipo_solicitud    tipo_solicitud_enum NOT NULL,
    descripcion       TEXT            NOT NULL,
    fecha_creacion    TIMESTAMP       NOT NULL,
    estado_solicitud  estado_solicitud_enum NOT NULL DEFAULT 'PENDIENTE',
    respuesta         TEXT            NULL,
    fecha_respuesta   TIMESTAMP       NULL
);

CREATE TABLE notificacion (
    id_notificacion   SERIAL PRIMARY KEY,
    id_destinatario   INT             NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    tipo              tipo_notificacion_enum NOT NULL,
    mensaje           TEXT            NOT NULL,
    fecha_envio       TIMESTAMP       NOT NULL,
    leida             BOOLEAN         NOT NULL DEFAULT FALSE
);

CREATE TABLE cambio_configuracion (
    id_cambio         SERIAL PRIMARY KEY,
    id_configuracion  INT             NOT NULL REFERENCES configuracion(id_configuracion) ON DELETE CASCADE ON UPDATE CASCADE,
    id_modificado_por INT             NOT NULL REFERENCES usuarios(id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE,
    campo             VARCHAR(60)     NOT NULL,
    valor_anterior    VARCHAR(100)    NOT NULL,
    valor_nuevo       VARCHAR(100)    NOT NULL,
    fecha_cambio      TIMESTAMP       NOT NULL
);

-- ============================================================ 

-- 4. POBLAMIENTO DE DATOS DE PRUEBA (MIGRACIÓN DESDE MYSQL) 

-- ============================================================ 

-- ============================================================
-- DATOS INICIALES DE AUTORIZACIÓN
-- ============================================================

INSERT INTO perfil (id_perfil, nombre, descripcion) VALUES
(1, 'ADMIN_RRHH', 'Perfil técnico de autorización para administración de recursos humanos'),
(2, 'SUPERVISOR', 'Perfil técnico de autorización para supervisión de obra'),
(3, 'CONTADOR', 'Perfil técnico de autorización para procesos contables y de nómina'),
(4, 'EMPLEADO', 'Perfil técnico de autorización para acceso del empleado');

INSERT INTO modulo (id_modulo, nombre, descripcion) VALUES
(1,  'EMPLEADOS',      'Gestión de empleados'),
(2,  'ASISTENCIA',     'Gestión y consulta de asistencia'),
(3,  'TURNOS',         'Gestión y asignación de turnos'),
(4,  'HORAS_EXTRAS',   'Gestión de horas extras'),
(5,  'PROYECTOS',      'Gestión de proyectos y asignaciones'),
(6,  'CONTRATOS',      'Gestión de contratos'),
(7,  'PRESTAMOS',      'Gestión de préstamos'),
(8,  'LIQUIDACIONES',  'Gestión de liquidaciones'),
(9,  'NOMINA',         'Gestión de nómina'),
(10, 'PILA',           'Gestión de información PILA'),
(11, 'REPORTES',       'Consulta y generación de reportes'),
(12, 'CONFIGURACION',  'Configuración del sistema'),
(13, 'CALENDARIO',     'Gestión del calendario laboral'),
(14, 'USUARIOS',       'Gestión de usuarios y administración de permisos');

INSERT INTO accion (id_accion, nombre, descripcion) VALUES
(1,  'CONSULTAR',  'Consultar información'),
(2,  'REGISTRAR',  'Registrar información'),
(3,  'ACTUALIZAR', 'Modificar información existente'),
(4,  'ELIMINAR',   'Eliminar o desactivar información según la regla de negocio'),
(5,  'DESCARGAR',  'Descargar información o documentos'),
(6,  'EXPORTAR',   'Exportar información'),
(7,  'GENERAR',    'Ejecutar una generación de información o documento'),
(8,  'APROBAR',    'Aprobar una operación'),
(9,  'ASIGNAR',    'Asignar recursos o relaciones'),
(10, 'VALIDAR',    'Validar una operación o información');

INSERT INTO usuarios (id_usuario, nombres, apellidos, correo, password_hash, estado, ultimo_acceso, foto_perfil, idioma) VALUES 
(1, 'Claudia', 'Cardenas Mejia', 'claudia.cardenas@construandes.com.co', '$2b$12$m2TF1QlwVBFHvJs34xwLgutzByHtjTldQK7la8ckZ9hOImB2kOpVG', TRUE, '2026-06-28 14:16:00', NULL, 'ES'),
(2, 'Laura', 'Munoz Garcia', 'laura.munoz@construandes.com.co', '$2b$12$/K.ebPl3H/fdXEtSVwhumuaBcslIOz/Fw8IEPw1KstqvizyeLxCou', TRUE, '2026-06-29 12:57:00', NULL, 'ES'),
(3, 'Manuel', 'Perez Alvarez', 'manuel.perez@construandes.com.co', '$2b$12$R5fX9I6kK130oA3/8WCHAu0eeHxGYpL/BL05N967zoiuBQhQqPHNS', TRUE, '2026-06-29 12:23:00', NULL, 'ES'),
(4, 'Ricardo', 'Gil Gomez', 'ricardo.gil@construandes.com.co', '$2b$12$Cri/ESJAisoLgmXlc4hmhehShaYc6VifsYNCfBJSy/7k8Ya0ecP5e', TRUE, '2026-06-23 08:32:00', NULL, 'ES'),
(5, 'Patricia', 'Vargas Pena', 'patricia.vargas@construandes.com.co', '$2b$12$OPycdWvN.EwhjjgCo6ppCumY8Ql4pM3FqLqTSrUdi73w9com.g11u', TRUE, '2026-06-27 07:48:00', NULL, 'ES'),
(6, 'Julian', 'Ramirez Suarez', 'julian.ramirez@construandes.com.co', '$2b$12$z9U36.BWy4ItxLkNND69He6Dj5sdTdTMKx9HuW9/ZzZg0wF.9KxW6', TRUE, '2026-06-20 19:07:00', NULL, 'ES'),
(7, 'Edwin', 'Sanchez Jimenez', 'edwin.sanchez@construandes.com.co', '$2b$12$b2jiMKasNUgNXGfaXtTxU.rlBUYyu5DYXU2qfofnSdYc.hn1BpSdu', TRUE, '2026-06-22 16:10:00', NULL, 'ES'),
(8, 'Luis', 'Mejia Rojas', 'luis.mejia@construandes.com.co', '$2b$12$AHLVmE8.jkmDDh.kv0Unk.M4u9gFBcuZY7Rl3TdLjX.TPs04RfNFe', TRUE, '2026-06-30 12:38:00', NULL, 'ES'),
(9, 'Gustavo', 'Garcia Cadena', 'gustavo.garcia@construandes.com.co', '$2b$12$mN5IC9C9QLW4muBpQwZi2enAUHH8GHQMtVgHDqc4H4PE2ZlmuBIVi', TRUE, '2026-06-21 12:24:00', NULL, 'ES'),
(10, 'Diana', 'Alvarez Diaz', 'diana.alvarez@construandes.com.co', '$2b$12$tMqfPbr1p67O1tG4A15rPexPB.btlFqaSEEOSkcGDum4.bktmprY.', TRUE, '2026-06-29 13:33:00', NULL, 'ES'),
(11, 'Martha', 'Gomez Ortiz', 'martha.gomez@construandes.com.co', '$2b$12$Z/uHx3swX4ppWVp81sw6C.1H7U6mXV5V.N7Ad9FgY95lEZTHjKCKW', TRUE, '2026-06-24 14:55:00', NULL, 'ES'),
(12, 'Sergio', 'Pena Martinez', 'sergio.pena@construandes.com.co', '$2b$12$mCh3W/DbBJOKRZ4PKvlGz.EXIfc2aVrUafpivjy1XEcQ6KOi6ABEa', TRUE, '2026-06-20 16:46:00', NULL, 'ES'),
(13, 'Cristian', 'Suarez Ruiz', 'cristian.suarez@construandes.com.co', '$2b$12$KuUwME3H/d9z9cncN/lq2u440fkPL.2DmjYQFSSovQsofNoKHmKBO', TRUE, '2026-06-21 16:56:00', NULL, 'ES'),
(14, 'Wilson', 'Jimenez Bermudez', 'wilson.jimenez@construandes.com.co', '$2b$12$MU3vBdTcHr7DjwB.BPWwIuKompNA6EaQEzgKTborTEeXhgxIl3KC.', TRUE, '2026-06-28 18:17:00', NULL, 'ES'),
(15, 'Jorge', 'Rojas Moreno', 'jorge.rojas@construandes.com.co', '$2b$12$8PXoGSBcwvDyCK4x08fNLO3.B71Q5TOdiZHORotR7iTZaMLZYKbiy', TRUE, '2026-06-30 11:07:00', NULL, 'ES'),
(16, 'Sandra', 'Cadena Romero', 'sandra.cadena@construandes.com.co', '$2b$12$.Uui.mPWpLSbcLEK9A7N7OpxDuKhgO/yhxKTkL5JXH9ejk5J2JAHW', TRUE, '2026-06-24 12:10:00', NULL, 'ES'),
(17, 'Adriana', 'Diaz Rodriguez', 'adriana.diaz@construandes.com.co', '$2b$12$XFlspmKcJeZd9j8HxoNsTO6pkr5WNtr0.VjB/MoNdp6li2BFrqAhu', TRUE, '2026-06-27 06:46:00', NULL, 'ES'),
(18, 'Carolina', 'Ortiz Torres', 'carolina.ortiz@construandes.com.co', '$2b$12$xdci.JXkjWSF9y9K087sheJHlRmIjTrn7qn6RMLyqgqSSJhEylFE.', TRUE, '2026-06-24 14:48:00', NULL, 'ES'),
(19, 'Viviana', 'Martinez Herrera', 'viviana.martinez@construandes.com.co', '$2b$12$2BUq3jw75FNOMj81H3muUuXT88R23LVbkaTsYY5U6V8qcPW2QjocK', TRUE, '2026-06-22 14:58:00', NULL, 'ES'),
(20, 'Liliana', 'Ruiz Nino', 'liliana.ruiz@construandes.com.co', '$2b$12$1AwpjMs.nWfNqmuyyzZjcOxTvd2yQuYrOz1508ddMAehoIpUsLCr2', TRUE, '2026-06-21 19:40:00', NULL, 'ES'),
(21, 'Nicolas', 'Bermudez Salazar', 'nicolas.bermudez@construandes.com.co', '$2b$12$y.YjUaqedohAkjNnVU3wtuyiNoCTqV5LyOIto1lGBpelyKWAerui.', TRUE, '2026-06-24 19:40:00', NULL, 'ES'),
(22, 'Yolanda', 'Moreno Castro', 'yolanda.moreno@construandes.com.co', '$2b$12$MUEzbUaYzVv0tE/d55hVa.cqFj1obugVTMC/i08oKaTtY0/wSeUfu', TRUE, '2026-06-28 15:12:00', NULL, 'ES'),
(23, 'Camilo', 'Romero Lopez', 'camilo.romero@construandes.com.co', '$2b$12$jF7lNFw98zfQrZF5LKwe.eCfpI7RCArmsNlvMwKLzIByY54j.v44K', TRUE, '2026-06-22 11:48:00', NULL, 'ES'),
(24, 'Alejandro', 'Rodriguez Cardenas', 'alejandro.rodriguez@construandes.com.co', '$2b$12$rP4bNzyAGeCx9.hDlfNX6.u/lKSxPF2PepJV.Um2l.93VK.jY0fBC', TRUE, '2026-06-22 14:49:00', NULL, 'ES'),
(25, 'Angela', 'Torres Munoz', 'angela.torres@construandes.com.co', '$2b$12$FJlWA5sRXCzL5.H.fIZ7ouTyKVxswYFAmj2WSFSwIycvThDcsgrbO', TRUE, '2026-06-28 20:00:00', NULL, 'ES'),
(26, 'Maria', 'Herrera Perez', 'maria.herrera@construandes.com.co', '$2b$12$VQSPmM3DMv8D9e8FWbDt.O0057SIjr/g.o2Cu8hpljkqqYsGrj4AK', TRUE, '2026-06-29 11:31:00', NULL, 'ES'),
(27, 'Diego', 'Nino Gil', 'diego.nino@construandes.com.co', '$2b$12$0E8YldD5LpaVyt8Z6ND2eecLRSDBegCY/XQOo7wBpuCUaQZpDv4H2', TRUE, '2026-06-20 07:59:00', NULL, 'ES'),
(28, 'Hector', 'Salazar Vargas', 'hector.salazar@construandes.com.co', '$2b$12$C4FjwFBrjr7I74Noft/c5OoxcPmSgtNKJUJ7M7I7FET3aYDXvrs0y', TRUE, '2026-06-25 20:53:00', NULL, 'ES'),
(29, 'Andres', 'Castro Ramirez', 'andres.castro@construandes.com.co', '$2b$12$TntSLRw5O5YoEEF5YnmOG.iy8S4H7bG7VxTpVngtX0.6U8hJt0yEq', TRUE, '2026-06-24 09:03:00', NULL, 'ES'),
(30, 'Mauricio', 'Lopez Sanchez', 'mauricio.lopez@construandes.com.co', '$2b$12$9j4AT.ZZXkw.89bZoXOQOeOI9vK6dowzBEmrXIGCt5aIw7Z6xXEne', TRUE, '2026-06-23 20:36:00', NULL, 'ES'),
(31, 'Fernando', 'Cardenas Mejia', 'fernando.cardenas@construandes.com.co', '$2b$12$EOUaPmMx6ntT254E7z3STexRkGYwwD.q/bLriddxML5vslmMsEj1u', TRUE, '2026-06-21 07:46:00', NULL, 'ES'),
(32, 'Felipe', 'Munoz Garcia', 'felipe.munoz@construandes.com.co', '$2b$12$CLcjyPd7fplm82VsP0uIPewoPMm2anNtZkepjBEv3nhIeqW0vvvW2', TRUE, '2026-06-27 19:04:00', NULL, 'ES'),
(33, 'Paola', 'Perez Alvarez', 'paola.perez@construandes.com.co', '$2b$12$I6pLrGiqplRz10MNPasc/eKuxoQZPxEeVwsOPMT2ZTbl5PovbCNqa', TRUE, '2026-06-28 18:08:00', NULL, 'ES'),
(34, 'Ivan', 'Gil Gomez', 'ivan.gil@construandes.com.co', '$2b$12$2JEdALDVJe/wp0i/FVRwMee9wteFYyXtopI5yNuumaosPzd4.6YGa', TRUE, '2026-06-22 16:30:00', NULL, 'ES'),
(35, 'Rodrigo', 'Vargas Pena', 'rodrigo.vargas@construandes.com.co', '$2b$12$2iCG1nHEZZAwXDI/4TB0pOafgUyacVZCnlwGlm8Ca85bCF8U5wq6W', TRUE, '2026-06-28 08:16:00', NULL, 'ES'),
(36, 'Oscar', 'Ramirez Suarez', 'oscar.ramirez@construandes.com.co', '$2b$12$Wh.bLKkzxAxQBrW7kgLJCuDDhMMyISd99O4ZqC3LhuhoEtlginfAG', TRUE, '2026-06-28 19:38:00', NULL, 'ES'),
(37, 'Carlos', 'Sanchez Jimenez', 'carlos.sanchez@construandes.com.co', '$2b$12$M20erMb/SlqRewmnz22k3u2GG1Rg4f8ymPsTGEoG53CK0iR4rl8E.', TRUE, '2026-06-26 09:59:00', NULL, 'ES'),
(38, 'Natalia', 'Mejia Rojas', 'natalia.mejia@construandes.com.co', '$2b$12$zs3n6NiBaZtiCmVJKhNelePuPXIoWYTZqTW9YRxbLGpu/zelXQ7qC', TRUE, '2026-06-28 18:46:00', NULL, 'ES'),
(39, 'Santiago', 'Garcia Cadena', 'santiago.garcia@construandes.com.co', '$2b$12$9hrQRAi1IexPhQY2fyw6IOav7zVGTiWvqIvtToF6fUXLBU6v8uIam', TRUE, '2026-06-23 17:19:00', NULL, 'ES'),
(40, 'Miguel', 'Alvarez Diaz', 'miguel.alvarez@construandes.com.co', '$2b$12$7yGKeKA2OgSbSSoh2c/vLu1BeUSUYxb2W56vZp1klam6hDsDjhDj6', TRUE, '2026-06-26 16:41:00', NULL, 'ES');

-- DATOS DE PRUEBA PARA PERFILES ESPECIALIZADOS
-- Los códigos profesionales siguientes son identificadores sintéticos de prueba.
-- Deben sustituirse por los datos reales en un entorno de producción.

INSERT INTO supervisor (id_usuario, numero_tarjeta_profesional, cuadrilla_asignada) VALUES
(4, 'SUP-TEST-001', 'CUADRILLA A'),
(5, 'SUP-TEST-002', 'CUADRILLA B'),
(6, 'SUP-TEST-003', 'CUADRILLA C'),
(7, 'SUP-TEST-004', 'CUADRILLA D'),
(8, 'SUP-TEST-005', 'CUADRILLA E');

INSERT INTO contador (id_usuario, numero_tarjeta_profesional, area_nomina) VALUES
(9, 'CON-TEST-001', 'GENERAL'),
(10, 'CON-TEST-002', 'GENERAL');

INSERT INTO admin_rrhh (id_usuario, area_responsable) VALUES
(1, 'ADMINISTRACION'),
(2, 'RECURSOS HUMANOS'),
(3, 'RECURSOS HUMANOS');

-- ============================================================
-- ASIGNACIÓN DEL PERFIL TÉCNICO A LOS USUARIOS
-- ============================================================

UPDATE usuarios
SET id_perfil = 1
WHERE id_usuario IN (1, 2, 3);

UPDATE usuarios
SET id_perfil = 2
WHERE id_usuario IN (4, 5, 6, 7, 8);

UPDATE usuarios
SET id_perfil = 3
WHERE id_usuario IN (9, 10);

UPDATE usuarios
SET id_perfil = 4
WHERE id_usuario BETWEEN 11 AND 40;

ALTER TABLE usuarios
    ALTER COLUMN id_perfil SET NOT NULL;

-- ============================================================
-- ASIGNACIÓN DE PERMISOS - SUPERVISOR
-- ============================================================

INSERT INTO permiso (id_perfil, id_modulo, id_accion)
SELECT
    p.id_perfil,
    m.id_modulo,
    a.id_accion
FROM perfil p
JOIN modulo m
    ON m.nombre IN (
        'EMPLEADOS',
        'ASISTENCIA',
        'TURNOS',
        'HORAS_EXTRAS',
        'PROYECTOS',
        'CONTRATOS',
        'PRESTAMOS',
        'NOMINA',
        'REPORTES',
        'CALENDARIO'
    )
JOIN accion a
    ON (
        (m.nombre = 'EMPLEADOS'    AND a.nombre = 'CONSULTAR')
        OR
        (m.nombre = 'ASISTENCIA'   AND a.nombre IN ('CONSULTAR', 'REGISTRAR'))
        OR
        (m.nombre = 'TURNOS'       AND a.nombre IN ('CONSULTAR', 'REGISTRAR'))
        OR
        (m.nombre = 'HORAS_EXTRAS' AND a.nombre IN ('CONSULTAR', 'REGISTRAR'))
        OR
        (m.nombre = 'PROYECTOS'    AND a.nombre IN ('CONSULTAR', 'ASIGNAR'))
        OR
        (m.nombre = 'CONTRATOS'    AND a.nombre = 'CONSULTAR')
        OR
        (m.nombre = 'PRESTAMOS'    AND a.nombre = 'CONSULTAR')
        OR
        (m.nombre = 'NOMINA'       AND a.nombre IN ('CONSULTAR', 'EXPORTAR'))
        OR
        (m.nombre = 'REPORTES'     AND a.nombre IN ('CONSULTAR', 'EXPORTAR'))
        OR
        (m.nombre = 'CALENDARIO'   AND a.nombre = 'CONSULTAR')
    )
WHERE p.nombre = 'SUPERVISOR';

-- ============================================================
-- PERMISOS DEL PERFIL CONTADOR
-- ============================================================

INSERT INTO permiso (id_perfil, id_modulo, id_accion)
SELECT
    p.id_perfil,
    m.id_modulo,
    a.id_accion
FROM perfil p
JOIN modulo m
    ON m.nombre = 'NOMINA'
JOIN accion a
    ON a.nombre IN ('CONSULTAR', 'GENERAR')
WHERE p.nombre = 'CONTADOR';

INSERT INTO permiso (id_perfil, id_modulo, id_accion)
SELECT
    p.id_perfil,
    m.id_modulo,
    a.id_accion
FROM perfil p
JOIN modulo m
    ON m.nombre = 'LIQUIDACIONES'
JOIN accion a
    ON a.nombre = 'GENERAR'
WHERE p.nombre = 'CONTADOR';

INSERT INTO permiso (id_perfil, id_modulo, id_accion)
SELECT
    p.id_perfil,
    m.id_modulo,
    a.id_accion
FROM perfil p
JOIN modulo m
    ON m.nombre = 'PILA'
JOIN accion a
    ON a.nombre IN ('CONSULTAR', 'REGISTRAR')
WHERE p.nombre = 'CONTADOR';


-- ============================================================
-- PERMISOS DEL PERFIL EMPLEADO
-- ============================================================

INSERT INTO permiso (id_perfil, id_modulo, id_accion)
SELECT
    p.id_perfil,
    m.id_modulo,
    a.id_accion
FROM perfil p
JOIN modulo m
    ON m.nombre = 'EMPLEADOS'
JOIN accion a
    ON a.nombre = 'CONSULTAR'
WHERE p.nombre = 'EMPLEADO';

INSERT INTO permiso (id_perfil, id_modulo, id_accion)
SELECT
    p.id_perfil,
    m.id_modulo,
    a.id_accion
FROM perfil p
JOIN modulo m
    ON m.nombre = 'NOMINA'
JOIN accion a
    ON a.nombre IN ('CONSULTAR', 'DESCARGAR')
WHERE p.nombre = 'EMPLEADO';

INSERT INTO permiso (id_perfil, id_modulo, id_accion)
SELECT
    p.id_perfil,
    m.id_modulo,
    a.id_accion
FROM perfil p
JOIN modulo m
    ON m.nombre = 'PRESTAMOS'
JOIN accion a
    ON a.nombre = 'CONSULTAR'
WHERE p.nombre = 'EMPLEADO';

-- ============================================================
-- ============================================================
-- PERMISOS DEL PERFIL ADMIN_RRHH
-- Matriz validada: 46 permisos
-- ============================================================

INSERT INTO permiso (id_perfil, id_modulo, id_accion)
SELECT p.id_perfil, m.id_modulo, a.id_accion
FROM perfil p
JOIN modulo m ON m.nombre = 'EMPLEADOS'
JOIN accion a ON a.nombre IN (
    'CONSULTAR',
    'REGISTRAR',
    'ACTUALIZAR',
    'ELIMINAR',
    'EXPORTAR'
)
WHERE p.nombre = 'ADMIN_RRHH';

INSERT INTO permiso (id_perfil, id_modulo, id_accion)
SELECT p.id_perfil, m.id_modulo, a.id_accion
FROM perfil p
JOIN modulo m ON m.nombre = 'ASISTENCIA'
JOIN accion a ON a.nombre IN (
    'CONSULTAR',
    'REGISTRAR',
    'ACTUALIZAR'
)
WHERE p.nombre = 'ADMIN_RRHH';

INSERT INTO permiso (id_perfil, id_modulo, id_accion)
SELECT p.id_perfil, m.id_modulo, a.id_accion
FROM perfil p
JOIN modulo m ON m.nombre = 'TURNOS'
JOIN accion a ON a.nombre IN (
    'CONSULTAR',
    'REGISTRAR',
    'ACTUALIZAR',
    'ASIGNAR'
)
WHERE p.nombre = 'ADMIN_RRHH';

INSERT INTO permiso (id_perfil, id_modulo, id_accion)
SELECT p.id_perfil, m.id_modulo, a.id_accion
FROM perfil p
JOIN modulo m ON m.nombre = 'HORAS_EXTRAS'
JOIN accion a ON a.nombre IN (
    'CONSULTAR',
    'REGISTRAR',
    'ACTUALIZAR',
    'APROBAR'
)
WHERE p.nombre = 'ADMIN_RRHH';

INSERT INTO permiso (id_perfil, id_modulo, id_accion)
SELECT p.id_perfil, m.id_modulo, a.id_accion
FROM perfil p
JOIN modulo m ON m.nombre = 'PROYECTOS'
JOIN accion a ON a.nombre IN (
    'CONSULTAR',
    'REGISTRAR',
    'ACTUALIZAR',
    'ASIGNAR'
)
WHERE p.nombre = 'ADMIN_RRHH';

INSERT INTO permiso (id_perfil, id_modulo, id_accion)
SELECT p.id_perfil, m.id_modulo, a.id_accion
FROM perfil p
JOIN modulo m ON m.nombre = 'CONTRATOS'
JOIN accion a ON a.nombre IN (
    'CONSULTAR',
    'REGISTRAR',
    'ACTUALIZAR'
)
WHERE p.nombre = 'ADMIN_RRHH';

INSERT INTO permiso (id_perfil, id_modulo, id_accion)
SELECT p.id_perfil, m.id_modulo, a.id_accion
FROM perfil p
JOIN modulo m ON m.nombre = 'PRESTAMOS'
JOIN accion a ON a.nombre IN (
    'CONSULTAR',
    'REGISTRAR',
    'ACTUALIZAR',
    'APROBAR'
)
WHERE p.nombre = 'ADMIN_RRHH';

INSERT INTO permiso (id_perfil, id_modulo, id_accion)
SELECT p.id_perfil, m.id_modulo, a.id_accion
FROM perfil p
JOIN modulo m ON m.nombre = 'LIQUIDACIONES'
JOIN accion a ON a.nombre IN (
    'CONSULTAR',
    'GENERAR',
    'APROBAR'
)
WHERE p.nombre = 'ADMIN_RRHH';

INSERT INTO permiso (id_perfil, id_modulo, id_accion)
SELECT p.id_perfil, m.id_modulo, a.id_accion
FROM perfil p
JOIN modulo m ON m.nombre = 'NOMINA'
JOIN accion a ON a.nombre IN (
    'CONSULTAR',
    'GENERAR',
    'APROBAR'
)
WHERE p.nombre = 'ADMIN_RRHH';

INSERT INTO permiso (id_perfil, id_modulo, id_accion)
SELECT p.id_perfil, m.id_modulo, a.id_accion
FROM perfil p
JOIN modulo m ON m.nombre = 'PILA'
JOIN accion a ON a.nombre IN (
    'CONSULTAR',
    'VALIDAR',
    'GENERAR'
)
WHERE p.nombre = 'ADMIN_RRHH';

INSERT INTO permiso (id_perfil, id_modulo, id_accion)
SELECT p.id_perfil, m.id_modulo, a.id_accion
FROM perfil p
JOIN modulo m ON m.nombre = 'REPORTES'
JOIN accion a ON a.nombre IN (
    'CONSULTAR',
    'EXPORTAR'
)
WHERE p.nombre = 'ADMIN_RRHH';

INSERT INTO permiso (id_perfil, id_modulo, id_accion)
SELECT p.id_perfil, m.id_modulo, a.id_accion
FROM perfil p
JOIN modulo m ON m.nombre = 'CONFIGURACION'
JOIN accion a ON a.nombre IN (
    'CONSULTAR',
    'ACTUALIZAR'
)
WHERE p.nombre = 'ADMIN_RRHH';

INSERT INTO permiso (id_perfil, id_modulo, id_accion)
SELECT p.id_perfil, m.id_modulo, a.id_accion
FROM perfil p
JOIN modulo m ON m.nombre = 'CALENDARIO'
JOIN accion a ON a.nombre IN (
    'CONSULTAR',
    'REGISTRAR'
)
WHERE p.nombre = 'ADMIN_RRHH';

INSERT INTO permiso (id_perfil, id_modulo, id_accion)
SELECT p.id_perfil, m.id_modulo, a.id_accion
FROM perfil p
JOIN modulo m ON m.nombre = 'USUARIOS'
JOIN accion a ON a.nombre IN (
    'CONSULTAR',
    'REGISTRAR',
    'ACTUALIZAR',
    'ELIMINAR'
)
WHERE p.nombre = 'ADMIN_RRHH';

-- ============================================================
-- CONSULTAS TEMPORALES DE VALIDACION DE PERMISOS
-- ============================================================

-- SELECT 1: conteo de permisos por perfil
SELECT
    p.nombre AS perfil,
    COUNT(*) AS cantidad_permisos
FROM permiso pe
JOIN perfil p
    ON p.id_perfil = pe.id_perfil
GROUP BY p.id_perfil, p.nombre
ORDER BY p.id_perfil;

-- SELECT 2: detalle de permisos de ADMIN_RRHH
SELECT
    p.nombre AS perfil,
    m.nombre AS modulo,
    a.nombre AS accion
FROM permiso pe
JOIN perfil p ON p.id_perfil = pe.id_perfil
JOIN modulo m ON m.id_modulo = pe.id_modulo
JOIN accion a ON a.id_accion = pe.id_accion
WHERE p.nombre = 'ADMIN_RRHH'
ORDER BY m.id_modulo, a.id_accion;

INSERT INTO proyecto (id_proyecto, id_supervisor, nombre, descripcion, ubicacion_calle, ubicacion_referencia, fecha_inicio, fecha_fin, estado_proyecto) VALUES 
(10, 1, 'Conjunto Residencial Cedros del Norte', 'Obra de construccion supervisada por el equipo de obra asignado.', 'Calle 145 # 58-20', 'Frente al Parque El Cedro', '2025-02-01', '2026-12-15', 'ACTIVO'), 
(9, 2, 'Edificio Torres de Chapinero', 'Obra de construccion supervisada por el equipo de obra asignado.', 'Carrera 13 # 63-45', 'Al lado de la estacion Chapinero', '2025-06-01', '2027-03-01', 'ACTIVO'), 
(8, 3, 'Centro Comercial Plaza Fontibon', 'Obra de construccion supervisada por el equipo de obra asignado.', 'Avenida Centenario # 100-30', 'Cerca al Terminal de Transporte', '2024-09-01', '2026-09-30', 'ACTIVO'), 
(7, 4, 'Bodegas Industriales Puente Aranda', 'Obra de construccion supervisada por el equipo de obra asignado.', 'Carrera 50 # 8-15', 'Zona Industrial', '2023-05-01', '2025-12-20', 'FINALIZADO'), 
(6, 5, 'Urbanizacion Villa del Sol', 'Obra de construccion supervisada por el equipo de obra asignado.', 'Calle 80 # 110-05', 'Sector Engativa', '2026-01-15', '2027-06-30', 'ACTIVO'), 
(5, 1, 'Conjunto Residencial Los Pinos', 'Construccion de complejo residencial de cuatro torres.', 'Calle 170 # 20-35', 'Frente al Colegio Distrital', '2026-01-10', '2026-11-30', 'ACTIVO'), 
(4, 2, 'Edificio Empresarial Andino', 'Construccion de edificio de oficinas con ocho niveles.', 'Carrera 11 # 93-40', 'Junto al Centro Comercial Andino', '2026-02-15', '2026-12-15', 'ACTIVO'), 
(3, 3, 'Parque Recreativo San Jorge', 'Adecuacion y construccion de zonas deportivas y recreativas.', 'Calle 68 # 45-18', 'Frente al Polideportivo', '2026-03-01', '2026-09-20', 'FINALIZADO'), 
(2, 4, 'Hospital Regional Occidente', 'Construccion de infraestructura hospitalaria.', 'Avenida Boyaca # 72-15', 'Cerca al Portal 80', '2026-04-10', '2026-12-20', 'ACTIVO'), 
(1, 5, 'Colegio Nuevo Horizonte', 'Construccion de institucion educativa con aulas y laboratorios.', 'Carrera 98 # 130-50', 'Frente al Parque Principal', '2026-05-05', '2026-10-31', 'FINALIZADO');  

 
INSERT INTO empleado (id_empleado, id_usuario, id_supervisor, tipo_documento, numero_documento, fecha_nacimiento, calle, barrio, ciudad, telefono, correo_personal, cargo, fecha_ingreso, salario, forma_pago, banco, numero_cuenta, estado_laboral) VALUES 
(1, 2, NULL, 'CC', '1050119651', '2003-08-04', 'Calle 19 # 91-81', 'Kennedy', 'Bogota', '3158800797', 'laura.munoz30@gmail.com', 'Analista de Recursos Humanos', '2022-04-03', 2600000.00, 'CONSIGNACION', 'Bancolombia', '1945826486', 'ACTIVO'),
(2, 3, NULL, 'CC', '1069008866', '1987-11-16', 'Calle 147 # 74-61', 'Engativa', 'Bogota', '3131944441', 'manuel.perez61@gmail.com', 'Analista de Recursos Humanos', '2022-09-05', 2600000.00, 'EFECTIVO', NULL, NULL, 'ACTIVO'),
(3, 4, NULL, 'CC', '1088447167', '1992-07-14', 'Calle 168 # 83-13', 'Kennedy', 'Bogota', '3157854710', 'ricardo.gil52@gmail.com', 'Supervisor de Obra', '2023-06-02', 3400000.00, 'EFECTIVO', NULL, NULL, 'ACTIVO'),
(4, 5, NULL, 'CC', '1025529407', '1998-03-14', 'Calle 13 # 84-70', 'Kennedy', 'Bogota', '3171979055', 'patricia.vargas12@gmail.com', 'Supervisor de Obra', '2023-03-15', 3200000.00, 'CONSIGNACION', 'Bancolombia', '3363629219', 'ACTIVO'),
(5, 6, NULL, 'CC', '1064606833', '1995-01-06', 'Calle 179 # 94-72', 'Chapinero', 'Bogota', '3128688676', 'julian.ramirez20@gmail.com', 'Supervisor de Obra', '2023-01-13', 3400000.00, 'CONSIGNACION', 'Banco de Bogota', '6520103410', 'ACTIVO'),
(6, 7, NULL, 'CC', '1077736262', '1973-12-11', 'Calle 15 # 66-11', 'Suba', 'Bogota', '3198748972', 'edwin.sanchez9@gmail.com', 'Supervisor de Obra', '2023-01-19', 3200000.00, 'CONSIGNACION', 'Banco Popular', '3281169403', 'ACTIVO'),
(7, 8, NULL, 'CC', '1054193837', '1985-10-20', 'Calle 172 # 92-41', 'Engativa', 'Bogota', '3116090908', 'luis.mejia34@gmail.com', 'Supervisor de Obra', '2023-05-03', 3200000.00, 'CONSIGNACION', 'Banco Popular', '2119980130', 'ACTIVO'),
(8, 9, NULL, 'CC', '1040264926', '1990-02-01', 'Calle 130 # 34-17', 'Ciudad Bolivar', 'Bogota', '3161367643', 'gustavo.garcia9@gmail.com', 'Contador de Nomina', '2022-10-19', 3200000.00, 'CONSIGNACION', 'Bancolombia', '3309122187', 'ACTIVO'),
(9, 10, NULL, 'CC', '1058812137', '1989-10-26', 'Calle 77 # 85-14', 'Suba', 'Bogota', '3172909480', 'diana.alvarez34@gmail.com', 'Contador de Nomina', '2022-11-27', 3000000.00, 'EFECTIVO', NULL, NULL, 'ACTIVO'),
(10, 11, 1, 'CC', '1020863865', '1988-10-07', 'Calle 71 # 6-1', 'Ciudad Bolivar', 'Bogota', '3136553958', 'martha.gomez99@gmail.com', 'Operador de Maquinaria', '2025-08-09', 1500000.00, 'CONSIGNACION', 'Bancolombia', '8019198243', 'RETIRADO'),
(11, 12, 2, 'CC', '1059302158', '1997-09-01', 'Calle 111 # 17-6', 'Fontibon', 'Bogota', '3174045292', 'sergio.pena47@gmail.com', 'Ayudante de Obra', '2025-01-27', 1423500.00, 'CONSIGNACION', 'Banco Popular', '3373077218', 'RETIRADO'),
(12, 13, 3, 'CC', '1033491314', '1976-06-25', 'Calle 86 # 53-86', 'Engativa', 'Bogota', '3189514287', 'cristian.suarez35@gmail.com', 'Almacenista de Obra', '2023-03-26', 1800000.00, 'CONSIGNACION', 'Banco de Bogota', '1106456634', 'INCAPACITADO'),
(13, 14, 4, 'CC', '1063174945', '1982-08-12', 'Calle 90 # 83-66', 'Usaquen', 'Bogota', '3129854548', 'wilson.jimenez87@gmail.com', 'Soldador', '2023-11-07', 1500000.00, 'CONSIGNACION', 'BBVA', '8616379926', 'ACTIVO'),
(14, 15, 5, 'CC', '1035059710', '1986-01-04', 'Calle 131 # 15-50', 'Engativa', 'Bogota', '3123966966', 'jorge.rojas33@gmail.com', 'Ayudante de Plomeria', '2025-06-14', 1800000.00, 'EFECTIVO', NULL, NULL, 'ACTIVO'),
(15, 16, 1, 'CC', '1072269803', '1982-06-14', 'Calle 171 # 53-42', 'Usaquen', 'Bogota', '3192188405', 'sandra.cadena90@gmail.com', 'Ayudante de Obra', '2025-06-22', 2200000.00, 'CONSIGNACION', 'BBVA', '7473041886', 'ACTIVO'),
(16, 17, 2, 'CC', '1089245317', '1981-10-19', 'Calle 114 # 57-87', 'Engativa', 'Bogota', '3150888017', 'adriana.diaz66@gmail.com', 'Soldador', '2024-05-07', 1800000.00, 'CONSIGNACION', 'Banco Popular', '6679017210', 'ACTIVO'),
(17, 18, 3, 'CC', '1038089166', '1991-02-27', 'Calle 107 # 81-74', 'Engativa', 'Bogota', '3169182797', 'carolina.ortiz92@gmail.com', 'Electricista', '2023-04-05', 2200000.00, 'CONSIGNACION', 'Bancolombia', '5607762160', 'ACTIVO'),
(18, 19, 4, 'CC', '1019806690', '1970-02-25', 'Calle 117 # 18-60', 'Ciudad Bolivar', 'Bogota', '3188054615', 'viviana.martinez97@gmail.com', 'Plomero', '2025-09-15', 1500000.00, 'CONSIGNACION', 'Banco Popular', '4643576871', 'ACTIVO'),
(19, 20, 5, 'CC', '1021361812', '2000-08-09', 'Calle 74 # 31-35', 'Ciudad Bolivar', 'Bogota', '3199811743', 'liliana.ruiz41@gmail.com', 'Electricista', '2025-08-21', 2200000.00, 'CONSIGNACION', 'BBVA', '2889238423', 'ACTIVO'),
(20, 21, 1, 'CC', '1031039390', '1979-12-07', 'Calle 150 # 90-3', 'Usaquen', 'Bogota', '3151410126', 'nicolas.bermudez62@gmail.com', 'Ayudante de Obra', '2024-09-15', 1800000.00, 'CONSIGNACION', 'Bancolombia', '7099469983', 'ACTIVO'),
(21, 22, 2, 'CC', '1056240084', '1984-08-08', 'Calle 174 # 52-93', 'Suba', 'Bogota', '3172238741', 'yolanda.moreno60@gmail.com', 'Soldador', '2023-07-11', 1800000.00, 'EFECTIVO', NULL, NULL, 'ACTIVO'),
(22, 23, 3, 'CC', '1075751409', '1971-02-21', 'Calle 84 # 44-98', 'Usaquen', 'Bogota', '3188986321', 'camilo.romero36@gmail.com', 'Plomero', '2023-01-09', 1500000.00, 'CONSIGNACION', 'BBVA', '6204041308', 'ACTIVO'),
(23, 24, 4, 'CC', '1002601580', '1973-06-08', 'Calle 33 # 61-86', 'Bosa', 'Bogota', '3172399599', 'alejandro.rodriguez73@gmail.com', 'Ayudante de Obra', '2023-04-07', 2200000.00, 'CONSIGNACION', 'Banco Popular', '1654477195', 'ACTIVO'),
(24, 25, 5, 'CC', '1049512272', '1977-03-10', 'Calle 152 # 89-81', 'Engativa', 'Bogota', '3122520277', 'angela.torres14@gmail.com', 'Ayudante de Obra', '2024-10-22', 2000000.00, 'CONSIGNACION', 'Banco de Bogota', '1851819913', 'ACTIVO'),
(25, 26, 1, 'CC', '1046600900', '1997-11-12', 'Calle 46 # 94-67', 'Fontibon', 'Bogota', '3171503856', 'maria.herrera79@gmail.com', 'Ayudante de Obra', '2023-07-27', 2000000.00, 'CONSIGNACION', 'Bancolombia', '5952059278', 'ACTIVO'),
(26, 27, 2, 'CC', '1098116677', '1987-06-28', 'Calle 8 # 64-42', 'Suba', 'Bogota', '3179520597', 'diego.nino63@gmail.com', 'Electricista', '2024-04-25', 1423500.00, 'CONSIGNACION', 'Banco Popular', '6922713963', 'ACTIVO'),
(27, 28, 3, 'CC', '1037535126', '1987-09-01', 'Calle 177 # 61-83', 'Chapinero', 'Bogota', '3180014570', 'hector.salazar58@gmail.com', 'Almacenista de Obra', '2023-12-14', 1500000.00, 'CONSIGNACION', 'Banco Popular', '4256292393', 'ACTIVO'),
(28, 29, 4, 'CC', '1054277800', '1985-05-22', 'Calle 180 # 59-35', 'Fontibon', 'Bogota', '3192850100', 'andres.castro33@gmail.com', 'Ayudante de Plomeria', '2025-09-12', 1650000.00, 'CONSIGNACION', 'Banco Popular', '6715705115', 'ACTIVO'),
(29, 30, 5, 'CC', '1042352128', '1981-04-07', 'Calle 4 # 91-69', 'Suba', 'Bogota', '3116046365', 'mauricio.lopez36@gmail.com', 'Pintor', '2023-04-10', 1650000.00, 'CONSIGNACION', 'BBVA', '6065662867', 'ACTIVO'),
(30, 31, 1, 'CC', '1093605777', '2001-02-28', 'Calle 65 # 62-15', 'Bosa', 'Bogota', '3116948946', 'fernando.cardenas52@gmail.com', 'Oficial de Construccion', '2024-08-15', 2000000.00, 'CONSIGNACION', 'Davivienda', '5146780827', 'ACTIVO'),
(31, 32, 2, 'CC', '1092133896', '1979-03-26', 'Calle 134 # 49-58', 'Chapinero', 'Bogota', '3107195288', 'felipe.munoz39@gmail.com', 'Ayudante de Plomeria', '2023-02-18', 1650000.00, 'CONSIGNACION', 'Banco Popular', '3656086594', 'ACTIVO'),
(32, 33, 3, 'CC', '1083352876', '1976-04-21', 'Calle 20 # 21-1', 'Usaquen', 'Bogota', '3108083974', 'paola.perez58@gmail.com', 'Electricista', '2023-04-06', 1650000.00, 'EFECTIVO', NULL, NULL, 'ACTIVO'),
(33, 34, 4, 'CC', '1031068214', '1988-12-28', 'Calle 51 # 55-15', 'Engativa', 'Bogota', '3138668783', 'ivan.gil83@gmail.com', 'Pintor', '2024-11-19', 1423500.00, 'EFECTIVO', NULL, NULL, 'ACTIVO'),
(34, 35, 5, 'CC', '1008004482', '1989-10-24', 'Calle 129 # 70-64', 'Chapinero', 'Bogota', '3122269779', 'rodrigo.vargas11@gmail.com', 'Ayudante de Plomeria', '2023-08-23', 1650000.00, 'CONSIGNACION', 'Banco de Bogota', '9343730920', 'ACTIVO'),
(35, 36, 1, 'CC', '1043261270', '1986-01-03', 'Calle 72 # 24-75', 'Usaquen', 'Bogota', '3181029073', 'oscar.ramirez82@gmail.com', 'Electricista', '2025-05-19', 2200000.00, 'CONSIGNACION', 'Davivienda', '8093179263', 'ACTIVO'),
(36, 37, 2, 'CC', '1054807553', '1990-11-04', 'Calle 103 # 98-71', 'Kennedy', 'Bogota', '3144735895', 'carlos.sanchez59@gmail.com', 'Maestro de Obra', '2025-08-10', 1650000.00, 'EFECTIVO', NULL, NULL, 'ACTIVO'),
(37, 38, 3, 'CC', '1015558733', '2002-01-22', 'Calle 161 # 57-98', 'Kennedy', 'Bogota', '3154247457', 'natalia.mejia27@gmail.com', 'Almacenista de Obra', '2023-04-17', 1800000.00, 'CONSIGNACION', 'Banco Popular', '8543865915', 'ACTIVO'),
(38, 39, 4, 'CC', '1093717532', '1977-01-21', 'Calle 105 # 12-29', 'Bosa', 'Bogota', '3165056916', 'santiago.garcia60@gmail.com', 'Ayudante de Plomeria', '2024-09-01', 1500000.00, 'EFECTIVO', NULL, NULL, 'ACTIVO'),
(39, 40, 5, 'CC', '1039172995', '1987-07-27', 'Calle 18 # 36-99', 'Usaquen', 'Bogota', '3168299645', 'miguel.alvarez44@gmail.com', 'Pintor', '2024-09-05', 1800000.00, 'CONSIGNACION', 'Davivienda', '4776677517', 'ACTIVO');

INSERT INTO afiliacion (id_empleado, eps, fondo_pension, arl, caja_compensacion, nivel_riesgo_arl) VALUES 
(1, 'Sura EPS', 'Porvenir', 'Positiva ARL', 'Compensar', 1),
(2, 'Sanitas EPS', 'Proteccion', 'Sura ARL', 'Compensar', 1),
(3, 'Nueva EPS', 'Porvenir', 'Sura ARL', 'Compensar', 1),
(4, 'Compensar EPS', 'Proteccion', 'Positiva ARL', 'Colsubsidio', 1),
(5, 'Compensar EPS', 'Colfondos', 'Sura ARL', 'Compensar', 1),
(6, 'Famisanar EPS', 'Porvenir', 'Colmena ARL', 'Compensar', 1),
(7, 'Sanitas EPS', 'Proteccion', 'Colmena ARL', 'Cafam', 1),
(8, 'Compensar EPS', 'Colfondos', 'Positiva ARL', 'Compensar', 1),
(9, 'Sura EPS', 'Porvenir', 'Colmena ARL', 'Cafam', 1),
(10, 'Compensar EPS', 'Colfondos', 'Sura ARL', 'Cafam', 5),
(11, 'Sura EPS', 'Colfondos', 'Sura ARL', 'Cafam', 4),
(12, 'Compensar EPS', 'Porvenir', 'Positiva ARL', 'Compensar', 4),
(13, 'Famisanar EPS', 'Colfondos', 'Sura ARL', 'Compensar', 4),
(14, 'Sura EPS', 'Colpensiones', 'Sura ARL', 'Cafam', 5),
(15, 'Nueva EPS', 'Proteccion', 'Sura ARL', 'Colsubsidio', 5),
(16, 'Sanitas EPS', 'Proteccion', 'Colmena ARL', 'Compensar', 4),
(17, 'Sanitas EPS', 'Colpensiones', 'Positiva ARL', 'Compensar', 5),
(18, 'Sanitas EPS', 'Colpensiones', 'Colmena ARL', 'Colsubsidio', 4),
(19, 'Famisanar EPS', 'Porvenir', 'Sura ARL', 'Compensar', 5),
(20, 'Sura EPS', 'Colfondos', 'Positiva ARL', 'Colsubsidio', 5),
(21, 'Compensar EPS', 'Porvenir', 'Positiva ARL', 'Cafam', 5),
(22, 'Sanitas EPS', 'Colfondos', 'Sura ARL', 'Colsubsidio', 5),
(23, 'Compensar EPS', 'Colpensiones', 'Colmena ARL', 'Colsubsidio', 4),
(24, 'Nueva EPS', 'Porvenir', 'Colmena ARL', 'Compensar', 4),
(25, 'Famisanar EPS', 'Colpensiones', 'Positiva ARL', 'Colsubsidio', 5),
(26, 'Compensar EPS', 'Colfondos', 'Positiva ARL', 'Colsubsidio', 5),
(27, 'Sura EPS', 'Porvenir', 'Positiva ARL', 'Compensar', 4),
(28, 'Compensar EPS', 'Porvenir', 'Colmena ARL', 'Compensar', 5),
(29, 'Sura EPS', 'Porvenir', 'Colmena ARL', 'Colsubsidio', 5),
(30, 'Sanitas EPS', 'Porvenir', 'Colmena ARL', 'Cafam', 5),
(31, 'Famisanar EPS', 'Colpensiones', 'Positiva ARL', 'Cafam', 4),
(32, 'Famisanar EPS', 'Colpensiones', 'Positiva ARL', 'Compensar', 4),
(33, 'Compensar EPS', 'Colfondos', 'Sura ARL', 'Compensar', 4),
(34, 'Famisanar EPS', 'Porvenir', 'Positiva ARL', 'Cafam', 5),
(35, 'Sanitas EPS', 'Porvenir', 'Positiva ARL', 'Colsubsidio', 4),
(36, 'Sura EPS', 'Colfondos', 'Positiva ARL', 'Colsubsidio', 5),
(37, 'Nueva EPS', 'Proteccion', 'Positiva ARL', 'Colsubsidio', 5),
(38, 'Sura EPS', 'Proteccion', 'Positiva ARL', 'Cafam', 4),
(39, 'Famisanar EPS', 'Colfondos', 'Sura ARL', 'Colsubsidio', 4); 

 
INSERT INTO historial_laboral (id_empleado, id_responsable, tipo_movimiento, valor_anterior, valor_nuevo, fecha_movimiento, observacion) VALUES 
(1, 3, 'INGRESO', NULL, 'Analista de Recursos Humanos', '2022-04-03 09:00:00', 'Ingreso del empleado a la empresa'), 
(2, 3, 'INGRESO', NULL, 'Analista de Recursos Humanos', '2022-09-05 09:00:00', 'Ingreso del empleado a la empresa'), 
(3, 2, 'INGRESO', NULL, 'Supervisor de Obra', '2023-06-02 09:00:00', 'Ingreso del empleado a la empresa'), 
(4, 3, 'INGRESO', NULL, 'Supervisor de Obra', '2023-03-15 09:00:00', 'Ingreso del empleado a la empresa'), 
(5, 3, 'INGRESO', NULL, 'Supervisor de Obra', '2023-01-13 09:00:00', 'Ingreso del empleado a la empresa'), 
(6, 3, 'INGRESO', NULL, 'Supervisor de Obra', '2023-01-19 09:00:00', 'Ingreso del empleado a la empresa'), 
(7, 3, 'INGRESO', NULL, 'Supervisor de Obra', '2023-05-03 09:00:00', 'Ingreso del empleado a la empresa'), 
(8, 3, 'INGRESO', NULL, 'Contador de Nomina', '2022-10-19 09:00:00', 'Ingreso del empleado a la empresa'), 
(9, 3, 'INGRESO', NULL, 'Contador de Nomina', '2022-11-27 09:00:00', 'Ingreso del empleado a la empresa'), 
(10, 3, 'INGRESO', NULL, 'Operador de Maquinaria', '2025-08-09 09:00:00', 'Ingreso del empleado a la empresa'), 
(11, 2, 'INGRESO', NULL, 'Ayudante de Obra', '2025-01-27 09:00:00', 'Ingreso del empleado a la empresa'), 
(12, 2, 'INGRESO', NULL, 'Almacenista de Obra', '2023-03-26 09:00:00', 'Ingreso del empleado a la empresa'), 
(13, 3, 'INGRESO', NULL, 'Soldador', '2023-11-07 09:00:00', 'Ingreso del empleado a la empresa'), 
(14, 2, 'INGRESO', NULL, 'Ayudante de Plomeria', '2025-06-14 09:00:00', 'Ingreso del empleado a la empresa'), 
(15, 3, 'INGRESO', NULL, 'Ayudante de Obra', '2025-06-22 09:00:00', 'Ingreso del empleado a la empresa'), 
(16, 2, 'INGRESO', NULL, 'Soldador', '2024-05-07 09:00:00', 'Ingreso del empleado a la empresa'), 
(17, 3, 'INGRESO', NULL, 'Electricista', '2023-04-05 09:00:00', 'Ingreso del empleado a la empresa'), 
(18, 3, 'INGRESO', NULL, 'Plomero', '2025-09-15 09:00:00', 'Ingreso del empleado a la empresa'), 
(19, 3, 'INGRESO', NULL, 'Electricista', '2025-08-21 09:00:00', 'Ingreso del empleado a la empresa'), 
(20, 3, 'INGRESO', NULL, 'Ayudante de Obra', '2024-09-15 09:00:00', 'Ingreso del empleado a la empresa'), 
(21, 2, 'INGRESO', NULL, 'Soldador', '2023-07-11 09:00:00', 'Ingreso del empleado a la empresa'), 
(22, 3, 'INGRESO', NULL, 'Plomero', '2023-01-09 09:00:00', 'Ingreso del empleado a la empresa'), 
(23, 2, 'INGRESO', NULL, 'Ayudante de Obra', '2023-04-07 09:00:00', 'Ingreso del empleado a la empresa'), 
(24, 2, 'INGRESO', NULL, 'Ayudante de Obra', '2024-10-22 09:00:00', 'Ingreso del empleado a la empresa'), 
(25, 3, 'INGRESO', NULL, 'Ayudante de Obra', '2023-07-27 09:00:00', 'Ingreso del empleado a la empresa'), 
(26, 2, 'INGRESO', NULL, 'Electricista', '2024-04-25 09:00:00', 'Ingreso del empleado a la empresa'), 
(27, 3, 'INGRESO', NULL, 'Almacenista de Obra', '2023-12-14 09:00:00', 'Ingreso del empleado a la empresa'), 
(28, 2, 'INGRESO', NULL, 'Ayudante de Plomeria', '2025-09-12 09:00:00', 'Ingreso del empleado a la empresa'), 
(29, 3, 'INGRESO', NULL, 'Pintor', '2023-04-10 09:00:00', 'Ingreso del empleado a la empresa'), 
(30, 2, 'INGRESO', NULL, 'Oficial de Construccion', '2024-08-15 09:00:00', 'Ingreso del empleado a la empresa'), 
(31, 2, 'INGRESO', NULL, 'Ayudante de Plomeria', '2023-02-18 09:00:00', 'Ingreso del empleado a la empresa'), 
(32, 3, 'INGRESO', NULL, 'Electricista', '2023-04-06 09:00:00', 'Ingreso del empleado a la empresa'), 
(33, 2, 'INGRESO', NULL, 'Pintor', '2024-11-19 09:00:00', 'Ingreso del empleado a la empresa'),
(34, 2, 'INGRESO', NULL, 'Ayudante de Plomeria', '2023-08-23 09:00:00', 'Ingreso del empleado a la empresa'), 
(35, 3, 'INGRESO', NULL, 'Electricista', '2025-05-19 09:00:00', 'Ingreso del empleado a la empresa'), 
(36, 3, 'INGRESO', NULL, 'Maestro de Obra', '2025-08-10 09:00:00', 'Ingreso del empleado a la empresa'),
(37, 3, 'INGRESO', NULL, 'Almacenista de Obra', '2023-04-17 09:00:00', 'Ingreso del empleado a la empresa'),
(38, 3, 'INGRESO', NULL, 'Ayudante de Plomeria', '2024-09-01 09:00:00', 'Ingreso del empleado a la empresa'), 
(39, 2, 'INGRESO', NULL, 'Pintor', '2024-09-05 09:00:00', 'Ingreso del empleado a la empresa'), 
(10, 3, 'RETIRO', 'ACTIVO', 'RETIRADO', '2026-05-28 15:00:00', 'Retiro registrado en el sistema'), 
(11, 3, 'RETIRO', 'ACTIVO', 'RETIRADO', '2026-05-11 15:00:00', 'Retiro registrado en el sistema'); 

 
INSERT INTO certificacion (id_empleado, nombre, fecha_emision, fecha_vencimiento, archivo_url, tipo_archivo, estado_certificacion) VALUES 
(33, 'Manejo Defensivo', '2025-12-28', '2026-12-28', '/certificados/emp33_manejo_defensivo.pdf', 'PDF', 'ACTIVO'), 
(35, 'Trabajo Seguro en Alturas', '2025-08-06', '2026-08-06', '/certificados/emp35_trabajo_seguro_en_alturas.pdf', 'PDF', 'ACTIVO'), 
(37, 'Manejo Defensivo', '2025-05-01', '2026-05-01', '/certificados/emp37_manejo_defensivo.pdf', 'PDF', 'PROXIMO_VENCER'), 
(28, 'Trabajo Seguro en Alturas', '2025-06-26', '2026-06-26', '/certificados/emp28_trabajo_seguro_en_alturas.pdf', 'PDF', 'PROXIMO_VENCER'), 
(30, 'Trabajo Seguro en Alturas', '2025-05-12', '2026-05-12', '/certificados/emp30_trabajo_seguro_en_alturas.pdf', 'PDF', 'PROXIMO_VENCER'), 
(14, 'Curso de Soldadura Certificada', '2025-07-05', '2026-07-05', '/certificados/emp14_curso_de_soldadura_certificada.pdf', 'PDF', 'PROXIMO_VENCER'), 
(32, 'Manejo de Maquinaria Pesada', '2025-09-14', '2026-09-14', '/certificados/emp32_manejo_de_maquinaria_pesada.pdf', 'PDF', 'ACTIVO'), 
(15, 'Primeros Auxilios Basico', '2025-11-26', '2026-11-26', '/certificados/emp15_primeros_auxilios_basico.pdf', 'PDF', 'ACTIVO'), 
(20, 'Manejo de Maquinaria Pesada', '2025-03-06', '2026-03-06', '/certificados/emp20_manejo_de_maquinaria_pesada.pdf', 'PDF', 'PROXIMO_VENCER'), 
(22, 'Trabajo Seguro en Alturas', '2025-10-28', '2026-10-28', '/certificados/emp22_trabajo_seguro_en_alturas.pdf', 'PDF', 'ACTIVO'), 
(31, 'Espacios Confinados', '2025-10-22', '2026-10-22', '/certificados/emp31_espacios_confinados.pdf', 'PDF', 'ACTIVO'), 
(39, 'Manejo de Maquinaria Pesada', '2025-08-19', '2026-08-19', '/certificados/emp39_manejo_de_maquinaria_pesada.pdf', 'PDF', 'ACTIVO'), 
(19, 'Manejo de Maquinaria Pesada', '2025-04-15', '2026-04-15', '/certificados/emp19_manejo_de_maquinaria_pesada.pdf', 'PDF', 'PROXIMO_VENCER'), 
(34, 'Manejo Defensivo', '2025-05-15', '2026-05-15', '/certificados/emp34_manejo_defensivo.pdf', 'PDF', 'PROXIMO_VENCER'), 
(25, 'Curso de Soldadura Certificada', '2025-11-01', '2026-11-01', '/certificados/emp25_curso_de_soldadura_certificada.pdf', 'PDF', 'ACTIVO'); 
 

INSERT INTO asistencia (id_empleado, id_creado_por, fecha, hora_entrada, hora_salida, estado_asistencia, observacion, fecha_creacion) VALUES 
(1, 1, '2026-06-22', '07:27:00', '17:00:00', 'RETARDO', 'Llegada tarde por transporte', '2026-06-22 07:05:00'), 
(1, 1, '2026-06-23', '07:28:00', '17:00:00', 'RETARDO', 'Llegada tarde por transporte', '2026-06-23 07:05:00'), 
(1, 1, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(1, 1, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(1, 1, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(2, 1, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(2, 1, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(2, 1, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(2, 1, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(2, 1, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(3, 1, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(3, 1, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(3, 1, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(3, 1, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(3, 1, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(4, 1, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(4, 1, '2026-06-23', '07:00:00', NULL, 'INASISTENCIA', 'No se presento a la obra', '2026-06-23 07:05:00'), 
(4, 1, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(4, 1, '2026-06-25', '07:00:00', NULL, 'INASISTENCIA', 'No se presento a la obra', '2026-06-25 07:05:00'), 
(4, 1, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(5, 1, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(5, 1, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(5, 1, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(5, 1, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(5, 1, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(6, 1, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(6, 1, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(6, 1, '2026-06-24', '07:24:00', '17:00:00', 'RETARDO', 'Llegada tarde por transporte', '2026-06-24 07:05:00'), 
(6, 1, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(6, 1, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(7, 1, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(7, 1, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(7, 1, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(7, 1, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(7, 1, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(8, 1, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(8, 1, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(8, 1, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(8, 1, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(8, 1, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(9, 1, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(9, 1, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(9, 1, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(9, 1, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(9, 1, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(13, 7, '2026-06-22', '07:25:00', '17:00:00', 'RETARDO', 'Llegada tarde por transporte', '2026-06-22 07:05:00'), 
(13, 7, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(13, 7, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(13, 7, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(13, 7, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(14, 8, '2026-06-22', '07:00:00', NULL, 'INASISTENCIA', 'No se presento a la obra', '2026-06-22 07:05:00'), 
(14, 8, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(14, 8, '2026-06-24', '07:22:00', '17:00:00', 'RETARDO', 'Llegada tarde por transporte', '2026-06-24 07:05:00'), 
(14, 8, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(14, 8, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(15, 4, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(15, 4, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'),
(15, 4, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(15, 4, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(15, 4, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(16, 5, '2026-06-22', '07:00:00', NULL, 'INASISTENCIA', 'No se presento a la obra', '2026-06-22 07:05:00'), 
(16, 5, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(16, 5, '2026-06-24', '07:00:00', NULL, 'INASISTENCIA', 'No se presento a la obra', '2026-06-24 07:05:00'), 
(16, 5, '2026-06-25', '07:26:00', '17:00:00', 'RETARDO', 'Llegada tarde por transporte', '2026-06-25 07:05:00'), 
(16, 5, '2026-06-26', '07:00:00', NULL, 'INASISTENCIA', 'No se presento a la obra', '2026-06-26 07:05:00'), 
(17, 6, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(17, 6, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(17, 6, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(17, 6, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(17, 6, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(18, 7, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(18, 7, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(18, 7, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(18, 7, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(18, 7, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(19, 8, '2026-06-22', '07:21:00', '17:00:00', 'RETARDO', 'Llegada tarde por transporte', '2026-06-22 07:05:00'), 
(19, 8, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(19, 8, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(19, 8, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(19, 8, '2026-06-26', '07:25:00', '17:00:00', 'RETARDO', 'Llegada tarde por transporte', '2026-06-26 07:05:00'), 
(20, 4, '2026-06-22', '07:23:00', '17:00:00', 'RETARDO', 'Llegada tarde por transporte', '2026-06-22 07:05:00'), 
(20, 4, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(20, 4, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(20, 4, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(20, 4, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(21, 5, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(21, 5, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(21, 5, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(21, 5, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(21, 5, '2026-06-26', '07:00:00', NULL, 'INASISTENCIA', 'No se presento a la obra', '2026-06-26 07:05:00'), 
(22, 6, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(22, 6, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(22, 6, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(22, 6, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(22, 6, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(23, 7, '2026-06-22', '07:28:00', '17:00:00', 'RETARDO', 'Llegada tarde por transporte', '2026-06-22 07:05:00'), 
(23, 7, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(23, 7, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(23, 7, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(23, 7, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(24, 8, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(24, 8, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(24, 8, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(24, 8, '2026-06-25', '07:00:00', NULL, 'INASISTENCIA', 'No se presento a la obra', '2026-06-25 07:05:00'), 
(24, 8, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(25, 4, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(25, 4, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(25, 4, '2026-06-24', '07:00:00', NULL, 'INASISTENCIA', 'No se presento a la obra', '2026-06-24 07:05:00'), 
(25, 4, '2026-06-25', '07:21:00', '17:00:00', 'RETARDO', 'Llegada tarde por transporte', '2026-06-25 07:05:00'), 
(25, 4, '2026-06-26', '07:00:00', NULL, 'INASISTENCIA', 'No se presento a la obra', '2026-06-26 07:05:00'), 
(26, 5, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(26, 5, '2026-06-23', '07:25:00', '17:00:00', 'RETARDO', 'Llegada tarde por transporte', '2026-06-23 07:05:00'), 
(26, 5, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(26, 5, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(26, 5, '2026-06-26', '07:00:00', NULL, 'INASISTENCIA', 'No se presento a la obra', '2026-06-26 07:05:00'), 
(27, 6, '2026-06-22', '07:27:00', '17:00:00', 'RETARDO', 'Llegada tarde por transporte', '2026-06-22 07:05:00'), 
(27, 6, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(27, 6, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(27, 6, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(27, 6, '2026-06-26', '07:00:00', NULL, 'INASISTENCIA', 'No se presento a la obra', '2026-06-26 07:05:00'), 
(28, 7, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(28, 7, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(28, 7, '2026-06-24', '07:00:00', NULL, 'INASISTENCIA', 'No se presento a la obra', '2026-06-24 07:05:00'), 
(28, 7, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(28, 7, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(29, 8, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(29, 8, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(29, 8, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(29, 8, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(29, 8, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(30, 4, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(30, 4, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(30, 4, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(30, 4, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(30, 4, '2026-06-26', '07:00:00', NULL, 'INASISTENCIA', 'No se presento a la obra', '2026-06-26 07:05:00'), 
(31, 5, '2026-06-22', '07:00:00', NULL, 'INASISTENCIA', 'No se presento a la obra', '2026-06-22 07:05:00'), 
(31, 5, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(31, 5, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'),
(31, 5, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(31, 5, '2026-06-26', '07:22:00', '17:00:00', 'RETARDO', 'Llegada tarde por transporte', '2026-06-26 07:05:00'), 
(32, 6, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(32, 6, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(32, 6, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(32, 6, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(32, 6, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(33, 7, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(33, 7, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'),
(33, 7, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(33, 7, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(33, 7, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(34, 8, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(34, 8, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(34, 8, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(34, 8, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(34, 8, '2026-06-26', '07:20:00', '17:00:00', 'RETARDO', 'Llegada tarde por transporte', '2026-06-26 07:05:00'), 
(35, 4, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(35, 4, '2026-06-23', '07:28:00', '17:00:00', 'RETARDO', 'Llegada tarde por transporte', '2026-06-23 07:05:00'), 
(35, 4, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(35, 4, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(35, 4, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(36, 5, '2026-06-22', '07:00:00', NULL, 'INASISTENCIA', 'No se presento a la obra', '2026-06-22 07:05:00'), 
(36, 5, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(36, 5, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(36, 5, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(36, 5, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(37, 6, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(37, 6, '2026-06-23', '07:25:00', '17:00:00', 'RETARDO', 'Llegada tarde por transporte', '2026-06-23 07:05:00'), 
(37, 6, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(37, 6, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(37, 6, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(38, 7, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(38, 7, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(38, 7, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(38, 7, '2026-06-25', '07:00:00', NULL, 'INASISTENCIA', 'No se presento a la obra', '2026-06-25 07:05:00'), 
(38, 7, '2026-06-26', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-26 07:05:00'), 
(39, 8, '2026-06-22', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-22 07:05:00'), 
(39, 8, '2026-06-23', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-23 07:05:00'), 
(39, 8, '2026-06-24', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-24 07:05:00'), 
(39, 8, '2026-06-25', '07:00:00', '17:00:00', 'PRESENTE', NULL, '2026-06-25 07:05:00'), 
(39, 8, '2026-06-26', '07:28:00', '17:00:00', 'RETARDO', 'Llegada tarde por transporte', '2026-06-26 07:05:00'); 

 
INSERT INTO turno (id_empleado, id_proyecto, id_asignado_por, tipo_turno, hora_inicio, hora_fin, fecha) VALUES 
(15, 7, 7, 'DIURNO', '07:00:00', '17:00:00', '2025-06-23'), 
(15, 7, 7, 'DIURNO', '07:00:00', '17:00:00', '2025-06-29'), 
(15, 7, 7, 'DIURNO', '07:00:00', '17:00:00', '2025-07-05'), 
(15, 7, 7, 'DIURNO', '07:00:00', '17:00:00', '2025-07-11'), 
(15, 7, 7, 'DIURNO', '07:00:00', '17:00:00', '2025-07-18'), 
(15, 7, 7, 'DIURNO', '07:00:00', '17:00:00', '2025-07-24'), 
(15, 7, 7, 'DIURNO', '07:00:00', '17:00:00', '2025-07-30'), 
(15, 7, 7, 'DIURNO', '07:00:00', '17:00:00', '2025-08-05'), 
(15, 7, 7, 'DIURNO', '07:00:00', '17:00:00', '2025-08-12'), 
(15, 7, 7, 'NOCTURNO', '19:00:00', '05:00:00', '2025-08-18'), 
(15, 7, 7, 'DIURNO', '07:00:00', '17:00:00', '2025-08-24'), 
(15, 7, 7, 'DIURNO', '07:00:00', '17:00:00', '2025-08-30'), 
(15, 7, 7, 'DIURNO', '07:00:00', '17:00:00', '2025-09-06'), 
(15, 7, 7, 'DIURNO', '07:00:00', '17:00:00', '2025-09-12'), 
(15, 7, 7, 'DIURNO', '07:00:00', '17:00:00', '2025-09-18'), 
(15, 7, 7, 'DIURNO', '07:00:00', '17:00:00', '2025-09-24'), 
(15, 8, 6, 'DIURNO', '07:00:00', '17:00:00', '2025-10-01'), 
(15, 8, 6, 'DIURNO', '07:00:00', '17:00:00', '2025-10-06'), 
(15, 8, 6, 'DIURNO', '07:00:00', '17:00:00', '2025-10-11'), 
(15, 8, 6, 'DIURNO', '07:00:00', '17:00:00', '2025-10-16'), 
(15, 8, 6, 'DIURNO', '07:00:00', '17:00:00', '2025-10-21'), 
(15, 8, 6, 'DIURNO', '07:00:00', '17:00:00', '2025-10-26'), 
(15, 8, 6, 'DIURNO', '07:00:00', '17:00:00', '2025-10-31'), 
(15, 8, 6, 'DIURNO', '07:00:00', '17:00:00', '2025-11-05'),
(15, 8, 6, 'DIURNO', '07:00:00', '17:00:00', '2025-11-10'), 
(15, 8, 6, 'NOCTURNO', '19:00:00', '05:00:00', '2025-11-15'), 
(15, 8, 6, 'DIURNO', '07:00:00', '17:00:00', '2025-11-20'), 
(15, 8, 6, 'DIURNO', '07:00:00', '17:00:00', '2025-11-25'), 
(15, 8, 6, 'DIURNO', '07:00:00', '17:00:00', '2025-11-30'), 
(15, 8, 6, 'DIURNO', '07:00:00', '17:00:00', '2025-12-05'), 
(15, 8, 6, 'DIURNO', '07:00:00', '17:00:00', '2025-12-10'), 
(15, 8, 6, 'DIURNO', '07:00:00', '17:00:00', '2025-12-15'), 
(15, 6, 8, 'DIURNO', '07:00:00', '17:00:00', '2026-01-15'), 
(15, 6, 8, 'DIURNO', '07:00:00', '17:00:00', '2026-01-19'), 
(15, 6, 8, 'DIURNO', '07:00:00', '17:00:00', '2026-01-23'), 
(15, 6, 8, 'DIURNO', '07:00:00', '17:00:00', '2026-01-27'), 
(15, 6, 8, 'DIURNO', '07:00:00', '17:00:00', '2026-02-01'), 
(15, 6, 8, 'DIURNO', '07:00:00', '17:00:00', '2026-02-05'), 
(15, 6, 8, 'DIURNO', '07:00:00', '17:00:00', '2026-02-09'), 
(15, 6, 8, 'DIURNO', '07:00:00', '17:00:00', '2026-02-14'), 
(15, 6, 8, 'DIURNO', '07:00:00', '17:00:00', '2026-02-18'), 
(15, 6, 8, 'NOCTURNO', '19:00:00', '05:00:00', '2026-02-22'), 
(15, 6, 8, 'DIURNO', '07:00:00', '17:00:00', '2026-02-26'), 
(15, 6, 8, 'DIURNO', '07:00:00', '17:00:00', '2026-03-03'), 
(15, 6, 8, 'DIURNO', '07:00:00', '17:00:00', '2026-03-07'),
(15, 6, 8, 'DIURNO', '07:00:00', '17:00:00', '2026-03-11'), 
(15, 9, 5, 'DIURNO', '07:00:00', '17:00:00', '2026-03-16'), 
(15, 9, 5, 'DIURNO', '07:00:00', '17:00:00', '2026-03-20'), 
(15, 9, 5, 'DIURNO', '07:00:00', '17:00:00', '2026-03-24'), 
(15, 9, 5, 'DIURNO', '07:00:00', '17:00:00', '2026-03-28'), 
(15, 9, 5, 'DIURNO', '07:00:00', '17:00:00', '2026-04-02'), 
(15, 9, 5, 'DIURNO', '07:00:00', '17:00:00', '2026-04-06'), 
(15, 9, 5, 'DIURNO', '07:00:00', '17:00:00', '2026-04-10'), 
(15, 9, 5, 'DIURNO', '07:00:00', '17:00:00', '2026-04-14'), 
(15, 9, 5, 'DIURNO', '07:00:00', '17:00:00', '2026-04-19'), 
(15, 9, 5, 'NOCTURNO', '19:00:00', '05:00:00', '2026-04-23'), 
(15, 9, 5, 'DIURNO', '07:00:00', '17:00:00', '2026-04-27'), 
(15, 9, 5, 'DIURNO', '07:00:00', '17:00:00', '2026-05-01'), 
(15, 10, 4, 'DIURNO', '07:00:00', '17:00:00', '2026-05-06'), 
(15, 10, 4, 'DIURNO', '07:00:00', '17:00:00', '2026-05-10'), 
(15, 10, 4, 'DIURNO', '07:00:00', '17:00:00', '2026-05-15'), 
(15, 10, 4, 'DIURNO', '07:00:00', '17:00:00', '2026-05-20'), 
(15, 10, 4, 'DIURNO', '07:00:00', '17:00:00', '2026-05-25'), 
(15, 10, 4, 'DIURNO', '07:00:00', '17:00:00', '2026-05-30'), 
(15, 10, 4, 'DIURNO', '07:00:00', '17:00:00', '2026-06-03'), 
(15, 10, 4, 'DIURNO', '07:00:00', '17:00:00', '2026-06-08'), 
(15, 10, 4, 'DIURNO', '07:00:00', '17:00:00', '2026-06-13'), 
(15, 10, 4, 'NOCTURNO', '19:00:00', '05:00:00', '2026-06-18'), 
(16, 10, 4, 'NOCTURNO', '19:00:00', '05:00:00', '2026-06-18'); 

 
INSERT INTO novedad (id_empleado, id_aprobado_por, tipo_novedad, fecha_inicio, fecha_fin, total_dias, soporte_url, estado_novedad) VALUES 
(4, 1, 'INCAPACIDAD_ARL', '2026-06-08', '2026-06-08', 1.0, '/soportes/novedad_emp4.pdf', 'APROBADA'), 
(22, 6, 'AUSENCIA_INJUSTIFICADA', '2026-05-04', '2026-05-05', 2.0, NULL, 'APROBADA'), 
(23, 7, 'PERMISO_NO_REMUNERADO', '2026-03-20', '2026-03-22', 3.0, NULL, 'APROBADA'), 
(26, 5, 'INCAPACIDAD_EPS', '2026-04-09', '2026-04-11', 3.0, '/soportes/novedad_emp26.pdf', 'APROBADA'), 
(7, 1, 'PERMISO_REMUNERADO', '2026-05-01', '2026-05-01', 1.0, NULL, 'APROBADA'), 
(38, NULL, 'AUSENCIA_INJUSTIFICADA', '2026-06-03', '2026-06-03', 1.0, NULL, 'PENDIENTE'), 
(20, 4, 'INCAPACIDAD_EPS', '2026-04-13', '2026-04-14', 2.0, '/soportes/novedad_emp20.pdf', 'RECHAZADA'), 
(35, 4, 'PERMISO_REMUNERADO', '2026-04-12', '2026-04-13', 2.0, NULL, 'APROBADA'); 


INSERT INTO hora_extra (id_empleado, id_aprobador, motivo, fecha_inicio, fecha_fin, cantidad_horas, tipo_hora, archivo_soporte_url, estado_he) VALUES 
(37, 3, 'Avance de obra por entrega de cronograma', '2026-05-15', '2026-05-15', 4.0, 'FESTIVA', '/soportes/he_emp37.pdf', 'RECHAZADA'), 
(31, 5, 'Avance de obra por entrega de cronograma', '2026-06-15', '2026-06-15', 3.0, 'DOMINICAL', '/soportes/he_emp31.pdf', 'APROBADA'), 
(32, 3, 'Avance de obra por entrega de cronograma', '2026-06-04', '2026-06-04', 3.0, 'FESTIVA', '/soportes/he_emp32.pdf', 'PENDIENTE'), 
(15, 4, 'Avance de obra por entrega de cronograma', '2026-05-22', '2026-05-22', 4.0, 'DIURNA_DOMINICAL', '/soportes/he_emp15.pdf', 'RECHAZADA'), 
(14, 5, 'Avance de obra por entrega de cronograma', '2026-06-22', '2026-06-22', 3.0, 'DIURNA', '/soportes/he_emp14.pdf', 'APROBADA'), 
(17, 3, 'Avance de obra por entrega de cronograma', '2026-05-20', '2026-05-20', 2.0, 'DIURNA', '/soportes/he_emp17.pdf', 'APROBADA'), 
(18, 4, 'Avance de obra por entrega de cronograma', '2026-05-07', '2026-05-07', 2.0, 'DOMINICAL', '/soportes/he_emp18.pdf', 'APROBADA'), 
(39, 5, 'Avance de obra por entrega de cronograma', '2026-05-04', '2026-05-04', 2.0, 'FESTIVA', '/soportes/he_emp39.pdf', 'RECHAZADA'), 
(35, 4, 'Avance de obra por entrega de cronograma', '2026-04-05', '2026-04-05', 3.0, 'DIURNA_DOMINICAL', '/soportes/he_emp35.pdf', 'APROBADA'), 
(36, 5, 'Avance de obra por entrega de cronograma', '2026-06-18', '2026-06-18', 4.0, 'DOMINICAL', '/soportes/he_emp36.pdf', 'PENDIENTE'); 
 
 
INSERT INTO observacion (id_empleado, id_supervisor, tipo_observacion, descripcion, fecha, escalada, estado_observacion) VALUES 
(25, 1, 'COMENTARIO', 'Buen desempeno general durante la semana de trabajo.', '2026-05-06 15:00:00', FALSE, 'RESUELTA'), 
(36, 2, 'INCIDENCIA', 'Se presento un incidente menor en la zona de trabajo, sin heridos.', '2026-03-14 09:00:00', TRUE, 'RESUELTA'), 
(14, 5, 'RECONOCIMIENTO', 'Se reconoce el cumplimiento sobresaliente de metas en la obra.', '2026-03-13 12:00:00', FALSE, 'RESUELTA'), 
(26, 2, 'INCIDENCIA', 'Se presento un incidente menor en la zona de trabajo, sin heridos.', '2026-04-11 10:00:00', TRUE, 'RESUELTA'), 
(13, 4, 'COMENTARIO', 'Buen desempeno general durante la semana de trabajo.', '2026-04-25 13:00:00', FALSE, 'NOTIFICADA'), 
(27, 3, 'LLAMADO_ATENCION', 'Se llama la atencion por no usar el equipo de proteccion personal.', '2026-04-04 10:00:00', TRUE, 'REGISTRADA'), 
(15, 1, 'LLAMADO_ATENCION', 'Se llama la atencion por no usar el equipo de proteccion personal.', '2026-03-06 15:00:00', FALSE, 'RESUELTA'), 
(23, 4, 'RECONOCIMIENTO', 'Se reconoce el cumplimiento sobresaliente de metas en la obra.', '2026-05-28 13:00:00', FALSE, 'REGISTRADA'), 
(31, 2, 'RECONOCIMIENTO', 'Se reconoce el cumplimiento sobresaliente de metas en la obra.', '2026-03-16 15:00:00', FALSE, 'RESUELTA'), 
(38, 4, 'INCIDENCIA', 'Se presento un incidente menor en la zona de trabajo, sin heridos.', '2026-05-19 08:00:00', FALSE, 'REGISTRADA'), 
(39, 5, 'INCIDENCIA', 'Se presento un incidente menor en la zona de trabajo, sin heridos.', '2026-06-15 08:00:00', TRUE, 'NOTIFICADA'), 
(30, 1, 'COMENTARIO', 'Buen desempeno general durante la semana de trabajo.', '2026-03-20 16:00:00', FALSE, 'NOTIFICADA'), 
(17, 3, 'RECONOCIMIENTO', 'Se reconoce el cumplimiento sobresaliente de metas en la obra.', '2026-03-15 11:00:00', FALSE, 'NOTIFICADA'), 
(37, 3, 'RECONOCIMIENTO', 'Se reconoce el cumplimiento sobresaliente de metas en la obra.', '2026-04-02 15:00:00', FALSE, 'REGISTRADA'), 
(19, 5, 'INCIDENCIA', 'Se presento un incidente menor en la zona de trabajo, sin heridos.', '2026-03-17 10:00:00', TRUE, 'RESUELTA'); 

 
INSERT INTO evaluacion_desempeno (id_empleado, id_evaluador, periodo, puntaje_productividad, puntaje_asistencia, puntaje_calidad, puntaje_general, recomendacion, solicita_capacitacion, fecha_evaluacion) VALUES 
(1, 2, '2026-S1', 3.9, 4.2, 4.0, 4.0, 'Continuar en el cargo actual', FALSE, '2026-06-30 17:00:00'), 
(2, 3, '2026-S1', 3.7, 4.9, 3.8, 4.1, 'Continuar en el cargo actual', FALSE, '2026-06-30 17:00:00'),
(3, 3, '2026-S1', 4.4, 3.6, 4.3, 4.1, 'Continuar en el cargo actual', FALSE, '2026-06-30 17:00:00'), 
(4, 2, '2026-S1', 3.1, 3.6, 4.4, 3.7, 'Se sugiere plan de mejora y seguimiento', TRUE, '2026-06-30 17:00:00'), 
(5, 3, '2026-S1', 3.7, 4.4, 3.3, 3.8, 'Se sugiere plan de mejora y seguimiento', TRUE, '2026-06-30 17:00:00'), 
(6, 3, '2026-S1', 3.3, 4.6, 3.2, 3.7, 'Se sugiere plan de mejora y seguimiento', FALSE, '2026-06-30 17:00:00'), 
(7, 2, '2026-S1', 4.6, 4.5, 4.7, 4.6, 'Continuar en el cargo actual', FALSE, '2026-06-30 17:00:00'), 
(8, 3, '2026-S1', 4.3, 4.1, 3.7, 4.0, 'Continuar en el cargo actual', FALSE, '2026-06-30 17:00:00'), 
(9, 3, '2026-S1', 3.6, 4.9, 3.7, 4.1, 'Continuar en el cargo actual', FALSE, '2026-06-30 17:00:00'), 
(13, 4, '2026-S1', 3.4, 5.0, 3.3, 3.9, 'Se sugiere plan de mejora y seguimiento', TRUE, '2026-06-30 17:00:00'), 
(14, 5, '2026-S1', 4.6, 4.3, 4.1, 4.3, 'Continuar en el cargo actual', FALSE, '2026-06-30 17:00:00'), 
(15, 4, '2026-S1', 4.5, 4.3, 4.3, 4.4, 'Continuar en el cargo actual', FALSE, '2026-06-30 17:00:00'), 
(16, 5, '2026-S1', 4.8, 4.4, 4.2, 4.5, 'Continuar en el cargo actual', FALSE, '2026-06-30 17:00:00'), 
(17, 3, '2026-S1', 3.3, 3.8, 4.4, 3.8, 'Se sugiere plan de mejora y seguimiento', FALSE, '2026-06-30 17:00:00'), 
(18, 4, '2026-S1', 4.8, 4.6, 3.1, 4.2, 'Continuar en el cargo actual', FALSE, '2026-06-30 17:00:00'), 
(19, 5, '2026-S1', 3.7, 4.6, 4.9, 4.4, 'Continuar en el cargo actual', FALSE, '2026-06-30 17:00:00'), 
(20, 4, '2026-S1', 4.2, 4.6, 4.6, 4.5, 'Continuar en el cargo actual', FALSE, '2026-06-30 17:00:00'), 
(21, 5, '2026-S1', 3.5, 3.9, 4.9, 4.1, 'Continuar en el cargo actual', FALSE, '2026-06-30 17:00:00'), 
(22, 3, '2026-S1', 4.6, 4.9, 3.4, 4.3, 'Continuar en el cargo actual', FALSE, '2026-06-30 17:00:00'), 
(23, 4, '2026-S1', 4.4, 4.4, 3.9, 4.2, 'Continuar en el cargo actual', FALSE, '2026-06-30 17:00:00'), 
(24, 5, '2026-S1', 4.5, 4.7, 4.0, 4.4, 'Continuar en el cargo actual', FALSE, '2026-06-30 17:00:00'), 
(25, 4, '2026-S1', 3.8, 3.7, 3.4, 3.6, 'Se sugiere plan de mejora y seguimiento', FALSE, '2026-06-30 17:00:00'), 
(26, 5, '2026-S1', 4.7, 3.6, 4.0, 4.1, 'Continuar en el cargo actual', FALSE, '2026-06-30 17:00:00'), 
(27, 3, '2026-S1', 3.7, 4.9, 4.4, 4.3, 'Continuar en el cargo actual', FALSE, '2026-06-30 17:00:00'), 
(28, 4, '2026-S1', 4.0, 3.7, 3.2, 3.6, 'Se sugiere plan de mejora y seguimiento', TRUE, '2026-06-30 17:00:00'), 
(29, 5, '2026-S1', 3.9, 4.3, 4.7, 4.3, 'Continuar en el cargo actual', FALSE, '2026-06-30 17:00:00'), 
(30, 4, '2026-S1', 3.2, 4.9, 4.6, 4.2, 'Continuar en el cargo actual', FALSE, '2026-06-30 17:00:00'), 
(31, 5, '2026-S1', 4.8, 4.9, 3.8, 4.5, 'Continuar en el cargo actual', FALSE, '2026-06-30 17:00:00'), 
(32, 3, '2026-S1', 3.8, 4.1, 3.8, 3.9, 'Se sugiere plan de mejora y seguimiento', TRUE, '2026-06-30 17:00:00'), 
(33, 4, '2026-S1', 3.4, 4.0, 3.2, 3.5, 'Se sugiere plan de mejora y seguimiento', FALSE, '2026-06-30 17:00:00'), 
(34, 5, '2026-S1', 3.7, 3.7, 3.1, 3.5, 'Se sugiere plan de mejora y seguimiento', FALSE, '2026-06-30 17:00:00'), 
(35, 4, '2026-S1', 3.9, 4.7, 4.5, 4.4, 'Continuar en el cargo actual', FALSE, '2026-06-30 17:00:00'), 
(36, 5, '2026-S1', 3.9, 4.4, 4.8, 4.4, 'Continuar en el cargo actual', FALSE, '2026-06-30 17:00:00'), 
(37, 3, '2026-S1', 3.0, 3.8, 3.3, 3.4, 'Se sugiere plan de mejora y seguimiento', FALSE, '2026-06-30 17:00:00'), 
(38, 4, '2026-S1', 4.2, 4.1, 4.6, 4.3, 'Continuar en el cargo actual', FALSE, '2026-06-30 17:00:00'), 
(39, 5, '2026-S1', 3.5, 3.7, 3.5, 3.6, 'Se sugiere plan de mejora y seguimiento', FALSE, '2026-06-30 17:00:00'); 
 
INSERT INTO asignacion_proyecto (id_proyecto, id_empleado, cuadrilla, rol_en_proyecto, fecha_asignacion, activo) VALUES 
(10, 10, 'Cuadrilla A', 'Operador de Maquinaria', '2025-08-09', FALSE), 
(9, 11, 'Cuadrilla B', 'Ayudante de Obra', '2025-01-27', FALSE), 
(8, 12, 'Cuadrilla C', 'Almacenista de Obra', '2023-03-26', FALSE), 
(7, 13, 'Cuadrilla D', 'Soldador', '2023-11-07', TRUE), 
(6, 14, 'Cuadrilla E', 'Ayudante de Plomeria', '2025-06-14', TRUE), 
(10, 15, 'Cuadrilla A', 'Ayudante de Obra', '2025-06-22', TRUE), 
(9, 16, 'Cuadrilla B', 'Soldador', '2024-05-07', TRUE), 
(8, 17, 'Cuadrilla C', 'Electricista', '2023-04-05', TRUE), 
(7, 18, 'Cuadrilla D', 'Plomero', '2025-09-15', TRUE), 
(6, 19, 'Cuadrilla E', 'Electricista', '2025-08-21', TRUE), 
(10, 20, 'Cuadrilla A', 'Ayudante de Obra', '2024-09-15', TRUE), 
(9, 21, 'Cuadrilla B', 'Soldador', '2023-07-11', TRUE), 
(8, 22, 'Cuadrilla C', 'Plomero', '2023-01-09', TRUE), 
(7, 23, 'Cuadrilla D', 'Ayudante de Obra', '2023-04-07', TRUE), 
(6, 24, 'Cuadrilla E', 'Ayudante de Obra', '2024-10-22', TRUE), 
(10, 25, 'Cuadrilla A', 'Ayudante de Obra', '2023-07-27', TRUE), 
(9, 26, 'Cuadrilla B', 'Electricista', '2024-04-25', TRUE), 
(8, 27, 'Cuadrilla C', 'Almacenista de Obra', '2023-12-14', TRUE),
(7, 28, 'Cuadrilla D', 'Ayudante de Plomeria', '2025-09-12', TRUE), 
(6, 29, 'Cuadrilla E', 'Pintor', '2023-04-10', TRUE), 
(10, 30, 'Cuadrilla A', 'Oficial de Construccion', '2024-08-15', TRUE), 
(9, 31, 'Cuadrilla B', 'Ayudante de Plomeria', '2023-02-18', TRUE), 
(8, 32, 'Cuadrilla C', 'Electricista', '2023-04-06', TRUE), 
(7, 33, 'Cuadrilla D', 'Pintor', '2024-11-19', TRUE), 
(6, 34, 'Cuadrilla E', 'Ayudante de Plomeria', '2023-08-23', TRUE), 
(10, 35, 'Cuadrilla A', 'Electricista', '2025-05-19', TRUE),
(9, 36, 'Cuadrilla B', 'Maestro de Obra', '2025-08-10', TRUE), 
(8, 37, 'Cuadrilla C', 'Almacenista de Obra', '2023-04-17', TRUE), 
(7, 38, 'Cuadrilla D', 'Ayudante de Plomeria', '2024-09-01', TRUE), 
(6, 39, 'Cuadrilla E', 'Pintor', '2024-09-05', TRUE); 
 
 
INSERT INTO configuracion (id_configuracion, smlmv, auxilio_transporte, tope_exoneracion, pct_hora_extra_diurna, pct_hora_extra_nocturna, pct_recargo_nocturno_ordinario, pct_recargo_dominical, pct_hora_extra_diurna_dominical, pct_salud_empleado, pct_pension_empleado, nivel_arl_1, nivel_arl_2, nivel_arl_3, nivel_arl_4, nivel_arl_5, anio_vigencia) VALUES 
(1, 1423500.0, 200000.0, 14235000.00, 0.25, 0.75, 0.35, 0.75, 1.00, 0.04, 0.04, 0.00522, 0.01044, 0.02436, 0.0435, 0.0696, 2026); 

 
INSERT INTO contrato (id_empleado, id_supervisor, id_proyecto, tipo_contrato, salario, fecha_inicio, fecha_fin, obra_asignada, arl, archivo_url, estado_contrato) VALUES 
(1, NULL, NULL, 'TERMINO_INDEFINIDO', 2600000.00, '2022-04-03', NULL, NULL, 'Positiva ARL', '/contratos/contrato_emp1.pdf', 'VIGENTE'), 
(2, NULL, NULL, 'TERMINO_INDEFINIDO', 2600000.00, '2022-09-05', NULL, NULL, 'Sura ARL', '/contratos/contrato_emp2.pdf', 'VIGENTE'), 
(3, NULL, NULL, 'TERMINO_INDEFINIDO', 3400000.00, '2023-06-02', NULL, NULL, 'Sura ARL', '/contratos/contrato_emp3.pdf', 'VIGENTE'), 
(4, NULL, NULL, 'TERMINO_INDEFINIDO', 3200000.00, '2023-03-15', NULL, NULL, 'Positiva ARL', '/contratos/contrato_emp4.pdf', 'VIGENTE'), 
(5, NULL, NULL, 'TERMINO_INDEFINIDO', 3400000.00, '2023-01-13', NULL, NULL, 'Sura ARL', '/contratos/contrato_emp5.pdf', 'VIGENTE'), 
(6, NULL, NULL, 'TERMINO_INDEFINIDO', 3200000.00, '2023-01-19', NULL, NULL, 'Colmena ARL', '/contratos/contrato_emp6.pdf', 'VIGENTE'), 
(7, NULL, NULL, 'TERMINO_INDEFINIDO', 3200000.00, '2023-05-03', NULL, NULL, 'Colmena ARL', '/contratos/contrato_emp7.pdf', 'VIGENTE'), 
(8, NULL, NULL, 'TERMINO_INDEFINIDO', 3200000.00, '2022-10-19', NULL, NULL, 'Positiva ARL', '/contratos/contrato_emp8.pdf', 'VIGENTE'), 
(9, NULL, NULL, 'TERMINO_INDEFINIDO', 3000000.00, '2022-11-27', NULL, NULL, 'Colmena ARL', '/contratos/contrato_emp9.pdf', 'VIGENTE'), 
(10, 1, 10, 'TERMINO_FIJO', 1500000.00, '2025-08-09', '2026-05-16', 'Conjunto Residencial Cedros del Norte', 'Sura ARL', '/contratos/contrato_emp10.pdf', 'LIQUIDADO'), 
(11, 2, 9, 'OBRA_LABOR', 1423500.00, '2025-01-27', '2026-05-28', 'Edificio Torres de Chapinero', 'Sura ARL', '/contratos/contrato_emp11.pdf', 'LIQUIDADO'), 
(12, 3, 8, 'TERMINO_FIJO', 1800000.00, '2023-03-26', '2024-03-26', 'Centro Comercial Plaza Fontibon', 'Positiva ARL', '/contratos/contrato_emp12.pdf', 'PROXIMO_VENCER'), 
(13, 4, 7, 'OBRA_LABOR', 1500000.00, '2023-11-07', '2025-12-20', 'Bodegas Industriales Puente Aranda', 'Sura ARL', '/contratos/contrato_emp13.pdf', 'VIGENTE'), 
(14, 5, 6, 'OBRA_LABOR', 1800000.00, '2025-06-14', '2027-06-30', 'Urbanizacion Villa del Sol', 'Sura ARL', '/contratos/contrato_emp14.pdf', 'VIGENTE'), 
(15, 1, 10, 'OBRA_LABOR', 2200000.00, '2025-06-22', '2026-12-15', 'Conjunto Residencial Cedros del Norte', 'Sura ARL', '/contratos/contrato_emp15.pdf', 'VIGENTE'), 
(16, 2, 9, 'TERMINO_FIJO', 1800000.00, '2024-05-07', '2025-05-07', 'Edificio Torres de Chapinero', 'Colmena ARL', '/contratos/contrato_emp16.pdf', 'PROXIMO_VENCER'), 
(17, 3, 8, 'TERMINO_FIJO', 2200000.00, '2023-04-05', '2024-04-05', 'Centro Comercial Plaza Fontibon', 'Positiva ARL', '/contratos/contrato_emp17.pdf', 'PROXIMO_VENCER'), 
(18, 4, 7, 'OBRA_LABOR', 1500000.00, '2025-09-15', '2025-12-20', 'Bodegas Industriales Puente Aranda', 'Colmena ARL', '/contratos/contrato_emp18.pdf', 'VIGENTE'), 
(19, 5, 6, 'TERMINO_FIJO', 2200000.00, '2025-08-21', '2026-08-21', 'Urbanizacion Villa del Sol', 'Sura ARL', '/contratos/contrato_emp19.pdf', 'VIGENTE'), 
(20, 1, 10, 'OBRA_LABOR', 1800000.00, '2024-09-15', '2026-12-15', 'Conjunto Residencial Cedros del Norte', 'Positiva ARL', '/contratos/contrato_emp20.pdf', 'VIGENTE'), 
(21, 2, 9, 'TERMINO_FIJO', 1800000.00, '2023-07-11', '2024-07-11', 'Edificio Torres de Chapinero', 'Positiva ARL', '/contratos/contrato_emp21.pdf', 'PROXIMO_VENCER'), 
(22, 3, 8, 'OBRA_LABOR', 1500000.00, '2023-01-09', '2026-09-30', 'Centro Comercial Plaza Fontibon', 'Sura ARL', '/contratos/contrato_emp22.pdf', 'VIGENTE'), 
(23, 4, 7, 'OBRA_LABOR', 2200000.00, '2023-04-07', '2025-12-20', 'Bodegas Industriales Puente Aranda', 'Colmena ARL', '/contratos/contrato_emp23.pdf', 'VIGENTE'), 
(24, 5, 6, 'TERMINO_FIJO', 2000000.00, '2024-10-22', '2025-10-22', 'Urbanizacion Villa del Sol', 'Colmena ARL', '/contratos/contrato_emp24.pdf', 'PROXIMO_VENCER'), 
(25, 1, 10, 'OBRA_LABOR', 2000000.00, '2023-07-27', '2026-12-15', 'Conjunto Residencial Cedros del Norte', 'Positiva ARL', '/contratos/contrato_emp25.pdf', 'VIGENTE'), 
(26, 2, 9, 'OBRA_LABOR', 1423500.00, '2024-04-25', '2027-03-01', 'Edificio Torres de Chapinero', 'Positiva ARL', '/contratos/contrato_emp26.pdf', 'VIGENTE'), 
(27, 3, 8, 'TERMINO_FIJO', 1500000.00, '2023-12-14', '2024-12-14', 'Centro Comercial Plaza Fontibon', 'Positiva ARL', '/contratos/contrato_emp27.pdf', 'PROXIMO_VENCER'), 
(28, 4, 7, 'TERMINO_FIJO', 1650000.00, '2025-09-12', '2026-09-12', 'Bodegas Industriales Puente Aranda', 'Colmena ARL', '/contratos/contrato_emp28.pdf', 'VIGENTE'), 
(29, 5, 6, 'OBRA_LABOR', 1650000.00, '2023-04-10', '2027-06-30', 'Urbanizacion Villa del Sol', 'Colmena ARL', '/contratos/contrato_emp29.pdf', 'VIGENTE'), 
(30, 1, 10, 'TERMINO_FIJO', 2000000.00, '2024-08-15', '2025-08-15', 'Conjunto Residencial Cedros del Norte', 'Colmena ARL', '/contratos/contrato_emp30.pdf', 'PROXIMO_VENCER'), 
(31, 2, 9, 'TERMINO_FIJO', 1650000.00, '2023-02-18', '2024-02-18', 'Edificio Torres de Chapinero', 'Positiva ARL', '/contratos/contrato_emp31.pdf', 'PROXIMO_VENCER'), 
(32, 3, 8, 'TERMINO_FIJO', 1650000.00, '2023-04-06', '2024-04-06', 'Centro Comercial Plaza Fontibon', 'Positiva ARL', '/contratos/contrato_emp32.pdf', 'PROXIMO_VENCER'), 
(33, 4, 7, 'OBRA_LABOR', 1423500.00, '2024-11-19', '2025-12-20', 'Bodegas Industriales Puente Aranda', 'Sura ARL', '/contratos/contrato_emp33.pdf', 'VIGENTE'), 
(34, 5, 6, 'TERMINO_FIJO', 1650000.00, '2023-08-23', '2024-08-23', 'Urbanizacion Villa del Sol', 'Positiva ARL', '/contratos/contrato_emp34.pdf', 'PROXIMO_VENCER'), 
(35, 1, 10, 'OBRA_LABOR', 2200000.00, '2025-05-19', '2026-12-15', 'Conjunto Residencial Cedros del Norte', 'Positiva ARL', '/contratos/contrato_emp35.pdf', 'VIGENTE'), 
(36, 2, 9, 'TERMINO_FIJO', 1650000.00, '2025-08-10', '2026-08-10', 'Edificio Torres de Chapinero', 'Positiva ARL', '/contratos/contrato_emp36.pdf', 'VIGENTE'), 
(37, 3, 8, 'OBRA_LABOR', 1800000.00, '2023-04-17', '2026-09-30', 'Centro Comercial Plaza Fontibon', 'Positiva ARL', '/contratos/contrato_emp37.pdf', 'VIGENTE'), 
(38, 4, 7, 'OBRA_LABOR', 1500000.00, '2024-09-01', '2025-12-20', 'Bodegas Industriales Puente Aranda', 'Positiva ARL', '/contratos/contrato_emp38.pdf', 'VIGENTE'), 
(39, 5, 6, 'TERMINO_FIJO', 1800000.00, '2024-09-05', '2025-09-05', 'Urbanizacion Villa del Sol', 'Sura ARL', '/contratos/contrato_emp39.pdf', 'PROXIMO_VENCER'); INSERT INTO prestamo (id_empleado, tipo_obligacion, valor_total, numero_cuotas, valor_cuota, cuotas_pagadas, saldo_pendiente, fecha_inicio, observacion, estado_prestamo) VALUES 
(17, 'EMBARGO_JUDICIAL', 800000.00, 8, 100000.00, 7, 100000.00, '2026-04-21', 'Embargo judicial notificado por autoridad competente', 'ACTIVO'), 
(14, 'EMBARGO_JUDICIAL', 800000.00, 4, 200000.00, 0, 800000.00, '2026-04-02', 'Embargo judicial notificado por autoridad competente', 'ACTIVO'), 
(24, 'PRESTAMO_EMPRESA', 1000000.00, 4, 250000.00, 0, 1000000.00, '2026-01-11', 'Prestamo de libre inversion descontado por nomina', 'ACTIVO'), 
(30, 'EMBARGO_JUDICIAL', 1000000.00, 8, 125000.00, 6, 250000.00, '2026-04-09', 'Embargo judicial notificado por autoridad competente', 'ACTIVO'), 
(23, 'PRESTAMO_EMPRESA', 500000.00, 8, 62500.00, 3, 312500.00, '2026-03-28', 'Prestamo de libre inversion descontado por nomina', 'ACTIVO'); 

 
INSERT INTO viatico (id_empleado, id_proyecto, id_aprobado_por, concepto, valor, fecha, soporte_url, estado_viatico) VALUES 
(37, 8, 6, 'Compra de materiales menores', 120000.00, '2026-06-11', '/soportes/viatico_emp37.pdf', 'APROBADO'), 
(14, 6, 8, 'Compra de materiales menores', 120000.00, '2026-05-26', '/soportes/viatico_emp14.pdf', 'APROBADO'), 
(33, 7, 7, 'Transporte a obra', 120000.00, '2026-03-14', '/soportes/viatico_emp33.pdf', 'APROBADO'), 
(23, 7, 7, 'Alojamiento temporal', 80000.00, '2026-03-03', '/soportes/viatico_emp23.pdf', 'APROBADO'), 
(21, 9, 5, 'Alojamiento temporal', 80000.00, '2026-06-20', '/soportes/viatico_emp21.pdf', 'RECHAZADO'), 
(16, 9, NULL, 'Alimentacion cuadrilla', 120000.00, '2026-05-15', '/soportes/viatico_emp16.pdf', 'PENDIENTE'), 
(24, 6, NULL, 'Alojamiento temporal', 120000.00, '2026-05-21', '/soportes/viatico_emp24.pdf', 'PENDIENTE'), 
(26, 9, 5, 'Transporte a obra', 120000.00, '2026-05-17', '/soportes/viatico_emp26.pdf', 'APROBADO'); 


INSERT INTO liquidacion (id_empleado, id_configuracion, fecha_retiro, motivo_retiro, salario_promedio, dias_trabajados, cesantias, intereses_cesantias, prima, vacaciones, indemnizacion, dotacion_pendiente, total_neto_pagar, notas_adicionales) VALUES 
(10, 1, '2026-05-28', 'RENUNCIA', 1500000.00, 284, 1183333.33, 112022.22, 1183333.33, 591666.67, 0.00, 0.00, 3070355.55, 'Liquidacion final procesada por RRHH'), 
(11, 1, '2026-05-11', 'MUTUO_ACUERDO', 1423500.00, 478, 1890091.67, 301154.61, 1890091.67, 945045.83, 0.00, 0.00, 5026383.78, 'Liquidacion final procesada por RRHH'); 

 
INSERT INTO nomina (id_nomina, id_obra, id_configuracion, id_admin_rrhh, periodo_inicio, periodo_fin, tipo_nomina, fecha_generacion, estado_nomina, total_pagado, cantidad_empleados) VALUES 
(1, NULL, 1, 1, '2026-06-16', '2026-06-30', 'QUINCENAL', '2026-06-30 20:00:00', 'PAGADA', 39897458.33, 37); 

 
INSERT INTO detalle_nomina (id_detalle_nomina, id_nomina, id_empleado, horas_ordinarias, horas_extra, dominicales_festivos, viaticos, incapacidades, descuentos_prestamos, neto_pagar) VALUES 
(1, 1, 1, 88.0, 0.0, 0.0, 50000.00, 0.00, 0.00, 1350000.00), 
(2, 1, 2, 88.0, 0.0, 0.0, 0.00, 0.00, 0.00, 1300000.00), 
(3, 1, 3, 88.0, 0.0, 8.0, 50000.00, 0.00, 0.00, 1948333.33), 
(4, 1, 4, 88.0, 0.0, 0.0, 0.00, 0.00, 0.00, 1600000.00), 
(5, 1, 5, 88.0, 0.0, 0.0, 0.00, 0.00, 0.00, 1700000.00),
(6, 1, 6, 88.0, 0.0, 0.0, 0.00, 0.00, 0.00, 1600000.00), 
(7, 1, 7, 88.0, 0.0, 0.0, 0.00, 0.00, 0.00, 1600000.00), 
(8, 1, 8, 88.0, 0.0, 0.0, 0.00, 0.00, 0.00, 1600000.00),
(9, 1, 9, 88.0, 0.0, 0.0, 0.00, 0.00, 0.00, 1500000.00), 
(10, 1, 13, 88.0, 0.0, 0.0, 50000.00, 0.00, 0.00, 800000.00), 
(11, 1, 14, 88.0, 0.0, 0.0, 0.00, 0.00, 50000.00, 850000.00), 
(12, 1, 15, 88.0, 0.0, 0.0, 0.00, 0.00, 0.00, 1100000.00), 
(13, 1, 16, 88.0, 0.0, 0.0, 0.00, 0.00, 0.00, 900000.00), 
(14, 1, 17, 88.0, 0.0, 0.0, 50000.00, 0.00, 50000.00, 1100000.00), 
(15, 1, 18, 88.0, 0.0, 0.0, 0.00, 0.00, 0.00, 750000.00), 
(16, 1, 19, 88.0, 0.0, 8.0, 0.00, 0.00, 0.00, 1228333.33), 
(17, 1, 20, 88.0, 0.0, 0.0, 0.00, 0.00, 0.00, 900000.00),
(18, 1, 21, 88.0, 4.0, 0.0, 0.00, 0.00, 0.00, 937500.00), 
(19, 1, 22, 88.0, 0.0, 0.0, 0.00, 0.00, 0.00, 750000.00),
(20, 1, 23, 88.0, 0.0, 0.0, 0.00, 0.00, 50000.00, 1050000.00), 
(21, 1, 24, 88.0, 4.0, 0.0, 50000.00, 0.00, 50000.00, 1041666.67), 
(22, 1, 25, 88.0, 0.0, 8.0, 0.00, 0.00, 0.00, 1116666.67), 
(23, 1, 26, 88.0, 0.0, 0.0, 0.00, 0.00, 0.00, 711750.00), 
(24, 1, 27, 88.0, 0.0, 8.0, 0.00, 0.00, 0.00, 837500.00), 
(25, 1, 28, 88.0, 0.0, 0.0, 0.00, 0.00, 0.00, 825000.00), 
(26, 1, 29, 88.0, 0.0, 0.0, 50000.00, 0.00, 0.00, 875000.00), 
(27, 1, 30, 88.0, 0.0, 0.0, 0.00, 0.00, 50000.00, 950000.00), 
(28, 1, 31, 88.0, 0.0, 0.0, 0.00, 0.00, 0.00, 825000.00), 
(29, 1, 32, 88.0, 0.0, 0.0, 50000.00, 0.00, 0.00, 875000.00), 
(30, 1, 33, 88.0, 0.0, 0.0, 0.00, 0.00, 0.00, 711750.00), 
(31, 1, 34, 88.0, 4.0, 8.0, 50000.00, 0.00, 0.00, 1005625.00), 
(32, 1, 35, 88.0, 4.0, 0.0, 0.00, 0.00, 0.00, 1145833.33), 
(33, 1, 36, 88.0, 0.0, 0.0, 0.00, 0.00, 0.00, 825000.00), 
(34, 1, 37, 88.0, 0.0, 0.0, 0.00, 0.00, 0.00, 900000.00), 
(35, 1, 38, 88.0, 0.0, 8.0, 0.00, 0.00, 0.00, 837500.00), 
(36, 1, 39, 88.0, 0.0, 0.0, 50000.00, 0.00, 0.00, 950000.00),
(37, 1, 12, 0.0, 0.0, 0.0, 0.00, 900000.00, 0.00, 900000.00); 

 
INSERT INTO desprendible (id_detalle_nomina, id_empleado, periodo_pago, dias_liquidados, fecha_pago, neto_recibido, archivo_url, firma_digital, estado_descarga) VALUES 
(1, 1, '2026-06-Q2', 15, '2026-06-30', 1350000.00, '/desprendibles/desprendible_1.pdf', 'FIRMA-0001-2026Q2', 'DESCARGADO'), 
(2, 2, '2026-06-Q2', 15, '2026-06-30', 1300000.00, '/desprendibles/desprendible_2.pdf', 'FIRMA-0002-2026Q2', 'GENERADO'), 
(3, 3, '2026-06-Q2', 15, '2026-06-30', 1948333.33, '/desprendibles/desprendible_3.pdf', 'FIRMA-0003-2026Q2', 'GENERADO'), 
(4, 4, '2026-06-Q2', 15, '2026-06-30', 1600000.00, '/desprendibles/desprendible_4.pdf', 'FIRMA-0004-2026Q2', 'DESCARGADO'), 
(5, 5, '2026-06-Q2', 15, '2026-06-30', 1700000.00, '/desprendibles/desprendible_5.pdf', 'FIRMA-0005-2026Q2', 'DESCARGADO'), 
(6, 6, '2026-06-Q2', 15, '2026-06-30', 1600000.00, '/desprendibles/desprendible_6.pdf', 'FIRMA-0006-2026Q2', 'DESCARGADO'), 
(7, 7, '2026-06-Q2', 15, '2026-06-30', 1600000.00, '/desprendibles/desprendible_7.pdf', 'FIRMA-0007-2026Q2', 'DESCARGADO'), 
(8, 8, '2026-06-Q2', 15, '2026-06-30', 1600000.00, '/desprendibles/desprendible_8.pdf', 'FIRMA-0008-2026Q2', 'DESCARGADO'), 
(9, 9, '2026-06-Q2', 15, '2026-06-30', 1500000.00, '/desprendibles/desprendible_9.pdf', 'FIRMA-0009-2026Q2', 'DESCARGADO'), 
(10, 13, '2026-06-Q2', 15, '2026-06-30', 800000.00, '/desprendibles/desprendible_10.pdf', 'FIRMA-0010-2026Q2', 'GENERADO'), 
(11, 14, '2026-06-Q2', 15, '2026-06-30', 850000.00, '/desprendibles/desprendible_11.pdf', 'FIRMA-0011-2026Q2', 'GENERADO'), 
(12, 15, '2026-06-Q2', 15, '2026-06-30', 1100000.00, '/desprendibles/desprendible_12.pdf', 'FIRMA-0012-2026Q2', 'GENERADO'), 
(13, 16, '2026-06-Q2', 15, '2026-06-30', 900000.00, '/desprendibles/desprendible_13.pdf', 'FIRMA-0013-2026Q2', 'GENERADO'), 
(14, 17, '2026-06-Q2', 15, '2026-06-30', 1100000.00, '/desprendibles/desprendible_14.pdf', 'FIRMA-0014-2026Q2', 'DESCARGADO'), 
(15, 18, '2026-06-Q2', 15, '2026-06-30', 750000.00, '/desprendibles/desprendible_15.pdf', 'FIRMA-0015-2026Q2', 'DESCARGADO'), 
(16, 19, '2026-06-Q2', 15, '2026-06-30', 1228333.33, '/desprendibles/desprendible_16.pdf', 'FIRMA-0016-2026Q2', 'DESCARGADO'), 
(17, 20, '2026-06-Q2', 15, '2026-06-30', 900000.00, '/desprendibles/desprendible_17.pdf', 'FIRMA-0017-2026Q2', 'DESCARGADO'), 
(18, 21, '2026-06-Q2', 15, '2026-06-30', 937500.00, '/desprendibles/desprendible_18.pdf', 'FIRMA-0018-2026Q2', 'GENERADO'), 
(19, 22, '2026-06-Q2', 15, '2026-06-30', 750000.00, '/desprendibles/desprendible_19.pdf', 'FIRMA-0019-2026Q2', 'DESCARGADO'), 
(20, 23, '2026-06-Q2', 15, '2026-06-30', 1050000.00, '/desprendibles/desprendible_20.pdf', 'FIRMA-0020-2026Q2', 'DESCARGADO'), 
(21, 24, '2026-06-Q2', 15, '2026-06-30', 1041666.67, '/desprendibles/desprendible_21.pdf', 'FIRMA-0021-2026Q2', 'DESCARGADO'), 
(22, 25, '2026-06-Q2', 15, '2026-06-30', 1116666.67, '/desprendibles/desprendible_22.pdf', 'FIRMA-0022-2026Q2', 'DESCARGADO'), 
(23, 26, '2026-06-Q2', 15, '2026-06-30', 711750.00, '/desprendibles/desprendible_23.pdf', 'FIRMA-0023-2026Q2', 'GENERADO'), 
(24, 27, '2026-06-Q2', 15, '2026-06-30', 837500.00, '/desprendibles/desprendible_24.pdf', 'FIRMA-0024-2026Q2', 'DESCARGADO'), 
(25, 28, '2026-06-Q2', 15, '2026-06-30', 825000.00, '/desprendibles/desprendible_25.pdf', 'FIRMA-0025-2026Q2', 'DESCARGADO'), 
(26, 29, '2026-06-Q2', 15, '2026-06-30', 875000.00, '/desprendibles/desprendible_26.pdf', 'FIRMA-0026-2026Q2', 'DESCARGADO'), 
(27, 30, '2026-06-Q2', 15, '2026-06-30', 950000.00, '/desprendibles/desprendible_27.pdf', 'FIRMA-0027-2026Q2', 'DESCARGADO'), 
(28, 31, '2026-06-Q2', 15, '2026-06-30', 825000.00, '/desprendibles/desprendible_28.pdf', 'FIRMA-0028-2026Q2', 'DESCARGADO'), 
(29, 32, '2026-06-Q2', 15, '2026-06-30', 875000.00, '/desprendibles/desprendible_29.pdf', 'FIRMA-0029-2026Q2', 'DESCARGADO'), 
(30, 33, '2026-06-Q2', 15, '2026-06-30', 711750.00, '/desprendibles/desprendible_30.pdf', 'FIRMA-0030-2026Q2', 'DESCARGADO'), 
(31, 34, '2026-06-Q2', 15, '2026-06-30', 1005625.00, '/desprendibles/desprendible_31.pdf', 'FIRMA-0031-2026Q2', 'GENERADO'), 
(32, 35, '2026-06-Q2', 15, '2026-06-30', 1145833.33, '/desprendibles/desprendible_32.pdf', 'FIRMA-0032-2026Q2', 'DESCARGADO'), 
(33, 36, '2026-06-Q2', 15, '2026-06-30', 825000.00, '/desprendibles/desprendible_33.pdf', 'FIRMA-0033-2026Q2', 'DESCARGADO'), 
(34, 37, '2026-06-Q2', 15, '2026-06-30', 900000.00, '/desprendibles/desprendible_34.pdf', 'FIRMA-0034-2026Q2', 'DESCARGADO'), 
(35, 38, '2026-06-Q2', 15, '2026-06-30', 837500.00, '/desprendibles/desprendible_35.pdf', 'FIRMA-0035-2026Q2', 'DESCARGADO'), 
(36, 39, '2026-06-Q2', 15, '2026-06-30', 950000.00, '/desprendibles/desprendible_36.pdf', 'FIRMA-0036-2026Q2', 'GENERADO'),
(37, 12, '2026-06-Q2', 15, '2026-06-30', 900000.00, '/desprendibles/desprendible_37.pdf', 'FIRMA-0037-2026Q2', 'GENERADO'); 


INSERT INTO pila (id_pila, id_nomina, periodo_inicio, periodo_fin, total_salud, total_pension, total_arl, total_paraestatales, archivo_txt, estado_validacion) VALUES 
(1, 1, '2026-06-16', '2026-06-30', 3033880.00, 3033880.00, 2948303.85, 2034000.00, '/pila/pila_2026_06_q2.txt', 'VALIDADO'); 


INSERT INTO aporte_empleado (id_pila, id_empleado, ibc, dias_cotizados, tarifa_arl, aportes_salud, aportes_pension, aportes_arl, aportes_paraestatales) VALUES 
(1, 1, 2600000.00, 15, 0.00522, 104000.00, 104000.00, 13572.00, 0.00),
(1, 2, 2600000.00, 15, 0.00522, 104000.00, 104000.00, 13572.00, 0.00), 
(1, 3, 3400000.00, 15, 0.00522, 136000.00, 136000.00, 17748.00, 306000.00),
(1, 4, 3200000.00, 15, 0.00522, 128000.00, 128000.00, 16704.00, 288000.00), 
(1, 5, 3400000.00, 15, 0.00522, 136000.00, 136000.00, 17748.00, 306000.00), 
(1, 6, 3200000.00, 15, 0.00522, 128000.00, 128000.00, 16704.00, 288000.00), 
(1, 7, 3200000.00, 15, 0.00522, 128000.00, 128000.00, 16704.00, 288000.00), 
(1, 8, 3200000.00, 15, 0.00522, 128000.00, 128000.00, 16704.00, 288000.00), 
(1, 9, 3000000.00, 15, 0.00522, 120000.00, 120000.00, 15660.00, 270000.00), 
(1, 13, 1500000.00, 15, 0.0435, 60000.00, 60000.00, 65250.00, 0.00), 
(1, 14, 1800000.00, 15, 0.0696, 72000.00, 72000.00, 125280.00, 0.00), 
(1, 15, 2200000.00, 15, 0.0696, 88000.00, 88000.00, 153120.00, 0.00), 
(1, 16, 1800000.00, 15, 0.0435, 72000.00, 72000.00, 78300.00, 0.00), 
(1, 17, 2200000.00, 15, 0.0696, 88000.00, 88000.00, 153120.00, 0.00), 
(1, 18, 1500000.00, 15, 0.0435, 60000.00, 60000.00, 65250.00, 0.00),
(1, 19, 2200000.00, 15, 0.0696, 88000.00, 88000.00, 153120.00, 0.00), 
(1, 20, 1800000.00, 15, 0.0696, 72000.00, 72000.00, 125280.00, 0.00), 
(1, 21, 1800000.00, 15, 0.0696, 72000.00, 72000.00, 125280.00, 0.00), 
(1, 22, 1500000.00, 15, 0.0696, 60000.00, 60000.00, 104400.00, 0.00), 
(1, 23, 2200000.00, 15, 0.0435, 88000.00, 88000.00, 95700.00, 0.00), 
(1, 24, 2000000.00, 15, 0.0435, 80000.00, 80000.00, 87000.00, 0.00), 
(1, 25, 2000000.00, 15, 0.0696, 80000.00, 80000.00, 139200.00, 0.00), 
(1, 26, 1423500.00, 15, 0.0696, 56940.00, 56940.00, 99075.60, 0.00), 
(1, 27, 1500000.00, 15, 0.0435, 60000.00, 60000.00, 65250.00, 0.00), 
(1, 28, 1650000.00, 15, 0.0696, 66000.00, 66000.00, 114840.00, 0.00), 
(1, 29, 1650000.00, 15, 0.0696, 66000.00, 66000.00, 114840.00, 0.00), 
(1, 30, 2000000.00, 15, 0.0696, 80000.00, 80000.00, 139200.00, 0.00), 
(1, 31, 1650000.00, 15, 0.0435, 66000.00, 66000.00, 71775.00, 0.00), 
(1, 32, 1650000.00, 15, 0.0435, 66000.00, 66000.00, 71775.00, 0.00),
(1, 33, 1423500.00, 15, 0.0435, 56940.00, 56940.00, 61922.25, 0.00), 
(1, 34, 1650000.00, 15, 0.0696, 66000.00, 66000.00, 114840.00, 0.00), 
(1, 35, 2200000.00, 15, 0.0435, 88000.00, 88000.00, 95700.00, 0.00), 
(1, 36, 1650000.00, 15, 0.0696, 66000.00, 66000.00, 114840.00, 0.00), 
(1, 37, 1800000.00, 15, 0.0696, 72000.00, 72000.00, 125280.00, 0.00), 
(1, 38, 1500000.00, 15, 0.0435, 60000.00, 60000.00, 65250.00, 0.00), 
(1, 39, 1800000.00, 15, 0.0435, 72000.00, 72000.00, 78300.00, 0.00); 

 
 
INSERT INTO solicitud (id_solicitante, id_gestor_por, tipo_solicitud, descripcion, fecha_creacion, estado_solicitud, respuesta, fecha_respuesta) VALUES 
(5, 2, 'CAMBIO_PROYECTO', 'Solicito traslado a otra obra por cercania con mi vivienda.', '2026-05-24 13:00:00', 'RECHAZADA', 'Solicitud rechazada por no cumplir requisitos.', '2026-05-27 13:00:00'), 
(12, 2, 'CAPACITACION', 'Solicito inscripcion al curso de trabajo en alturas.', '2026-03-11 11:00:00', 'RECHAZADA', 'Solicitud rechazada por no cumplir requisitos.', '2026-03-14 11:00:00'), 
(30, NULL, 'RECURSOS', 'Solicito dotacion de elementos de proteccion personal.', '2026-04-05 09:00:00', 'PENDIENTE', NULL, NULL), 
(28, 2, 'CAMBIO_PROYECTO', 'Solicito traslado a otra obra por cercania con mi vivienda.', '2026-06-28 17:00:00', 'RECHAZADA', 'Solicitud rechazada por no cumplir requisitos.', '2026-06-30 17:00:00'), 
(32, 3, 'CAMBIO_PROYECTO', 'Solicito traslado a otra obra por cercania con mi vivienda.', '2026-05-07 10:00:00', 'RECHAZADA', 'Solicitud rechazada por no cumplir requisitos.', '2026-05-11 10:00:00'), 
(31, 3, 'CAMBIO_PROYECTO', 'Solicito traslado a otra obra por cercania con mi vivienda.', '2026-06-01 09:00:00', 'RECHAZADA', 'Solicitud rechazada por no cumplir requisitos.', '2026-06-03 09:00:00'), 
(15, 3, 'CAMBIO_TURNO', 'Solicito cambio de turno por motivos personales.', '2026-05-02 08:00:00', 'APROBADA', 'Solicitud aprobada segun politica interna.', '2026-05-07 08:00:00'), 
(23, NULL, 'PERMISO', 'Solicito permiso remunerado por cita medica.', '2026-06-10 16:00:00', 'PENDIENTE', NULL, NULL), 
(21, 3, 'CORRECCION_DATOS', 'Solicito corregir el numero de telefono registrado en mi perfil.', '2026-06-05 12:00:00', 'APROBADA', 'Solicitud aprobada segun politica interna.', '2026-06-08 12:00:00'), 
(6, 3, 'CORRECCION_DATOS', 'Solicito corregir el numero de telefono registrado en mi perfil.', '2026-06-02 17:00:00', 'EN_REVISION', NULL, NULL); 

 

 

INSERT INTO notificacion (id_destinatario, tipo, mensaje, fecha_envio, leida) VALUES 
(37, 'ALERTA_CERT', 'Tu certificacion esta proxima a vencer, agenda su renovacion.', '2026-05-07 16:00:00', FALSE), 
(20, 'SOLICITUD_RESPONDIDA', 'Tu solicitud ha sido respondida, revisa el detalle en la plataforma.', '2026-05-02 07:00:00', TRUE), 
(6, 'ALERTA_CERT', 'Tu certificacion esta proxima a vencer, agenda su renovacion.', '2026-06-17 14:00:00', TRUE), 
(26, 'SOLICITUD_RESPONDIDA', 'Tu solicitud ha sido respondida, revisa el detalle en la plataforma.', '2026-05-11 16:00:00', FALSE), 
(34, 'ALERTA_CONTRATO', 'Tu contrato esta proximo a vencer, comunicate con RRHH.', '2026-06-20 18:00:00', FALSE), 
(30, 'SOLICITUD_RESPONDIDA', 'Tu solicitud ha sido respondida, revisa el detalle en la plataforma.', '2026-06-17 15:00:00', FALSE), 
(19, 'SOLICITUD_RESPONDIDA', 'Tu solicitud ha sido respondida, revisa el detalle en la plataforma.', '2026-06-16 07:00:00', FALSE), 
(9, 'ALERTA_CERT', 'Tu certificacion esta proxima a vencer, agenda su renovacion.', '2026-05-14 16:00:00', FALSE), 
(38, 'PAGO_NOMINA', 'Tu comprobante de pago de la quincena ya esta disponible.', '2026-06-09 17:00:00', TRUE), 
(5, 'PAGO_NOMINA', 'Tu comprobante de pago de la quincena ya esta disponible.', '2026-06-06 15:00:00', FALSE), 
(14, 'ALERTA_CONTRATO', 'Tu contrato esta proximo a vencer, comunicate con RRHH.', '2026-05-02 16:00:00', TRUE), 
(13, 'ALERTA_CONTRATO', 'Tu contrato esta proximo a vencer, comunicate con RRHH.', '2026-05-15 12:00:00', FALSE), 
(27, 'ALERTA_CONTRATO', 'Tu contrato esta proximo a vencer, comunicate con RRHH.', '2026-06-23 10:00:00', FALSE), 
(12, 'SOLICITUD_RESPONDIDA', 'Tu solicitud ha sido respondida, revisa el detalle en la plataforma.', '2026-06-28 18:00:00', TRUE), 
(36, 'ALERTA_CONTRATO', 'Tu contrato esta proximo a vencer, comunicate con RRHH.', '2026-05-18 12:00:00', FALSE); 

 

 

INSERT INTO cambio_configuracion (id_configuracion, id_modificado_por, campo, valor_anterior, valor_nuevo, fecha_cambio) VALUES 
(1, 1, 'smlmv', '1300000.00', '1423500.00', '2026-01-05 09:00:00'), 
(1, 1, 'auxilio_transporte', '162000.00', '200000.00', '2026-01-05 09:05:00'); 

------Empledos con usuarios-----
SELECT 
    e.id_empleado,
    u.nombres,
    u.apellidos,
    e.cargo,
    e.salario,
    e.estado_laboral
FROM empleado e
INNER JOIN usuarios u 
    ON e.id_usuario = u.id_usuario;

------Empledos con su afilacion-----
SELECT 
    e.id_empleado,
    u.nombres,
    u.apellidos,
    a.eps,
    a.fondo_pension,
    a.arl,
    a.caja_compensacion,
    a.nivel_riesgo_arl
FROM empleado e
INNER JOIN usuarios u 
    ON e.id_usuario = u.id_usuario
INNER JOIN afiliacion a 
    ON e.id_empleado = a.id_empleado;
	
------Empledos y sus supervisores-----
SELECT 
    e.id_empleado,
    u.nombres AS empleado,
    u.apellidos AS apellido_empleado,
    s.nombres AS supervisor,
    s.apellidos AS apellido_supervisor
FROM empleado e
INNER JOIN usuarios u 
    ON e.id_usuario = u.id_usuario
LEFT JOIN supervisor sp
    ON e.id_supervisor = sp.id_supervisor
LEFT JOIN usuarios s
    ON sp.id_usuario = s.id_usuario;

------protyectos con sus supervisores-----
SELECT 
    p.id_proyecto,
    p.nombre AS proyecto,
    u.nombres AS supervisor,
    u.apellidos AS apellido_supervisor,
    p.estado_proyecto
FROM proyecto p
INNER JOIN supervisor sp
    ON p.id_supervisor = sp.id_supervisor
INNER JOIN usuarios u
    ON sp.id_usuario = u.id_usuario;

------Empleados asignados a proyectos -----
SELECT 
    e.id_empleado,
    u.nombres,
    u.apellidos,
    p.nombre AS proyecto,
    ap.cuadrilla,
    ap.rol_en_proyecto
FROM asignacion_proyecto ap
INNER JOIN empleado e 
    ON ap.id_empleado = e.id_empleado
INNER JOIN usuarios u 
    ON e.id_usuario = u.id_usuario
INNER JOIN proyecto p 
    ON ap.id_proyecto = p.id_proyecto;

------Contrato con empleado y proyecto -----
SELECT 
    c.id_contrato,
    u.nombres,
    u.apellidos,
    c.tipo_contrato,
    c.salario,
    c.fecha_inicio,
    c.fecha_fin,
    p.nombre AS proyecto,
    c.estado_contrato
FROM contrato c
INNER JOIN empleado e 
    ON c.id_empleado = e.id_empleado
INNER JOIN usuarios u 
    ON e.id_usuario = u.id_usuario
LEFT JOIN proyecto p 
    ON c.id_proyecto = p.id_proyecto;
	
------nomina con sus empleados -----
SELECT 
    n.id_nomina,
    n.periodo_inicio,
    n.periodo_fin,
    n.tipo_nomina,
    u.nombres,
    u.apellidos,
    dn.neto_pagar
FROM nomina n
INNER JOIN detalle_nomina dn 
    ON n.id_nomina = dn.id_nomina
INNER JOIN empleado e 
    ON dn.id_empleado = e.id_empleado
INNER JOIN usuarios u 
    ON e.id_usuario = u.id_usuario;

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
-- ============================================================
-- 17. SINCRONIZACION DE SECUENCIAS SERIAL
-- Deja cada secuencia alineada con el mayor ID cargado manualmente.
-- Esto evita colisiones en futuras inserciones realizadas por la API.
SELECT setval(pg_get_serial_sequence('perfil', 'id_perfil'), COALESCE(MAX(id_perfil), 1), MAX(id_perfil) IS NOT NULL) FROM perfil;
SELECT setval(pg_get_serial_sequence('modulo', 'id_modulo'), COALESCE(MAX(id_modulo), 1), MAX(id_modulo) IS NOT NULL) FROM modulo;
SELECT setval(pg_get_serial_sequence('accion', 'id_accion'), COALESCE(MAX(id_accion), 1), MAX(id_accion) IS NOT NULL) FROM accion;
SELECT setval(pg_get_serial_sequence('permiso', 'id_permiso'), COALESCE(MAX(id_permiso), 1), MAX(id_permiso) IS NOT NULL) FROM permiso;
SELECT setval(pg_get_serial_sequence('usuarios', 'id_usuario'), COALESCE(MAX(id_usuario), 1), MAX(id_usuario) IS NOT NULL) FROM usuarios;
SELECT setval(pg_get_serial_sequence('supervisor', 'id_supervisor'), COALESCE(MAX(id_supervisor), 1), MAX(id_supervisor) IS NOT NULL) FROM supervisor;
SELECT setval(pg_get_serial_sequence('contador', 'id_contador'), COALESCE(MAX(id_contador), 1), MAX(id_contador) IS NOT NULL) FROM contador;
SELECT setval(pg_get_serial_sequence('admin_rrhh', 'id_admin_rrhh'), COALESCE(MAX(id_admin_rrhh), 1), MAX(id_admin_rrhh) IS NOT NULL) FROM admin_rrhh;
SELECT setval(pg_get_serial_sequence('proyecto', 'id_proyecto'), COALESCE(MAX(id_proyecto), 1), MAX(id_proyecto) IS NOT NULL) FROM proyecto;
SELECT setval(pg_get_serial_sequence('empleado', 'id_empleado'), COALESCE(MAX(id_empleado), 1), MAX(id_empleado) IS NOT NULL) FROM empleado;
SELECT setval(pg_get_serial_sequence('afiliacion', 'id_afiliacion'), COALESCE(MAX(id_afiliacion), 1), MAX(id_afiliacion) IS NOT NULL) FROM afiliacion;
SELECT setval(pg_get_serial_sequence('historial_laboral', 'id_historial'), COALESCE(MAX(id_historial), 1), MAX(id_historial) IS NOT NULL) FROM historial_laboral;
SELECT setval(pg_get_serial_sequence('certificacion', 'id_certificacion'), COALESCE(MAX(id_certificacion), 1), MAX(id_certificacion) IS NOT NULL) FROM certificacion;
SELECT setval(pg_get_serial_sequence('asistencia', 'id_asistencia'), COALESCE(MAX(id_asistencia), 1), MAX(id_asistencia) IS NOT NULL) FROM asistencia;
SELECT setval(pg_get_serial_sequence('turno', 'id_turno'), COALESCE(MAX(id_turno), 1), MAX(id_turno) IS NOT NULL) FROM turno;
SELECT setval(pg_get_serial_sequence('novedad', 'id_novedad'), COALESCE(MAX(id_novedad), 1), MAX(id_novedad) IS NOT NULL) FROM novedad;
SELECT setval(pg_get_serial_sequence('hora_extra', 'id_hora_extra'), COALESCE(MAX(id_hora_extra), 1), MAX(id_hora_extra) IS NOT NULL) FROM hora_extra;
SELECT setval(pg_get_serial_sequence('observacion', 'id_observacion'), COALESCE(MAX(id_observacion), 1), MAX(id_observacion) IS NOT NULL) FROM observacion;
SELECT setval(pg_get_serial_sequence('evaluacion_desempeno', 'id_evaluacion'), COALESCE(MAX(id_evaluacion), 1), MAX(id_evaluacion) IS NOT NULL) FROM evaluacion_desempeno;
SELECT setval(pg_get_serial_sequence('asignacion_proyecto', 'id_asignacion'), COALESCE(MAX(id_asignacion), 1), MAX(id_asignacion) IS NOT NULL) FROM asignacion_proyecto;
SELECT setval(pg_get_serial_sequence('configuracion', 'id_configuracion'), COALESCE(MAX(id_configuracion), 1), MAX(id_configuracion) IS NOT NULL) FROM configuracion;
SELECT setval(pg_get_serial_sequence('contrato', 'id_contrato'), COALESCE(MAX(id_contrato), 1), MAX(id_contrato) IS NOT NULL) FROM contrato;
SELECT setval(pg_get_serial_sequence('prestamo', 'id_prestamo'), COALESCE(MAX(id_prestamo), 1), MAX(id_prestamo) IS NOT NULL) FROM prestamo;
SELECT setval(pg_get_serial_sequence('viatico', 'id_viatico'), COALESCE(MAX(id_viatico), 1), MAX(id_viatico) IS NOT NULL) FROM viatico;
SELECT setval(pg_get_serial_sequence('liquidacion', 'id_liquidacion'), COALESCE(MAX(id_liquidacion), 1), MAX(id_liquidacion) IS NOT NULL) FROM liquidacion;
SELECT setval(pg_get_serial_sequence('nomina', 'id_nomina'), COALESCE(MAX(id_nomina), 1), MAX(id_nomina) IS NOT NULL) FROM nomina;
SELECT setval(pg_get_serial_sequence('detalle_nomina', 'id_detalle_nomina'), COALESCE(MAX(id_detalle_nomina), 1), MAX(id_detalle_nomina) IS NOT NULL) FROM detalle_nomina;
SELECT setval(pg_get_serial_sequence('desprendible', 'id_desprendible'), COALESCE(MAX(id_desprendible), 1), MAX(id_desprendible) IS NOT NULL) FROM desprendible;
SELECT setval(pg_get_serial_sequence('pila', 'id_pila'), COALESCE(MAX(id_pila), 1), MAX(id_pila) IS NOT NULL) FROM pila;
SELECT setval(pg_get_serial_sequence('aporte_empleado', 'id_aporte'), COALESCE(MAX(id_aporte), 1), MAX(id_aporte) IS NOT NULL) FROM aporte_empleado;
SELECT setval(pg_get_serial_sequence('solicitud', 'id_solicitud'), COALESCE(MAX(id_solicitud), 1), MAX(id_solicitud) IS NOT NULL) FROM solicitud;
SELECT setval(pg_get_serial_sequence('notificacion', 'id_notificacion'), COALESCE(MAX(id_notificacion), 1), MAX(id_notificacion) IS NOT NULL) FROM notificacion;
SELECT setval(pg_get_serial_sequence('cambio_configuracion', 'id_cambio'), COALESCE(MAX(id_cambio), 1), MAX(id_cambio) IS NOT NULL) FROM cambio_configuracion;

COMMIT;
