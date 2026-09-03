--
-- PostgreSQL database dump
--

\restrict HSOaW8GbvdXkP2XokfnbE4PQO5vUBqXStRZa3C7yOSyRJCT8wMncPqF8Mfa5FJJ

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-09-01 14:24:42

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5536 (class 1262 OID 17443)
-- Name: DB_Buydrax; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "DB_Buydrax" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Colombia.1252';


ALTER DATABASE "DB_Buydrax" OWNER TO postgres;

\unrestrict HSOaW8GbvdXkP2XokfnbE4PQO5vUBqXStRZa3C7yOSyRJCT8wMncPqF8Mfa5FJJ
\connect "DB_Buydrax"
\restrict HSOaW8GbvdXkP2XokfnbE4PQO5vUBqXStRZa3C7yOSyRJCT8wMncPqF8Mfa5FJJ

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 929 (class 1247 OID 17482)
-- Name: estado_asistencia_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_asistencia_enum AS ENUM (
    'PRESENTE',
    'RETARDO',
    'INASISTENCIA'
);


ALTER TYPE public.estado_asistencia_enum OWNER TO postgres;

--
-- TOC entry 926 (class 1247 OID 17474)
-- Name: estado_certificacion_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_certificacion_enum AS ENUM (
    'ACTIVO',
    'PROXIMO_VENCER',
    'VENCIDO'
);


ALTER TYPE public.estado_certificacion_enum OWNER TO postgres;

--
-- TOC entry 950 (class 1247 OID 17548)
-- Name: estado_contrato_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_contrato_enum AS ENUM (
    'VIGENTE',
    'PROXIMO_VENCER',
    'FINALIZADO',
    'LIQUIDADO'
);


ALTER TYPE public.estado_contrato_enum OWNER TO postgres;

--
-- TOC entry 971 (class 1247 OID 17606)
-- Name: estado_descarga_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_descarga_enum AS ENUM (
    'GENERADO',
    'DESCARGADO'
);


ALTER TYPE public.estado_descarga_enum OWNER TO postgres;

--
-- TOC entry 941 (class 1247 OID 17522)
-- Name: estado_he_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_he_enum AS ENUM (
    'PENDIENTE',
    'APROBADA',
    'RECHAZADA'
);


ALTER TYPE public.estado_he_enum OWNER TO postgres;

--
-- TOC entry 920 (class 1247 OID 17452)
-- Name: estado_laboral_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_laboral_enum AS ENUM (
    'ACTIVO',
    'INCAPACITADO',
    'RETIRADO'
);


ALTER TYPE public.estado_laboral_enum OWNER TO postgres;

--
-- TOC entry 968 (class 1247 OID 17598)
-- Name: estado_nomina_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_nomina_enum AS ENUM (
    'BORRADOR',
    'APROBADA',
    'PAGADA'
);


ALTER TYPE public.estado_nomina_enum OWNER TO postgres;

--
-- TOC entry 935 (class 1247 OID 17502)
-- Name: estado_novedad_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_novedad_enum AS ENUM (
    'PENDIENTE',
    'APROBADA',
    'RECHAZADA'
);


ALTER TYPE public.estado_novedad_enum OWNER TO postgres;

--
-- TOC entry 947 (class 1247 OID 17540)
-- Name: estado_observacion_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_observacion_enum AS ENUM (
    'REGISTRADA',
    'NOTIFICADA',
    'RESUELTA'
);


ALTER TYPE public.estado_observacion_enum OWNER TO postgres;

--
-- TOC entry 956 (class 1247 OID 17566)
-- Name: estado_prestamo_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_prestamo_enum AS ENUM (
    'ACTIVO',
    'TERMINADO',
    'SUSPENDIDO'
);


ALTER TYPE public.estado_prestamo_enum OWNER TO postgres;

--
-- TOC entry 917 (class 1247 OID 17445)
-- Name: estado_proyecto_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_proyecto_enum AS ENUM (
    'ACTIVO',
    'FINALIZADO',
    'SUSPENDIDO'
);


ALTER TYPE public.estado_proyecto_enum OWNER TO postgres;

--
-- TOC entry 980 (class 1247 OID 17634)
-- Name: estado_solicitud_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_solicitud_enum AS ENUM (
    'PENDIENTE',
    'EN_REVISION',
    'APROBADA',
    'RECHAZADA'
);


ALTER TYPE public.estado_solicitud_enum OWNER TO postgres;

--
-- TOC entry 974 (class 1247 OID 17612)
-- Name: estado_validacion_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_validacion_enum AS ENUM (
    'PENDIENTE',
    'VALIDADO',
    'CON_ERRORES'
);


ALTER TYPE public.estado_validacion_enum OWNER TO postgres;

--
-- TOC entry 959 (class 1247 OID 17574)
-- Name: estado_viatico_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_viatico_enum AS ENUM (
    'PENDIENTE',
    'APROBADO',
    'RECHAZADO'
);


ALTER TYPE public.estado_viatico_enum OWNER TO postgres;

--
-- TOC entry 962 (class 1247 OID 17582)
-- Name: motivo_retiro_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.motivo_retiro_enum AS ENUM (
    'RENUNCIA',
    'DESPIDO_JUSTA_CAUSA',
    'DESPIDO_SIN_CAUSA',
    'MUTUO_ACUERDO'
);


ALTER TYPE public.motivo_retiro_enum OWNER TO postgres;

--
-- TOC entry 938 (class 1247 OID 17510)
-- Name: tipo_hora_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_hora_enum AS ENUM (
    'DIURNA',
    'NOCTURNA',
    'DOMINICAL',
    'FESTIVA',
    'DIURNA_DOMINICAL'
);


ALTER TYPE public.tipo_hora_enum OWNER TO postgres;

--
-- TOC entry 923 (class 1247 OID 17460)
-- Name: tipo_movimiento_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_movimiento_enum AS ENUM (
    'CAMBIO_CARGO',
    'CAMBIO_OBRA',
    'CAMBIO_SUPERVISOR',
    'CAMBIO_ESTADO',
    'INGRESO',
    'RETIRO'
);


ALTER TYPE public.tipo_movimiento_enum OWNER TO postgres;

--
-- TOC entry 965 (class 1247 OID 17592)
-- Name: tipo_nomina_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_nomina_enum AS ENUM (
    'QUINCENAL',
    'MENSUAL'
);


ALTER TYPE public.tipo_nomina_enum OWNER TO postgres;

--
-- TOC entry 983 (class 1247 OID 17644)
-- Name: tipo_notificacion_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_notificacion_enum AS ENUM (
    'PAGO_NOMINA',
    'ALERTA_CONTRATO',
    'ALERTA_CERT',
    'CAMBIO_TURNO',
    'SOLICITUD_RESPONDIDA'
);


ALTER TYPE public.tipo_notificacion_enum OWNER TO postgres;

--
-- TOC entry 932 (class 1247 OID 17490)
-- Name: tipo_novedad_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_novedad_enum AS ENUM (
    'INCAPACIDAD_EPS',
    'INCAPACIDAD_ARL',
    'PERMISO_REMUNERADO',
    'PERMISO_NO_REMUNERADO',
    'AUSENCIA_INJUSTIFICADA'
);


ALTER TYPE public.tipo_novedad_enum OWNER TO postgres;

--
-- TOC entry 953 (class 1247 OID 17558)
-- Name: tipo_obligacion_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_obligacion_enum AS ENUM (
    'PRESTAMO_EMPRESA',
    'ANTICIPO',
    'EMBARGO_JUDICIAL'
);


ALTER TYPE public.tipo_obligacion_enum OWNER TO postgres;

--
-- TOC entry 944 (class 1247 OID 17530)
-- Name: tipo_observacion_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_observacion_enum AS ENUM (
    'COMENTARIO',
    'LLAMADO_ATENCION',
    'INCIDENCIA',
    'RECONOCIMIENTO'
);


ALTER TYPE public.tipo_observacion_enum OWNER TO postgres;

--
-- TOC entry 977 (class 1247 OID 17620)
-- Name: tipo_solicitud_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_solicitud_enum AS ENUM (
    'CORRECCION_DATOS',
    'CAMBIO_TURNO',
    'CAMBIO_PROYECTO',
    'RECURSOS',
    'CAPACITACION',
    'PERMISO'
);


ALTER TYPE public.tipo_solicitud_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 17678)
-- Name: accion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accion (
    id_accion integer NOT NULL,
    nombre character varying(30) NOT NULL,
    descripcion character varying(150)
);


ALTER TABLE public.accion OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 17677)
-- Name: accion_id_accion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.accion_id_accion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.accion_id_accion_seq OWNER TO postgres;

--
-- TOC entry 5537 (class 0 OID 0)
-- Dependencies: 223
-- Name: accion_id_accion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.accion_id_accion_seq OWNED BY public.accion.id_accion;


--
-- TOC entry 234 (class 1259 OID 17777)
-- Name: admin_rrhh; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_rrhh (
    id_admin_rrhh integer NOT NULL,
    id_usuario integer NOT NULL,
    area_responsable character varying(60) NOT NULL
);


ALTER TABLE public.admin_rrhh OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 17776)
-- Name: admin_rrhh_id_admin_rrhh_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_rrhh_id_admin_rrhh_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_rrhh_id_admin_rrhh_seq OWNER TO postgres;

--
-- TOC entry 5538 (class 0 OID 0)
-- Dependencies: 233
-- Name: admin_rrhh_id_admin_rrhh_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_rrhh_id_admin_rrhh_seq OWNED BY public.admin_rrhh.id_admin_rrhh;


--
-- TOC entry 240 (class 1259 OID 17855)
-- Name: afiliacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.afiliacion (
    id_afiliacion integer NOT NULL,
    id_empleado integer NOT NULL,
    eps character varying(60) NOT NULL,
    fondo_pension character varying(60) NOT NULL,
    arl character varying(60) NOT NULL,
    caja_compensacion character varying(60) NOT NULL,
    nivel_riesgo_arl integer DEFAULT 1 NOT NULL,
    fecha_afiliacion date DEFAULT CURRENT_DATE,
    estado_afiliacion character varying(20) DEFAULT 'ACTIVO'::character varying NOT NULL,
    CONSTRAINT ck_afiliacion_nivel_arl CHECK (((nivel_riesgo_arl >= 1) AND (nivel_riesgo_arl <= 5)))
);


ALTER TABLE public.afiliacion OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 17854)
-- Name: afiliacion_id_afiliacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.afiliacion_id_afiliacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.afiliacion_id_afiliacion_seq OWNER TO postgres;

--
-- TOC entry 5539 (class 0 OID 0)
-- Dependencies: 239
-- Name: afiliacion_id_afiliacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.afiliacion_id_afiliacion_seq OWNED BY public.afiliacion.id_afiliacion;


--
-- TOC entry 278 (class 1259 OID 18398)
-- Name: aporte_empleado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.aporte_empleado (
    id_aporte integer NOT NULL,
    id_pila integer NOT NULL,
    id_empleado integer NOT NULL,
    ibc numeric(12,2) NOT NULL,
    dias_cotizados integer NOT NULL,
    tarifa_arl double precision NOT NULL,
    aportes_salud numeric(10,2) NOT NULL,
    aportes_pension numeric(10,2) NOT NULL,
    aportes_arl numeric(10,2) NOT NULL,
    aportes_paraestatales numeric(10,2) NOT NULL,
    CONSTRAINT ck_aporte_dias_cotizados CHECK (((dias_cotizados >= 1) AND (dias_cotizados <= 30)))
);


ALTER TABLE public.aporte_empleado OWNER TO postgres;

--
-- TOC entry 277 (class 1259 OID 18397)
-- Name: aporte_empleado_id_aporte_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.aporte_empleado_id_aporte_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.aporte_empleado_id_aporte_seq OWNER TO postgres;

--
-- TOC entry 5540 (class 0 OID 0)
-- Dependencies: 277
-- Name: aporte_empleado_id_aporte_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.aporte_empleado_id_aporte_seq OWNED BY public.aporte_empleado.id_aporte;


--
-- TOC entry 258 (class 1259 OID 18096)
-- Name: asignacion_proyecto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asignacion_proyecto (
    id_asignacion integer NOT NULL,
    id_proyecto integer NOT NULL,
    id_empleado integer NOT NULL,
    cuadrilla character varying(60) NOT NULL,
    rol_en_proyecto character varying(60) NOT NULL,
    fecha_asignacion date NOT NULL,
    activo boolean DEFAULT true NOT NULL
);


ALTER TABLE public.asignacion_proyecto OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 18095)
-- Name: asignacion_proyecto_id_asignacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asignacion_proyecto_id_asignacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asignacion_proyecto_id_asignacion_seq OWNER TO postgres;

--
-- TOC entry 5541 (class 0 OID 0)
-- Dependencies: 257
-- Name: asignacion_proyecto_id_asignacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asignacion_proyecto_id_asignacion_seq OWNED BY public.asignacion_proyecto.id_asignacion;


--
-- TOC entry 246 (class 1259 OID 17925)
-- Name: asistencia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asistencia (
    id_asistencia integer NOT NULL,
    id_empleado integer NOT NULL,
    id_creado_por integer NOT NULL,
    fecha date NOT NULL,
    hora_entrada time without time zone NOT NULL,
    hora_salida time without time zone,
    estado_asistencia public.estado_asistencia_enum NOT NULL,
    observacion character varying(255),
    fecha_creacion timestamp without time zone NOT NULL
);


ALTER TABLE public.asistencia OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 17924)
-- Name: asistencia_id_asistencia_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asistencia_id_asistencia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asistencia_id_asistencia_seq OWNER TO postgres;

--
-- TOC entry 5542 (class 0 OID 0)
-- Dependencies: 245
-- Name: asistencia_id_asistencia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asistencia_id_asistencia_seq OWNED BY public.asistencia.id_asistencia;


--
-- TOC entry 284 (class 1259 OID 18475)
-- Name: cambio_configuracion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cambio_configuracion (
    id_cambio integer NOT NULL,
    id_configuracion integer NOT NULL,
    id_modificado_por integer NOT NULL,
    campo character varying(60) NOT NULL,
    valor_anterior character varying(100) NOT NULL,
    valor_nuevo character varying(100) NOT NULL,
    fecha_cambio timestamp without time zone NOT NULL
);


ALTER TABLE public.cambio_configuracion OWNER TO postgres;

--
-- TOC entry 283 (class 1259 OID 18474)
-- Name: cambio_configuracion_id_cambio_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cambio_configuracion_id_cambio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cambio_configuracion_id_cambio_seq OWNER TO postgres;

--
-- TOC entry 5543 (class 0 OID 0)
-- Dependencies: 283
-- Name: cambio_configuracion_id_cambio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cambio_configuracion_id_cambio_seq OWNED BY public.cambio_configuracion.id_cambio;


--
-- TOC entry 244 (class 1259 OID 17904)
-- Name: certificacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.certificacion (
    id_certificacion integer NOT NULL,
    id_empleado integer NOT NULL,
    nombre character varying(100) NOT NULL,
    fecha_emision date NOT NULL,
    fecha_vencimiento date NOT NULL,
    archivo_url character varying(255) NOT NULL,
    tipo_archivo character varying(10) NOT NULL,
    estado_certificacion public.estado_certificacion_enum DEFAULT 'ACTIVO'::public.estado_certificacion_enum NOT NULL
);


ALTER TABLE public.certificacion OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 17903)
-- Name: certificacion_id_certificacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.certificacion_id_certificacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.certificacion_id_certificacion_seq OWNER TO postgres;

--
-- TOC entry 5544 (class 0 OID 0)
-- Dependencies: 243
-- Name: certificacion_id_certificacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.certificacion_id_certificacion_seq OWNED BY public.certificacion.id_certificacion;


--
-- TOC entry 260 (class 1259 OID 18123)
-- Name: configuracion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.configuracion (
    id_configuracion integer NOT NULL,
    smlmv numeric(12,2) NOT NULL,
    auxilio_transporte numeric(10,2) NOT NULL,
    tope_exoneracion numeric(12,2) NOT NULL,
    pct_hora_extra_diurna double precision DEFAULT 0.25 NOT NULL,
    pct_hora_extra_nocturna double precision DEFAULT 0.75 NOT NULL,
    pct_recargo_nocturno_ordinario double precision DEFAULT 0.35 NOT NULL,
    pct_recargo_dominical double precision DEFAULT 0.75 NOT NULL,
    pct_hora_extra_diurna_dominical double precision DEFAULT 1.00 NOT NULL,
    pct_salud_empleado double precision NOT NULL,
    pct_pension_empleado double precision NOT NULL,
    nivel_arl_1 double precision NOT NULL,
    nivel_arl_2 double precision NOT NULL,
    nivel_arl_3 double precision NOT NULL,
    nivel_arl_4 double precision NOT NULL,
    nivel_arl_5 double precision NOT NULL,
    anio_vigencia integer NOT NULL
);


ALTER TABLE public.configuracion OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 18122)
-- Name: configuracion_id_configuracion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.configuracion_id_configuracion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.configuracion_id_configuracion_seq OWNER TO postgres;

--
-- TOC entry 5545 (class 0 OID 0)
-- Dependencies: 259
-- Name: configuracion_id_configuracion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.configuracion_id_configuracion_seq OWNED BY public.configuracion.id_configuracion;


--
-- TOC entry 232 (class 1259 OID 17759)
-- Name: contador; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contador (
    id_contador integer NOT NULL,
    id_usuario integer NOT NULL,
    numero_tarjeta_profesional character varying(30) NOT NULL,
    area_nomina character varying(30) NOT NULL
);


ALTER TABLE public.contador OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 17758)
-- Name: contador_id_contador_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contador_id_contador_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contador_id_contador_seq OWNER TO postgres;

--
-- TOC entry 5546 (class 0 OID 0)
-- Dependencies: 231
-- Name: contador_id_contador_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contador_id_contador_seq OWNED BY public.contador.id_contador;


--
-- TOC entry 262 (class 1259 OID 18154)
-- Name: contrato; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contrato (
    id_contrato integer NOT NULL,
    id_empleado integer NOT NULL,
    id_supervisor integer,
    id_proyecto integer,
    tipo_contrato character varying(30) NOT NULL,
    salario numeric(12,2) NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date,
    obra_asignada character varying(100),
    arl character varying(60) NOT NULL,
    archivo_url character varying(255),
    estado_contrato public.estado_contrato_enum DEFAULT 'VIGENTE'::public.estado_contrato_enum NOT NULL,
    CONSTRAINT ck_contrato_fechas CHECK (((fecha_fin IS NULL) OR (fecha_inicio < fecha_fin)))
);


ALTER TABLE public.contrato OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 18153)
-- Name: contrato_id_contrato_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contrato_id_contrato_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contrato_id_contrato_seq OWNER TO postgres;

--
-- TOC entry 5547 (class 0 OID 0)
-- Dependencies: 261
-- Name: contrato_id_contrato_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contrato_id_contrato_seq OWNED BY public.contrato.id_contrato;


--
-- TOC entry 274 (class 1259 OID 18342)
-- Name: desprendible; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.desprendible (
    id_desprendible integer NOT NULL,
    id_detalle_nomina integer NOT NULL,
    id_empleado integer NOT NULL,
    periodo_pago character varying(30) NOT NULL,
    dias_liquidados integer NOT NULL,
    fecha_pago date NOT NULL,
    neto_recibido numeric(12,2) NOT NULL,
    archivo_url character varying(255) NOT NULL,
    firma_digital character varying(255) NOT NULL,
    estado_descarga public.estado_descarga_enum DEFAULT 'GENERADO'::public.estado_descarga_enum NOT NULL
);


ALTER TABLE public.desprendible OWNER TO postgres;

--
-- TOC entry 273 (class 1259 OID 18341)
-- Name: desprendible_id_desprendible_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.desprendible_id_desprendible_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.desprendible_id_desprendible_seq OWNER TO postgres;

--
-- TOC entry 5548 (class 0 OID 0)
-- Dependencies: 273
-- Name: desprendible_id_desprendible_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.desprendible_id_desprendible_seq OWNED BY public.desprendible.id_desprendible;


--
-- TOC entry 272 (class 1259 OID 18307)
-- Name: detalle_nomina; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalle_nomina (
    id_detalle_nomina integer NOT NULL,
    id_nomina integer NOT NULL,
    id_empleado integer NOT NULL,
    horas_ordinarias double precision DEFAULT 0 NOT NULL,
    horas_extra double precision DEFAULT 0 NOT NULL,
    dominicales_festivos double precision DEFAULT 0 NOT NULL,
    viaticos numeric(10,2) DEFAULT 0 NOT NULL,
    incapacidades numeric(10,2) DEFAULT 0 NOT NULL,
    descuentos_prestamos numeric(10,2) DEFAULT 0 NOT NULL,
    neto_pagar numeric(12,2) NOT NULL
);


ALTER TABLE public.detalle_nomina OWNER TO postgres;

--
-- TOC entry 271 (class 1259 OID 18306)
-- Name: detalle_nomina_id_detalle_nomina_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detalle_nomina_id_detalle_nomina_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detalle_nomina_id_detalle_nomina_seq OWNER TO postgres;

--
-- TOC entry 5549 (class 0 OID 0)
-- Dependencies: 271
-- Name: detalle_nomina_id_detalle_nomina_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detalle_nomina_id_detalle_nomina_seq OWNED BY public.detalle_nomina.id_detalle_nomina;


