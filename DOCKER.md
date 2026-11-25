# Buydrax — Ejecución con Docker

## Requisitos
- Docker Desktop (o Docker Engine + Compose v2)

## Arranque

```bash
# Desde la raíz de este proyecto
docker compose up --build
```

- Frontend: http://localhost:5173  
- API / Swagger: http://localhost:8000/docs  
- Postgres: localhost:5433 (user/pass/db: buydrax)

## Primera vez: cargar la base de datos

Con el contenedor `buydrax-db` corriendo:

```bash
# Script principal (elige uno)
docker exec -i buydrax-db psql -U buydrax -d buydrax < BASE_DE_DATOS_BUYDRAX_FINAL.sql

# Multi-tenant / rol EMPRESA / dominios
docker exec -i buydrax-db psql -U buydrax -d buydrax < backend/scripts/sql/2026_rol_empresa_dominios.sql
docker exec -i buydrax-db psql -U buydrax -d buydrax < backend/scripts/sql/2026_multitenant_dominio_soft_delete.sql

# Opcional: cuadrillas, etc.
docker exec -i buydrax-db psql -U buydrax -d buydrax < backend/scripts/sql/2026_cuadrillas_entidad.sql
```

## Usuario de prueba EMPRESA
Tras los scripts multi-tenant suele existir:
- correo: `plataforma@buydrax.local`
- clave: la misma del reset Admin123 (ver SQL_RESET_PASSWORD_Admin123.sql)

## Variables (.env en la raíz)
Ya viene configurado para Docker. No subas secretos reales a Git.
