-- ============================================================
-- BUYDRAX: Cuadrillas como entidad (multi-proyecto)
-- Ejecutar DESPUÉS de BASE_DE_DATOS y (si aplica) rol EMPRESA
-- Script independiente en DBeaver
-- ============================================================
-- Reglas:
--  * Una cuadrilla puede estar en varios proyectos
--  * Quitar cuadrilla de un proyecto: solo si no hay empleados activos
--    (o usar "retirar todos y desvincular")
-- ============================================================

BEGIN;

-- 1) Catálogo de cuadrillas
CREATE TABLE IF NOT EXISTS cuadrilla (
    id_cuadrilla   SERIAL PRIMARY KEY,
    nombre         VARCHAR(80) NOT NULL,
    descripcion    VARCHAR(200) NULL,
    id_supervisor  INT NULL REFERENCES supervisor(id_supervisor) ON DELETE SET NULL ON UPDATE CASCADE,
    activo         BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en      TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_cuadrilla_nombre UNIQUE (nombre)
);

CREATE INDEX IF NOT EXISTS ix_cuadrilla_activo ON cuadrilla (activo);

-- 2) Vínculo cuadrilla ↔ proyecto (una cuadrilla en N proyectos)
CREATE TABLE IF NOT EXISTS cuadrilla_proyecto (
    id_cuadrilla_proyecto SERIAL PRIMARY KEY,
    id_cuadrilla   INT NOT NULL REFERENCES cuadrilla(id_cuadrilla) ON DELETE CASCADE ON UPDATE CASCADE,
    id_proyecto    INT NOT NULL REFERENCES proyecto(id_proyecto) ON DELETE CASCADE ON UPDATE CASCADE,
    activo         BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_inicio   DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_fin      DATE NULL,
    CONSTRAINT uq_cuadrilla_proyecto UNIQUE (id_cuadrilla, id_proyecto)
);

CREATE INDEX IF NOT EXISTS ix_cp_proyecto ON cuadrilla_proyecto (id_proyecto);
CREATE INDEX IF NOT EXISTS ix_cp_cuadrilla ON cuadrilla_proyecto (id_cuadrilla);

-- 3) FK opcional en asignación (se mantiene columna texto por compatibilidad)
ALTER TABLE asignacion_proyecto
    ADD COLUMN IF NOT EXISTS id_cuadrilla INT NULL
        REFERENCES cuadrilla(id_cuadrilla) ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS ix_asignacion_id_cuadrilla ON asignacion_proyecto (id_cuadrilla);

-- 4) Migrar nombres de cuadrilla ya usados en asignaciones
INSERT INTO cuadrilla (nombre, activo)
SELECT DISTINCT trim(a.cuadrilla), TRUE
FROM asignacion_proyecto a
WHERE a.cuadrilla IS NOT NULL
  AND trim(a.cuadrilla) <> ''
  AND NOT EXISTS (
      SELECT 1 FROM cuadrilla c WHERE lower(c.nombre) = lower(trim(a.cuadrilla))
  );

-- Vincular id_cuadrilla en asignaciones existentes
UPDATE asignacion_proyecto a
SET id_cuadrilla = c.id_cuadrilla
FROM cuadrilla c
WHERE a.id_cuadrilla IS NULL
  AND a.cuadrilla IS NOT NULL
  AND lower(trim(a.cuadrilla)) = lower(c.nombre);

-- Crear vínculos cuadrilla_proyecto desde asignaciones activas
INSERT INTO cuadrilla_proyecto (id_cuadrilla, id_proyecto, activo, fecha_inicio)
SELECT DISTINCT a.id_cuadrilla, a.id_proyecto, TRUE, COALESCE(a.fecha_asignacion, CURRENT_DATE)
FROM asignacion_proyecto a
WHERE a.id_cuadrilla IS NOT NULL
  AND COALESCE(a.activo, TRUE) = TRUE
  AND NOT EXISTS (
      SELECT 1 FROM cuadrilla_proyecto cp
      WHERE cp.id_cuadrilla = a.id_cuadrilla AND cp.id_proyecto = a.id_proyecto
  );

COMMIT;