--
-- TOC entry 238 (class 1259 OID 17817)
-- Name: empleado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empleado (
    id_empleado integer NOT NULL,
    id_usuario integer NOT NULL,
    id_supervisor integer,
    tipo_documento character varying(10) NOT NULL,
    numero_documento character varying(20) NOT NULL,
    fecha_nacimiento date NOT NULL,
    calle character varying(100) NOT NULL,
    barrio character varying(60),
    ciudad character varying(60) NOT NULL,
    telefono character varying(15) NOT NULL,
    correo_personal character varying(100),
    cargo character varying(60) NOT NULL,
    fecha_ingreso date NOT NULL,
    salario numeric(12,2) NOT NULL,
    forma_pago character varying(20) NOT NULL,
    banco character varying(60),
    numero_cuenta character varying(30),
    estado_laboral public.estado_laboral_enum DEFAULT 'ACTIVO'::public.estado_laboral_enum NOT NULL,
    CONSTRAINT ck_empleado_salario_no_negativo CHECK ((salario >= (0)::numeric))
);


ALTER TABLE public.empleado OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 17816)
-- Name: empleado_id_empleado_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.empleado_id_empleado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.empleado_id_empleado_seq OWNER TO postgres;

--
-- TOC entry 5550 (class 0 OID 0)
-- Dependencies: 237
-- Name: empleado_id_empleado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.empleado_id_empleado_seq OWNED BY public.empleado.id_empleado;


--
-- TOC entry 256 (class 1259 OID 18066)
-- Name: evaluacion_desempeno; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evaluacion_desempeno (
    id_evaluacion integer NOT NULL,
    id_empleado integer NOT NULL,
    id_evaluador integer NOT NULL,
    periodo character varying(20) NOT NULL,
    puntaje_productividad double precision NOT NULL,
    puntaje_asistencia double precision NOT NULL,
    puntaje_calidad double precision NOT NULL,
    puntaje_general double precision NOT NULL,
    recomendacion text,
    solicita_capacitacion boolean DEFAULT false NOT NULL,
    fecha_evaluacion timestamp without time zone NOT NULL
);


ALTER TABLE public.evaluacion_desempeno OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 18065)
-- Name: evaluacion_desempeno_id_evaluacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.evaluacion_desempeno_id_evaluacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.evaluacion_desempeno_id_evaluacion_seq OWNER TO postgres;

--
-- TOC entry 5551 (class 0 OID 0)
-- Dependencies: 255
-- Name: evaluacion_desempeno_id_evaluacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.evaluacion_desempeno_id_evaluacion_seq OWNED BY public.evaluacion_desempeno.id_evaluacion;


--
-- TOC entry 242 (class 1259 OID 17881)
-- Name: historial_laboral; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_laboral (
    id_historial integer NOT NULL,
    id_empleado integer NOT NULL,
    id_responsable integer NOT NULL,
    tipo_movimiento public.tipo_movimiento_enum NOT NULL,
    valor_anterior character varying(100),
    valor_nuevo character varying(100) NOT NULL,
    fecha_movimiento timestamp without time zone NOT NULL,
    observacion character varying(255)
);


ALTER TABLE public.historial_laboral OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 17880)
-- Name: historial_laboral_id_historial_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historial_laboral_id_historial_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historial_laboral_id_historial_seq OWNER TO postgres;

--
-- TOC entry 5552 (class 0 OID 0)
-- Dependencies: 241
-- Name: historial_laboral_id_historial_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_laboral_id_historial_seq OWNED BY public.historial_laboral.id_historial;


--
-- TOC entry 252 (class 1259 OID 18006)
-- Name: hora_extra; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hora_extra (
    id_hora_extra integer NOT NULL,
    id_empleado integer NOT NULL,
    id_aprobador integer,
    motivo character varying(255) NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    cantidad_horas double precision NOT NULL,
    tipo_hora public.tipo_hora_enum NOT NULL,
    archivo_soporte_url character varying(255) NOT NULL,
    estado_he public.estado_he_enum DEFAULT 'PENDIENTE'::public.estado_he_enum NOT NULL,
    CONSTRAINT ck_hora_extra_cantidad CHECK ((cantidad_horas > (0)::double precision)),
    CONSTRAINT ck_hora_extra_fechas CHECK ((fecha_inicio <= fecha_fin))
);


ALTER TABLE public.hora_extra OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 18005)
-- Name: hora_extra_id_hora_extra_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hora_extra_id_hora_extra_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hora_extra_id_hora_extra_seq OWNER TO postgres;

--
-- TOC entry 5553 (class 0 OID 0)
-- Dependencies: 251
-- Name: hora_extra_id_hora_extra_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hora_extra_id_hora_extra_seq OWNED BY public.hora_extra.id_hora_extra;


--
-- TOC entry 268 (class 1259 OID 18239)
-- Name: liquidacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.liquidacion (
    id_liquidacion integer NOT NULL,
    id_empleado integer NOT NULL,
    id_configuracion integer NOT NULL,
    fecha_retiro date NOT NULL,
    motivo_retiro public.motivo_retiro_enum NOT NULL,
    salario_promedio numeric(12,2) NOT NULL,
    dias_trabajados integer NOT NULL,
    cesantias numeric(12,2) NOT NULL,
    intereses_cesantias numeric(12,2) NOT NULL,
    prima numeric(12,2) NOT NULL,
    vacaciones numeric(12,2) NOT NULL,
    indemnizacion numeric(12,2) NOT NULL,
    dotacion_pendiente numeric(12,2) DEFAULT 0 NOT NULL,
    total_neto_pagar numeric(12,2) NOT NULL,
    notas_adicionales character varying(200),
    CONSTRAINT ck_liquidacion_valores_no_negativos CHECK (((salario_promedio >= (0)::numeric) AND (cesantias >= (0)::numeric) AND (intereses_cesantias >= (0)::numeric) AND (prima >= (0)::numeric) AND (vacaciones >= (0)::numeric) AND (indemnizacion >= (0)::numeric) AND (dotacion_pendiente >= (0)::numeric) AND (total_neto_pagar >= (0)::numeric)))
);


ALTER TABLE public.liquidacion OWNER TO postgres;

--
-- TOC entry 267 (class 1259 OID 18238)
-- Name: liquidacion_id_liquidacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.liquidacion_id_liquidacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.liquidacion_id_liquidacion_seq OWNER TO postgres;

--
-- TOC entry 5554 (class 0 OID 0)
-- Dependencies: 267
-- Name: liquidacion_id_liquidacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.liquidacion_id_liquidacion_seq OWNED BY public.liquidacion.id_liquidacion;


--
-- TOC entry 222 (class 1259 OID 17667)
-- Name: modulo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modulo (
    id_modulo integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(150)
);


ALTER TABLE public.modulo OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 17666)
-- Name: modulo_id_modulo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.modulo_id_modulo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.modulo_id_modulo_seq OWNER TO postgres;

--
-- TOC entry 5555 (class 0 OID 0)
-- Dependencies: 221
-- Name: modulo_id_modulo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.modulo_id_modulo_seq OWNED BY public.modulo.id_modulo;


--
-- TOC entry 270 (class 1259 OID 18272)
-- Name: nomina; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nomina (
    id_nomina integer NOT NULL,
    id_obra integer,
    id_configuracion integer NOT NULL,
    id_admin_rrhh integer NOT NULL,
    periodo_inicio date NOT NULL,
    periodo_fin date NOT NULL,
    tipo_nomina public.tipo_nomina_enum NOT NULL,
    fecha_generacion timestamp without time zone NOT NULL,
    estado_nomina public.estado_nomina_enum DEFAULT 'BORRADOR'::public.estado_nomina_enum NOT NULL,
    total_pagado numeric(14,2) DEFAULT 0 NOT NULL,
    cantidad_empleados integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.nomina OWNER TO postgres;

--
-- TOC entry 269 (class 1259 OID 18271)
-- Name: nomina_id_nomina_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nomina_id_nomina_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nomina_id_nomina_seq OWNER TO postgres;

--
-- TOC entry 5556 (class 0 OID 0)
-- Dependencies: 269
-- Name: nomina_id_nomina_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nomina_id_nomina_seq OWNED BY public.nomina.id_nomina;


--
-- TOC entry 282 (class 1259 OID 18454)
-- Name: notificacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notificacion (
    id_notificacion integer NOT NULL,
    id_destinatario integer NOT NULL,
    tipo public.tipo_notificacion_enum NOT NULL,
    mensaje text NOT NULL,
    fecha_envio timestamp without time zone NOT NULL,
    leida boolean DEFAULT false NOT NULL
);


ALTER TABLE public.notificacion OWNER TO postgres;

--
-- TOC entry 281 (class 1259 OID 18453)
-- Name: notificacion_id_notificacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notificacion_id_notificacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notificacion_id_notificacion_seq OWNER TO postgres;

--
-- TOC entry 5557 (class 0 OID 0)
-- Dependencies: 281
-- Name: notificacion_id_notificacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notificacion_id_notificacion_seq OWNED BY public.notificacion.id_notificacion;


--
-- TOC entry 250 (class 1259 OID 17979)
-- Name: novedad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.novedad (
    id_novedad integer NOT NULL,
    id_empleado integer NOT NULL,
    id_aprobado_por integer,
    tipo_novedad public.tipo_novedad_enum NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    total_dias double precision NOT NULL,
    soporte_url character varying(255),
    estado_novedad public.estado_novedad_enum DEFAULT 'PENDIENTE'::public.estado_novedad_enum NOT NULL,
    CONSTRAINT ck_novedad_fechas CHECK ((fecha_inicio <= fecha_fin)),
    CONSTRAINT ck_novedad_total_dias CHECK ((total_dias > (0)::double precision))
);


ALTER TABLE public.novedad OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 17978)
-- Name: novedad_id_novedad_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.novedad_id_novedad_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.novedad_id_novedad_seq OWNER TO postgres;

--
-- TOC entry 5558 (class 0 OID 0)
-- Dependencies: 249
-- Name: novedad_id_novedad_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.novedad_id_novedad_seq OWNED BY public.novedad.id_novedad;


--
-- TOC entry 254 (class 1259 OID 18037)
-- Name: observacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observacion (
    id_observacion integer NOT NULL,
    id_empleado integer NOT NULL,
    id_supervisor integer NOT NULL,
    tipo_observacion public.tipo_observacion_enum NOT NULL,
    descripcion text NOT NULL,
    fecha timestamp without time zone NOT NULL,
    escalada boolean DEFAULT false NOT NULL,
    estado_observacion public.estado_observacion_enum DEFAULT 'REGISTRADA'::public.estado_observacion_enum NOT NULL
);


ALTER TABLE public.observacion OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 18036)
-- Name: observacion_id_observacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.observacion_id_observacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.observacion_id_observacion_seq OWNER TO postgres;

--
-- TOC entry 5559 (class 0 OID 0)
-- Dependencies: 253
-- Name: observacion_id_observacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.observacion_id_observacion_seq OWNED BY public.observacion.id_observacion;


--
-- TOC entry 220 (class 1259 OID 17656)
-- Name: perfil; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.perfil (
    id_perfil integer NOT NULL,
    nombre character varying(30) NOT NULL,
    descripcion character varying(150)
);


ALTER TABLE public.perfil OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 17655)
-- Name: perfil_id_perfil_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.perfil_id_perfil_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.perfil_id_perfil_seq OWNER TO postgres;

--
-- TOC entry 5560 (class 0 OID 0)
-- Dependencies: 219
-- Name: perfil_id_perfil_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.perfil_id_perfil_seq OWNED BY public.perfil.id_perfil;


--
-- TOC entry 226 (class 1259 OID 17689)
-- Name: permiso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permiso (
    id_permiso integer NOT NULL,
    id_perfil integer NOT NULL,
    id_modulo integer NOT NULL,
    id_accion integer NOT NULL
);


ALTER TABLE public.permiso OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 17688)
-- Name: permiso_id_permiso_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permiso_id_permiso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permiso_id_permiso_seq OWNER TO postgres;

--
-- TOC entry 5561 (class 0 OID 0)
-- Dependencies: 225
-- Name: permiso_id_permiso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permiso_id_permiso_seq OWNED BY public.permiso.id_permiso;


--
-- TOC entry 276 (class 1259 OID 18374)
-- Name: pila; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pila (
    id_pila integer NOT NULL,
    id_nomina integer NOT NULL,
    periodo_inicio date NOT NULL,
    periodo_fin date NOT NULL,
    total_salud numeric(12,2) NOT NULL,
    total_pension numeric(12,2) NOT NULL,
    total_arl numeric(12,2) NOT NULL,
    total_paraestatales numeric(12,2) NOT NULL,
    archivo_txt character varying(255),
    estado_validacion public.estado_validacion_enum DEFAULT 'PENDIENTE'::public.estado_validacion_enum NOT NULL
);


ALTER TABLE public.pila OWNER TO postgres;

--
-- TOC entry 275 (class 1259 OID 18373)
-- Name: pila_id_pila_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pila_id_pila_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pila_id_pila_seq OWNER TO postgres;

--
-- TOC entry 5562 (class 0 OID 0)
-- Dependencies: 275
-- Name: pila_id_pila_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pila_id_pila_seq OWNED BY public.pila.id_pila;


--
-- TOC entry 264 (class 1259 OID 18185)
-- Name: prestamo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prestamo (
    id_prestamo integer NOT NULL,
    id_empleado integer NOT NULL,
    tipo_obligacion public.tipo_obligacion_enum NOT NULL,
    valor_total numeric(12,2) NOT NULL,
    numero_cuotas integer NOT NULL,
    valor_cuota numeric(12,2) NOT NULL,
    cuotas_pagadas integer DEFAULT 0 NOT NULL,
    saldo_pendiente numeric(12,2) NOT NULL,
    fecha_inicio date NOT NULL,
    observacion character varying(255),
    estado_prestamo public.estado_prestamo_enum DEFAULT 'ACTIVO'::public.estado_prestamo_enum NOT NULL
);


ALTER TABLE public.prestamo OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 18184)
-- Name: prestamo_id_prestamo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prestamo_id_prestamo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prestamo_id_prestamo_seq OWNER TO postgres;

--
-- TOC entry 5563 (class 0 OID 0)
-- Dependencies: 263
-- Name: prestamo_id_prestamo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prestamo_id_prestamo_seq OWNED BY public.prestamo.id_prestamo;


--
-- TOC entry 236 (class 1259 OID 17794)
-- Name: proyecto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proyecto (
    id_proyecto integer NOT NULL,
    id_supervisor integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    ubicacion_calle character varying(100) NOT NULL,
    ubicacion_referencia character varying(100),
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    estado_proyecto public.estado_proyecto_enum DEFAULT 'ACTIVO'::public.estado_proyecto_enum NOT NULL,
    CONSTRAINT ck_proyecto_fechas CHECK ((fecha_inicio < fecha_fin))
);


ALTER TABLE public.proyecto OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 17793)
-- Name: proyecto_id_proyecto_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.proyecto_id_proyecto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.proyecto_id_proyecto_seq OWNER TO postgres;

--
-- TOC entry 5564 (class 0 OID 0)
-- Dependencies: 235
-- Name: proyecto_id_proyecto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.proyecto_id_proyecto_seq OWNED BY public.proyecto.id_proyecto;


--
-- TOC entry 280 (class 1259 OID 18428)
-- Name: solicitud; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.solicitud (
    id_solicitud integer NOT NULL,
    id_solicitante integer NOT NULL,
    id_gestor_por integer,
    tipo_solicitud public.tipo_solicitud_enum NOT NULL,
    descripcion text NOT NULL,
    fecha_creacion timestamp without time zone NOT NULL,
    estado_solicitud public.estado_solicitud_enum DEFAULT 'PENDIENTE'::public.estado_solicitud_enum NOT NULL,
    respuesta text,
    fecha_respuesta timestamp without time zone
);


ALTER TABLE public.solicitud OWNER TO postgres;

--
-- TOC entry 279 (class 1259 OID 18427)
-- Name: solicitud_id_solicitud_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.solicitud_id_solicitud_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solicitud_id_solicitud_seq OWNER TO postgres;

--
-- TOC entry 5565 (class 0 OID 0)
-- Dependencies: 279
-- Name: solicitud_id_solicitud_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.solicitud_id_solicitud_seq OWNED BY public.solicitud.id_solicitud;


--
-- TOC entry 230 (class 1259 OID 17742)
-- Name: supervisor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supervisor (
    id_supervisor integer NOT NULL,
    id_usuario integer NOT NULL,
    numero_tarjeta_profesional character varying(30) NOT NULL,
    cuadrilla_asignada character varying(60)
);


ALTER TABLE public.supervisor OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 17741)
-- Name: supervisor_id_supervisor_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.supervisor_id_supervisor_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.supervisor_id_supervisor_seq OWNER TO postgres;

--
-- TOC entry 5566 (class 0 OID 0)
-- Dependencies: 229
-- Name: supervisor_id_supervisor_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.supervisor_id_supervisor_seq OWNED BY public.supervisor.id_supervisor;


--
-- TOC entry 248 (class 1259 OID 17949)
-- Name: turno; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.turno (
    id_turno integer NOT NULL,
    id_empleado integer NOT NULL,
    id_proyecto integer NOT NULL,
    id_asignado_por integer NOT NULL,
    tipo_turno character varying(20) NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone NOT NULL,
    fecha date NOT NULL
);


ALTER TABLE public.turno OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 17948)
-- Name: turno_id_turno_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.turno_id_turno_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.turno_id_turno_seq OWNER TO postgres;

--
-- TOC entry 5567 (class 0 OID 0)
-- Dependencies: 247
-- Name: turno_id_turno_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.turno_id_turno_seq OWNED BY public.turno.id_turno;


--
-- TOC entry 228 (class 1259 OID 17717)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    id_perfil integer NOT NULL,
    nombres character varying(60) NOT NULL,
    apellidos character varying(60) NOT NULL,
    correo character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    estado boolean DEFAULT true NOT NULL,
    ultimo_acceso timestamp without time zone,
    foto_perfil character varying(255),
    idioma character varying(5) DEFAULT 'ES'::character varying NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 17716)
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_usuario_seq OWNER TO postgres;

--
-- TOC entry 5568 (class 0 OID 0)
-- Dependencies: 227
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;


--
-- TOC entry 266 (class 1259 OID 18209)
-- Name: viatico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.viatico (
    id_viatico integer NOT NULL,
    id_empleado integer NOT NULL,
    id_proyecto integer NOT NULL,
    id_aprobado_por integer,
    concepto character varying(60) NOT NULL,
    valor numeric(10,2) NOT NULL,
    fecha date NOT NULL,
    soporte_url character varying(255),
    estado_viatico public.estado_viatico_enum DEFAULT 'PENDIENTE'::public.estado_viatico_enum NOT NULL
);


ALTER TABLE public.viatico OWNER TO postgres;

--
-- TOC entry 265 (class 1259 OID 18208)
-- Name: viatico_id_viatico_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.viatico_id_viatico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.viatico_id_viatico_seq OWNER TO postgres;

--
-- TOC entry 5569 (class 0 OID 0)
-- Dependencies: 265
-- Name: viatico_id_viatico_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.viatico_id_viatico_seq OWNED BY public.viatico.id_viatico;


--
-- TOC entry 5087 (class 2604 OID 17681)
-- Name: accion id_accion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accion ALTER COLUMN id_accion SET DEFAULT nextval('public.accion_id_accion_seq'::regclass);


--
-- TOC entry 5094 (class 2604 OID 17780)
-- Name: admin_rrhh id_admin_rrhh; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_rrhh ALTER COLUMN id_admin_rrhh SET DEFAULT nextval('public.admin_rrhh_id_admin_rrhh_seq'::regclass);


--
-- TOC entry 5099 (class 2604 OID 17858)
-- Name: afiliacion id_afiliacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.afiliacion ALTER COLUMN id_afiliacion SET DEFAULT nextval('public.afiliacion_id_afiliacion_seq'::regclass);


--
-- TOC entry 5149 (class 2604 OID 18401)
-- Name: aporte_empleado id_aporte; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aporte_empleado ALTER COLUMN id_aporte SET DEFAULT nextval('public.aporte_empleado_id_aporte_seq'::regclass);


--
-- TOC entry 5117 (class 2604 OID 18099)
-- Name: asignacion_proyecto id_asignacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asignacion_proyecto ALTER COLUMN id_asignacion SET DEFAULT nextval('public.asignacion_proyecto_id_asignacion_seq'::regclass);


--
-- TOC entry 5106 (class 2604 OID 17928)
-- Name: asistencia id_asistencia; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asistencia ALTER COLUMN id_asistencia SET DEFAULT nextval('public.asistencia_id_asistencia_seq'::regclass);


--
-- TOC entry 5154 (class 2604 OID 18478)
-- Name: cambio_configuracion id_cambio; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cambio_configuracion ALTER COLUMN id_cambio SET DEFAULT nextval('public.cambio_configuracion_id_cambio_seq'::regclass);


--
-- TOC entry 5104 (class 2604 OID 17907)
-- Name: certificacion id_certificacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificacion ALTER COLUMN id_certificacion SET DEFAULT nextval('public.certificacion_id_certificacion_seq'::regclass);


--
-- TOC entry 5119 (class 2604 OID 18126)
-- Name: configuracion id_configuracion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion ALTER COLUMN id_configuracion SET DEFAULT nextval('public.configuracion_id_configuracion_seq'::regclass);


--
-- TOC entry 5093 (class 2604 OID 17762)
-- Name: contador id_contador; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contador ALTER COLUMN id_contador SET DEFAULT nextval('public.contador_id_contador_seq'::regclass);


--
-- TOC entry 5125 (class 2604 OID 18157)
-- Name: contrato id_contrato; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contrato ALTER COLUMN id_contrato SET DEFAULT nextval('public.contrato_id_contrato_seq'::regclass);


