-- ============================================================
-- BUYDRAX — DATOS DEMO AMPLIADOS
-- Ejecutar DESPUÉS del script principal (BASE_DE_DATOS_BUYDRAX_CORREGIDA.sql)
-- o sobre una BD ya cargada. Seguro de re-ejecutar (usa NOT EXISTS).
--
-- Incluye: empresas/dominios, cuadrillas, vínculos, más asistencias,
-- turnos recientes, horas extra, observaciones, nóminas extra,
-- solicitudes, notificaciones, y relleno de id_cuadrilla.
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 0) Defaults / columnas opcionales
-- ------------------------------------------------------------
ALTER TABLE cuadrilla ALTER COLUMN creado_en SET DEFAULT NOW();
UPDATE cuadrilla SET creado_en = NOW() WHERE creado_en IS NULL;

-- ------------------------------------------------------------
-- 1) Empresas / dominios
-- ------------------------------------------------------------
INSERT INTO empresa (nombre, dominio, tipo, activo)
SELECT v.nombre, v.dominio, v.tipo, TRUE
FROM (VALUES
  ('Construandes', 'construandes.com.co', 'EMPRESA'),
  ('Buydrax Plataforma', 'buydrax.local', 'EMPRESA'),
  ('Colcenter Demo', 'colcenter.com', 'EMPRESA')
) AS v(nombre, dominio, tipo)
WHERE NOT EXISTS (
  SELECT 1 FROM empresa e WHERE lower(e.dominio) = lower(v.dominio)
);

UPDATE usuarios u
SET id_empresa = e.id_empresa
FROM empresa e
WHERE e.dominio = 'construandes.com.co'
  AND u.id_empresa IS NULL
  AND position('@' IN u.correo) > 0
  AND lower(split_part(u.correo, '@', 2)) = 'construandes.com.co';

UPDATE usuarios u
SET id_empresa = e.id_empresa
FROM empresa e
WHERE e.dominio = 'buydrax.local'
  AND lower(u.correo) = 'plataforma@buydrax.local';

-- Usuario plataforma EMPRESA (si no existe)
INSERT INTO usuarios (id_perfil, nombres, apellidos, correo, password_hash, estado, idioma, id_empresa)
SELECT p.id_perfil, 'Plataforma', 'Buydrax', 'plataforma@buydrax.local',
       COALESCE(
         (SELECT password_hash FROM usuarios WHERE lower(correo) = 'claudia.cardenas@construandes.com.co' LIMIT 1),
         '$2b$12$5NznOrcY.m6alT1MgfJpG.fU.SBPsaKMJDCt2BpUFwc8rOx0XRpNq'
       ),
       TRUE, 'ES', e.id_empresa
FROM perfil p
CROSS JOIN empresa e
WHERE p.nombre = 'EMPRESA'
  AND e.dominio = 'buydrax.local'
  AND NOT EXISTS (SELECT 1 FROM usuarios WHERE lower(correo) = 'plataforma@buydrax.local');

-- Permisos EMPRESA ≈ ADMIN_RRHH
INSERT INTO permiso (id_perfil, id_modulo, id_accion)
SELECT pe.id_perfil, pr.id_modulo, pr.id_accion
FROM permiso pr
JOIN perfil pa ON pa.id_perfil = pr.id_perfil AND pa.nombre = 'ADMIN_RRHH'
JOIN perfil pe ON pe.nombre = 'EMPRESA'
WHERE NOT EXISTS (
  SELECT 1 FROM permiso x
  WHERE x.id_perfil = pe.id_perfil AND x.id_modulo = pr.id_modulo AND x.id_accion = pr.id_accion
);

-- ------------------------------------------------------------
-- 2) Catálogo de cuadrillas
-- ------------------------------------------------------------
INSERT INTO cuadrilla (nombre, descripcion, activo, creado_en)
SELECT v.nombre, v.descripcion, TRUE, NOW()
FROM (VALUES
  ('Cuadrilla A', 'Cuadrilla operativa A — obra general'),
  ('Cuadrilla B', 'Cuadrilla operativa B — estructuras'),
  ('Cuadrilla C', 'Cuadrilla operativa C — acabados'),
  ('Cuadrilla D', 'Cuadrilla operativa D — instalaciones'),
  ('Cuadrilla E', 'Cuadrilla operativa E — apoyo'),
  ('General', 'Cuadrilla general / sin especializar')
) AS v(nombre, descripcion)
WHERE NOT EXISTS (
  SELECT 1 FROM cuadrilla c WHERE lower(c.nombre) = lower(v.nombre)
);

