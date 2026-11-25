-- Buydrax multi-tenant + soft delete + recuperación
-- REQUERIDO para aislamiento total por dominio
BEGIN;

ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS dominio VARCHAR(120);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS eliminado_en TIMESTAMP NULL;

UPDATE usuarios
SET dominio = lower(split_part(correo, '@', 2))
WHERE (dominio IS NULL OR dominio = '')
  AND correo IS NOT NULL
  AND position('@' in correo) > 0;

CREATE INDEX IF NOT EXISTS ix_usuarios_dominio ON usuarios (dominio);

ALTER TABLE empleado ADD COLUMN IF NOT EXISTS eliminado_en TIMESTAMP NULL;
CREATE INDEX IF NOT EXISTS ix_empleado_eliminado ON empleado (eliminado_en);

ALTER TABLE proyecto ADD COLUMN IF NOT EXISTS dominio VARCHAR(120);
ALTER TABLE proyecto ADD COLUMN IF NOT EXISTS eliminado_en TIMESTAMP NULL;
CREATE INDEX IF NOT EXISTS ix_proyecto_dominio ON proyecto (dominio);

UPDATE proyecto p
SET dominio = lower(u.dominio)
FROM supervisor s
JOIN usuarios u ON u.id_usuario = s.id_usuario
WHERE p.id_supervisor = s.id_supervisor
  AND (p.dominio IS NULL OR p.dominio = '')
  AND u.dominio IS NOT NULL;

CREATE TABLE IF NOT EXISTS recuperacion_password (
  id_recuperacion SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  token VARCHAR(128) NOT NULL UNIQUE,
  expira_en TIMESTAMP NOT NULL,
  usado BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMIT;
