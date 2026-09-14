# Buydrax Frontend ↔ Backend reorganizado

## Requisitos
1. Backend corriendo en http://127.0.0.1:8000
2. Node.js 18+
3. PostgreSQL con la base `buydrax` y el SQL auditado cargado

## Arranque
```bash
cd frontend
npm install
npm run dev
```

Opcional — archivo `.env`:
```
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## Cambio importante respecto a la versión anterior
El backend ya **no** usa el prefijo `/api/v1`.  
La base URL correcta es:

```
http://127.0.0.1:8000/api
```

## Pantallas ya conectadas a la API
| Pantalla | Endpoints |
|----------|-----------|
| Login | `POST /auth/login` |
| Dashboard | `GET /dashboard` |
| Lista / gestión empleados | `GET/POST/PATCH /empleados`, afiliación |
| Crear proyecto | `GET/POST /proyectos`, `GET /supervisores` |
| Asignaciones | `GET/POST /proyectos/{id}/asignaciones`, `GET/PATCH /asignaciones-proyecto` |
| Usuarios | `GET/POST /usuarios` |

## Token
Tras el login se guarda `access_token` en `localStorage` y se envía en `Authorization: Bearer …`.

## Otras pantallas
Asistencia, turnos, nómina, reportes, certificaciones, etc. pueden seguir usando mocks locales (`src/data/`) hasta que se conecten a sus endpoints del backend.
