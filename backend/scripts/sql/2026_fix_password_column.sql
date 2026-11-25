-- Asegura que la columna de contraseña se llame password_encriptado
-- (compatible con el modelo SQLAlchemy actual).

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuarios' AND column_name = 'password_hash'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuarios' AND column_name = 'password_encriptado'
  ) THEN
    ALTER TABLE usuarios RENAME COLUMN password_hash TO password_encriptado;
  END IF;
END $$;

-- Verificación
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'usuarios'
  AND column_name LIKE 'password%';
