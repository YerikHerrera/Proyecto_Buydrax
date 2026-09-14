# Buydrax API — Backend reorganizado

API FastAPI sobre PostgreSQL, fiel al **SQL auditado** y a la matriz **EP-01 … EP-102**.

## Estructura

```
app/
├── nucleo/              configuracion, seguridad, dependencias, excepciones
├── base_datos/          base_orm, sesion
├── modelos/
│   ├── usuario, perfil_y_permisos, roles_especiales
│   └── negocio/         9 archivos + enums.py
├── esquemas/
│   ├── comunes, autenticacion, usuario
│   └── negocio/         9 archivos
├── repositorios/        10 repositorios
├── servicios/           1 servicio por dominio (lógica de negocio)
└── api/
    ├── enrutador.py
    └── endpoints/       carpetas por dominio, endpoints delgados
```

## Flujo de capas

```
Request → Endpoint (HTTP) → Servicio (reglas) → Repositorio (SQLAlchemy) → DB
```

## Ejecución

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # editar DATABASE_URL y SECRET_KEY
uvicorn app.main:app --reload --port 8000
```

- Swagger: http://127.0.0.1:8000/docs  
- Prefijo API: **`/api`** (ya no `/api/v1`)  
- Frontend: `VITE_API_BASE_URL=http://127.0.0.1:8000/api`

## Estado del refactor

- ✅ Nombres descriptivos en español
- ✅ Sin carpeta `v1`
- ✅ Endpoints separados por dominio
- ✅ Modelos y esquemas de negocio divididos
- ✅ **Toda la lógica de negocio en servicios + repositorios**
- ✅ Endpoints delgados (solo HTTP)
