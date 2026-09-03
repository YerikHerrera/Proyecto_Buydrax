-- ============================================================
-- VALIDACIÓN DE CANTIDAD DE REGISTROS PRINCIPALES
-- ============================================================

-- Verifica la cantidad de empleados registrados en la base de datos.

SELECT COUNT(*) AS total_empleados
FROM empleado;

-- Verifica la cantidad de nóminas registradas en la base de datos.

SELECT COUNT(*) AS total_nominas
FROM nomina;

-- Verifica la cantidad de detalles de nómina registrados.

SELECT COUNT(*) AS total_detalles_nomina
FROM detalle_nomina;

-- Verifica la cantidad de desprendibles de nómina registrados.

SELECT COUNT(*) AS total_desprendibles
FROM desprendible;

-- Verifica la cantidad de registros de PILA generados.

SELECT COUNT(*) AS total_pila
FROM pila;

-- Verifica la cantidad de aportes individuales registrados en la PILA.

SELECT COUNT(*) AS total_aportes_empleado
FROM aporte_empleado;

-- ============================================================
-- VALIDACIÓN DE RELACIÓN ENTRE EMPLEADOS Y USUARIOS
-- ============================================================

-- Verifica la relación entre cada empleado y su usuario asociado,
-- mostrando los datos básicos de identificación y el estado laboral.

SELECT
    e.id_empleado,
    e.id_usuario,
    u.nombres,
    u.apellidos,
    e.estado_laboral
FROM empleado e
JOIN usuarios u
    ON u.id_usuario = e.id_usuario
ORDER BY e.id_empleado;

-- ============================================================
-- VALIDACIÓN DE EMPLEADOS SIN DETALLE DE NÓMINA
-- ============================================================

-- Identifica empleados que no tienen un detalle de nómina asociado.
-- Permite comprobar que los empleados retirados no estén incluidos
-- accidentalmente en la nómina.

SELECT
    e.id_empleado,
    u.nombres,
    u.apellidos,
    e.estado_laboral
FROM empleado e
JOIN usuarios u
    ON u.id_usuario = e.id_usuario
LEFT JOIN detalle_nomina dn
    ON dn.id_empleado = e.id_empleado
WHERE dn.id_empleado IS NULL
ORDER BY e.id_empleado;

-- ============================================================
-- VALIDACIÓN DE DETALLES DE NÓMINA Y EMPLEADOS
-- ============================================================

-- Verifica que cada detalle de nómina esté asociado con un
-- empleado existente y muestra sus datos de identificación.

SELECT
    dn.id_detalle_nomina,
    dn.id_nomina,
    dn.id_empleado,
    u.nombres,
    u.apellidos,
    e.estado_laboral
FROM detalle_nomina dn
JOIN empleado e
    ON e.id_empleado = dn.id_empleado
JOIN usuarios u
    ON u.id_usuario = e.id_usuario
ORDER BY dn.id_empleado;

-- ============================================================
-- VALIDACIÓN DE DETALLE DE NÓMINA Y DESPRENDIBLE
-- ============================================================

-- Verifica que los detalles de nómina tengan un desprendible
-- asociado y muestra la información principal del desprendible.

SELECT
    dn.id_detalle_nomina,
    dn.id_nomina,
    dn.id_empleado,
    d.id_desprendible,
    d.neto_recibido,
    d.periodo_pago,
    d.fecha_pago,
    d.estado_descarga
FROM detalle_nomina dn
JOIN desprendible d
    ON d.id_detalle_nomina = dn.id_detalle_nomina
ORDER BY dn.id_detalle_nomina;

-- ============================================================
-- VALIDACIÓN DE CONSISTENCIA DEL EMPLEADO EN DESPRENDIBLE
-- ============================================================

-- Detecta posibles inconsistencias entre el empleado registrado
-- en el detalle de nómina y el empleado registrado en su desprendible.
-- El resultado esperado es cero filas.

SELECT
    dn.id_detalle_nomina,
    dn.id_empleado AS empleado_detalle,
    d.id_empleado AS empleado_desprendible