--
-- TOC entry 5145 (class 2604 OID 18345)
-- Name: desprendible id_desprendible; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.desprendible ALTER COLUMN id_desprendible SET DEFAULT nextval('public.desprendible_id_desprendible_seq'::regclass);


--
-- TOC entry 5138 (class 2604 OID 18310)
-- Name: detalle_nomina id_detalle_nomina; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_nomina ALTER COLUMN id_detalle_nomina SET DEFAULT nextval('public.detalle_nomina_id_detalle_nomina_seq'::regclass);


--
-- TOC entry 5097 (class 2604 OID 17820)
-- Name: empleado id_empleado; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleado ALTER COLUMN id_empleado SET DEFAULT nextval('public.empleado_id_empleado_seq'::regclass);


--
-- TOC entry 5115 (class 2604 OID 18069)
-- Name: evaluacion_desempeno id_evaluacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluacion_desempeno ALTER COLUMN id_evaluacion SET DEFAULT nextval('public.evaluacion_desempeno_id_evaluacion_seq'::regclass);


--
-- TOC entry 5103 (class 2604 OID 17884)
-- Name: historial_laboral id_historial; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_laboral ALTER COLUMN id_historial SET DEFAULT nextval('public.historial_laboral_id_historial_seq'::regclass);


--
-- TOC entry 5110 (class 2604 OID 18009)
-- Name: hora_extra id_hora_extra; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hora_extra ALTER COLUMN id_hora_extra SET DEFAULT nextval('public.hora_extra_id_hora_extra_seq'::regclass);


--
-- TOC entry 5132 (class 2604 OID 18242)
-- Name: liquidacion id_liquidacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidacion ALTER COLUMN id_liquidacion SET DEFAULT nextval('public.liquidacion_id_liquidacion_seq'::regclass);


--
-- TOC entry 5086 (class 2604 OID 17670)
-- Name: modulo id_modulo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modulo ALTER COLUMN id_modulo SET DEFAULT nextval('public.modulo_id_modulo_seq'::regclass);


--
-- TOC entry 5134 (class 2604 OID 18275)
-- Name: nomina id_nomina; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nomina ALTER COLUMN id_nomina SET DEFAULT nextval('public.nomina_id_nomina_seq'::regclass);


--
-- TOC entry 5152 (class 2604 OID 18457)
-- Name: notificacion id_notificacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacion ALTER COLUMN id_notificacion SET DEFAULT nextval('public.notificacion_id_notificacion_seq'::regclass);


--
-- TOC entry 5108 (class 2604 OID 17982)
-- Name: novedad id_novedad; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.novedad ALTER COLUMN id_novedad SET DEFAULT nextval('public.novedad_id_novedad_seq'::regclass);


--
-- TOC entry 5112 (class 2604 OID 18040)
-- Name: observacion id_observacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion ALTER COLUMN id_observacion SET DEFAULT nextval('public.observacion_id_observacion_seq'::regclass);


--
-- TOC entry 5085 (class 2604 OID 17659)
-- Name: perfil id_perfil; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil ALTER COLUMN id_perfil SET DEFAULT nextval('public.perfil_id_perfil_seq'::regclass);


--
-- TOC entry 5088 (class 2604 OID 17692)
-- Name: permiso id_permiso; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permiso ALTER COLUMN id_permiso SET DEFAULT nextval('public.permiso_id_permiso_seq'::regclass);


--
-- TOC entry 5147 (class 2604 OID 18377)
-- Name: pila id_pila; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pila ALTER COLUMN id_pila SET DEFAULT nextval('public.pila_id_pila_seq'::regclass);


--
-- TOC entry 5127 (class 2604 OID 18188)
-- Name: prestamo id_prestamo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestamo ALTER COLUMN id_prestamo SET DEFAULT nextval('public.prestamo_id_prestamo_seq'::regclass);


--
-- TOC entry 5095 (class 2604 OID 17797)
-- Name: proyecto id_proyecto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyecto ALTER COLUMN id_proyecto SET DEFAULT nextval('public.proyecto_id_proyecto_seq'::regclass);


--
-- TOC entry 5150 (class 2604 OID 18431)
-- Name: solicitud id_solicitud; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud ALTER COLUMN id_solicitud SET DEFAULT nextval('public.solicitud_id_solicitud_seq'::regclass);


--
-- TOC entry 5092 (class 2604 OID 17745)
-- Name: supervisor id_supervisor; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supervisor ALTER COLUMN id_supervisor SET DEFAULT nextval('public.supervisor_id_supervisor_seq'::regclass);


--
-- TOC entry 5107 (class 2604 OID 17952)
-- Name: turno id_turno; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.turno ALTER COLUMN id_turno SET DEFAULT nextval('public.turno_id_turno_seq'::regclass);


--
-- TOC entry 5089 (class 2604 OID 17720)
-- Name: usuarios id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);


--
-- TOC entry 5130 (class 2604 OID 18212)
-- Name: viatico id_viatico; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.viatico ALTER COLUMN id_viatico SET DEFAULT nextval('public.viatico_id_viatico_seq'::regclass);


--
-- TOC entry 5470 (class 0 OID 17678)
-- Dependencies: 224
-- Data for Name: accion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accion (id_accion, nombre, descripcion) FROM stdin;
1	CONSULTAR	Consultar información
2	REGISTRAR	Registrar información
3	ACTUALIZAR	Modificar información existente
4	ELIMINAR	Eliminar o desactivar información según la regla de negocio
5	DESCARGAR	Descargar información o documentos
6	EXPORTAR	Exportar información
7	GENERAR	Ejecutar una generación de información o documento
8	APROBAR	Aprobar una operación
9	ASIGNAR	Asignar recursos o relaciones
10	VALIDAR	Validar una operación o información
\.


--
-- TOC entry 5480 (class 0 OID 17777)
-- Dependencies: 234
-- Data for Name: admin_rrhh; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_rrhh (id_admin_rrhh, id_usuario, area_responsable) FROM stdin;
1	1	ADMINISTRACION
2	2	RECURSOS HUMANOS
3	3	RECURSOS HUMANOS
\.


--
-- TOC entry 5486 (class 0 OID 17855)
-- Dependencies: 240
-- Data for Name: afiliacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.afiliacion (id_afiliacion, id_empleado, eps, fondo_pension, arl, caja_compensacion, nivel_riesgo_arl, fecha_afiliacion, estado_afiliacion) FROM stdin;
1	1	Sura EPS	Porvenir	Positiva ARL	Compensar	1	2026-08-31	ACTIVO
2	2	Sanitas EPS	Proteccion	Sura ARL	Compensar	1	2026-08-31	ACTIVO
3	3	Nueva EPS	Porvenir	Sura ARL	Compensar	1	2026-08-31	ACTIVO
4	4	Compensar EPS	Proteccion	Positiva ARL	Colsubsidio	1	2026-08-31	ACTIVO
5	5	Compensar EPS	Colfondos	Sura ARL	Compensar	1	2026-08-31	ACTIVO
6	6	Famisanar EPS	Porvenir	Colmena ARL	Compensar	1	2026-08-31	ACTIVO
7	7	Sanitas EPS	Proteccion	Colmena ARL	Cafam	1	2026-08-31	ACTIVO
8	8	Compensar EPS	Colfondos	Positiva ARL	Compensar	1	2026-08-31	ACTIVO
9	9	Sura EPS	Porvenir	Colmena ARL	Cafam	1	2026-08-31	ACTIVO
10	10	Compensar EPS	Colfondos	Sura ARL	Cafam	5	2026-08-31	ACTIVO
11	11	Sura EPS	Colfondos	Sura ARL	Cafam	4	2026-08-31	ACTIVO
12	12	Compensar EPS	Porvenir	Positiva ARL	Compensar	4	2026-08-31	ACTIVO
13	13	Famisanar EPS	Colfondos	Sura ARL	Compensar	4	2026-08-31	ACTIVO
14	14	Sura EPS	Colpensiones	Sura ARL	Cafam	5	2026-08-31	ACTIVO
15	15	Nueva EPS	Proteccion	Sura ARL	Colsubsidio	5	2026-08-31	ACTIVO
16	16	Sanitas EPS	Proteccion	Colmena ARL	Compensar	4	2026-08-31	ACTIVO
17	17	Sanitas EPS	Colpensiones	Positiva ARL	Compensar	5	2026-08-31	ACTIVO
18	18	Sanitas EPS	Colpensiones	Colmena ARL	Colsubsidio	4	2026-08-31	ACTIVO
19	19	Famisanar EPS	Porvenir	Sura ARL	Compensar	5	2026-08-31	ACTIVO
20	20	Sura EPS	Colfondos	Positiva ARL	Colsubsidio	5	2026-08-31	ACTIVO
21	21	Compensar EPS	Porvenir	Positiva ARL	Cafam	5	2026-08-31	ACTIVO
22	22	Sanitas EPS	Colfondos	Sura ARL	Colsubsidio	5	2026-08-31	ACTIVO
23	23	Compensar EPS	Colpensiones	Colmena ARL	Colsubsidio	4	2026-08-31	ACTIVO
24	24	Nueva EPS	Porvenir	Colmena ARL	Compensar	4	2026-08-31	ACTIVO
25	25	Famisanar EPS	Colpensiones	Positiva ARL	Colsubsidio	5	2026-08-31	ACTIVO
26	26	Compensar EPS	Colfondos	Positiva ARL	Colsubsidio	5	2026-08-31	ACTIVO
27	27	Sura EPS	Porvenir	Positiva ARL	Compensar	4	2026-08-31	ACTIVO
28	28	Compensar EPS	Porvenir	Colmena ARL	Compensar	5	2026-08-31	ACTIVO
29	29	Sura EPS	Porvenir	Colmena ARL	Colsubsidio	5	2026-08-31	ACTIVO
30	30	Sanitas EPS	Porvenir	Colmena ARL	Cafam	5	2026-08-31	ACTIVO
31	31	Famisanar EPS	Colpensiones	Positiva ARL	Cafam	4	2026-08-31	ACTIVO
32	32	Famisanar EPS	Colpensiones	Positiva ARL	Compensar	4	2026-08-31	ACTIVO
33	33	Compensar EPS	Colfondos	Sura ARL	Compensar	4	2026-08-31	ACTIVO
34	34	Famisanar EPS	Porvenir	Positiva ARL	Cafam	5	2026-08-31	ACTIVO
35	35	Sanitas EPS	Porvenir	Positiva ARL	Colsubsidio	4	2026-08-31	ACTIVO
36	36	Sura EPS	Colfondos	Positiva ARL	Colsubsidio	5	2026-08-31	ACTIVO
37	37	Nueva EPS	Proteccion	Positiva ARL	Colsubsidio	5	2026-08-31	ACTIVO
38	38	Sura EPS	Proteccion	Positiva ARL	Cafam	4	2026-08-31	ACTIVO
39	39	Famisanar EPS	Colfondos	Sura ARL	Colsubsidio	4	2026-08-31	ACTIVO
\.


--
-- TOC entry 5524 (class 0 OID 18398)
-- Dependencies: 278
-- Data for Name: aporte_empleado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.aporte_empleado (id_aporte, id_pila, id_empleado, ibc, dias_cotizados, tarifa_arl, aportes_salud, aportes_pension, aportes_arl, aportes_paraestatales) FROM stdin;
1	1	1	2600000.00	15	0.00522	104000.00	104000.00	13572.00	0.00
2	1	2	2600000.00	15	0.00522	104000.00	104000.00	13572.00	0.00
3	1	3	3400000.00	15	0.00522	136000.00	136000.00	17748.00	306000.00
4	1	4	3200000.00	15	0.00522	128000.00	128000.00	16704.00	288000.00
5	1	5	3400000.00	15	0.00522	136000.00	136000.00	17748.00	306000.00
6	1	6	3200000.00	15	0.00522	128000.00	128000.00	16704.00	288000.00
7	1	7	3200000.00	15	0.00522	128000.00	128000.00	16704.00	288000.00
8	1	8	3200000.00	15	0.00522	128000.00	128000.00	16704.00	288000.00
9	1	9	3000000.00	15	0.00522	120000.00	120000.00	15660.00	270000.00
10	1	13	1500000.00	15	0.0435	60000.00	60000.00	65250.00	0.00
11	1	14	1800000.00	15	0.0696	72000.00	72000.00	125280.00	0.00
12	1	15	2200000.00	15	0.0696	88000.00	88000.00	153120.00	0.00
13	1	16	1800000.00	15	0.0435	72000.00	72000.00	78300.00	0.00
14	1	17	2200000.00	15	0.0696	88000.00	88000.00	153120.00	0.00
15	1	18	1500000.00	15	0.0435	60000.00	60000.00	65250.00	0.00
16	1	19	2200000.00	15	0.0696	88000.00	88000.00	153120.00	0.00
17	1	20	1800000.00	15	0.0696	72000.00	72000.00	125280.00	0.00
18	1	21	1800000.00	15	0.0696	72000.00	72000.00	125280.00	0.00
19	1	22	1500000.00	15	0.0696	60000.00	60000.00	104400.00	0.00
20	1	23	2200000.00	15	0.0435	88000.00	88000.00	95700.00	0.00
21	1	24	2000000.00	15	0.0435	80000.00	80000.00	87000.00	0.00
22	1	25	2000000.00	15	0.0696	80000.00	80000.00	139200.00	0.00
23	1	26	1423500.00	15	0.0696	56940.00	56940.00	99075.60	0.00
24	1	27	1500000.00	15	0.0435	60000.00	60000.00	65250.00	0.00
25	1	28	1650000.00	15	0.0696	66000.00	66000.00	114840.00	0.00
26	1	29	1650000.00	15	0.0696	66000.00	66000.00	114840.00	0.00
27	1	30	2000000.00	15	0.0696	80000.00	80000.00	139200.00	0.00
28	1	31	1650000.00	15	0.0435	66000.00	66000.00	71775.00	0.00
29	1	32	1650000.00	15	0.0435	66000.00	66000.00	71775.00	0.00
30	1	33	1423500.00	15	0.0435	56940.00	56940.00	61922.25	0.00
31	1	34	1650000.00	15	0.0696	66000.00	66000.00	114840.00	0.00
32	1	35	2200000.00	15	0.0435	88000.00	88000.00	95700.00	0.00
33	1	36	1650000.00	15	0.0696	66000.00	66000.00	114840.00	0.00
34	1	37	1800000.00	15	0.0696	72000.00	72000.00	125280.00	0.00
35	1	38	1500000.00	15	0.0435	60000.00	60000.00	65250.00	0.00
36	1	39	1800000.00	15	0.0435	72000.00	72000.00	78300.00	0.00
\.


--
-- TOC entry 5504 (class 0 OID 18096)
-- Dependencies: 258
-- Data for Name: asignacion_proyecto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asignacion_proyecto (id_asignacion, id_proyecto, id_empleado, cuadrilla, rol_en_proyecto, fecha_asignacion, activo) FROM stdin;
1	10	10	Cuadrilla A	Operador de Maquinaria	2025-08-09	f
2	9	11	Cuadrilla B	Ayudante de Obra	2025-01-27	f
3	8	12	Cuadrilla C	Almacenista de Obra	2023-03-26	f
4	7	13	Cuadrilla D	Soldador	2023-11-07	t
5	6	14	Cuadrilla E	Ayudante de Plomeria	2025-06-14	t
6	10	15	Cuadrilla A	Ayudante de Obra	2025-06-22	t
7	9	16	Cuadrilla B	Soldador	2024-05-07	t
8	8	17	Cuadrilla C	Electricista	2023-04-05	t
9	7	18	Cuadrilla D	Plomero	2025-09-15	t
10	6	19	Cuadrilla E	Electricista	2025-08-21	t
11	10	20	Cuadrilla A	Ayudante de Obra	2024-09-15	t
12	9	21	Cuadrilla B	Soldador	2023-07-11	t
13	8	22	Cuadrilla C	Plomero	2023-01-09	t
14	7	23	Cuadrilla D	Ayudante de Obra	2023-04-07	t
15	6	24	Cuadrilla E	Ayudante de Obra	2024-10-22	t
16	10	25	Cuadrilla A	Ayudante de Obra	2023-07-27	t
17	9	26	Cuadrilla B	Electricista	2024-04-25	t
18	8	27	Cuadrilla C	Almacenista de Obra	2023-12-14	t
19	7	28	Cuadrilla D	Ayudante de Plomeria	2025-09-12	t
20	6	29	Cuadrilla E	Pintor	2023-04-10	t
21	10	30	Cuadrilla A	Oficial de Construccion	2024-08-15	t
22	9	31	Cuadrilla B	Ayudante de Plomeria	2023-02-18	t
23	8	32	Cuadrilla C	Electricista	2023-04-06	t
24	7	33	Cuadrilla D	Pintor	2024-11-19	t
25	6	34	Cuadrilla E	Ayudante de Plomeria	2023-08-23	t
26	10	35	Cuadrilla A	Electricista	2025-05-19	t
27	9	36	Cuadrilla B	Maestro de Obra	2025-08-10	t
28	8	37	Cuadrilla C	Almacenista de Obra	2023-04-17	t
29	7	38	Cuadrilla D	Ayudante de Plomeria	2024-09-01	t
30	6	39	Cuadrilla E	Pintor	2024-09-05	t
\.


--
-- TOC entry 5492 (class 0 OID 17925)
-- Dependencies: 246
-- Data for Name: asistencia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asistencia (id_asistencia, id_empleado, id_creado_por, fecha, hora_entrada, hora_salida, estado_asistencia, observacion, fecha_creacion) FROM stdin;
1	1	1	2026-06-22	07:27:00	17:00:00	RETARDO	Llegada tarde por transporte	2026-06-22 07:05:00
2	1	1	2026-06-23	07:28:00	17:00:00	RETARDO	Llegada tarde por transporte	2026-06-23 07:05:00
3	1	1	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
4	1	1	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
5	1	1	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
6	2	1	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
7	2	1	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
8	2	1	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
9	2	1	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
10	2	1	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
11	3	1	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
12	3	1	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
13	3	1	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
14	3	1	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
15	3	1	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
16	4	1	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
17	4	1	2026-06-23	07:00:00	\N	INASISTENCIA	No se presento a la obra	2026-06-23 07:05:00
18	4	1	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
19	4	1	2026-06-25	07:00:00	\N	INASISTENCIA	No se presento a la obra	2026-06-25 07:05:00
20	4	1	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
21	5	1	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
22	5	1	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
23	5	1	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
24	5	1	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
25	5	1	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
26	6	1	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
27	6	1	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
28	6	1	2026-06-24	07:24:00	17:00:00	RETARDO	Llegada tarde por transporte	2026-06-24 07:05:00
29	6	1	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
30	6	1	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
31	7	1	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
32	7	1	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
33	7	1	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
34	7	1	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
35	7	1	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
36	8	1	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
37	8	1	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
38	8	1	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
39	8	1	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
40	8	1	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
41	9	1	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
42	9	1	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
43	9	1	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
44	9	1	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
45	9	1	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
46	13	7	2026-06-22	07:25:00	17:00:00	RETARDO	Llegada tarde por transporte	2026-06-22 07:05:00
47	13	7	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
48	13	7	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
49	13	7	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
50	13	7	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
51	14	8	2026-06-22	07:00:00	\N	INASISTENCIA	No se presento a la obra	2026-06-22 07:05:00
52	14	8	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
53	14	8	2026-06-24	07:22:00	17:00:00	RETARDO	Llegada tarde por transporte	2026-06-24 07:05:00
54	14	8	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
55	14	8	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
56	15	4	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
57	15	4	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
58	15	4	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
59	15	4	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
60	15	4	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
61	16	5	2026-06-22	07:00:00	\N	INASISTENCIA	No se presento a la obra	2026-06-22 07:05:00
62	16	5	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
63	16	5	2026-06-24	07:00:00	\N	INASISTENCIA	No se presento a la obra	2026-06-24 07:05:00
64	16	5	2026-06-25	07:26:00	17:00:00	RETARDO	Llegada tarde por transporte	2026-06-25 07:05:00
65	16	5	2026-06-26	07:00:00	\N	INASISTENCIA	No se presento a la obra	2026-06-26 07:05:00
66	17	6	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
67	17	6	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
68	17	6	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
69	17	6	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
70	17	6	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
71	18	7	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
72	18	7	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
73	18	7	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
74	18	7	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
75	18	7	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
76	19	8	2026-06-22	07:21:00	17:00:00	RETARDO	Llegada tarde por transporte	2026-06-22 07:05:00
77	19	8	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
78	19	8	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
79	19	8	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
80	19	8	2026-06-26	07:25:00	17:00:00	RETARDO	Llegada tarde por transporte	2026-06-26 07:05:00
81	20	4	2026-06-22	07:23:00	17:00:00	RETARDO	Llegada tarde por transporte	2026-06-22 07:05:00
82	20	4	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
83	20	4	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
84	20	4	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
85	20	4	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
86	21	5	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
87	21	5	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
88	21	5	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
89	21	5	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
90	21	5	2026-06-26	07:00:00	\N	INASISTENCIA	No se presento a la obra	2026-06-26 07:05:00
91	22	6	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
92	22	6	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
93	22	6	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
94	22	6	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
95	22	6	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
96	23	7	2026-06-22	07:28:00	17:00:00	RETARDO	Llegada tarde por transporte	2026-06-22 07:05:00
97	23	7	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
98	23	7	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
99	23	7	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
100	23	7	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
101	24	8	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
102	24	8	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
103	24	8	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
104	24	8	2026-06-25	07:00:00	\N	INASISTENCIA	No se presento a la obra	2026-06-25 07:05:00
105	24	8	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
106	25	4	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
107	25	4	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
108	25	4	2026-06-24	07:00:00	\N	INASISTENCIA	No se presento a la obra	2026-06-24 07:05:00
109	25	4	2026-06-25	07:21:00	17:00:00	RETARDO	Llegada tarde por transporte	2026-06-25 07:05:00
110	25	4	2026-06-26	07:00:00	\N	INASISTENCIA	No se presento a la obra	2026-06-26 07:05:00
111	26	5	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
112	26	5	2026-06-23	07:25:00	17:00:00	RETARDO	Llegada tarde por transporte	2026-06-23 07:05:00
113	26	5	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
114	26	5	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
115	26	5	2026-06-26	07:00:00	\N	INASISTENCIA	No se presento a la obra	2026-06-26 07:05:00
116	27	6	2026-06-22	07:27:00	17:00:00	RETARDO	Llegada tarde por transporte	2026-06-22 07:05:00
117	27	6	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
118	27	6	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
119	27	6	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
120	27	6	2026-06-26	07:00:00	\N	INASISTENCIA	No se presento a la obra	2026-06-26 07:05:00
121	28	7	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
122	28	7	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
123	28	7	2026-06-24	07:00:00	\N	INASISTENCIA	No se presento a la obra	2026-06-24 07:05:00
124	28	7	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
125	28	7	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
126	29	8	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
127	29	8	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
128	29	8	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
129	29	8	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
130	29	8	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
131	30	4	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
132	30	4	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
133	30	4	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
134	30	4	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
135	30	4	2026-06-26	07:00:00	\N	INASISTENCIA	No se presento a la obra	2026-06-26 07:05:00
136	31	5	2026-06-22	07:00:00	\N	INASISTENCIA	No se presento a la obra	2026-06-22 07:05:00
137	31	5	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
138	31	5	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
139	31	5	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
140	31	5	2026-06-26	07:22:00	17:00:00	RETARDO	Llegada tarde por transporte	2026-06-26 07:05:00
141	32	6	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
142	32	6	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
143	32	6	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
144	32	6	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
145	32	6	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
146	33	7	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
147	33	7	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
148	33	7	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
149	33	7	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
150	33	7	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
151	34	8	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
152	34	8	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
153	34	8	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
154	34	8	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
155	34	8	2026-06-26	07:20:00	17:00:00	RETARDO	Llegada tarde por transporte	2026-06-26 07:05:00
156	35	4	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
157	35	4	2026-06-23	07:28:00	17:00:00	RETARDO	Llegada tarde por transporte	2026-06-23 07:05:00
158	35	4	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
159	35	4	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
160	35	4	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
161	36	5	2026-06-22	07:00:00	\N	INASISTENCIA	No se presento a la obra	2026-06-22 07:05:00
162	36	5	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
163	36	5	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
164	36	5	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
165	36	5	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
166	37	6	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
167	37	6	2026-06-23	07:25:00	17:00:00	RETARDO	Llegada tarde por transporte	2026-06-23 07:05:00
168	37	6	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
169	37	6	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
170	37	6	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
171	38	7	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
172	38	7	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
173	38	7	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
174	38	7	2026-06-25	07:00:00	\N	INASISTENCIA	No se presento a la obra	2026-06-25 07:05:00
175	38	7	2026-06-26	07:00:00	17:00:00	PRESENTE	\N	2026-06-26 07:05:00
176	39	8	2026-06-22	07:00:00	17:00:00	PRESENTE	\N	2026-06-22 07:05:00
177	39	8	2026-06-23	07:00:00	17:00:00	PRESENTE	\N	2026-06-23 07:05:00
178	39	8	2026-06-24	07:00:00	17:00:00	PRESENTE	\N	2026-06-24 07:05:00
179	39	8	2026-06-25	07:00:00	17:00:00	PRESENTE	\N	2026-06-25 07:05:00
180	39	8	2026-06-26	07:28:00	17:00:00	RETARDO	Llegada tarde por transporte	2026-06-26 07:05:00
\.


