-- ============================================================
-- BUYDRAX: Rol EMPRESA + dominios explícitos (multi-tenant seguro)
-- Ejecutar en la base donde ya está el script principal.
-- ============================================================

BEGIN;

-- 1) Perfil EMPRESA (funciones tipo Admin a nivel de plataforma/tenant)
INSERT INTO perfil (nombre, descripcion)
SELECT 'EMPRESA', 'Administrador de plataforma: crea dominios y asigna Admin RRHH por empresa'
WHERE NOT EXISTS (SELECT 1 FROM perfil WHERE nombre = 'EMPRESA');

-- 2) Tabla de dominios / empresas
CREATE TABLE IF NOT EXISTS empresa (
    id_empresa   SERIAL PRIMARY KEY,
    nombre       VARCHAR(120) NOT NULL,
    dominio      VARCHAR(120) NOT NULL,
    tipo         VARCHAR(20)  NOT NULL DEFAULT 'EMPRESA',
    -- EMPRESA = dominio corporativo (@colcenter.com)
    -- EXTERNO = dominio externo autorizado (ej. gmail.com ligado a un tenant)
    activo       BOOLEAN      NOT NULL DEFAULT TRUE,
    creado_en    TIMESTAMP    NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_empresa_dominio UNIQUE (dominio),
    CONSTRAINT ck_empresa_tipo CHECK (tipo IN ('EMPRESA', 'EXTERNO'))
);

CREATE INDEX IF NOT EXISTS ix_empresa_dominio ON empresa (lower(dominio));

-- 3) Vincular usuarios a una empresa (opcional; el dominio del correo debe coincidir)
ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS id_empresa INT NULL
        REFERENCES empresa(id_empresa) ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS ix_usuarios_id_empresa ON usuarios (id_empresa);

-- 4) Semilla: dominio construandes (si aún no existe)
INSERT INTO empresa (nombre, dominio, tipo, activo)
SELECT 'Construandes', 'construandes.com.co', 'EMPRESA', TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM empresa WHERE lower(dominio) = 'construandes.com.co'
);

-- 5) Vincular usuarios @construandes.com.co a esa empresa
UPDATE usuarios u
SET id_empresa = e.id_empresa
FROM empresa e
WHERE e.dominio = 'construandes.com.co'
  AND u.id_empresa IS NULL
  AND position('@' in u.correo) > 0
  AND lower(split_part(u.correo, '@', 2)) = 'construandes.com.co';

-- 6) Permisos básicos del perfil EMPRESA (mismos módulos de consulta/gestión si existen)
-- Se copian permisos de ADMIN_RRHH cuando ambos perfiles existen.
INSERT INTO permiso (id_perfil, id_modulo, id_accion)
SELECT pe.id_perfil, p.id_modulo, p.id_accion
FROM permiso p
JOIN perfil pa ON pa.id_perfil = p.id_perfil AND pa.nombre = 'ADMIN_RRHH'
JOIN perfil pe ON pe.nombre = 'EMPRESA'
WHERE NOT EXISTS (
    SELECT 1 FROM permiso x
    WHERE x.id_perfil = pe.id_perfil
      AND x.id_modulo = p.id_modulo
      AND x.id_accion = p.id_accion
);


-- 7) Usuario plataforma EMPRESA de prueba (misma clave que el reset Admin123! si ya corriste el reset)
INSERT INTO usuarios (id_perfil, nombres, apellidos, correo, password_hash, estado, idioma)
SELECT p.id_perfil, 'Plataforma', 'Buydrax', 'plataforma@buydrax.local',
       COALESCE(
         (SELECT password_hash FROM usuarios WHERE lower(correo) = 'claudia.cardenas@construandes.com.co' LIMIT 1),
         '$2b$12$5NznOrcY.m6alT1MgfJpG.fU.SBPsaKMJDCt2BpUFwc8rOx0XRpNq'
       ),
       TRUE, 'ES'
FROM perfil p
WHERE p.nombre = 'EMPRESA'
  AND NOT EXISTS (SELECT 1 FROM usuarios WHERE lower(correo) = 'plataforma@buydrax.local');

-- Dominio local opcional para el usuario plataforma
INSERT INTO empresa (nombre, dominio, tipo, activo)
SELECT 'Buydrax Plataforma', 'buydrax.local', 'EMPRESA', TRUE
WHERE NOT EXISTS (SELECT 1 FROM empresa WHERE lower(dominio) = 'buydrax.local');

UPDATE usuarios u
SET id_empresa = e.id_empresa
FROM empresa e
WHERE lower(u.correo) = 'plataforma@buydrax.local'
  AND e.dominio = 'buydrax.local';

COMMIT;
