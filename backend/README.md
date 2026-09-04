# Buydrax API — Backend completo

API FastAPI sobre PostgreSQL, fiel al **SQL auditado**, la **matriz definitiva (EP-01…EP-102)** y las **decisiones cerradas**.

## Requisitos

- Python 3.11+
- PostgreSQL con la base `buydrax` y el script SQL auditado cargado

## Instalación

```bash
cd 07_BACKEND
python -m venv .venv

# Windows:
.\.venv\Scripts\activate

# Linux/Mac:
source .venv/bin/activate

pip install -r requirements.txt
copy .env.example .env   # Windows
# cp .env.example .env   # Linux/Mac
```

Edita `.env`:

```env
DATABASE_URL=postgresql+psycopg2://usuario:password@localhost:5432/buydrax
SECRET_KEY=una-clave-larga-y-secreta
```

## Ejecución

```bash
uvicorn app.main:app --reload --port 8000
```

- Swagger: http://127.0.0.1:8000/docs
- Health: http://127.0.0.1:8000/health

## Endpoints (matriz)

| Rango | Dominio |
|-------|---------|
| EP-01…07 | Auth / Usuarios / Roles |
| EP-08 | Dashboard |
| EP-09…14 | Empleados |
| EP-15…16 | Afiliación |
| EP-17 | Historial laboral |
| EP-18…21 | Certificaciones |
| EP-22…25 | Supervisores |
| EP-26…28 | Asistencia |
| EP-29…33 | Turnos |
| EP-34…37 | Novedades |
| EP-38…41 | Horas extra |
| EP-42…46 | Proyectos |
| EP-47…51 | Asignaciones |
| EP-52…55 | Contratos |
| EP-56…59 | Préstamos |
| EP-60…63 | Viáticos |
| EP-64…67 | Liquidaciones |
| EP-68…77 | Nómina / Desprendibles |
| EP-78…81 | PILA |
| EP-82…86 | Configuración |
| EP-87…94 | Evaluaciones / Observaciones |
| EP-95…99 | Solicitudes |
| EP-100…102 | Notificaciones |

Prefijo: `/api/v1`

## Bloqueos (no se inventan fórmulas)

- `POST /api/v1/nominas/{id}/calcular` → fórmulas de nómina **pendientes** en fuentes
- `POST /api/v1/nominas/{id}/pila` → formato/reglas PILA **pendientes**
- Desprendibles: generación **interna** (no hay POST libre de generación)

## Login de prueba

Los hashes del SQL de semillas son bcrypt. Actualiza uno:

```python
from app.core.security import hash_password
print(hash_password("Admin123!"))
```

```sql
UPDATE usuarios SET password_hash = '<hash>' WHERE id_usuario = 1;
```

## Estructura

```
app/
  core/          config, security, dependencies, exceptions
  db/            session SQLAlchemy
  models/        todas las tablas del SQL auditado
  schemas/       validación request/response
  repositories/  acceso a datos (usuarios)
  services/      casos de uso auth/usuarios
  api/v1/endpoints/  auth, usuarios, roles, domain (resto EP)
```
