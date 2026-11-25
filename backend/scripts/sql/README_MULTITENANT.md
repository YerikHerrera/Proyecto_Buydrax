# Multi-tenant por dominio + soft delete

Ejecuta en PostgreSQL:

```bash
psql -U <user> -d <db> -f backend/scripts/sql/2026_multitenant_dominio_soft_delete.sql
```

Cambios:
- usuarios.password_hash → usuarios.password_encriptado
- usuarios.dominio, usuarios.eliminado_en
- empleado.eliminado_en
- proyecto.dominio, proyecto.eliminado_en
- tabla recuperacion_password

SMTP opcional (settings/env):
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM

Sin SMTP, correos de recuperación en backend/logs/correos_enviados.log