--
-- TOC entry 5530 (class 0 OID 18475)
-- Dependencies: 284
-- Data for Name: cambio_configuracion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cambio_configuracion (id_cambio, id_configuracion, id_modificado_por, campo, valor_anterior, valor_nuevo, fecha_cambio) FROM stdin;
1	1	1	smlmv	1300000.00	1423500.00	2026-01-05 09:00:00
2	1	1	auxilio_transporte	162000.00	200000.00	2026-01-05 09:05:00
\.


--
-- TOC entry 5490 (class 0 OID 17904)
-- Dependencies: 244
-- Data for Name: certificacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.certificacion (id_certificacion, id_empleado, nombre, fecha_emision, fecha_vencimiento, archivo_url, tipo_archivo, estado_certificacion) FROM stdin;
1	33	Manejo Defensivo	2025-12-28	2026-12-28	/certificados/emp33_manejo_defensivo.pdf	PDF	ACTIVO
2	35	Trabajo Seguro en Alturas	2025-08-06	2026-08-06	/certificados/emp35_trabajo_seguro_en_alturas.pdf	PDF	ACTIVO
3	37	Manejo Defensivo	2025-05-01	2026-05-01	/certificados/emp37_manejo_defensivo.pdf	PDF	PROXIMO_VENCER
4	28	Trabajo Seguro en Alturas	2025-06-26	2026-06-26	/certificados/emp28_trabajo_seguro_en_alturas.pdf	PDF	PROXIMO_VENCER
5	30	Trabajo Seguro en Alturas	2025-05-12	2026-05-12	/certificados/emp30_trabajo_seguro_en_alturas.pdf	PDF	PROXIMO_VENCER
6	14	Curso de Soldadura Certificada	2025-07-05	2026-07-05	/certificados/emp14_curso_de_soldadura_certificada.pdf	PDF	PROXIMO_VENCER
7	32	Manejo de Maquinaria Pesada	2025-09-14	2026-09-14	/certificados/emp32_manejo_de_maquinaria_pesada.pdf	PDF	ACTIVO
8	15	Primeros Auxilios Basico	2025-11-26	2026-11-26	/certificados/emp15_primeros_auxilios_basico.pdf	PDF	ACTIVO
9	20	Manejo de Maquinaria Pesada	2025-03-06	2026-03-06	/certificados/emp20_manejo_de_maquinaria_pesada.pdf	PDF	PROXIMO_VENCER
10	22	Trabajo Seguro en Alturas	2025-10-28	2026-10-28	/certificados/emp22_trabajo_seguro_en_alturas.pdf	PDF	ACTIVO
11	31	Espacios Confinados	2025-10-22	2026-10-22	/certificados/emp31_espacios_confinados.pdf	PDF	ACTIVO
12	39	Manejo de Maquinaria Pesada	2025-08-19	2026-08-19	/certificados/emp39_manejo_de_maquinaria_pesada.pdf	PDF	ACTIVO
13	19	Manejo de Maquinaria Pesada	2025-04-15	2026-04-15	/certificados/emp19_manejo_de_maquinaria_pesada.pdf	PDF	PROXIMO_VENCER
14	34	Manejo Defensivo	2025-05-15	2026-05-15	/certificados/emp34_manejo_defensivo.pdf	PDF	PROXIMO_VENCER
15	25	Curso de Soldadura Certificada	2025-11-01	2026-11-01	/certificados/emp25_curso_de_soldadura_certificada.pdf	PDF	ACTIVO
\.


--
-- TOC entry 5506 (class 0 OID 18123)
-- Dependencies: 260
-- Data for Name: configuracion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.configuracion (id_configuracion, smlmv, auxilio_transporte, tope_exoneracion, pct_hora_extra_diurna, pct_hora_extra_nocturna, pct_recargo_nocturno_ordinario, pct_recargo_dominical, pct_hora_extra_diurna_dominical, pct_salud_empleado, pct_pension_empleado, nivel_arl_1, nivel_arl_2, nivel_arl_3, nivel_arl_4, nivel_arl_5, anio_vigencia) FROM stdin;
1	1423500.00	200000.00	14235000.00	0.25	0.75	0.35	0.75	1	0.04	0.04	0.00522	0.01044	0.02436	0.0435	0.0696	2026
\.


--
-- TOC entry 5478 (class 0 OID 17759)
-- Dependencies: 232
-- Data for Name: contador; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contador (id_contador, id_usuario, numero_tarjeta_profesional, area_nomina) FROM stdin;
1	9	CON-TEST-001	GENERAL
2	10	CON-TEST-002	GENERAL
\.


--
-- TOC entry 5508 (class 0 OID 18154)
-- Dependencies: 262
-- Data for Name: contrato; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contrato (id_contrato, id_empleado, id_supervisor, id_proyecto, tipo_contrato, salario, fecha_inicio, fecha_fin, obra_asignada, arl, archivo_url, estado_contrato) FROM stdin;
1	1	\N	\N	TERMINO_INDEFINIDO	2600000.00	2022-04-03	\N	\N	Positiva ARL	/contratos/contrato_emp1.pdf	VIGENTE
2	2	\N	\N	TERMINO_INDEFINIDO	2600000.00	2022-09-05	\N	\N	Sura ARL	/contratos/contrato_emp2.pdf	VIGENTE
3	3	\N	\N	TERMINO_INDEFINIDO	3400000.00	2023-06-02	\N	\N	Sura ARL	/contratos/contrato_emp3.pdf	VIGENTE
4	4	\N	\N	TERMINO_INDEFINIDO	3200000.00	2023-03-15	\N	\N	Positiva ARL	/contratos/contrato_emp4.pdf	VIGENTE
5	5	\N	\N	TERMINO_INDEFINIDO	3400000.00	2023-01-13	\N	\N	Sura ARL	/contratos/contrato_emp5.pdf	VIGENTE
6	6	\N	\N	TERMINO_INDEFINIDO	3200000.00	2023-01-19	\N	\N	Colmena ARL	/contratos/contrato_emp6.pdf	VIGENTE
7	7	\N	\N	TERMINO_INDEFINIDO	3200000.00	2023-05-03	\N	\N	Colmena ARL	/contratos/contrato_emp7.pdf	VIGENTE
8	8	\N	\N	TERMINO_INDEFINIDO	3200000.00	2022-10-19	\N	\N	Positiva ARL	/contratos/contrato_emp8.pdf	VIGENTE
9	9	\N	\N	TERMINO_INDEFINIDO	3000000.00	2022-11-27	\N	\N	Colmena ARL	/contratos/contrato_emp9.pdf	VIGENTE
10	10	1	10	TERMINO_FIJO	1500000.00	2025-08-09	2026-05-16	Conjunto Residencial Cedros del Norte	Sura ARL	/contratos/contrato_emp10.pdf	LIQUIDADO
11	11	2	9	OBRA_LABOR	1423500.00	2025-01-27	2026-05-28	Edificio Torres de Chapinero	Sura ARL	/contratos/contrato_emp11.pdf	LIQUIDADO
12	12	3	8	TERMINO_FIJO	1800000.00	2023-03-26	2024-03-26	Centro Comercial Plaza Fontibon	Positiva ARL	/contratos/contrato_emp12.pdf	PROXIMO_VENCER
13	13	4	7	OBRA_LABOR	1500000.00	2023-11-07	2025-12-20	Bodegas Industriales Puente Aranda	Sura ARL	/contratos/contrato_emp13.pdf	VIGENTE
14	14	5	6	OBRA_LABOR	1800000.00	2025-06-14	2027-06-30	Urbanizacion Villa del Sol	Sura ARL	/contratos/contrato_emp14.pdf	VIGENTE
15	15	1	10	OBRA_LABOR	2200000.00	2025-06-22	2026-12-15	Conjunto Residencial Cedros del Norte	Sura ARL	/contratos/contrato_emp15.pdf	VIGENTE
16	16	2	9	TERMINO_FIJO	1800000.00	2024-05-07	2025-05-07	Edificio Torres de Chapinero	Colmena ARL	/contratos/contrato_emp16.pdf	PROXIMO_VENCER
17	17	3	8	TERMINO_FIJO	2200000.00	2023-04-05	2024-04-05	Centro Comercial Plaza Fontibon	Positiva ARL	/contratos/contrato_emp17.pdf	PROXIMO_VENCER
18	18	4	7	OBRA_LABOR	1500000.00	2025-09-15	2025-12-20	Bodegas Industriales Puente Aranda	Colmena ARL	/contratos/contrato_emp18.pdf	VIGENTE
19	19	5	6	TERMINO_FIJO	2200000.00	2025-08-21	2026-08-21	Urbanizacion Villa del Sol	Sura ARL	/contratos/contrato_emp19.pdf	VIGENTE
20	20	1	10	OBRA_LABOR	1800000.00	2024-09-15	2026-12-15	Conjunto Residencial Cedros del Norte	Positiva ARL	/contratos/contrato_emp20.pdf	VIGENTE
21	21	2	9	TERMINO_FIJO	1800000.00	2023-07-11	2024-07-11	Edificio Torres de Chapinero	Positiva ARL	/contratos/contrato_emp21.pdf	PROXIMO_VENCER
22	22	3	8	OBRA_LABOR	1500000.00	2023-01-09	2026-09-30	Centro Comercial Plaza Fontibon	Sura ARL	/contratos/contrato_emp22.pdf	VIGENTE
23	23	4	7	OBRA_LABOR	2200000.00	2023-04-07	2025-12-20	Bodegas Industriales Puente Aranda	Colmena ARL	/contratos/contrato_emp23.pdf	VIGENTE
24	24	5	6	TERMINO_FIJO	2000000.00	2024-10-22	2025-10-22	Urbanizacion Villa del Sol	Colmena ARL	/contratos/contrato_emp24.pdf	PROXIMO_VENCER
25	25	1	10	OBRA_LABOR	2000000.00	2023-07-27	2026-12-15	Conjunto Residencial Cedros del Norte	Positiva ARL	/contratos/contrato_emp25.pdf	VIGENTE
26	26	2	9	OBRA_LABOR	1423500.00	2024-04-25	2027-03-01	Edificio Torres de Chapinero	Positiva ARL	/contratos/contrato_emp26.pdf	VIGENTE
27	27	3	8	TERMINO_FIJO	1500000.00	2023-12-14	2024-12-14	Centro Comercial Plaza Fontibon	Positiva ARL	/contratos/contrato_emp27.pdf	PROXIMO_VENCER
28	28	4	7	TERMINO_FIJO	1650000.00	2025-09-12	2026-09-12	Bodegas Industriales Puente Aranda	Colmena ARL	/contratos/contrato_emp28.pdf	VIGENTE
29	29	5	6	OBRA_LABOR	1650000.00	2023-04-10	2027-06-30	Urbanizacion Villa del Sol	Colmena ARL	/contratos/contrato_emp29.pdf	VIGENTE
30	30	1	10	TERMINO_FIJO	2000000.00	2024-08-15	2025-08-15	Conjunto Residencial Cedros del Norte	Colmena ARL	/contratos/contrato_emp30.pdf	PROXIMO_VENCER
31	31	2	9	TERMINO_FIJO	1650000.00	2023-02-18	2024-02-18	Edificio Torres de Chapinero	Positiva ARL	/contratos/contrato_emp31.pdf	PROXIMO_VENCER
32	32	3	8	TERMINO_FIJO	1650000.00	2023-04-06	2024-04-06	Centro Comercial Plaza Fontibon	Positiva ARL	/contratos/contrato_emp32.pdf	PROXIMO_VENCER
33	33	4	7	OBRA_LABOR	1423500.00	2024-11-19	2025-12-20	Bodegas Industriales Puente Aranda	Sura ARL	/contratos/contrato_emp33.pdf	VIGENTE
34	34	5	6	TERMINO_FIJO	1650000.00	2023-08-23	2024-08-23	Urbanizacion Villa del Sol	Positiva ARL	/contratos/contrato_emp34.pdf	PROXIMO_VENCER
35	35	1	10	OBRA_LABOR	2200000.00	2025-05-19	2026-12-15	Conjunto Residencial Cedros del Norte	Positiva ARL	/contratos/contrato_emp35.pdf	VIGENTE
36	36	2	9	TERMINO_FIJO	1650000.00	2025-08-10	2026-08-10	Edificio Torres de Chapinero	Positiva ARL	/contratos/contrato_emp36.pdf	VIGENTE
37	37	3	8	OBRA_LABOR	1800000.00	2023-04-17	2026-09-30	Centro Comercial Plaza Fontibon	Positiva ARL	/contratos/contrato_emp37.pdf	VIGENTE
38	38	4	7	OBRA_LABOR	1500000.00	2024-09-01	2025-12-20	Bodegas Industriales Puente Aranda	Positiva ARL	/contratos/contrato_emp38.pdf	VIGENTE
39	39	5	6	TERMINO_FIJO	1800000.00	2024-09-05	2025-09-05	Urbanizacion Villa del Sol	Sura ARL	/contratos/contrato_emp39.pdf	PROXIMO_VENCER
\.


--
-- TOC entry 5520 (class 0 OID 18342)
-- Dependencies: 274
-- Data for Name: desprendible; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.desprendible (id_desprendible, id_detalle_nomina, id_empleado, periodo_pago, dias_liquidados, fecha_pago, neto_recibido, archivo_url, firma_digital, estado_descarga) FROM stdin;
1	1	1	2026-06-Q2	15	2026-06-30	1350000.00	/desprendibles/desprendible_1.pdf	FIRMA-0001-2026Q2	DESCARGADO
2	2	2	2026-06-Q2	15	2026-06-30	1300000.00	/desprendibles/desprendible_2.pdf	FIRMA-0002-2026Q2	GENERADO
3	3	3	2026-06-Q2	15	2026-06-30	1948333.33	/desprendibles/desprendible_3.pdf	FIRMA-0003-2026Q2	GENERADO
4	4	4	2026-06-Q2	15	2026-06-30	1600000.00	/desprendibles/desprendible_4.pdf	FIRMA-0004-2026Q2	DESCARGADO
5	5	5	2026-06-Q2	15	2026-06-30	1700000.00	/desprendibles/desprendible_5.pdf	FIRMA-0005-2026Q2	DESCARGADO
6	6	6	2026-06-Q2	15	2026-06-30	1600000.00	/desprendibles/desprendible_6.pdf	FIRMA-0006-2026Q2	DESCARGADO
7	7	7	2026-06-Q2	15	2026-06-30	1600000.00	/desprendibles/desprendible_7.pdf	FIRMA-0007-2026Q2	DESCARGADO
8	8	8	2026-06-Q2	15	2026-06-30	1600000.00	/desprendibles/desprendible_8.pdf	FIRMA-0008-2026Q2	DESCARGADO
9	9	9	2026-06-Q2	15	2026-06-30	1500000.00	/desprendibles/desprendible_9.pdf	FIRMA-0009-2026Q2	DESCARGADO
10	10	13	2026-06-Q2	15	2026-06-30	800000.00	/desprendibles/desprendible_10.pdf	FIRMA-0010-2026Q2	GENERADO
11	11	14	2026-06-Q2	15	2026-06-30	850000.00	/desprendibles/desprendible_11.pdf	FIRMA-0011-2026Q2	GENERADO
12	12	15	2026-06-Q2	15	2026-06-30	1100000.00	/desprendibles/desprendible_12.pdf	FIRMA-0012-2026Q2	GENERADO
13	13	16	2026-06-Q2	15	2026-06-30	900000.00	/desprendibles/desprendible_13.pdf	FIRMA-0013-2026Q2	GENERADO
14	14	17	2026-06-Q2	15	2026-06-30	1100000.00	/desprendibles/desprendible_14.pdf	FIRMA-0014-2026Q2	DESCARGADO
15	15	18	2026-06-Q2	15	2026-06-30	750000.00	/desprendibles/desprendible_15.pdf	FIRMA-0015-2026Q2	DESCARGADO
16	16	19	2026-06-Q2	15	2026-06-30	1228333.33	/desprendibles/desprendible_16.pdf	FIRMA-0016-2026Q2	DESCARGADO
17	17	20	2026-06-Q2	15	2026-06-30	900000.00	/desprendibles/desprendible_17.pdf	FIRMA-0017-2026Q2	DESCARGADO
18	18	21	2026-06-Q2	15	2026-06-30	937500.00	/desprendibles/desprendible_18.pdf	FIRMA-0018-2026Q2	GENERADO
19	19	22	2026-06-Q2	15	2026-06-30	750000.00	/desprendibles/desprendible_19.pdf	FIRMA-0019-2026Q2	DESCARGADO
20	20	23	2026-06-Q2	15	2026-06-30	1050000.00	/desprendibles/desprendible_20.pdf	FIRMA-0020-2026Q2	DESCARGADO
21	21	24	2026-06-Q2	15	2026-06-30	1041666.67	/desprendibles/desprendible_21.pdf	FIRMA-0021-2026Q2	DESCARGADO
22	22	25	2026-06-Q2	15	2026-06-30	1116666.67	/desprendibles/desprendible_22.pdf	FIRMA-0022-2026Q2	DESCARGADO
23	23	26	2026-06-Q2	15	2026-06-30	711750.00	/desprendibles/desprendible_23.pdf	FIRMA-0023-2026Q2	GENERADO
24	24	27	2026-06-Q2	15	2026-06-30	837500.00	/desprendibles/desprendible_24.pdf	FIRMA-0024-2026Q2	DESCARGADO
25	25	28	2026-06-Q2	15	2026-06-30	825000.00	/desprendibles/desprendible_25.pdf	FIRMA-0025-2026Q2	DESCARGADO
26	26	29	2026-06-Q2	15	2026-06-30	875000.00	/desprendibles/desprendible_26.pdf	FIRMA-0026-2026Q2	DESCARGADO
27	27	30	2026-06-Q2	15	2026-06-30	950000.00	/desprendibles/desprendible_27.pdf	FIRMA-0027-2026Q2	DESCARGADO
28	28	31	2026-06-Q2	15	2026-06-30	825000.00	/desprendibles/desprendible_28.pdf	FIRMA-0028-2026Q2	DESCARGADO
29	29	32	2026-06-Q2	15	2026-06-30	875000.00	/desprendibles/desprendible_29.pdf	FIRMA-0029-2026Q2	DESCARGADO
30	30	33	2026-06-Q2	15	2026-06-30	711750.00	/desprendibles/desprendible_30.pdf	FIRMA-0030-2026Q2	DESCARGADO
31	31	34	2026-06-Q2	15	2026-06-30	1005625.00	/desprendibles/desprendible_31.pdf	FIRMA-0031-2026Q2	GENERADO
32	32	35	2026-06-Q2	15	2026-06-30	1145833.33	/desprendibles/desprendible_32.pdf	FIRMA-0032-2026Q2	DESCARGADO
33	33	36	2026-06-Q2	15	2026-06-30	825000.00	/desprendibles/desprendible_33.pdf	FIRMA-0033-2026Q2	DESCARGADO
34	34	37	2026-06-Q2	15	2026-06-30	900000.00	/desprendibles/desprendible_34.pdf	FIRMA-0034-2026Q2	DESCARGADO
35	35	38	2026-06-Q2	15	2026-06-30	837500.00	/desprendibles/desprendible_35.pdf	FIRMA-0035-2026Q2	DESCARGADO
36	36	39	2026-06-Q2	15	2026-06-30	950000.00	/desprendibles/desprendible_36.pdf	FIRMA-0036-2026Q2	GENERADO
37	37	12	2026-06-Q2	15	2026-06-30	900000.00	/desprendibles/desprendible_37.pdf	FIRMA-0037-2026Q2	GENERADO
\.