-- Nombres que ya existen solo como texto en asignaciones
INSERT INTO cuadrilla (nombre, activo, creado_en)
SELECT DISTINCT trim(a.cuadrilla), TRUE, NOW()
FROM asignacion_proyecto a
WHERE a.cuadrilla IS NOT NULL AND trim(a.cuadrilla) <> ''
  AND NOT EXISTS (
    SELECT 1 FROM cuadrilla c WHERE lower(c.nombre) = lower(trim(a.cuadrilla))
  );

-- Vincular cada cuadrilla a todos los proyectos ACTIVOS (demo multi-proyecto)
INSERT INTO cuadrilla_proyecto (id_cuadrilla, id_proyecto, activo, fecha_inicio)
SELECT c.id_cuadrilla, p.id_proyecto, TRUE, COALESCE(p.fecha_inicio, CURRENT_DATE)
FROM cuadrilla c
CROSS JOIN proyecto p
WHERE p.estado_proyecto = 'ACTIVO'
  AND c.activo = TRUE
  AND NOT EXISTS (
    SELECT 1 FROM cuadrilla_proyecto cp
    WHERE cp.id_cuadrilla = c.id_cuadrilla AND cp.id_proyecto = p.id_proyecto
  );

-- Rellenar id_cuadrilla en asignaciones según el nombre de texto
UPDATE asignacion_proyecto a
SET id_cuadrilla = c.id_cuadrilla
FROM cuadrilla c
WHERE a.id_cuadrilla IS NULL
  AND a.cuadrilla IS NOT NULL
  AND lower(trim(a.cuadrilla)) = lower(c.nombre);

-- ------------------------------------------------------------
-- 3) Asignaciones activas extra (empleados sin asignación activa)
-- ------------------------------------------------------------
INSERT INTO asignacion_proyecto (id_proyecto, id_empleado, cuadrilla, rol_en_proyecto, fecha_asignacion, activo, id_cuadrilla)
SELECT
  ((e.id_empleado - 1) % (SELECT COUNT(*) FROM proyecto WHERE estado_proyecto = 'ACTIVO')) + 1,
  e.id_empleado,
  CASE ((e.id_empleado - 1) % 5)
    WHEN 0 THEN 'Cuadrilla A'
    WHEN 1 THEN 'Cuadrilla B'
    WHEN 2 THEN 'Cuadrilla C'
    WHEN 3 THEN 'Cuadrilla D'
    ELSE 'Cuadrilla E'
  END,
  e.cargo,
  GREATEST(e.fecha_ingreso, DATE '2024-01-15'),
  TRUE,
  (SELECT c.id_cuadrilla FROM cuadrilla c
   WHERE c.nombre = CASE ((e.id_empleado - 1) % 5)
     WHEN 0 THEN 'Cuadrilla A' WHEN 1 THEN 'Cuadrilla B' WHEN 2 THEN 'Cuadrilla C'
     WHEN 3 THEN 'Cuadrilla D' ELSE 'Cuadrilla E' END
   LIMIT 1)
FROM empleado e
WHERE e.estado_laboral = 'ACTIVO'
  AND NOT EXISTS (
    SELECT 1 FROM asignacion_proyecto ap
    WHERE ap.id_empleado = e.id_empleado AND ap.activo = TRUE
  )
  AND EXISTS (SELECT 1 FROM proyecto WHERE estado_proyecto = 'ACTIVO');

-- Ajustar id_proyecto si el módulo no coincide con ids reales
UPDATE asignacion_proyecto a
SET id_proyecto = p.id_proyecto
FROM (
  SELECT id_proyecto, row_number() OVER (ORDER BY id_proyecto) AS rn
  FROM proyecto WHERE estado_proyecto = 'ACTIVO'
) p
WHERE a.activo = TRUE
  AND a.id_proyecto NOT IN (SELECT id_proyecto FROM proyecto)
  AND p.rn = 1;

