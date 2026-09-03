-- ============================================================
-- CONSULTAS MULTITABLA - PROYECTO BUYDRAX
-- Base de datos: DB_Buydrax
-- Motor: PostgreSQL
--
-- Este archivo contiene consultas de lectura que relacionan
-- múltiples tablas de la base de datos para demostrar las
-- funcionalidades y relaciones principales del sistema.
--
-- Las consultas deben ejecutarse individualmente.
-- ============================================================

-- ============================================================
-- VERIFICACIÓN DE ESTRUCTURA
-- Descripción: 1. Consulta las columnas de la tabla que se 
--              requiera. 2. Consulta las tablas de la BD.
-- ============================================================

SELECT
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'NOMBRE_TABLA'
ORDER BY ordinal_position;

SELECT
    table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ============================================================
-- CONSULTA MULTITABLA 1
-- Descripción: Consulta los empleados junto con la información
--              asociada de sus usuarios.
-- ============================================================

SELECT
    e.id_empleado,
    u.nombres,
    u.apellidos,
    u.correo,
    e.estado_laboral
FROM empleado e
JOIN usuarios u
    ON u.id_usuario = e.id_usuario
ORDER BY e.id_empleado;

-- ============================================================
-- CONSULTA MULTITABLA 2
-- Descripción: Consulta los empleados junto con su usuario y
--              el perfil de acceso asignado.
-- ============================================================

SELECT
    e.id_empleado,
    u.nombres,
    u.apellidos,
    u.correo,
    p.nombre AS perfil,
    e.estado_laboral
FROM empleado e
JOIN usuarios u
    ON u.id_usuario = e.id_usuario
JOIN perfil p
    ON p.id_perfil = u.id_perfil
ORDER BY e.id_empleado;

-- ============================================================
-- CONSULTA MULTITABLA 3
-- Descripción: Consulta los contratos asociados a cada empleado,
--              mostrando información del empleado y del contrato.
-- ============================================================

SELECT
    e.id_empleado,
    u.nombres,
    u.apellidos,
    c.id_contrato,
    c.tipo_contrato,
    c.fecha_inicio,
    c.fecha_fin,
    c.salario
FROM empleado e
JOIN usuarios u
    ON u.id_usuario = e.id_usuario
JOIN contrato c
    ON c.id_empleado = e.id_empleado
ORDER BY e.id_empleado;

-- ============================================================
-- CONSULTA MULTITABLA 4
-- Descripción: Consulta los empleados asignados a proyectos,
--              mostrando el proyecto, la información del empleado,
--              su cuadrilla, rol y estado de la asignación.
-- ============================================================

SELECT
    e.id_empleado,
    u.nombres,
    u.apellidos,
    p.id_proyecto,
    p.nombre AS proyecto,
    ap.cuadrilla,
    ap.rol_en_proyecto,
    ap.fecha_asignacion,
    ap.activo
FROM empleado e
JOIN usuarios u
    ON u.id_usuario = e.id_usuario
JOIN asignacion_proyecto ap
    ON ap.id_empleado = e.id_empleado
JOIN proyecto p
    ON p.id_proyecto = ap.id_proyecto
ORDER BY p.nombre, e.id_empleado;

-- ============================================================
-- CONSULTA MULTITABLA 5
-- Descripción: Consulta la nómina junto con los empleados
--              incluidos en la liquidación, mostrando las horas,
--              conceptos adicionales y el valor neto a pagar.
-- ============================================================

SELECT
    n.id_nomina,
    n.periodo_inicio,
    n.periodo_fin,
    dn.id_detalle_nomina,
    e.id_empleado,
    u.nombres,
    u.apellidos,
    dn.horas_ordinarias,
    dn.horas_extra,
    dn.dominicales_festivos,
    dn.viaticos,
    dn.incapacidades,
    dn.descuentos_prestamos,
    dn.neto_pagar
FROM nomina n
JOIN detalle_nomina dn
    ON dn.id_nomina = n.id_nomina
JOIN empleado e
    ON e.id_empleado = dn.id_empleado
JOIN usuarios u
    ON u.id_usuario = e.id_usuario
ORDER BY dn.id_detalle_nomina;

-- ============================================================
-- CONSULTA MULTITABLA 6
-- Descripción: Consulta la nómina, los empleados liquidados
--              y sus desprendibles de pago, mostrando el
--              período, el valor neto recibido y el estado
--              de descarga del desprendible.
-- ============================================================

