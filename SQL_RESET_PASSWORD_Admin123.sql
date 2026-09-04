-- ============================================================
-- BUYDRAX: reset de contraseñas de prueba
-- Contraseña para TODOS los usuarios: Admin123!
-- Hash bcrypt generado de forma compatible con passlib/backend.
-- Ejecutar conectado a la base buydrax DESPUÉS del script principal.
-- ============================================================

BEGIN;

UPDATE usuarios
SET password_hash = '$2b$12$5NznOrcY.m6alT1MgfJpG.fU.SBPsaKMJDCt2BpUFwc8rOx0XRpNq';

-- Verificación rápida de perfiles (ADMIN_RRHH = 1, SUPERVISOR = 2, CONTADOR = 3, EMPLEADO = 4)
SELECT id_usuario, correo, id_perfil, estado
FROM usuarios
ORDER BY id_usuario
LIMIT 15;

COMMIT;