-- ------------------------------------------------------------
-- 4) Asistencias recientes (últimos 20 días hábiles aprox.)
--    Presente / Retardo / Inasistencia variados
-- ------------------------------------------------------------
INSERT INTO asistencia (
  id_empleado, id_creado_por, fecha, hora_entrada, hora_salida,
  estado_asistencia, observacion, fecha_creacion
)
SELECT
  e.id_empleado,
  1,  -- creado por Admin RRHH (Claudia)
  d.dia,
  CASE (e.id_empleado + EXTRACT(DOY FROM d.dia)::int) % 5
    WHEN 0 THEN TIME '07:05'
    WHEN 1 THEN TIME '07:25'  -- retardo
    WHEN 2 THEN TIME '06:55'
    WHEN 3 THEN TIME '07:00'
    ELSE TIME '07:15'
  END,
  CASE WHEN (e.id_empleado + EXTRACT(DOY FROM d.dia)::int) % 11 = 0
    THEN NULL
    ELSE TIME '16:00' + ((e.id_empleado % 3) * INTERVAL '15 minutes')
  END,
  CASE (e.id_empleado + EXTRACT(DOY FROM d.dia)::int) % 7
    WHEN 0 THEN 'INASISTENCIA'::estado_asistencia_enum
    WHEN 1 THEN 'RETARDO'::estado_asistencia_enum
    ELSE 'PRESENTE'::estado_asistencia_enum
  END,
  CASE (e.id_empleado + EXTRACT(DOY FROM d.dia)::int) % 7
    WHEN 0 THEN 'Sin justificar (demo)'
    WHEN 1 THEN 'Llegó tarde por transporte (demo)'
    ELSE NULL
  END,
  d.dia + TIME '18:00'
FROM empleado e
CROSS JOIN (
  SELECT (CURRENT_DATE - (g || ' days')::interval)::date AS dia
  FROM generate_series(0, 27) AS g
) d
WHERE e.estado_laboral = 'ACTIVO'
  AND e.id_empleado <= 25
  AND EXTRACT(ISODOW FROM d.dia) BETWEEN 1 AND 6  -- lun-sáb
  AND NOT EXISTS (
    SELECT 1 FROM asistencia a
    WHERE a.id_empleado = e.id_empleado AND a.fecha = d.dia
  );

-- Inasistencias: hora salida null y entrada 00:00 si hace falta
UPDATE asistencia
SET hora_entrada = TIME '00:00', hora_salida = NULL
WHERE estado_asistencia = 'INASISTENCIA'
  AND fecha >= CURRENT_DATE - 30;

-- ------------------------------------------------------------
-- 5) Turnos recientes (sin solapamientos graves: un turno/día)
-- ------------------------------------------------------------
INSERT INTO turno (
  id_empleado, id_proyecto, id_asignado_por, tipo_turno, hora_inicio, hora_fin, fecha
)
SELECT
  e.id_empleado,
  COALESCE(
    (SELECT ap.id_proyecto FROM asignacion_proyecto ap
     WHERE ap.id_empleado = e.id_empleado AND ap.activo = TRUE
     ORDER BY ap.fecha_asignacion DESC LIMIT 1),
    (SELECT id_proyecto FROM proyecto WHERE estado_proyecto = 'ACTIVO' ORDER BY id_proyecto LIMIT 1)
  ),
  COALESCE(
    (SELECT u.id_usuario FROM usuarios u
     JOIN supervisor s ON s.id_usuario = u.id_usuario
     LIMIT 1),
    4
  ),
  CASE (e.id_empleado % 3)
    WHEN 0 THEN 'Diurno'
    WHEN 1 THEN 'Mixto'
    ELSE 'Nocturno'
  END,
  CASE (e.id_empleado % 3)
    WHEN 0 THEN TIME '07:00'
    WHEN 1 THEN TIME '10:00'
    ELSE TIME '18:00'
  END,
  CASE (e.id_empleado % 3)
    WHEN 0 THEN TIME '16:00'
    WHEN 1 THEN TIME '18:00'
    ELSE TIME '02:00'
  END,
  d.dia
