-- Buydrax: normalizar el nombre de la columna de contraseña.
-- Seguro para bases que ya usan password_encriptado: no realiza cambios.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'usuarios'
          AND column_name = 'password_hash'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'usuarios'
          AND column_name = 'password_encriptado'
    ) THEN
        ALTER TABLE usuarios RENAME COLUMN password_hash TO password_encriptado;
    END IF;
END $$;