SELECT
    n.id_nomina,
    n.periodo_inicio,
    n.periodo_fin,
    e.id_empleado,
    u.nombres,
    u.apellidos,
    d.id_desprendible,
    d.periodo_pago,
    d.fecha_pago,
    d.neto_recibido,
    d.estado_descarga
FROM nomina n
JOIN detalle_nomina dn
    ON dn.id_nomina = n.id_nomina
JOIN empleado e
    ON e.id_empleado = dn.id_empleado
JOIN usuarios u
    ON u.id_usuario = e.id_usuario
JOIN desprendible d
    ON d.id_detalle_nomina = dn.id_detalle_nomina
ORDER BY d.id_desprendible;

-- ============================================================
-- CONSULTA MULTITABLA 7
-- Descripción: Consulta la PILA junto con los empleados y sus
--              aportes individuales a salud, pensión, ARL y
--              paraestatales.
-- ============================================================

SELECT
    p.id_pila,
    p.periodo_inicio,
    p.periodo_fin,
    e.id_empleado,
    u.nombres,
    u.apellidos,
    a.ibc,
    a.dias_cotizados,
    a.tarifa_arl,
    a.aportes_salud,
    a.aportes_pension,
    a.aportes_arl,
    a.aportes_paraestatales
FROM pila p
JOIN aporte_empleado a
    ON a.id_pila = p.id_pila
JOIN empleado e
    ON e.id_empleado = a.id_empleado
JOIN usuarios u
    ON u.id_usuario = e.id_usuario
ORDER BY a.id_aporte;

-- ============================================================
-- CONSULTA MULTITABLA 8
-- Descripción: Consulta los empleados junto con su información
--              de afiliación al sistema de seguridad social.
-- ============================================================

SELECT
    e.id_empleado,
    u.nombres,
    u.apellidos,
    a.id_afiliacion,
    a.eps,
    a.fondo_pension,
    a.arl,
    a.caja_compensacion,
    a.nivel_riesgo_arl,
    a.fecha_afiliacion,
    a.estado_afiliacion
FROM empleado e
JOIN usuarios u
    ON u.id_usuario = e.id_usuario
JOIN afiliacion a
    ON a.id_empleado = e.id_empleado
ORDER BY e.id_empleado;

-- ============================================================
-- CONSULTA MULTITABLA 9
-- Descripción: Consulta las horas extras registradas para los
--              empleados, mostrando sus datos personales,
--              período, cantidad, tipo y estado de la hora extra.
-- ============================================================

SELECT
    e.id_empleado,
    u.nombres,
    u.apellidos,
    he.id_hora_extra,
    he.motivo,
    he.fecha_inicio,
    he.fecha_fin,
    he.cantidad_horas,
    he.tipo_hora,
    he.estado_he
FROM empleado e
JOIN usuarios u
    ON u.id_usuario = e.id_usuario
JOIN hora_extra he
    ON he.id_empleado = e.id_empleado
ORDER BY he.fecha_inicio, e.id_empleado;

-- ============================================================
-- CONSULTA MULTITABLA 10
-- Descripción: Consulta las horas extras registradas junto con
--              el empleado que las realizó y el supervisor
--              responsable de su aprobación.
-- ============================================================

SELECT
    he.id_hora_extra,
    he.fecha_inicio,
    he.fecha_fin,
    he.cantidad_horas,
    he.tipo_hora,
    he.estado_he,
    e.id_empleado,
    ue.nombres AS nombres_empleado,
    ue.apellidos AS apellidos_empleado,
    s.id_supervisor,
    us.nombres AS nombres_supervisor,
    us.apellidos AS apellidos_supervisor
FROM hora_extra he
JOIN empleado e
    ON e.id_empleado = he.id_empleado
JOIN usuarios ue
    ON ue.id_usuario = e.id_usuario
JOIN supervisor s
    ON s.id_supervisor = he.id_aprobador
JOIN usuarios us
    ON us.id_usuario = s.id_usuario
ORDER BY he.fecha_inicio, he.id_hora_extra;

-- ============================================================
-- CONSULTA MULTITABLA 11
-- Descripción: Consulta los préstamos asociados a los empleados,
--              mostrando los datos del empleado, las condiciones
--              del préstamo, las cuotas y el saldo pendiente.
-- ============================================================

SELECT
    e.id_empleado,
    u.nombres,
    u.apellidos,
    pr.id_prestamo,
    pr.tipo_obligacion,
    pr.valor_total,
    pr.numero_cuotas,
    pr.valor_cuota,
    pr.cuotas_pagadas,
    pr.saldo_pendiente,
    pr.fecha_inicio,
    pr.estado_prestamo