--
-- TOC entry 5518 (class 0 OID 18307)
-- Dependencies: 272
-- Data for Name: detalle_nomina; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detalle_nomina (id_detalle_nomina, id_nomina, id_empleado, horas_ordinarias, horas_extra, dominicales_festivos, viaticos, incapacidades, descuentos_prestamos, neto_pagar) FROM stdin;
1	1	1	88	0	0	50000.00	0.00	0.00	1350000.00
2	1	2	88	0	0	0.00	0.00	0.00	1300000.00
3	1	3	88	0	8	50000.00	0.00	0.00	1948333.33
4	1	4	88	0	0	0.00	0.00	0.00	1600000.00
5	1	5	88	0	0	0.00	0.00	0.00	1700000.00
6	1	6	88	0	0	0.00	0.00	0.00	1600000.00
7	1	7	88	0	0	0.00	0.00	0.00	1600000.00
8	1	8	88	0	0	0.00	0.00	0.00	1600000.00
9	1	9	88	0	0	0.00	0.00	0.00	1500000.00
10	1	13	88	0	0	50000.00	0.00	0.00	800000.00
11	1	14	88	0	0	0.00	0.00	50000.00	850000.00
12	1	15	88	0	0	0.00	0.00	0.00	1100000.00
13	1	16	88	0	0	0.00	0.00	0.00	900000.00
14	1	17	88	0	0	50000.00	0.00	50000.00	1100000.00
15	1	18	88	0	0	0.00	0.00	0.00	750000.00
16	1	19	88	0	8	0.00	0.00	0.00	1228333.33
17	1	20	88	0	0	0.00	0.00	0.00	900000.00
18	1	21	88	4	0	0.00	0.00	0.00	937500.00
19	1	22	88	0	0	0.00	0.00	0.00	750000.00
20	1	23	88	0	0	0.00	0.00	50000.00	1050000.00
21	1	24	88	4	0	50000.00	0.00	50000.00	1041666.67
22	1	25	88	0	8	0.00	0.00	0.00	1116666.67
23	1	26	88	0	0	0.00	0.00	0.00	711750.00
24	1	27	88	0	8	0.00	0.00	0.00	837500.00
25	1	28	88	0	0	0.00	0.00	0.00	825000.00
26	1	29	88	0	0	50000.00	0.00	0.00	875000.00
27	1	30	88	0	0	0.00	0.00	50000.00	950000.00
28	1	31	88	0	0	0.00	0.00	0.00	825000.00
29	1	32	88	0	0	50000.00	0.00	0.00	875000.00
30	1	33	88	0	0	0.00	0.00	0.00	711750.00
31	1	34	88	4	8	50000.00	0.00	0.00	1005625.00
32	1	35	88	4	0	0.00	0.00	0.00	1145833.33
33	1	36	88	0	0	0.00	0.00	0.00	825000.00
34	1	37	88	0	0	0.00	0.00	0.00	900000.00
35	1	38	88	0	8	0.00	0.00	0.00	837500.00
36	1	39	88	0	0	50000.00	0.00	0.00	950000.00
37	1	12	0	0	0	0.00	900000.00	0.00	900000.00
\.


--
-- TOC entry 5484 (class 0 OID 17817)
-- Dependencies: 238
-- Data for Name: empleado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.empleado (id_empleado, id_usuario, id_supervisor, tipo_documento, numero_documento, fecha_nacimiento, calle, barrio, ciudad, telefono, correo_personal, cargo, fecha_ingreso, salario, forma_pago, banco, numero_cuenta, estado_laboral) FROM stdin;
1	2	\N	CC	1050119651	2003-08-04	Calle 19 # 91-81	Kennedy	Bogota	3158800797	laura.munoz30@gmail.com	Analista de Recursos Humanos	2022-04-03	2600000.00	CONSIGNACION	Bancolombia	1945826486	ACTIVO
2	3	\N	CC	1069008866	1987-11-16	Calle 147 # 74-61	Engativa	Bogota	3131944441	manuel.perez61@gmail.com	Analista de Recursos Humanos	2022-09-05	2600000.00	EFECTIVO	\N	\N	ACTIVO
3	4	\N	CC	1088447167	1992-07-14	Calle 168 # 83-13	Kennedy	Bogota	3157854710	ricardo.gil52@gmail.com	Supervisor de Obra	2023-06-02	3400000.00	EFECTIVO	\N	\N	ACTIVO
4	5	\N	CC	1025529407	1998-03-14	Calle 13 # 84-70	Kennedy	Bogota	3171979055	patricia.vargas12@gmail.com	Supervisor de Obra	2023-03-15	3200000.00	CONSIGNACION	Bancolombia	3363629219	ACTIVO
5	6	\N	CC	1064606833	1995-01-06	Calle 179 # 94-72	Chapinero	Bogota	3128688676	julian.ramirez20@gmail.com	Supervisor de Obra	2023-01-13	3400000.00	CONSIGNACION	Banco de Bogota	6520103410	ACTIVO
6	7	\N	CC	1077736262	1973-12-11	Calle 15 # 66-11	Suba	Bogota	3198748972	edwin.sanchez9@gmail.com	Supervisor de Obra	2023-01-19	3200000.00	CONSIGNACION	Banco Popular	3281169403	ACTIVO
7	8	\N	CC	1054193837	1985-10-20	Calle 172 # 92-41	Engativa	Bogota	3116090908	luis.mejia34@gmail.com	Supervisor de Obra	2023-05-03	3200000.00	CONSIGNACION	Banco Popular	2119980130	ACTIVO
8	9	\N	CC	1040264926	1990-02-01	Calle 130 # 34-17	Ciudad Bolivar	Bogota	3161367643	gustavo.garcia9@gmail.com	Contador de Nomina	2022-10-19	3200000.00	CONSIGNACION	Bancolombia	3309122187	ACTIVO
9	10	\N	CC	1058812137	1989-10-26	Calle 77 # 85-14	Suba	Bogota	3172909480	diana.alvarez34@gmail.com	Contador de Nomina	2022-11-27	3000000.00	EFECTIVO	\N	\N	ACTIVO
10	11	1	CC	1020863865	1988-10-07	Calle 71 # 6-1	Ciudad Bolivar	Bogota	3136553958	martha.gomez99@gmail.com	Operador de Maquinaria	2025-08-09	1500000.00	CONSIGNACION	Bancolombia	8019198243	RETIRADO
11	12	2	CC	1059302158	1997-09-01	Calle 111 # 17-6	Fontibon	Bogota	3174045292	sergio.pena47@gmail.com	Ayudante de Obra	2025-01-27	1423500.00	CONSIGNACION	Banco Popular	3373077218	RETIRADO
12	13	3	CC	1033491314	1976-06-25	Calle 86 # 53-86	Engativa	Bogota	3189514287	cristian.suarez35@gmail.com	Almacenista de Obra	2023-03-26	1800000.00	CONSIGNACION	Banco de Bogota	1106456634	INCAPACITADO
13	14	4	CC	1063174945	1982-08-12	Calle 90 # 83-66	Usaquen	Bogota	3129854548	wilson.jimenez87@gmail.com	Soldador	2023-11-07	1500000.00	CONSIGNACION	BBVA	8616379926	ACTIVO
14	15	5	CC	1035059710	1986-01-04	Calle 131 # 15-50	Engativa	Bogota	3123966966	jorge.rojas33@gmail.com	Ayudante de Plomeria	2025-06-14	1800000.00	EFECTIVO	\N	\N	ACTIVO
15	16	1	CC	1072269803	1982-06-14	Calle 171 # 53-42	Usaquen	Bogota	3192188405	sandra.cadena90@gmail.com	Ayudante de Obra	2025-06-22	2200000.00	CONSIGNACION	BBVA	7473041886	ACTIVO
16	17	2	CC	1089245317	1981-10-19	Calle 114 # 57-87	Engativa	Bogota	3150888017	adriana.diaz66@gmail.com	Soldador	2024-05-07	1800000.00	CONSIGNACION	Banco Popular	6679017210	ACTIVO
17	18	3	CC	1038089166	1991-02-27	Calle 107 # 81-74	Engativa	Bogota	3169182797	carolina.ortiz92@gmail.com	Electricista	2023-04-05	2200000.00	CONSIGNACION	Bancolombia	5607762160	ACTIVO
18	19	4	CC	1019806690	1970-02-25	Calle 117 # 18-60	Ciudad Bolivar	Bogota	3188054615	viviana.martinez97@gmail.com	Plomero	2025-09-15	1500000.00	CONSIGNACION	Banco Popular	4643576871	ACTIVO
19	20	5	CC	1021361812	2000-08-09	Calle 74 # 31-35	Ciudad Bolivar	Bogota	3199811743	liliana.ruiz41@gmail.com	Electricista	2025-08-21	2200000.00	CONSIGNACION	BBVA	2889238423	ACTIVO
20	21	1	CC	1031039390	1979-12-07	Calle 150 # 90-3	Usaquen	Bogota	3151410126	nicolas.bermudez62@gmail.com	Ayudante de Obra	2024-09-15	1800000.00	CONSIGNACION	Bancolombia	7099469983	ACTIVO
21	22	2	CC	1056240084	1984-08-08	Calle 174 # 52-93	Suba	Bogota	3172238741	yolanda.moreno60@gmail.com	Soldador	2023-07-11	1800000.00	EFECTIVO	\N	\N	ACTIVO
22	23	3	CC	1075751409	1971-02-21	Calle 84 # 44-98	Usaquen	Bogota	3188986321	camilo.romero36@gmail.com	Plomero	2023-01-09	1500000.00	CONSIGNACION	BBVA	6204041308	ACTIVO
23	24	4	CC	1002601580	1973-06-08	Calle 33 # 61-86	Bosa	Bogota	3172399599	alejandro.rodriguez73@gmail.com	Ayudante de Obra	2023-04-07	2200000.00	CONSIGNACION	Banco Popular	1654477195	ACTIVO
24	25	5	CC	1049512272	1977-03-10	Calle 152 # 89-81	Engativa	Bogota	3122520277	angela.torres14@gmail.com	Ayudante de Obra	2024-10-22	2000000.00	CONSIGNACION	Banco de Bogota	1851819913	ACTIVO
25	26	1	CC	1046600900	1997-11-12	Calle 46 # 94-67	Fontibon	Bogota	3171503856	maria.herrera79@gmail.com	Ayudante de Obra	2023-07-27	2000000.00	CONSIGNACION	Bancolombia	5952059278	ACTIVO
26	27	2	CC	1098116677	1987-06-28	Calle 8 # 64-42	Suba	Bogota	3179520597	diego.nino63@gmail.com	Electricista	2024-04-25	1423500.00	CONSIGNACION	Banco Popular	6922713963	ACTIVO
27	28	3	CC	1037535126	1987-09-01	Calle 177 # 61-83	Chapinero	Bogota	3180014570	hector.salazar58@gmail.com	Almacenista de Obra	2023-12-14	1500000.00	CONSIGNACION	Banco Popular	4256292393	ACTIVO
28	29	4	CC	1054277800	1985-05-22	Calle 180 # 59-35	Fontibon	Bogota	3192850100	andres.castro33@gmail.com	Ayudante de Plomeria	2025-09-12	1650000.00	CONSIGNACION	Banco Popular	6715705115	ACTIVO
29	30	5	CC	1042352128	1981-04-07	Calle 4 # 91-69	Suba	Bogota	3116046365	mauricio.lopez36@gmail.com	Pintor	2023-04-10	1650000.00	CONSIGNACION	BBVA	6065662867	ACTIVO
30	31	1	CC	1093605777	2001-02-28	Calle 65 # 62-15	Bosa	Bogota	3116948946	fernando.cardenas52@gmail.com	Oficial de Construccion	2024-08-15	2000000.00	CONSIGNACION	Davivienda	5146780827	ACTIVO
31	32	2	CC	1092133896	1979-03-26	Calle 134 # 49-58	Chapinero	Bogota	3107195288	felipe.munoz39@gmail.com	Ayudante de Plomeria	2023-02-18	1650000.00	CONSIGNACION	Banco Popular	3656086594	ACTIVO
32	33	3	CC	1083352876	1976-04-21	Calle 20 # 21-1	Usaquen	Bogota	3108083974	paola.perez58@gmail.com	Electricista	2023-04-06	1650000.00	EFECTIVO	\N	\N	ACTIVO
33	34	4	CC	1031068214	1988-12-28	Calle 51 # 55-15	Engativa	Bogota	3138668783	ivan.gil83@gmail.com	Pintor	2024-11-19	1423500.00	EFECTIVO	\N	\N	ACTIVO
34	35	5	CC	1008004482	1989-10-24	Calle 129 # 70-64	Chapinero	Bogota	3122269779	rodrigo.vargas11@gmail.com	Ayudante de Plomeria	2023-08-23	1650000.00	CONSIGNACION	Banco de Bogota	9343730920	ACTIVO
35	36	1	CC	1043261270	1986-01-03	Calle 72 # 24-75	Usaquen	Bogota	3181029073	oscar.ramirez82@gmail.com	Electricista	2025-05-19	2200000.00	CONSIGNACION	Davivienda	8093179263	ACTIVO
36	37	2	CC	1054807553	1990-11-04	Calle 103 # 98-71	Kennedy	Bogota	3144735895	carlos.sanchez59@gmail.com	Maestro de Obra	2025-08-10	1650000.00	EFECTIVO	\N	\N	ACTIVO
37	38	3	CC	1015558733	2002-01-22	Calle 161 # 57-98	Kennedy	Bogota	3154247457	natalia.mejia27@gmail.com	Almacenista de Obra	2023-04-17	1800000.00	CONSIGNACION	Banco Popular	8543865915	ACTIVO
38	39	4	CC	1093717532	1977-01-21	Calle 105 # 12-29	Bosa	Bogota	3165056916	santiago.garcia60@gmail.com	Ayudante de Plomeria	2024-09-01	1500000.00	EFECTIVO	\N	\N	ACTIVO
39	40	5	CC	1039172995	1987-07-27	Calle 18 # 36-99	Usaquen	Bogota	3168299645	miguel.alvarez44@gmail.com	Pintor	2024-09-05	1800000.00	CONSIGNACION	Davivienda	4776677517	ACTIVO
\.


--
-- TOC entry 5502 (class 0 OID 18066)
-- Dependencies: 256
-- Data for Name: evaluacion_desempeno; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.evaluacion_desempeno (id_evaluacion, id_empleado, id_evaluador, periodo, puntaje_productividad, puntaje_asistencia, puntaje_calidad, puntaje_general, recomendacion, solicita_capacitacion, fecha_evaluacion) FROM stdin;
1	1	2	2026-S1	3.9	4.2	4	4	Continuar en el cargo actual	f	2026-06-30 17:00:00
2	2	3	2026-S1	3.7	4.9	3.8	4.1	Continuar en el cargo actual	f	2026-06-30 17:00:00
3	3	3	2026-S1	4.4	3.6	4.3	4.1	Continuar en el cargo actual	f	2026-06-30 17:00:00
4	4	2	2026-S1	3.1	3.6	4.4	3.7	Se sugiere plan de mejora y seguimiento	t	2026-06-30 17:00:00
5	5	3	2026-S1	3.7	4.4	3.3	3.8	Se sugiere plan de mejora y seguimiento	t	2026-06-30 17:00:00
6	6	3	2026-S1	3.3	4.6	3.2	3.7	Se sugiere plan de mejora y seguimiento	f	2026-06-30 17:00:00
7	7	2	2026-S1	4.6	4.5	4.7	4.6	Continuar en el cargo actual	f	2026-06-30 17:00:00
8	8	3	2026-S1	4.3	4.1	3.7	4	Continuar en el cargo actual	f	2026-06-30 17:00:00
9	9	3	2026-S1	3.6	4.9	3.7	4.1	Continuar en el cargo actual	f	2026-06-30 17:00:00
10	13	4	2026-S1	3.4	5	3.3	3.9	Se sugiere plan de mejora y seguimiento	t	2026-06-30 17:00:00
11	14	5	2026-S1	4.6	4.3	4.1	4.3	Continuar en el cargo actual	f	2026-06-30 17:00:00
12	15	4	2026-S1	4.5	4.3	4.3	4.4	Continuar en el cargo actual	f	2026-06-30 17:00:00
13	16	5	2026-S1	4.8	4.4	4.2	4.5	Continuar en el cargo actual	f	2026-06-30 17:00:00
14	17	3	2026-S1	3.3	3.8	4.4	3.8	Se sugiere plan de mejora y seguimiento	f	2026-06-30 17:00:00
15	18	4	2026-S1	4.8	4.6	3.1	4.2	Continuar en el cargo actual	f	2026-06-30 17:00:00
16	19	5	2026-S1	3.7	4.6	4.9	4.4	Continuar en el cargo actual	f	2026-06-30 17:00:00
17	20	4	2026-S1	4.2	4.6	4.6	4.5	Continuar en el cargo actual	f	2026-06-30 17:00:00
18	21	5	2026-S1	3.5	3.9	4.9	4.1	Continuar en el cargo actual	f	2026-06-30 17:00:00
19	22	3	2026-S1	4.6	4.9	3.4	4.3	Continuar en el cargo actual	f	2026-06-30 17:00:00
20	23	4	2026-S1	4.4	4.4	3.9	4.2	Continuar en el cargo actual	f	2026-06-30 17:00:00
21	24	5	2026-S1	4.5	4.7	4	4.4	Continuar en el cargo actual	f	2026-06-30 17:00:00
22	25	4	2026-S1	3.8	3.7	3.4	3.6	Se sugiere plan de mejora y seguimiento	f	2026-06-30 17:00:00
23	26	5	2026-S1	4.7	3.6	4	4.1	Continuar en el cargo actual	f	2026-06-30 17:00:00
24	27	3	2026-S1	3.7	4.9	4.4	4.3	Continuar en el cargo actual	f	2026-06-30 17:00:00
25	28	4	2026-S1	4	3.7	3.2	3.6	Se sugiere plan de mejora y seguimiento	t	2026-06-30 17:00:00
26	29	5	2026-S1	3.9	4.3	4.7	4.3	Continuar en el cargo actual	f	2026-06-30 17:00:00
27	30	4	2026-S1	3.2	4.9	4.6	4.2	Continuar en el cargo actual	f	2026-06-30 17:00:00
28	31	5	2026-S1	4.8	4.9	3.8	4.5	Continuar en el cargo actual	f	2026-06-30 17:00:00
29	32	3	2026-S1	3.8	4.1	3.8	3.9	Se sugiere plan de mejora y seguimiento	t	2026-06-30 17:00:00
30	33	4	2026-S1	3.4	4	3.2	3.5	Se sugiere plan de mejora y seguimiento	f	2026-06-30 17:00:00
31	34	5	2026-S1	3.7	3.7	3.1	3.5	Se sugiere plan de mejora y seguimiento	f	2026-06-30 17:00:00
32	35	4	2026-S1	3.9	4.7	4.5	4.4	Continuar en el cargo actual	f	2026-06-30 17:00:00
33	36	5	2026-S1	3.9	4.4	4.8	4.4	Continuar en el cargo actual	f	2026-06-30 17:00:00
34	37	3	2026-S1	3	3.8	3.3	3.4	Se sugiere plan de mejora y seguimiento	f	2026-06-30 17:00:00
35	38	4	2026-S1	4.2	4.1	4.6	4.3	Continuar en el cargo actual	f	2026-06-30 17:00:00
36	39	5	2026-S1	3.5	3.7	3.5	3.6	Se sugiere plan de mejora y seguimiento	f	2026-06-30 17:00:00
\.