FROM empleado e
CROSS JOIN (
  SELECT (CURRENT_DATE - (g || ' days')::interval)::date AS dia
  FROM generate_series(0, 13) AS g
) d
WHERE e.estado_laboral = 'ACTIVO'
  AND e.id_empleado <= 20
  AND EXTRACT(ISODOW FROM d.dia) BETWEEN 1 AND 6
  AND NOT EXISTS (
    SELECT 1 FROM turno t
    WHERE t.id_empleado = e.id_empleado AND t.fecha = d.dia
  )
  AND EXISTS (SELECT 1 FROM proyecto WHERE estado_proyecto = 'ACTIVO');

-- ------------------------------------------------------------
-- 6) Horas extra adicionales (fechas válidas inicio <= fin)
-- ------------------------------------------------------------
INSERT INTO hora_extra (
  id_empleado, id_aprobador, motivo, fecha_inicio, fecha_fin,
  cantidad_horas, tipo_hora, archivo_soporte_url, estado_he
)
SELECT
  e.id_empleado,
  (SELECT id_supervisor FROM supervisor ORDER BY id_supervisor LIMIT 1),
  'Refuerzo obra / cierre de etapa (demo ampliado)',
  (CURRENT_DATE - ((e.id_empleado % 10) || ' days')::interval)::date,
  (CURRENT_DATE - ((e.id_empleado % 10) || ' days')::interval)::date,
  2 + (e.id_empleado % 4),
  CASE (e.id_empleado % 3)
    WHEN 0 THEN 'DIURNA'::tipo_hora_enum
    WHEN 1 THEN 'NOCTURNA'::tipo_hora_enum
    ELSE 'DOMINICAL'::tipo_hora_enum
  END,
  '/soportes/he_demo_' || e.id_empleado || '.pdf',
  CASE (e.id_empleado % 3)
    WHEN 0 THEN 'PENDIENTE'::estado_he_enum
    WHEN 1 THEN 'APROBADA'::estado_he_enum
    ELSE 'RECHAZADA'::estado_he_enum
  END
FROM empleado e
WHERE e.estado_laboral = 'ACTIVO'
  AND e.id_empleado BETWEEN 1 AND 15
  AND NOT EXISTS (
    SELECT 1 FROM hora_extra h
    WHERE h.id_empleado = e.id_empleado
      AND h.motivo LIKE '%demo ampliado%'
  );

-- ------------------------------------------------------------
-- 7) Observaciones extra
-- ------------------------------------------------------------
INSERT INTO observacion (
  id_empleado, id_supervisor, tipo_observacion, descripcion, fecha, escalada, estado_observacion
)
SELECT
  e.id_empleado,
  COALESCE(e.id_supervisor, (SELECT id_supervisor FROM supervisor LIMIT 1)),
  CASE (e.id_empleado % 4)
    WHEN 0 THEN 'RECONOCIMIENTO'::tipo_observacion_enum
    WHEN 1 THEN 'COMENTARIO'::tipo_observacion_enum
    WHEN 2 THEN 'LLAMADO_ATENCION'::tipo_observacion_enum
    ELSE 'INCIDENCIA'::tipo_observacion_enum
  END,
  'Registro demo ampliado — seguimiento de desempeño en obra.',
  CURRENT_DATE - ((e.id_empleado % 20) || ' days')::interval,
  (e.id_empleado % 4) = 3,
  CASE WHEN (e.id_empleado % 4) = 3 THEN 'NOTIFICADA'::estado_observacion_enum
       ELSE 'REGISTRADA'::estado_observacion_enum END
FROM empleado e
WHERE e.estado_laboral = 'ACTIVO'
  AND e.id_empleado BETWEEN 1 AND 18
  AND e.id_supervisor IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM observacion o
    WHERE o.id_empleado = e.id_empleado
      AND o.descripcion LIKE '%demo ampliado%'
  );