FROM prestamo pr
JOIN empleado e
    ON e.id_empleado = pr.id_empleado
JOIN usuarios u
    ON u.id_usuario = e.id_usuario
ORDER BY e.id_empleado, pr.id_prestamo;

-- ============================================================
-- CONSULTA MULTITABLA 12
-- Descripción: Consulta los contratos junto con el empleado,
--              supervisor y proyecto asociados, mostrando las
--              principales condiciones del contrato.
-- ============================================================

SELECT
    c.id_contrato,
    e.id_empleado,
    ue.nombres AS nombres_empleado,
    ue.apellidos AS apellidos_empleado,
    s.id_supervisor,
    us.nombres AS nombres_supervisor,
    us.apellidos AS apellidos_supervisor,
    p.id_proyecto,
    p.nombre AS proyecto,
    c.tipo_contrato,
    c.salario,
    c.fecha_inicio,
    c.fecha_fin,
    c.obra_asignada,
    c.arl,
    c.estado_contrato
FROM contrato c
JOIN empleado e
    ON e.id_empleado = c.id_empleado
JOIN usuarios ue
    ON ue.id_usuario = e.id_usuario
JOIN supervisor s
    ON s.id_supervisor = c.id_supervisor
JOIN usuarios us
    ON us.id_usuario = s.id_usuario
JOIN proyecto p
    ON p.id_proyecto = c.id_proyecto
ORDER BY c.id_contrato;

-- ============================================================
-- CONSULTA MULTITABLA 13
-- Descripción: Consulta la asistencia de los empleados junto
--              con el turno asignado para la misma fecha,
--              mostrando horarios, estado y observaciones.
-- ============================================================

SELECT
    e.id_empleado,
    u.nombres,
    u.apellidos,
    a.id_asistencia,
    a.fecha,
    a.hora_entrada,
    a.hora_salida,
    a.estado_asistencia,
    a.observacion,
    t.id_turno,
    t.tipo_turno,
    t.hora_inicio,
    t.hora_fin,
    t.id_proyecto
FROM asistencia a
JOIN empleado e
    ON e.id_empleado = a.id_empleado
JOIN usuarios u
    ON u.id_usuario = e.id_usuario
LEFT JOIN turno t
    ON t.id_empleado = a.id_empleado
   AND t.fecha = a.fecha
ORDER BY a.fecha, e.id_empleado, a.id_asistencia;

-- ============================================================
-- CONSULTA MULTITABLA 14
-- Descripción: Consulta las liquidaciones de los empleados,
--              mostrando sus datos personales, información del
--              retiro y los valores correspondientes a las
--              prestaciones sociales liquidadas.
-- ============================================================

SELECT
    l.id_liquidacion,
    e.id_empleado,
    u.nombres,
    u.apellidos,
    l.fecha_retiro,
    l.motivo_retiro,
    l.salario_promedio,
    l.dias_trabajados,
    l.cesantias,
    l.intereses_cesantias,
    l.prima,
    l.vacaciones
FROM liquidacion l
JOIN empleado e
    ON e.id_empleado = l.id_empleado
JOIN usuarios u
    ON u.id_usuario = e.id_usuario
ORDER BY l.id_liquidacion;

-- ============================================================
-- CONSULTA MULTITABLA 15
-- Descripción: Consulta las liquidaciones junto con el empleado
--              y la configuración utilizada para calcularlas,
--              incluyendo el año de vigencia y los principales
--              parámetros salariales y de aportes.
-- ============================================================

SELECT
    l.id_liquidacion,
    e.id_empleado,
    u.nombres,
    u.apellidos,
    l.fecha_retiro,
    l.motivo_retiro,
    l.salario_promedio,
    l.dias_trabajados,
    l.cesantias,
    l.intereses_cesantias,
    l.prima,
    l.vacaciones,
    c.id_configuracion,
    c.anio_vigencia,
    c.smlmv,
    c.auxilio_transporte,
    c.pct_salud_empleado,
    c.pct_pension_empleado
FROM liquidacion l
JOIN empleado e
    ON e.id_empleado = l.id_empleado
JOIN usuarios u
    ON u.id_usuario = e.id_usuario
JOIN configuracion c
    ON c.id_configuracion = l.id_configuracion
ORDER BY l.id_liquidacion;