--
-- TOC entry 5488 (class 0 OID 17881)
-- Dependencies: 242
-- Data for Name: historial_laboral; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_laboral (id_historial, id_empleado, id_responsable, tipo_movimiento, valor_anterior, valor_nuevo, fecha_movimiento, observacion) FROM stdin;
1	1	3	INGRESO	\N	Analista de Recursos Humanos	2022-04-03 09:00:00	Ingreso del empleado a la empresa
2	2	3	INGRESO	\N	Analista de Recursos Humanos	2022-09-05 09:00:00	Ingreso del empleado a la empresa
3	3	2	INGRESO	\N	Supervisor de Obra	2023-06-02 09:00:00	Ingreso del empleado a la empresa
4	4	3	INGRESO	\N	Supervisor de Obra	2023-03-15 09:00:00	Ingreso del empleado a la empresa
5	5	3	INGRESO	\N	Supervisor de Obra	2023-01-13 09:00:00	Ingreso del empleado a la empresa
6	6	3	INGRESO	\N	Supervisor de Obra	2023-01-19 09:00:00	Ingreso del empleado a la empresa
7	7	3	INGRESO	\N	Supervisor de Obra	2023-05-03 09:00:00	Ingreso del empleado a la empresa
8	8	3	INGRESO	\N	Contador de Nomina	2022-10-19 09:00:00	Ingreso del empleado a la empresa
9	9	3	INGRESO	\N	Contador de Nomina	2022-11-27 09:00:00	Ingreso del empleado a la empresa
10	10	3	INGRESO	\N	Operador de Maquinaria	2025-08-09 09:00:00	Ingreso del empleado a la empresa
11	11	2	INGRESO	\N	Ayudante de Obra	2025-01-27 09:00:00	Ingreso del empleado a la empresa
12	12	2	INGRESO	\N	Almacenista de Obra	2023-03-26 09:00:00	Ingreso del empleado a la empresa
13	13	3	INGRESO	\N	Soldador	2023-11-07 09:00:00	Ingreso del empleado a la empresa
14	14	2	INGRESO	\N	Ayudante de Plomeria	2025-06-14 09:00:00	Ingreso del empleado a la empresa
15	15	3	INGRESO	\N	Ayudante de Obra	2025-06-22 09:00:00	Ingreso del empleado a la empresa
16	16	2	INGRESO	\N	Soldador	2024-05-07 09:00:00	Ingreso del empleado a la empresa
17	17	3	INGRESO	\N	Electricista	2023-04-05 09:00:00	Ingreso del empleado a la empresa
18	18	3	INGRESO	\N	Plomero	2025-09-15 09:00:00	Ingreso del empleado a la empresa
19	19	3	INGRESO	\N	Electricista	2025-08-21 09:00:00	Ingreso del empleado a la empresa
20	20	3	INGRESO	\N	Ayudante de Obra	2024-09-15 09:00:00	Ingreso del empleado a la empresa
21	21	2	INGRESO	\N	Soldador	2023-07-11 09:00:00	Ingreso del empleado a la empresa
22	22	3	INGRESO	\N	Plomero	2023-01-09 09:00:00	Ingreso del empleado a la empresa
23	23	2	INGRESO	\N	Ayudante de Obra	2023-04-07 09:00:00	Ingreso del empleado a la empresa
24	24	2	INGRESO	\N	Ayudante de Obra	2024-10-22 09:00:00	Ingreso del empleado a la empresa
25	25	3	INGRESO	\N	Ayudante de Obra	2023-07-27 09:00:00	Ingreso del empleado a la empresa
26	26	2	INGRESO	\N	Electricista	2024-04-25 09:00:00	Ingreso del empleado a la empresa
27	27	3	INGRESO	\N	Almacenista de Obra	2023-12-14 09:00:00	Ingreso del empleado a la empresa
28	28	2	INGRESO	\N	Ayudante de Plomeria	2025-09-12 09:00:00	Ingreso del empleado a la empresa
29	29	3	INGRESO	\N	Pintor	2023-04-10 09:00:00	Ingreso del empleado a la empresa
30	30	2	INGRESO	\N	Oficial de Construccion	2024-08-15 09:00:00	Ingreso del empleado a la empresa
31	31	2	INGRESO	\N	Ayudante de Plomeria	2023-02-18 09:00:00	Ingreso del empleado a la empresa
32	32	3	INGRESO	\N	Electricista	2023-04-06 09:00:00	Ingreso del empleado a la empresa
33	33	2	INGRESO	\N	Pintor	2024-11-19 09:00:00	Ingreso del empleado a la empresa
34	34	2	INGRESO	\N	Ayudante de Plomeria	2023-08-23 09:00:00	Ingreso del empleado a la empresa
35	35	3	INGRESO	\N	Electricista	2025-05-19 09:00:00	Ingreso del empleado a la empresa
36	36	3	INGRESO	\N	Maestro de Obra	2025-08-10 09:00:00	Ingreso del empleado a la empresa
37	37	3	INGRESO	\N	Almacenista de Obra	2023-04-17 09:00:00	Ingreso del empleado a la empresa
38	38	3	INGRESO	\N	Ayudante de Plomeria	2024-09-01 09:00:00	Ingreso del empleado a la empresa
39	39	2	INGRESO	\N	Pintor	2024-09-05 09:00:00	Ingreso del empleado a la empresa
40	10	3	RETIRO	ACTIVO	RETIRADO	2026-05-28 15:00:00	Retiro registrado en el sistema
41	11	3	RETIRO	ACTIVO	RETIRADO	2026-05-11 15:00:00	Retiro registrado en el sistema
\.


--
-- TOC entry 5498 (class 0 OID 18006)
-- Dependencies: 252
-- Data for Name: hora_extra; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hora_extra (id_hora_extra, id_empleado, id_aprobador, motivo, fecha_inicio, fecha_fin, cantidad_horas, tipo_hora, archivo_soporte_url, estado_he) FROM stdin;
1	37	3	Avance de obra por entrega de cronograma	2026-05-15	2026-05-15	4	FESTIVA	/soportes/he_emp37.pdf	RECHAZADA
2	31	5	Avance de obra por entrega de cronograma	2026-06-15	2026-06-15	3	DOMINICAL	/soportes/he_emp31.pdf	APROBADA
3	32	3	Avance de obra por entrega de cronograma	2026-06-04	2026-06-04	3	FESTIVA	/soportes/he_emp32.pdf	PENDIENTE
4	15	4	Avance de obra por entrega de cronograma	2026-05-22	2026-05-22	4	DIURNA_DOMINICAL	/soportes/he_emp15.pdf	RECHAZADA
5	14	5	Avance de obra por entrega de cronograma	2026-06-22	2026-06-22	3	DIURNA	/soportes/he_emp14.pdf	APROBADA
6	17	3	Avance de obra por entrega de cronograma	2026-05-20	2026-05-20	2	DIURNA	/soportes/he_emp17.pdf	APROBADA
7	18	4	Avance de obra por entrega de cronograma	2026-05-07	2026-05-07	2	DOMINICAL	/soportes/he_emp18.pdf	APROBADA
8	39	5	Avance de obra por entrega de cronograma	2026-05-04	2026-05-04	2	FESTIVA	/soportes/he_emp39.pdf	RECHAZADA
9	35	4	Avance de obra por entrega de cronograma	2026-04-05	2026-04-05	3	DIURNA_DOMINICAL	/soportes/he_emp35.pdf	APROBADA
10	36	5	Avance de obra por entrega de cronograma	2026-06-18	2026-06-18	4	DOMINICAL	/soportes/he_emp36.pdf	PENDIENTE
\.


--
-- TOC entry 5514 (class 0 OID 18239)
-- Dependencies: 268
-- Data for Name: liquidacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.liquidacion (id_liquidacion, id_empleado, id_configuracion, fecha_retiro, motivo_retiro, salario_promedio, dias_trabajados, cesantias, intereses_cesantias, prima, vacaciones, indemnizacion, dotacion_pendiente, total_neto_pagar, notas_adicionales) FROM stdin;
1	10	1	2026-05-28	RENUNCIA	1500000.00	284	1183333.33	112022.22	1183333.33	591666.67	0.00	0.00	3070355.55	Liquidacion final procesada por RRHH
2	11	1	2026-05-11	MUTUO_ACUERDO	1423500.00	478	1890091.67	301154.61	1890091.67	945045.83	0.00	0.00	5026383.78	Liquidacion final procesada por RRHH
\.


--
-- TOC entry 5468 (class 0 OID 17667)
-- Dependencies: 222
-- Data for Name: modulo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.modulo (id_modulo, nombre, descripcion) FROM stdin;
1	EMPLEADOS	Gestión de empleados
2	ASISTENCIA	Gestión y consulta de asistencia
3	TURNOS	Gestión y asignación de turnos
4	HORAS_EXTRAS	Gestión de horas extras
5	PROYECTOS	Gestión de proyectos y asignaciones
6	CONTRATOS	Gestión de contratos
7	PRESTAMOS	Gestión de préstamos
8	LIQUIDACIONES	Gestión de liquidaciones
9	NOMINA	Gestión de nómina
10	PILA	Gestión de información PILA
11	REPORTES	Consulta y generación de reportes
12	CONFIGURACION	Configuración del sistema
13	CALENDARIO	Gestión del calendario laboral
14	USUARIOS	Gestión de usuarios y administración de permisos
\.


--
-- TOC entry 5516 (class 0 OID 18272)
-- Dependencies: 270
-- Data for Name: nomina; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nomina (id_nomina, id_obra, id_configuracion, id_admin_rrhh, periodo_inicio, periodo_fin, tipo_nomina, fecha_generacion, estado_nomina, total_pagado, cantidad_empleados) FROM stdin;
1	\N	1	1	2026-06-16	2026-06-30	QUINCENAL	2026-06-30 20:00:00	PAGADA	39897458.33	37
\.


--
-- TOC entry 5528 (class 0 OID 18454)
-- Dependencies: 282
-- Data for Name: notificacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notificacion (id_notificacion, id_destinatario, tipo, mensaje, fecha_envio, leida) FROM stdin;
1	37	ALERTA_CERT	Tu certificacion esta proxima a vencer, agenda su renovacion.	2026-05-07 16:00:00	f
2	20	SOLICITUD_RESPONDIDA	Tu solicitud ha sido respondida, revisa el detalle en la plataforma.	2026-05-02 07:00:00	t
3	6	ALERTA_CERT	Tu certificacion esta proxima a vencer, agenda su renovacion.	2026-06-17 14:00:00	t
4	26	SOLICITUD_RESPONDIDA	Tu solicitud ha sido respondida, revisa el detalle en la plataforma.	2026-05-11 16:00:00	f
5	34	ALERTA_CONTRATO	Tu contrato esta proximo a vencer, comunicate con RRHH.	2026-06-20 18:00:00	f
6	30	SOLICITUD_RESPONDIDA	Tu solicitud ha sido respondida, revisa el detalle en la plataforma.	2026-06-17 15:00:00	f
7	19	SOLICITUD_RESPONDIDA	Tu solicitud ha sido respondida, revisa el detalle en la plataforma.	2026-06-16 07:00:00	f
8	9	ALERTA_CERT	Tu certificacion esta proxima a vencer, agenda su renovacion.	2026-05-14 16:00:00	f
9	38	PAGO_NOMINA	Tu comprobante de pago de la quincena ya esta disponible.	2026-06-09 17:00:00	t
10	5	PAGO_NOMINA	Tu comprobante de pago de la quincena ya esta disponible.	2026-06-06 15:00:00	f
11	14	ALERTA_CONTRATO	Tu contrato esta proximo a vencer, comunicate con RRHH.	2026-05-02 16:00:00	t
12	13	ALERTA_CONTRATO	Tu contrato esta proximo a vencer, comunicate con RRHH.	2026-05-15 12:00:00	f
13	27	ALERTA_CONTRATO	Tu contrato esta proximo a vencer, comunicate con RRHH.	2026-06-23 10:00:00	f
14	12	SOLICITUD_RESPONDIDA	Tu solicitud ha sido respondida, revisa el detalle en la plataforma.	2026-06-28 18:00:00	t
15	36	ALERTA_CONTRATO	Tu contrato esta proximo a vencer, comunicate con RRHH.	2026-05-18 12:00:00	f
\.


--
-- TOC entry 5496 (class 0 OID 17979)
-- Dependencies: 250
-- Data for Name: novedad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.novedad (id_novedad, id_empleado, id_aprobado_por, tipo_novedad, fecha_inicio, fecha_fin, total_dias, soporte_url, estado_novedad) FROM stdin;
1	4	1	INCAPACIDAD_ARL	2026-06-08	2026-06-08	1	/soportes/novedad_emp4.pdf	APROBADA
2	22	6	AUSENCIA_INJUSTIFICADA	2026-05-04	2026-05-05	2	\N	APROBADA
3	23	7	PERMISO_NO_REMUNERADO	2026-03-20	2026-03-22	3	\N	APROBADA
4	26	5	INCAPACIDAD_EPS	2026-04-09	2026-04-11	3	/soportes/novedad_emp26.pdf	APROBADA
5	7	1	PERMISO_REMUNERADO	2026-05-01	2026-05-01	1	\N	APROBADA
6	38	\N	AUSENCIA_INJUSTIFICADA	2026-06-03	2026-06-03	1	\N	PENDIENTE
7	20	4	INCAPACIDAD_EPS	2026-04-13	2026-04-14	2	/soportes/novedad_emp20.pdf	RECHAZADA
8	35	4	PERMISO_REMUNERADO	2026-04-12	2026-04-13	2	\N	APROBADA
\.


--
-- TOC entry 5500 (class 0 OID 18037)
-- Dependencies: 254
-- Data for Name: observacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.observacion (id_observacion, id_empleado, id_supervisor, tipo_observacion, descripcion, fecha, escalada, estado_observacion) FROM stdin;
1	25	1	COMENTARIO	Buen desempeno general durante la semana de trabajo.	2026-05-06 15:00:00	f	RESUELTA
2	36	2	INCIDENCIA	Se presento un incidente menor en la zona de trabajo, sin heridos.	2026-03-14 09:00:00	t	RESUELTA
3	14	5	RECONOCIMIENTO	Se reconoce el cumplimiento sobresaliente de metas en la obra.	2026-03-13 12:00:00	f	RESUELTA
4	26	2	INCIDENCIA	Se presento un incidente menor en la zona de trabajo, sin heridos.	2026-04-11 10:00:00	t	RESUELTA
5	13	4	COMENTARIO	Buen desempeno general durante la semana de trabajo.	2026-04-25 13:00:00	f	NOTIFICADA
6	27	3	LLAMADO_ATENCION	Se llama la atencion por no usar el equipo de proteccion personal.	2026-04-04 10:00:00	t	REGISTRADA
7	15	1	LLAMADO_ATENCION	Se llama la atencion por no usar el equipo de proteccion personal.	2026-03-06 15:00:00	f	RESUELTA
8	23	4	RECONOCIMIENTO	Se reconoce el cumplimiento sobresaliente de metas en la obra.	2026-05-28 13:00:00	f	REGISTRADA
9	31	2	RECONOCIMIENTO	Se reconoce el cumplimiento sobresaliente de metas en la obra.	2026-03-16 15:00:00	f	RESUELTA
10	38	4	INCIDENCIA	Se presento un incidente menor en la zona de trabajo, sin heridos.	2026-05-19 08:00:00	f	REGISTRADA
11	39	5	INCIDENCIA	Se presento un incidente menor en la zona de trabajo, sin heridos.	2026-06-15 08:00:00	t	NOTIFICADA
12	30	1	COMENTARIO	Buen desempeno general durante la semana de trabajo.	2026-03-20 16:00:00	f	NOTIFICADA
13	17	3	RECONOCIMIENTO	Se reconoce el cumplimiento sobresaliente de metas en la obra.	2026-03-15 11:00:00	f	NOTIFICADA
14	37	3	RECONOCIMIENTO	Se reconoce el cumplimiento sobresaliente de metas en la obra.	2026-04-02 15:00:00	f	REGISTRADA
15	19	5	INCIDENCIA	Se presento un incidente menor en la zona de trabajo, sin heridos.	2026-03-17 10:00:00	t	RESUELTA
\.


--
-- TOC entry 5466 (class 0 OID 17656)
-- Dependencies: 220
-- Data for Name: perfil; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.perfil (id_perfil, nombre, descripcion) FROM stdin;
1	ADMIN_RRHH	Perfil técnico de autorización para administración de recursos humanos
2	SUPERVISOR	Perfil técnico de autorización para supervisión de obra
3	CONTADOR	Perfil técnico de autorización para procesos contables y de nómina
4	EMPLEADO	Perfil técnico de autorización para acceso del empleado
\.


--
-- TOC entry 5472 (class 0 OID 17689)
-- Dependencies: 226
-- Data for Name: permiso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permiso (id_permiso, id_perfil, id_modulo, id_accion) FROM stdin;
1	2	2	1
2	2	2	2
3	2	13	1
4	2	6	1
5	2	1	1
6	2	4	1
7	2	4	2
8	2	9	1
9	2	9	6
10	2	7	1
11	2	5	1
12	2	5	9
13	2	11	1
14	2	11	6
15	2	3	1
16	2	3	2
17	3	9	1
18	3	9	7
19	3	8	7
20	3	10	1
21	3	10	2
22	4	1	1
23	4	9	1
24	4	9	5
25	4	7	1
26	1	1	1
27	1	1	2
28	1	1	3
29	1	1	4
30	1	1	6
31	1	2	1
32	1	2	2
33	1	2	3
34	1	3	1
35	1	3	2
36	1	3	3
37	1	3	9
38	1	4	1
39	1	4	2
40	1	4	3
41	1	4	8
42	1	5	1
43	1	5	2
44	1	5	3
45	1	5	9
46	1	6	1
47	1	6	2
48	1	6	3
49	1	7	1
50	1	7	2
51	1	7	3
52	1	7	8
53	1	8	1
54	1	8	7
55	1	8	8
56	1	9	1
57	1	9	7
58	1	9	8
59	1	10	1
60	1	10	7
61	1	10	10
62	1	11	1
63	1	11	6
64	1	12	1
65	1	12	3
66	1	13	1
67	1	13	2
68	1	14	1
69	1	14	2
70	1	14	3
71	1	14	4
\.


--
-- TOC entry 5522 (class 0 OID 18374)
-- Dependencies: 276
-- Data for Name: pila; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pila (id_pila, id_nomina, periodo_inicio, periodo_fin, total_salud, total_pension, total_arl, total_paraestatales, archivo_txt, estado_validacion) FROM stdin;
1	1	2026-06-16	2026-06-30	3033880.00	3033880.00	2948303.85	2034000.00	/pila/pila_2026_06_q2.txt	VALIDADO
\.


--
-- TOC entry 5510 (class 0 OID 18185)
-- Dependencies: 264
-- Data for Name: prestamo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prestamo (id_prestamo, id_empleado, tipo_obligacion, valor_total, numero_cuotas, valor_cuota, cuotas_pagadas, saldo_pendiente, fecha_inicio, observacion, estado_prestamo) FROM stdin;
1	17	EMBARGO_JUDICIAL	800000.00	8	100000.00	7	100000.00	2026-04-21	Embargo judicial notificado por autoridad competente	ACTIVO
2	14	EMBARGO_JUDICIAL	800000.00	4	200000.00	0	800000.00	2026-04-02	Embargo judicial notificado por autoridad competente	ACTIVO
3	24	PRESTAMO_EMPRESA	1000000.00	4	250000.00	0	1000000.00	2026-01-11	Prestamo de libre inversion descontado por nomina	ACTIVO
4	30	EMBARGO_JUDICIAL	1000000.00	8	125000.00	6	250000.00	2026-04-09	Embargo judicial notificado por autoridad competente	ACTIVO
5	23	PRESTAMO_EMPRESA	500000.00	8	62500.00	3	312500.00	2026-03-28	Prestamo de libre inversion descontado por nomina	ACTIVO
\.


--
-- TOC entry 5482 (class 0 OID 17794)
-- Dependencies: 236
-- Data for Name: proyecto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.proyecto (id_proyecto, id_supervisor, nombre, descripcion, ubicacion_calle, ubicacion_referencia, fecha_inicio, fecha_fin, estado_proyecto) FROM stdin;
10	1	Conjunto Residencial Cedros del Norte	Obra de construccion supervisada por el equipo de obra asignado.	Calle 145 # 58-20	Frente al Parque El Cedro	2025-02-01	2026-12-15	ACTIVO
9	2	Edificio Torres de Chapinero	Obra de construccion supervisada por el equipo de obra asignado.	Carrera 13 # 63-45	Al lado de la estacion Chapinero	2025-06-01	2027-03-01	ACTIVO
8	3	Centro Comercial Plaza Fontibon	Obra de construccion supervisada por el equipo de obra asignado.	Avenida Centenario # 100-30	Cerca al Terminal de Transporte	2024-09-01	2026-09-30	ACTIVO
7	4	Bodegas Industriales Puente Aranda	Obra de construccion supervisada por el equipo de obra asignado.	Carrera 50 # 8-15	Zona Industrial	2023-05-01	2025-12-20	FINALIZADO
6	5	Urbanizacion Villa del Sol	Obra de construccion supervisada por el equipo de obra asignado.	Calle 80 # 110-05	Sector Engativa	2026-01-15	2027-06-30	ACTIVO
5	1	Conjunto Residencial Los Pinos	Construccion de complejo residencial de cuatro torres.	Calle 170 # 20-35	Frente al Colegio Distrital	2026-01-10	2026-11-30	ACTIVO
4	2	Edificio Empresarial Andino	Construccion de edificio de oficinas con ocho niveles.	Carrera 11 # 93-40	Junto al Centro Comercial Andino	2026-02-15	2026-12-15	ACTIVO
3	3	Parque Recreativo San Jorge	Adecuacion y construccion de zonas deportivas y recreativas.	Calle 68 # 45-18	Frente al Polideportivo	2026-03-01	2026-09-20	FINALIZADO
2	4	Hospital Regional Occidente	Construccion de infraestructura hospitalaria.	Avenida Boyaca # 72-15	Cerca al Portal 80	2026-04-10	2026-12-20	ACTIVO
1	5	Colegio Nuevo Horizonte	Construccion de institucion educativa con aulas y laboratorios.	Carrera 98 # 130-50	Frente al Parque Principal	2026-05-05	2026-10-31	FINALIZADO
\.