FROM detalle_nomina dn
JOIN desprendible d
    ON d.id_detalle_nomina = dn.id_detalle_nomina
WHERE dn.id_empleado <> d.id_empleado;

-- ============================================================
-- VALIDACIÓN DE ESTRUCTURA DE LA TABLA PILA
-- ============================================================

-- Consulta la estructura de columnas de la tabla PILA para
-- comprobar los campos utilizados en las validaciones de aportes.

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'pila'
ORDER BY ordinal_position;

-- ============================================================
-- VALIDACIÓN DE ESTRUCTURA DE LA TABLA APORTE_EMPLEADO
-- ============================================================

-- Consulta la estructura de columnas de aporte_empleado para
-- comprobar los campos utilizados en la validación de aportes.

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'aporte_empleado'
ORDER BY ordinal_position;

-- ============================================================
-- VALIDACIÓN DE RELACIÓN ENTRE PILA, APORTES Y EMPLEADOS
-- ============================================================

-- Verifica que cada aporte esté asociado con una PILA y un
-- empleado existente, mostrando los valores utilizados para
-- calcular los diferentes aportes.

SELECT
    a.id_aporte,
    a.id_pila,
    a.id_empleado,
    u.nombres,
    u.apellidos,
    a.ibc,
    a.dias_cotizados,
    a.tarifa_arl,
    a.aportes_salud,
    a.aportes_pension,
    a.aportes_arl,
    a.aportes_paraestatales
FROM aporte_empleado a
JOIN empleado e
    ON e.id_empleado = a.id_empleado
JOIN usuarios u
    ON u.id_usuario = e.id_usuario
JOIN pila p
    ON p.id_pila = a.id_pila
ORDER BY a.id_aporte;

-- ============================================================
-- VALIDACIÓN DE TOTALES DE PILA Y APORTES
-- ============================================================

-- Compara los totales registrados en PILA con la suma de los
-- aportes individuales de aporte_empleado para comprobar su
-- consistencia contable.

SELECT
    p.id_pila,
    p.id_nomina,
    p.total_salud,
    SUM(a.aportes_salud) AS suma_aportes_salud,
    p.total_pension,
    SUM(a.aportes_pension) AS suma_aportes_pension,
    p.total_arl,
    SUM(a.aportes_arl) AS suma_aportes_arl,
    p.total_paraestatales,
    SUM(a.aportes_paraestatales) AS suma_aportes_paraestatales
FROM pila p
LEFT JOIN aporte_empleado a
    ON a.id_pila = p.id_pila
GROUP BY
    p.id_pila,
    p.id_nomina,
    p.total_salud,
    p.total_pension,
    p.total_arl,
    p.total_paraestatales;

-- ============================================================
-- VALIDACIÓN DE CANTIDAD DE PERMISOS POR PERFIL
-- ============================================================

-- Verifica la cantidad de permisos asignados a cada perfil
-- dentro de la matriz de autorización del sistema.

SELECT
    p.nombre AS perfil,
    COUNT(*) AS total_permisos
FROM permiso pe
JOIN perfil p
    ON p.id_perfil = pe.id_perfil
GROUP BY p.id_perfil, p.nombre
ORDER BY p.nombre;

-- ============================================================
-- VALIDACIÓN DE PERMISOS DEL PERFIL ADMIN_RRHH
-- ============================================================

-- Detalla los módulos y acciones asignados al perfil ADMIN_RRHH
-- para comprobar las 46 combinaciones de permisos definidas
-- en la matriz de autorización.

SELECT
    p.nombre AS perfil,
    m.nombre AS modulo,
    a.nombre AS accion
FROM permiso pe
JOIN perfil p
    ON p.id_perfil = pe.id_perfil
JOIN modulo m
    ON m.id_modulo = pe.id_modulo
JOIN accion a
    ON a.id_accion = pe.id_accion
WHERE p.nombre = 'ADMIN_RRHH'
ORDER BY m.nombre, a.nombre;