-- ------------------------------------------------------------
-- 8) Nóminas extra (periodos recientes) + detalle simple
-- ------------------------------------------------------------
INSERT INTO nomina (
  id_obra, id_configuracion, id_admin_rrhh, periodo_inicio, periodo_fin,
  tipo_nomina, fecha_generacion, estado_nomina, total_pagado, cantidad_empleados
)
SELECT
  (SELECT id_proyecto FROM proyecto ORDER BY id_proyecto LIMIT 1),
  (SELECT id_configuracion FROM configuracion ORDER BY id_configuracion LIMIT 1),
  (SELECT id_admin_rrhh FROM admin_rrhh ORDER BY id_admin_rrhh LIMIT 1),
  v.inicio,
  v.fin,
  'QUINCENAL'::tipo_nomina_enum,
  v.fin + 2,
  v.estado,
  v.total,
  v.cant
FROM (VALUES
  (DATE '2026-10-01', DATE '2026-10-15', 'PAGADA'::estado_nomina_enum, 48500000.00, 25),
  (DATE '2026-10-16', DATE '2026-10-31', 'PAGADA'::estado_nomina_enum, 49200000.00, 26),
  (DATE '2026-11-01', DATE '2026-11-15', 'APROBADA'::estado_nomina_enum, 50150000.00, 28),
  (DATE '2026-11-16', DATE '2026-11-30', 'BORRADOR'::estado_nomina_enum, 0.00, 0)
) AS v(inicio, fin, estado, total, cant)
WHERE EXISTS (SELECT 1 FROM admin_rrhh LIMIT 1)
  AND EXISTS (SELECT 1 FROM configuracion LIMIT 1)
  AND NOT EXISTS (
    SELECT 1 FROM nomina n
    WHERE n.periodo_inicio = v.inicio AND n.periodo_fin = v.fin
  );

-- Detalle para la última nómina APROBADA/PAGADA sin detalle
INSERT INTO detalle_nomina (
  id_nomina, id_empleado, horas_ordinarias, horas_extra, dominicales_festivos,
  viaticos, incapacidades, descuentos_prestamos, neto_pagar
)
SELECT
  n.id_nomina,
  e.id_empleado,
  96,
  (e.id_empleado % 5) * 2,
  CASE WHEN e.id_empleado % 7 = 0 THEN 8 ELSE 0 END,
  CASE WHEN e.id_empleado % 4 = 0 THEN 80000 ELSE 0 END,
  0,
  CASE WHEN e.id_empleado % 6 = 0 THEN 50000 ELSE 0 END,
  GREATEST(e.salario / 2, 500000)
FROM nomina n
CROSS JOIN empleado e
WHERE n.estado_nomina IN ('APROBADA', 'PAGADA')
  AND e.estado_laboral = 'ACTIVO'
  AND e.id_empleado <= 20
  AND n.periodo_inicio >= DATE '2026-10-01'
  AND NOT EXISTS (
    SELECT 1 FROM detalle_nomina d
    WHERE d.id_nomina = n.id_nomina AND d.id_empleado = e.id_empleado
  )
  AND EXISTS (SELECT 1 FROM configuracion LIMIT 1);

-- ------------------------------------------------------------
-- 9) Solicitudes y notificaciones demo
-- ------------------------------------------------------------
INSERT INTO solicitud (
  id_solicitante, id_gestor_por, tipo_solicitud, descripcion,
  fecha_creacion, estado_solicitud, respuesta, fecha_respuesta
)
SELECT
  u.id_usuario,
  1,
  CASE (u.id_usuario % 3)
    WHEN 0 THEN 'CAMBIO_TURNO'::tipo_solicitud_enum
    WHEN 1 THEN 'PERMISO'::tipo_solicitud_enum
    ELSE 'CAPACITACION'::tipo_solicitud_enum
  END,
  'Solicitud generada en datos demo ampliados.',
  NOW() - ((u.id_usuario % 10) || ' days')::interval,
  CASE (u.id_usuario % 3)
    WHEN 0 THEN 'PENDIENTE'::estado_solicitud_enum
    WHEN 1 THEN 'APROBADA'::estado_solicitud_enum
    ELSE 'EN_REVISION'::estado_solicitud_enum
  END,
  CASE WHEN u.id_usuario % 3 = 1 THEN 'Aprobado en demo' ELSE NULL END,
  CASE WHEN u.id_usuario % 3 = 1 THEN NOW() - INTERVAL '1 day' ELSE NULL END
FROM usuarios u
WHERE u.id_usuario BETWEEN 11 AND 25
  AND NOT EXISTS (
    SELECT 1 FROM solicitud s
    WHERE s.id_solicitante = u.id_usuario
      AND s.descripcion LIKE '%demo ampliados%'
  );