--
-- TOC entry 5526 (class 0 OID 18428)
-- Dependencies: 280
-- Data for Name: solicitud; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.solicitud (id_solicitud, id_solicitante, id_gestor_por, tipo_solicitud, descripcion, fecha_creacion, estado_solicitud, respuesta, fecha_respuesta) FROM stdin;
1	5	2	CAMBIO_PROYECTO	Solicito traslado a otra obra por cercania con mi vivienda.	2026-05-24 13:00:00	RECHAZADA	Solicitud rechazada por no cumplir requisitos.	2026-05-27 13:00:00
2	12	2	CAPACITACION	Solicito inscripcion al curso de trabajo en alturas.	2026-03-11 11:00:00	RECHAZADA	Solicitud rechazada por no cumplir requisitos.	2026-03-14 11:00:00
3	30	\N	RECURSOS	Solicito dotacion de elementos de proteccion personal.	2026-04-05 09:00:00	PENDIENTE	\N	\N
4	28	2	CAMBIO_PROYECTO	Solicito traslado a otra obra por cercania con mi vivienda.	2026-06-28 17:00:00	RECHAZADA	Solicitud rechazada por no cumplir requisitos.	2026-06-30 17:00:00
5	32	3	CAMBIO_PROYECTO	Solicito traslado a otra obra por cercania con mi vivienda.	2026-05-07 10:00:00	RECHAZADA	Solicitud rechazada por no cumplir requisitos.	2026-05-11 10:00:00
6	31	3	CAMBIO_PROYECTO	Solicito traslado a otra obra por cercania con mi vivienda.	2026-06-01 09:00:00	RECHAZADA	Solicitud rechazada por no cumplir requisitos.	2026-06-03 09:00:00
7	15	3	CAMBIO_TURNO	Solicito cambio de turno por motivos personales.	2026-05-02 08:00:00	APROBADA	Solicitud aprobada segun politica interna.	2026-05-07 08:00:00
8	23	\N	PERMISO	Solicito permiso remunerado por cita medica.	2026-06-10 16:00:00	PENDIENTE	\N	\N
9	21	3	CORRECCION_DATOS	Solicito corregir el numero de telefono registrado en mi perfil.	2026-06-05 12:00:00	APROBADA	Solicitud aprobada segun politica interna.	2026-06-08 12:00:00
10	6	3	CORRECCION_DATOS	Solicito corregir el numero de telefono registrado en mi perfil.	2026-06-02 17:00:00	EN_REVISION	\N	\N
\.


--
-- TOC entry 5476 (class 0 OID 17742)
-- Dependencies: 230
-- Data for Name: supervisor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supervisor (id_supervisor, id_usuario, numero_tarjeta_profesional, cuadrilla_asignada) FROM stdin;
1	4	SUP-TEST-001	CUADRILLA A
2	5	SUP-TEST-002	CUADRILLA B
3	6	SUP-TEST-003	CUADRILLA C
4	7	SUP-TEST-004	CUADRILLA D
5	8	SUP-TEST-005	CUADRILLA E
\.


--
-- TOC entry 5494 (class 0 OID 17949)
-- Dependencies: 248
-- Data for Name: turno; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.turno (id_turno, id_empleado, id_proyecto, id_asignado_por, tipo_turno, hora_inicio, hora_fin, fecha) FROM stdin;
1	15	7	7	DIURNO	07:00:00	17:00:00	2025-06-23
2	15	7	7	DIURNO	07:00:00	17:00:00	2025-06-29
3	15	7	7	DIURNO	07:00:00	17:00:00	2025-07-05
4	15	7	7	DIURNO	07:00:00	17:00:00	2025-07-11
5	15	7	7	DIURNO	07:00:00	17:00:00	2025-07-18
6	15	7	7	DIURNO	07:00:00	17:00:00	2025-07-24
7	15	7	7	DIURNO	07:00:00	17:00:00	2025-07-30
8	15	7	7	DIURNO	07:00:00	17:00:00	2025-08-05
9	15	7	7	DIURNO	07:00:00	17:00:00	2025-08-12
10	15	7	7	NOCTURNO	19:00:00	05:00:00	2025-08-18
11	15	7	7	DIURNO	07:00:00	17:00:00	2025-08-24
12	15	7	7	DIURNO	07:00:00	17:00:00	2025-08-30
13	15	7	7	DIURNO	07:00:00	17:00:00	2025-09-06
14	15	7	7	DIURNO	07:00:00	17:00:00	2025-09-12
15	15	7	7	DIURNO	07:00:00	17:00:00	2025-09-18
16	15	7	7	DIURNO	07:00:00	17:00:00	2025-09-24
17	15	8	6	DIURNO	07:00:00	17:00:00	2025-10-01
18	15	8	6	DIURNO	07:00:00	17:00:00	2025-10-06
19	15	8	6	DIURNO	07:00:00	17:00:00	2025-10-11
20	15	8	6	DIURNO	07:00:00	17:00:00	2025-10-16
21	15	8	6	DIURNO	07:00:00	17:00:00	2025-10-21
22	15	8	6	DIURNO	07:00:00	17:00:00	2025-10-26
23	15	8	6	DIURNO	07:00:00	17:00:00	2025-10-31
24	15	8	6	DIURNO	07:00:00	17:00:00	2025-11-05
25	15	8	6	DIURNO	07:00:00	17:00:00	2025-11-10
26	15	8	6	NOCTURNO	19:00:00	05:00:00	2025-11-15
27	15	8	6	DIURNO	07:00:00	17:00:00	2025-11-20
28	15	8	6	DIURNO	07:00:00	17:00:00	2025-11-25
29	15	8	6	DIURNO	07:00:00	17:00:00	2025-11-30
30	15	8	6	DIURNO	07:00:00	17:00:00	2025-12-05
31	15	8	6	DIURNO	07:00:00	17:00:00	2025-12-10
32	15	8	6	DIURNO	07:00:00	17:00:00	2025-12-15
33	15	6	8	DIURNO	07:00:00	17:00:00	2026-01-15
34	15	6	8	DIURNO	07:00:00	17:00:00	2026-01-19
35	15	6	8	DIURNO	07:00:00	17:00:00	2026-01-23
36	15	6	8	DIURNO	07:00:00	17:00:00	2026-01-27
37	15	6	8	DIURNO	07:00:00	17:00:00	2026-02-01
38	15	6	8	DIURNO	07:00:00	17:00:00	2026-02-05
39	15	6	8	DIURNO	07:00:00	17:00:00	2026-02-09
40	15	6	8	DIURNO	07:00:00	17:00:00	2026-02-14
41	15	6	8	DIURNO	07:00:00	17:00:00	2026-02-18
42	15	6	8	NOCTURNO	19:00:00	05:00:00	2026-02-22
43	15	6	8	DIURNO	07:00:00	17:00:00	2026-02-26
44	15	6	8	DIURNO	07:00:00	17:00:00	2026-03-03
45	15	6	8	DIURNO	07:00:00	17:00:00	2026-03-07
46	15	6	8	DIURNO	07:00:00	17:00:00	2026-03-11
47	15	9	5	DIURNO	07:00:00	17:00:00	2026-03-16
48	15	9	5	DIURNO	07:00:00	17:00:00	2026-03-20
49	15	9	5	DIURNO	07:00:00	17:00:00	2026-03-24
50	15	9	5	DIURNO	07:00:00	17:00:00	2026-03-28
51	15	9	5	DIURNO	07:00:00	17:00:00	2026-04-02
52	15	9	5	DIURNO	07:00:00	17:00:00	2026-04-06
53	15	9	5	DIURNO	07:00:00	17:00:00	2026-04-10
54	15	9	5	DIURNO	07:00:00	17:00:00	2026-04-14
55	15	9	5	DIURNO	07:00:00	17:00:00	2026-04-19
56	15	9	5	NOCTURNO	19:00:00	05:00:00	2026-04-23
57	15	9	5	DIURNO	07:00:00	17:00:00	2026-04-27
58	15	9	5	DIURNO	07:00:00	17:00:00	2026-05-01
59	15	10	4	DIURNO	07:00:00	17:00:00	2026-05-06
60	15	10	4	DIURNO	07:00:00	17:00:00	2026-05-10
61	15	10	4	DIURNO	07:00:00	17:00:00	2026-05-15
62	15	10	4	DIURNO	07:00:00	17:00:00	2026-05-20
63	15	10	4	DIURNO	07:00:00	17:00:00	2026-05-25
64	15	10	4	DIURNO	07:00:00	17:00:00	2026-05-30
65	15	10	4	DIURNO	07:00:00	17:00:00	2026-06-03
66	15	10	4	DIURNO	07:00:00	17:00:00	2026-06-08
67	15	10	4	DIURNO	07:00:00	17:00:00	2026-06-13
68	15	10	4	NOCTURNO	19:00:00	05:00:00	2026-06-18
69	16	10	4	NOCTURNO	19:00:00	05:00:00	2026-06-18
\.


--
-- TOC entry 5474 (class 0 OID 17717)
-- Dependencies: 228
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id_usuario, id_perfil, nombres, apellidos, correo, password_hash, estado, ultimo_acceso, foto_perfil, idioma) FROM stdin;
1	1	Claudia	Cardenas Mejia	claudia.cardenas@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-28 14:16:00	\N	ES
2	1	Laura	Munoz Garcia	laura.munoz@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-29 12:57:00	\N	ES
3	1	Manuel	Perez Alvarez	manuel.perez@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-29 12:23:00	\N	ES
4	2	Ricardo	Gil Gomez	ricardo.gil@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-23 08:32:00	\N	ES
5	2	Patricia	Vargas Pena	patricia.vargas@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-27 07:48:00	\N	ES
6	2	Julian	Ramirez Suarez	julian.ramirez@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-20 19:07:00	\N	ES
7	2	Edwin	Sanchez Jimenez	edwin.sanchez@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-22 16:10:00	\N	ES
8	2	Luis	Mejia Rojas	luis.mejia@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-30 12:38:00	\N	ES
9	3	Gustavo	Garcia Cadena	gustavo.garcia@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-21 12:24:00	\N	ES
10	3	Diana	Alvarez Diaz	diana.alvarez@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-29 13:33:00	\N	ES
11	4	Martha	Gomez Ortiz	martha.gomez@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-24 14:55:00	\N	ES
12	4	Sergio	Pena Martinez	sergio.pena@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-20 16:46:00	\N	ES
13	4	Cristian	Suarez Ruiz	cristian.suarez@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-21 16:56:00	\N	ES
14	4	Wilson	Jimenez Bermudez	wilson.jimenez@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-28 18:17:00	\N	ES
15	4	Jorge	Rojas Moreno	jorge.rojas@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-30 11:07:00	\N	ES
16	4	Sandra	Cadena Romero	sandra.cadena@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-24 12:10:00	\N	ES
17	4	Adriana	Diaz Rodriguez	adriana.diaz@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-27 06:46:00	\N	ES
18	4	Carolina	Ortiz Torres	carolina.ortiz@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-24 14:48:00	\N	ES
19	4	Viviana	Martinez Herrera	viviana.martinez@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-22 14:58:00	\N	ES
20	4	Liliana	Ruiz Nino	liliana.ruiz@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-21 19:40:00	\N	ES
21	4	Nicolas	Bermudez Salazar	nicolas.bermudez@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-24 19:40:00	\N	ES
22	4	Yolanda	Moreno Castro	yolanda.moreno@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-28 15:12:00	\N	ES
23	4	Camilo	Romero Lopez	camilo.romero@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-22 11:48:00	\N	ES
24	4	Alejandro	Rodriguez Cardenas	alejandro.rodriguez@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-22 14:49:00	\N	ES
25	4	Angela	Torres Munoz	angela.torres@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-28 20:00:00	\N	ES
26	4	Maria	Herrera Perez	maria.herrera@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-29 11:31:00	\N	ES
27	4	Diego	Nino Gil	diego.nino@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-20 07:59:00	\N	ES
28	4	Hector	Salazar Vargas	hector.salazar@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-25 20:53:00	\N	ES
29	4	Andres	Castro Ramirez	andres.castro@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-24 09:03:00	\N	ES
30	4	Mauricio	Lopez Sanchez	mauricio.lopez@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-23 20:36:00	\N	ES
31	4	Fernando	Cardenas Mejia	fernando.cardenas@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-21 07:46:00	\N	ES
32	4	Felipe	Munoz Garcia	felipe.munoz@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-27 19:04:00	\N	ES
33	4	Paola	Perez Alvarez	paola.perez@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-28 18:08:00	\N	ES
34	4	Ivan	Gil Gomez	ivan.gil@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-22 16:30:00	\N	ES
35	4	Rodrigo	Vargas Pena	rodrigo.vargas@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-28 08:16:00	\N	ES
36	4	Oscar	Ramirez Suarez	oscar.ramirez@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-28 19:38:00	\N	ES
37	4	Carlos	Sanchez Jimenez	carlos.sanchez@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-26 09:59:00	\N	ES
38	4	Natalia	Mejia Rojas	natalia.mejia@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-28 18:46:00	\N	ES
39	4	Santiago	Garcia Cadena	santiago.garcia@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-23 17:19:00	\N	ES
40	4	Miguel	Alvarez Diaz	miguel.alvarez@construandes.com.co	$2y$10$Y1a0nR7z8dQmL3kXeVoGZuTfB4hC6sJpN9wA2rD5eF8gH1iJ3kLmO	t	2026-06-26 16:41:00	\N	ES
\.


--
-- TOC entry 5512 (class 0 OID 18209)
-- Dependencies: 266
-- Data for Name: viatico; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.viatico (id_viatico, id_empleado, id_proyecto, id_aprobado_por, concepto, valor, fecha, soporte_url, estado_viatico) FROM stdin;
1	37	8	6	Compra de materiales menores	120000.00	2026-06-11	/soportes/viatico_emp37.pdf	APROBADO
2	14	6	8	Compra de materiales menores	120000.00	2026-05-26	/soportes/viatico_emp14.pdf	APROBADO
3	33	7	7	Transporte a obra	120000.00	2026-03-14	/soportes/viatico_emp33.pdf	APROBADO
4	23	7	7	Alojamiento temporal	80000.00	2026-03-03	/soportes/viatico_emp23.pdf	APROBADO
5	21	9	5	Alojamiento temporal	80000.00	2026-06-20	/soportes/viatico_emp21.pdf	RECHAZADO
6	16	9	\N	Alimentacion cuadrilla	120000.00	2026-05-15	/soportes/viatico_emp16.pdf	PENDIENTE
7	24	6	\N	Alojamiento temporal	120000.00	2026-05-21	/soportes/viatico_emp24.pdf	PENDIENTE
8	26	9	5	Transporte a obra	120000.00	2026-05-17	/soportes/viatico_emp26.pdf	APROBADO
\.


--
-- TOC entry 5570 (class 0 OID 0)
-- Dependencies: 223
-- Name: accion_id_accion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.accion_id_accion_seq', 10, true);


--
-- TOC entry 5571 (class 0 OID 0)
-- Dependencies: 233
-- Name: admin_rrhh_id_admin_rrhh_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_rrhh_id_admin_rrhh_seq', 3, true);


--
-- TOC entry 5572 (class 0 OID 0)
-- Dependencies: 239
-- Name: afiliacion_id_afiliacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.afiliacion_id_afiliacion_seq', 39, true);


--
-- TOC entry 5573 (class 0 OID 0)
-- Dependencies: 277
-- Name: aporte_empleado_id_aporte_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.aporte_empleado_id_aporte_seq', 36, true);


--
-- TOC entry 5574 (class 0 OID 0)
-- Dependencies: 257
-- Name: asignacion_proyecto_id_asignacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asignacion_proyecto_id_asignacion_seq', 30, true);


--
-- TOC entry 5575 (class 0 OID 0)
-- Dependencies: 245
-- Name: asistencia_id_asistencia_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asistencia_id_asistencia_seq', 180, true);


--
-- TOC entry 5576 (class 0 OID 0)
-- Dependencies: 283
-- Name: cambio_configuracion_id_cambio_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cambio_configuracion_id_cambio_seq', 2, true);


--
-- TOC entry 5577 (class 0 OID 0)
-- Dependencies: 243
-- Name: certificacion_id_certificacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.certificacion_id_certificacion_seq', 15, true);


--
-- TOC entry 5578 (class 0 OID 0)
-- Dependencies: 259
-- Name: configuracion_id_configuracion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.configuracion_id_configuracion_seq', 1, true);


--
-- TOC entry 5579 (class 0 OID 0)
-- Dependencies: 231
-- Name: contador_id_contador_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contador_id_contador_seq', 2, true);


--
-- TOC entry 5580 (class 0 OID 0)
-- Dependencies: 261
-- Name: contrato_id_contrato_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contrato_id_contrato_seq', 39, true);


--
-- TOC entry 5581 (class 0 OID 0)
-- Dependencies: 273
-- Name: desprendible_id_desprendible_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.desprendible_id_desprendible_seq', 37, true);


--
-- TOC entry 5582 (class 0 OID 0)
-- Dependencies: 271
-- Name: detalle_nomina_id_detalle_nomina_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detalle_nomina_id_detalle_nomina_seq', 37, true);


--
-- TOC entry 5583 (class 0 OID 0)
-- Dependencies: 237
-- Name: empleado_id_empleado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.empleado_id_empleado_seq', 39, true);


--
-- TOC entry 5584 (class 0 OID 0)
-- Dependencies: 255
-- Name: evaluacion_desempeno_id_evaluacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evaluacion_desempeno_id_evaluacion_seq', 36, true);


--
-- TOC entry 5585 (class 0 OID 0)
-- Dependencies: 241
-- Name: historial_laboral_id_historial_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_laboral_id_historial_seq', 41, true);


--
-- TOC entry 5586 (class 0 OID 0)
-- Dependencies: 251
-- Name: hora_extra_id_hora_extra_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hora_extra_id_hora_extra_seq', 10, true);


--
-- TOC entry 5587 (class 0 OID 0)
-- Dependencies: 267
-- Name: liquidacion_id_liquidacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.liquidacion_id_liquidacion_seq', 2, true);


--
-- TOC entry 5588 (class 0 OID 0)
-- Dependencies: 221
-- Name: modulo_id_modulo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.modulo_id_modulo_seq', 14, true);


--
-- TOC entry 5589 (class 0 OID 0)
-- Dependencies: 269
-- Name: nomina_id_nomina_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nomina_id_nomina_seq', 1, true);


--
-- TOC entry 5590 (class 0 OID 0)
-- Dependencies: 281
-- Name: notificacion_id_notificacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notificacion_id_notificacion_seq', 15, true);


--
-- TOC entry 5591 (class 0 OID 0)
-- Dependencies: 249
-- Name: novedad_id_novedad_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.novedad_id_novedad_seq', 8, true);


--
-- TOC entry 5592 (class 0 OID 0)
-- Dependencies: 253
-- Name: observacion_id_observacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.observacion_id_observacion_seq', 15, true);


--
-- TOC entry 5593 (class 0 OID 0)
-- Dependencies: 219
-- Name: perfil_id_perfil_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.perfil_id_perfil_seq', 4, true);


--
-- TOC entry 5594 (class 0 OID 0)
-- Dependencies: 225
-- Name: permiso_id_permiso_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permiso_id_permiso_seq', 71, true);


--
-- TOC entry 5595 (class 0 OID 0)
-- Dependencies: 275
-- Name: pila_id_pila_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pila_id_pila_seq', 1, true);


--
-- TOC entry 5596 (class 0 OID 0)
-- Dependencies: 263
-- Name: prestamo_id_prestamo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prestamo_id_prestamo_seq', 5, true);


--
-- TOC entry 5597 (class 0 OID 0)
-- Dependencies: 235
-- Name: proyecto_id_proyecto_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.proyecto_id_proyecto_seq', 10, true);


--
-- TOC entry 5598 (class 0 OID 0)
-- Dependencies: 279
-- Name: solicitud_id_solicitud_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.solicitud_id_solicitud_seq', 10, true);


--
-- TOC entry 5599 (class 0 OID 0)
-- Dependencies: 229
-- Name: supervisor_id_supervisor_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.supervisor_id_supervisor_seq', 5, true);


--
-- TOC entry 5600 (class 0 OID 0)
-- Dependencies: 247
-- Name: turno_id_turno_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.turno_id_turno_seq', 69, true);


--
-- TOC entry 5601 (class 0 OID 0)
-- Dependencies: 227
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 40, true);


--
-- TOC entry 5602 (class 0 OID 0)
-- Dependencies: 265
-- Name: viatico_id_viatico_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.viatico_id_viatico_seq', 8, true);


--
-- TOC entry 5174 (class 2606 OID 17687)
-- Name: accion accion_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accion
    ADD CONSTRAINT accion_nombre_key UNIQUE (nombre);


--
-- TOC entry 5176 (class 2606 OID 17685)
-- Name: accion accion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accion
    ADD CONSTRAINT accion_pkey PRIMARY KEY (id_accion);


