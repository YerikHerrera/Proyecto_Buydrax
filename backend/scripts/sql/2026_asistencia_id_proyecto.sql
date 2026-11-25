-- Opcional: vincular asistencia a proyecto (Registrar asistencia)
BEGIN;
ALTER TABLE asistencia
  ADD COLUMN IF NOT EXISTS id_proyecto INT NULL
    REFERENCES proyecto(id_proyecto) ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX IF NOT EXISTS ix_asistencia_id_proyecto ON asistencia (id_proyecto);
COMMIT;