INSERT INTO notificacion (id_destinatario, tipo, mensaje, fecha_envio, leida)
SELECT
  u.id_usuario,
  'ALERTA_CONTRATO'::tipo_notificacion_enum,
  'Demo: revisa tu información laboral y certificaciones.',
  NOW() - ((u.id_usuario % 5) || ' hours')::interval,
  (u.id_usuario % 2 = 0)
FROM usuarios u
WHERE u.id_usuario BETWEEN 1 AND 15
  AND NOT EXISTS (
    SELECT 1 FROM notificacion n
    WHERE n.id_destinatario = u.id_usuario
      AND n.mensaje LIKE 'Demo: revisa%'
  );

-- ------------------------------------------------------------
-- 10) Afiliaciones faltantes
-- ------------------------------------------------------------
INSERT INTO afiliacion (id_empleado, eps, fondo_pension, arl, caja_compensacion, nivel_riesgo_arl)
SELECT
  e.id_empleado,
  CASE (e.id_empleado % 3) WHEN 0 THEN 'Sura' WHEN 1 THEN 'Sanitas' ELSE 'Nueva EPS' END,
  CASE (e.id_empleado % 3) WHEN 0 THEN 'Porvenir' WHEN 1 THEN 'Protección' ELSE 'Colpensiones' END,
  'Sura ARL',
  'Compensar',
  1 + (e.id_empleado % 3)
FROM empleado e
WHERE NOT EXISTS (
  SELECT 1 FROM afiliacion a WHERE a.id_empleado = e.id_empleado
);

-- ------------------------------------------------------------
-- 11) Secuencias al día
-- ------------------------------------------------------------
SELECT setval(pg_get_serial_sequence('empresa', 'id_empresa'), COALESCE((SELECT MAX(id_empresa) FROM empresa), 1), true);
SELECT setval(pg_get_serial_sequence('cuadrilla', 'id_cuadrilla'), COALESCE((SELECT MAX(id_cuadrilla) FROM cuadrilla), 1), true);
SELECT setval(pg_get_serial_sequence('cuadrilla_proyecto', 'id_cuadrilla_proyecto'), COALESCE((SELECT MAX(id_cuadrilla_proyecto) FROM cuadrilla_proyecto), 1), true);
SELECT setval(pg_get_serial_sequence('asistencia', 'id_asistencia'), COALESCE((SELECT MAX(id_asistencia) FROM asistencia), 1), true);
SELECT setval(pg_get_serial_sequence('turno', 'id_turno'), COALESCE((SELECT MAX(id_turno) FROM turno), 1), true);
SELECT setval(pg_get_serial_sequence('hora_extra', 'id_hora_extra'), COALESCE((SELECT MAX(id_hora_extra) FROM hora_extra), 1), true);
SELECT setval(pg_get_serial_sequence('nomina', 'id_nomina'), COALESCE((SELECT MAX(id_nomina) FROM nomina), 1), true);
SELECT setval(pg_get_serial_sequence('detalle_nomina', 'id_detalle_nomina'), COALESCE((SELECT MAX(id_detalle_nomina) FROM detalle_nomina), 1), true);
SELECT setval(pg_get_serial_sequence('usuarios', 'id_usuario'), COALESCE((SELECT MAX(id_usuario) FROM usuarios), 1), true);

COMMIT;

-- Verificación rápida (opcional):
-- SELECT 'empresa' t, count(*) FROM empresa
-- UNION ALL SELECT 'cuadrilla', count(*) FROM cuadrilla
-- UNION ALL SELECT 'cuadrilla_proyecto', count(*) FROM cuadrilla_proyecto
-- UNION ALL SELECT 'asistencia', count(*) FROM asistencia
-- UNION ALL SELECT 'turno', count(*) FROM turno
-- UNION ALL SELECT 'hora_extra', count(*) FROM hora_extra
-- UNION ALL SELECT 'asignacion_proyecto', count(*) FROM asignacion_proyecto
-- UNION ALL SELECT 'nomina', count(*) FROM nomina
-- UNION ALL SELECT 'detalle_nomina', count(*) FROM detalle_nomina;
