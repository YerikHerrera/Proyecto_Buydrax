# Informe — Bloque 1: Autenticación y Usuarios

**Fecha:** 2026-09-03  
**Alcance:** EP-01 a EP-07 según matriz definitiva.

## Qué se implementó

### Infraestructura mínima (necesaria para el bloque)
- Estructura limpia en `07_BACKEND/`
- Configuración por variables de entorno (`.env.example`)
- SQLAlchemy 2 + sesión
- Modelos ORM **fieles** al SQL auditado para: `perfil`, `modulo`, `accion`, `permiso`, `usuarios`, `supervisor`, `contador`, `admin_rrhh`
- Seguridad: bcrypt (compatible con hashes `$2y$` del SQL) + JWT
- Manejo de errores tipado (auth, authz, not found, conflict, validation, invalid state)
- Separación: rutas → servicios → repositorios

### Endpoints

| ID    | Método | Ruta               | Auth | Authz              | Estado |
|-------|--------|--------------------|------|--------------------|--------|
| EP-01 | POST   | /api/v1/auth/login | No   | —                  | OK     |
| EP-02 | POST   | /api/v1/auth/logout| Sí   | Usuario autenticado| OK     |
| EP-03 | POST   | /api/v1/usuarios   | Sí   | Admin_RRHH         | OK     |
| EP-04 | GET    | /api/v1/usuarios   | Sí   | Usuario autorizado | OK     |
| EP-05 | GET    | /api/v1/usuarios/{id}| Sí | Usuario autorizado | OK     |
| EP-06 | PATCH  | /api/v1/usuarios/{id}| Sí | Admin_RRHH         | OK     |
| EP-07 | GET    | /api/v1/roles      | Sí   | Usuario autorizado | OK     |

### Reglas aplicadas
- Identidad del actor derivada del token (no del body).
- Correo único.
- Usuario deshabilitado no puede autenticarse.
- Creación de usuario con rol especializado genera la fila 1:1 correspondiente.
- No se inventaron campos fuera del SQL.
- No hay CRUD libre de permisos (decisión de la matriz).

## Decisiones / supuestos documentados

1. **Logout (EP-02):** con JWT stateless el cierre es del lado del cliente. El endpoint existe y exige token válido; no se implementó lista negra de tokens (no está en fuentes).
2. **Campos de rol especializado en POST /usuarios:** el SQL los exige NOT NULL en `supervisor`/`contador`/`admin_rrhh`. Por tanto, al crear con esos roles se exigen en el body. La matriz solo dice “datos de usuario + rol”; se documenta como extensión necesaria para respetar el SQL.
3. **Cambio de rol en PATCH:** solo actualiza `usuarios.id_perfil`. Crear/eliminar la fila especializada al cambiar de rol no está especificado en las fuentes; queda pendiente.
4. **Contraseñas de semillas:** los hashes del SQL son bcrypt `$2y$`. El backend los verifica normalizando a `$2b$`. La contraseña en claro de las semillas no está en el paquete.

## Pendientes (no inventados)

- Política de invalidación de tokens (si se requiere más que JWT stateless).
- Reglas exactas de transición de rol especializado (crear/borrar filas 1:1).
- Pruebas automatizadas contra PostgreSQL real.
- Endpoints de permisos detallados (explícitamente fuera de la matriz por ahora).

## Cómo probar (manual)

1. Tener la BD `buydrax` con el SQL auditado cargado.
2. Configurar `.env` con `DATABASE_URL` y `SECRET_KEY`.
3. Arrancar: `uvicorn app.main:app --reload`
4. Login → obtener token → usar `Authorization: Bearer …` en el resto.

Para poder hacer login con un usuario de semilla, actualizar su `password_hash` con uno generado por este backend, o crear un usuario nuevo vía EP-03 (requiere un Admin_RRHH ya autenticado — circularidad inicial: usar un hash conocido o un script de seed de un admin de prueba).

## Script sugerido para generar hash de prueba

```python
from app.core.security import hash_password
print(hash_password("Admin123!"))
```

Actualizar en BD:
```sql
UPDATE usuarios SET password_hash = '<hash>' WHERE correo = 'claudia.cardenas@construandes.com.co';
```

## Discrepancias encontradas

Ninguna nueva respecto a la auditoría inicial. Se respetó el SQL y la matriz.