--
-- TOC entry 5194 (class 2606 OID 17787)
-- Name: admin_rrhh admin_rrhh_id_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_rrhh
    ADD CONSTRAINT admin_rrhh_id_usuario_key UNIQUE (id_usuario);


--
-- TOC entry 5196 (class 2606 OID 17785)
-- Name: admin_rrhh admin_rrhh_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_rrhh
    ADD CONSTRAINT admin_rrhh_pkey PRIMARY KEY (id_admin_rrhh);


--
-- TOC entry 5206 (class 2606 OID 17874)
-- Name: afiliacion afiliacion_id_empleado_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.afiliacion
    ADD CONSTRAINT afiliacion_id_empleado_key UNIQUE (id_empleado);


--
-- TOC entry 5208 (class 2606 OID 17872)
-- Name: afiliacion afiliacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.afiliacion
    ADD CONSTRAINT afiliacion_pkey PRIMARY KEY (id_afiliacion);


--
-- TOC entry 5256 (class 2606 OID 18414)
-- Name: aporte_empleado aporte_empleado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aporte_empleado
    ADD CONSTRAINT aporte_empleado_pkey PRIMARY KEY (id_aporte);


--
-- TOC entry 5226 (class 2606 OID 18109)
-- Name: asignacion_proyecto asignacion_proyecto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asignacion_proyecto
    ADD CONSTRAINT asignacion_proyecto_pkey PRIMARY KEY (id_asignacion);


--
-- TOC entry 5214 (class 2606 OID 17937)
-- Name: asistencia asistencia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asistencia
    ADD CONSTRAINT asistencia_pkey PRIMARY KEY (id_asistencia);


--
-- TOC entry 5264 (class 2606 OID 18487)
-- Name: cambio_configuracion cambio_configuracion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cambio_configuracion
    ADD CONSTRAINT cambio_configuracion_pkey PRIMARY KEY (id_cambio);


--
-- TOC entry 5212 (class 2606 OID 17918)
-- Name: certificacion certificacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificacion
    ADD CONSTRAINT certificacion_pkey PRIMARY KEY (id_certificacion);


--
-- TOC entry 5230 (class 2606 OID 18152)
-- Name: configuracion configuracion_anio_vigencia_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion
    ADD CONSTRAINT configuracion_anio_vigencia_key UNIQUE (anio_vigencia);


--
-- TOC entry 5232 (class 2606 OID 18150)
-- Name: configuracion configuracion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion
    ADD CONSTRAINT configuracion_pkey PRIMARY KEY (id_configuracion);


--
-- TOC entry 5190 (class 2606 OID 17770)
-- Name: contador contador_id_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contador
    ADD CONSTRAINT contador_id_usuario_key UNIQUE (id_usuario);


--
-- TOC entry 5192 (class 2606 OID 17768)
-- Name: contador contador_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contador
    ADD CONSTRAINT contador_pkey PRIMARY KEY (id_contador);


--
-- TOC entry 5234 (class 2606 OID 18168)
-- Name: contrato contrato_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contrato
    ADD CONSTRAINT contrato_pkey PRIMARY KEY (id_contrato);


--
-- TOC entry 5248 (class 2606 OID 18362)
-- Name: desprendible desprendible_id_detalle_nomina_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.desprendible
    ADD CONSTRAINT desprendible_id_detalle_nomina_key UNIQUE (id_detalle_nomina);


--
-- TOC entry 5250 (class 2606 OID 18360)
-- Name: desprendible desprendible_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.desprendible
    ADD CONSTRAINT desprendible_pkey PRIMARY KEY (id_desprendible);


--
-- TOC entry 5244 (class 2606 OID 18328)
-- Name: detalle_nomina detalle_nomina_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_nomina
    ADD CONSTRAINT detalle_nomina_pkey PRIMARY KEY (id_detalle_nomina);


--
-- TOC entry 5200 (class 2606 OID 17841)
-- Name: empleado empleado_id_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleado
    ADD CONSTRAINT empleado_id_usuario_key UNIQUE (id_usuario);


--
-- TOC entry 5202 (class 2606 OID 17843)
-- Name: empleado empleado_numero_documento_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleado
    ADD CONSTRAINT empleado_numero_documento_key UNIQUE (numero_documento);


--
-- TOC entry 5204 (class 2606 OID 17839)
-- Name: empleado empleado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleado
    ADD CONSTRAINT empleado_pkey PRIMARY KEY (id_empleado);


--
-- TOC entry 5224 (class 2606 OID 18084)
-- Name: evaluacion_desempeno evaluacion_desempeno_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluacion_desempeno
    ADD CONSTRAINT evaluacion_desempeno_pkey PRIMARY KEY (id_evaluacion);


--
-- TOC entry 5210 (class 2606 OID 17892)
-- Name: historial_laboral historial_laboral_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_laboral
    ADD CONSTRAINT historial_laboral_pkey PRIMARY KEY (id_historial);


--
-- TOC entry 5220 (class 2606 OID 18025)
-- Name: hora_extra hora_extra_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hora_extra
    ADD CONSTRAINT hora_extra_pkey PRIMARY KEY (id_hora_extra);


--
-- TOC entry 5240 (class 2606 OID 18260)
-- Name: liquidacion liquidacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidacion
    ADD CONSTRAINT liquidacion_pkey PRIMARY KEY (id_liquidacion);


--
-- TOC entry 5170 (class 2606 OID 17676)
-- Name: modulo modulo_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modulo
    ADD CONSTRAINT modulo_nombre_key UNIQUE (nombre);


--
-- TOC entry 5172 (class 2606 OID 17674)
-- Name: modulo modulo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modulo
    ADD CONSTRAINT modulo_pkey PRIMARY KEY (id_modulo);


--
-- TOC entry 5242 (class 2606 OID 18290)
-- Name: nomina nomina_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nomina
    ADD CONSTRAINT nomina_pkey PRIMARY KEY (id_nomina);


--
-- TOC entry 5262 (class 2606 OID 18468)
-- Name: notificacion notificacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacion
    ADD CONSTRAINT notificacion_pkey PRIMARY KEY (id_notificacion);


--
-- TOC entry 5218 (class 2606 OID 17994)
-- Name: novedad novedad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.novedad
    ADD CONSTRAINT novedad_pkey PRIMARY KEY (id_novedad);


--
-- TOC entry 5222 (class 2606 OID 18054)
-- Name: observacion observacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion
    ADD CONSTRAINT observacion_pkey PRIMARY KEY (id_observacion);


--
-- TOC entry 5166 (class 2606 OID 17665)
-- Name: perfil perfil_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil
    ADD CONSTRAINT perfil_nombre_key UNIQUE (nombre);


--
-- TOC entry 5168 (class 2606 OID 17663)
-- Name: perfil perfil_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil
    ADD CONSTRAINT perfil_pkey PRIMARY KEY (id_perfil);


--
-- TOC entry 5178 (class 2606 OID 17698)
-- Name: permiso permiso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permiso
    ADD CONSTRAINT permiso_pkey PRIMARY KEY (id_permiso);


--
-- TOC entry 5252 (class 2606 OID 18391)
-- Name: pila pila_id_nomina_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pila
    ADD CONSTRAINT pila_id_nomina_key UNIQUE (id_nomina);


--
-- TOC entry 5254 (class 2606 OID 18389)
-- Name: pila pila_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pila
    ADD CONSTRAINT pila_pkey PRIMARY KEY (id_pila);


--
-- TOC entry 5236 (class 2606 OID 18202)
-- Name: prestamo prestamo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestamo
    ADD CONSTRAINT prestamo_pkey PRIMARY KEY (id_prestamo);


--
-- TOC entry 5198 (class 2606 OID 17810)
-- Name: proyecto proyecto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyecto
    ADD CONSTRAINT proyecto_pkey PRIMARY KEY (id_proyecto);


--
-- TOC entry 5260 (class 2606 OID 18442)
-- Name: solicitud solicitud_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud
    ADD CONSTRAINT solicitud_pkey PRIMARY KEY (id_solicitud);


--
-- TOC entry 5186 (class 2606 OID 17752)
-- Name: supervisor supervisor_id_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supervisor
    ADD CONSTRAINT supervisor_id_usuario_key UNIQUE (id_usuario);


--
-- TOC entry 5188 (class 2606 OID 17750)
-- Name: supervisor supervisor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supervisor
    ADD CONSTRAINT supervisor_pkey PRIMARY KEY (id_supervisor);


--
-- TOC entry 5216 (class 2606 OID 17962)
-- Name: turno turno_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.turno
    ADD CONSTRAINT turno_pkey PRIMARY KEY (id_turno);


--
-- TOC entry 5258 (class 2606 OID 18416)
-- Name: aporte_empleado uq_aporte_pila_empleado; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aporte_empleado
    ADD CONSTRAINT uq_aporte_pila_empleado UNIQUE (id_pila, id_empleado);


--
-- TOC entry 5228 (class 2606 OID 18111)
-- Name: asignacion_proyecto uq_asignacion; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asignacion_proyecto
    ADD CONSTRAINT uq_asignacion UNIQUE (id_proyecto, id_empleado);


--
-- TOC entry 5246 (class 2606 OID 18330)
-- Name: detalle_nomina uq_detalle_nomina; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_nomina
    ADD CONSTRAINT uq_detalle_nomina UNIQUE (id_nomina, id_empleado);


--
-- TOC entry 5180 (class 2606 OID 17700)
-- Name: permiso uq_permiso_perfil_modulo_accion; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permiso
    ADD CONSTRAINT uq_permiso_perfil_modulo_accion UNIQUE (id_perfil, id_modulo, id_accion);


--
-- TOC entry 5182 (class 2606 OID 17735)
-- Name: usuarios usuarios_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_key UNIQUE (correo);


--
-- TOC entry 5184 (class 2606 OID 17733)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 5238 (class 2606 OID 18222)
-- Name: viatico viatico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.viatico
    ADD CONSTRAINT viatico_pkey PRIMARY KEY (id_viatico);


--
-- TOC entry 5271 (class 2606 OID 17788)
-- Name: admin_rrhh admin_rrhh_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_rrhh
    ADD CONSTRAINT admin_rrhh_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5275 (class 2606 OID 17875)
-- Name: afiliacion afiliacion_id_empleado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.afiliacion
    ADD CONSTRAINT afiliacion_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5311 (class 2606 OID 18422)
-- Name: aporte_empleado aporte_empleado_id_empleado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aporte_empleado
    ADD CONSTRAINT aporte_empleado_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5312 (class 2606 OID 18417)
-- Name: aporte_empleado aporte_empleado_id_pila_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aporte_empleado
    ADD CONSTRAINT aporte_empleado_id_pila_fkey FOREIGN KEY (id_pila) REFERENCES public.pila(id_pila) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5292 (class 2606 OID 18117)
-- Name: asignacion_proyecto asignacion_proyecto_id_empleado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asignacion_proyecto
    ADD CONSTRAINT asignacion_proyecto_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5293 (class 2606 OID 18112)
-- Name: asignacion_proyecto asignacion_proyecto_id_proyecto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asignacion_proyecto
    ADD CONSTRAINT asignacion_proyecto_id_proyecto_fkey FOREIGN KEY (id_proyecto) REFERENCES public.proyecto(id_proyecto) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5279 (class 2606 OID 17943)
-- Name: asistencia asistencia_id_creado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asistencia
    ADD CONSTRAINT asistencia_id_creado_por_fkey FOREIGN KEY (id_creado_por) REFERENCES public.usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5280 (class 2606 OID 17938)
-- Name: asistencia asistencia_id_empleado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asistencia
    ADD CONSTRAINT asistencia_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5316 (class 2606 OID 18488)
-- Name: cambio_configuracion cambio_configuracion_id_configuracion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cambio_configuracion
    ADD CONSTRAINT cambio_configuracion_id_configuracion_fkey FOREIGN KEY (id_configuracion) REFERENCES public.configuracion(id_configuracion) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5317 (class 2606 OID 18493)
-- Name: cambio_configuracion cambio_configuracion_id_modificado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cambio_configuracion
    ADD CONSTRAINT cambio_configuracion_id_modificado_por_fkey FOREIGN KEY (id_modificado_por) REFERENCES public.usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5278 (class 2606 OID 17919)
-- Name: certificacion certificacion_id_empleado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificacion
    ADD CONSTRAINT certificacion_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5270 (class 2606 OID 17771)
-- Name: contador contador_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contador
    ADD CONSTRAINT contador_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5294 (class 2606 OID 18169)
-- Name: contrato contrato_id_empleado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contrato
    ADD CONSTRAINT contrato_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5295 (class 2606 OID 18179)
-- Name: contrato contrato_id_proyecto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contrato
    ADD CONSTRAINT contrato_id_proyecto_fkey FOREIGN KEY (id_proyecto) REFERENCES public.proyecto(id_proyecto) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5296 (class 2606 OID 18174)
-- Name: contrato contrato_id_supervisor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contrato
    ADD CONSTRAINT contrato_id_supervisor_fkey FOREIGN KEY (id_supervisor) REFERENCES public.supervisor(id_supervisor) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5308 (class 2606 OID 18363)
-- Name: desprendible desprendible_id_detalle_nomina_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.desprendible
    ADD CONSTRAINT desprendible_id_detalle_nomina_fkey FOREIGN KEY (id_detalle_nomina) REFERENCES public.detalle_nomina(id_detalle_nomina) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5309 (class 2606 OID 18368)
-- Name: desprendible desprendible_id_empleado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.desprendible
    ADD CONSTRAINT desprendible_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5306 (class 2606 OID 18336)
-- Name: detalle_nomina detalle_nomina_id_empleado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_nomina
    ADD CONSTRAINT detalle_nomina_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5307 (class 2606 OID 18331)
-- Name: detalle_nomina detalle_nomina_id_nomina_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_nomina
    ADD CONSTRAINT detalle_nomina_id_nomina_fkey FOREIGN KEY (id_nomina) REFERENCES public.nomina(id_nomina) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5273 (class 2606 OID 17849)
-- Name: empleado empleado_id_supervisor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleado
    ADD CONSTRAINT empleado_id_supervisor_fkey FOREIGN KEY (id_supervisor) REFERENCES public.supervisor(id_supervisor) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5274 (class 2606 OID 17844)
-- Name: empleado empleado_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleado
    ADD CONSTRAINT empleado_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5290 (class 2606 OID 18085)
-- Name: evaluacion_desempeno evaluacion_desempeno_id_empleado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluacion_desempeno
    ADD CONSTRAINT evaluacion_desempeno_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5291 (class 2606 OID 18090)
-- Name: evaluacion_desempeno evaluacion_desempeno_id_evaluador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluacion_desempeno
    ADD CONSTRAINT evaluacion_desempeno_id_evaluador_fkey FOREIGN KEY (id_evaluador) REFERENCES public.supervisor(id_supervisor) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5276 (class 2606 OID 17893)
-- Name: historial_laboral historial_laboral_id_empleado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_laboral
    ADD CONSTRAINT historial_laboral_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5277 (class 2606 OID 17898)
-- Name: historial_laboral historial_laboral_id_responsable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_laboral
    ADD CONSTRAINT historial_laboral_id_responsable_fkey FOREIGN KEY (id_responsable) REFERENCES public.supervisor(id_supervisor) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5286 (class 2606 OID 18031)
-- Name: hora_extra hora_extra_id_aprobador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hora_extra
    ADD CONSTRAINT hora_extra_id_aprobador_fkey FOREIGN KEY (id_aprobador) REFERENCES public.supervisor(id_supervisor) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5287 (class 2606 OID 18026)
-- Name: hora_extra hora_extra_id_empleado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hora_extra
    ADD CONSTRAINT hora_extra_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5301 (class 2606 OID 18266)
-- Name: liquidacion liquidacion_id_configuracion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidacion
    ADD CONSTRAINT liquidacion_id_configuracion_fkey FOREIGN KEY (id_configuracion) REFERENCES public.configuracion(id_configuracion) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5302 (class 2606 OID 18261)
-- Name: liquidacion liquidacion_id_empleado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liquidacion
    ADD CONSTRAINT liquidacion_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5303 (class 2606 OID 18301)
-- Name: nomina nomina_id_admin_rrhh_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nomina
    ADD CONSTRAINT nomina_id_admin_rrhh_fkey FOREIGN KEY (id_admin_rrhh) REFERENCES public.admin_rrhh(id_admin_rrhh) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5304 (class 2606 OID 18296)
-- Name: nomina nomina_id_configuracion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nomina
    ADD CONSTRAINT nomina_id_configuracion_fkey FOREIGN KEY (id_configuracion) REFERENCES public.configuracion(id_configuracion) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5305 (class 2606 OID 18291)
-- Name: nomina nomina_id_obra_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nomina
    ADD CONSTRAINT nomina_id_obra_fkey FOREIGN KEY (id_obra) REFERENCES public.proyecto(id_proyecto) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5315 (class 2606 OID 18469)
-- Name: notificacion notificacion_id_destinatario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificacion
    ADD CONSTRAINT notificacion_id_destinatario_fkey FOREIGN KEY (id_destinatario) REFERENCES public.usuarios(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5284 (class 2606 OID 18000)
-- Name: novedad novedad_id_aprobado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.novedad
    ADD CONSTRAINT novedad_id_aprobado_por_fkey FOREIGN KEY (id_aprobado_por) REFERENCES public.usuarios(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5285 (class 2606 OID 17995)
-- Name: novedad novedad_id_empleado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.novedad
    ADD CONSTRAINT novedad_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5288 (class 2606 OID 18055)
-- Name: observacion observacion_id_empleado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion
    ADD CONSTRAINT observacion_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5289 (class 2606 OID 18060)
-- Name: observacion observacion_id_supervisor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion
    ADD CONSTRAINT observacion_id_supervisor_fkey FOREIGN KEY (id_supervisor) REFERENCES public.supervisor(id_supervisor) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5265 (class 2606 OID 17711)
-- Name: permiso permiso_id_accion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permiso
    ADD CONSTRAINT permiso_id_accion_fkey FOREIGN KEY (id_accion) REFERENCES public.accion(id_accion) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5266 (class 2606 OID 17706)
-- Name: permiso permiso_id_modulo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permiso
    ADD CONSTRAINT permiso_id_modulo_fkey FOREIGN KEY (id_modulo) REFERENCES public.modulo(id_modulo) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5267 (class 2606 OID 17701)
-- Name: permiso permiso_id_perfil_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permiso
    ADD CONSTRAINT permiso_id_perfil_fkey FOREIGN KEY (id_perfil) REFERENCES public.perfil(id_perfil) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5310 (class 2606 OID 18392)
-- Name: pila pila_id_nomina_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pila
    ADD CONSTRAINT pila_id_nomina_fkey FOREIGN KEY (id_nomina) REFERENCES public.nomina(id_nomina) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5297 (class 2606 OID 18203)
-- Name: prestamo prestamo_id_empleado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestamo
    ADD CONSTRAINT prestamo_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5272 (class 2606 OID 17811)
-- Name: proyecto proyecto_id_supervisor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyecto
    ADD CONSTRAINT proyecto_id_supervisor_fkey FOREIGN KEY (id_supervisor) REFERENCES public.supervisor(id_supervisor) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5313 (class 2606 OID 18448)
-- Name: solicitud solicitud_id_gestor_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud
    ADD CONSTRAINT solicitud_id_gestor_por_fkey FOREIGN KEY (id_gestor_por) REFERENCES public.usuarios(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5314 (class 2606 OID 18443)
-- Name: solicitud solicitud_id_solicitante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud
    ADD CONSTRAINT solicitud_id_solicitante_fkey FOREIGN KEY (id_solicitante) REFERENCES public.usuarios(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5269 (class 2606 OID 17753)
-- Name: supervisor supervisor_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supervisor
    ADD CONSTRAINT supervisor_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5281 (class 2606 OID 17973)
-- Name: turno turno_id_asignado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.turno
    ADD CONSTRAINT turno_id_asignado_por_fkey FOREIGN KEY (id_asignado_por) REFERENCES public.usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5282 (class 2606 OID 17963)
-- Name: turno turno_id_empleado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.turno
    ADD CONSTRAINT turno_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5283 (class 2606 OID 17968)
-- Name: turno turno_id_proyecto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.turno
    ADD CONSTRAINT turno_id_proyecto_fkey FOREIGN KEY (id_proyecto) REFERENCES public.proyecto(id_proyecto) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5268 (class 2606 OID 17736)
-- Name: usuarios usuarios_id_perfil_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_id_perfil_fkey FOREIGN KEY (id_perfil) REFERENCES public.perfil(id_perfil) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5298 (class 2606 OID 18233)
-- Name: viatico viatico_id_aprobado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.viatico
    ADD CONSTRAINT viatico_id_aprobado_por_fkey FOREIGN KEY (id_aprobado_por) REFERENCES public.usuarios(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5299 (class 2606 OID 18223)
-- Name: viatico viatico_id_empleado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.viatico
    ADD CONSTRAINT viatico_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5300 (class 2606 OID 18228)
-- Name: viatico viatico_id_proyecto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.viatico
    ADD CONSTRAINT viatico_id_proyecto_fkey FOREIGN KEY (id_proyecto) REFERENCES public.proyecto(id_proyecto) ON UPDATE CASCADE ON DELETE RESTRICT;


-- Completed on 2026-09-01 14:24:42

--
-- PostgreSQL database dump complete
--

\unrestrict HSOaW8GbvdXkP2XokfnbE4PQO5vUBqXStRZa3C7yOSyRJCT8wMncPqF8Mfa5FJJ

