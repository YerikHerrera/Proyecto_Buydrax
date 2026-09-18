# Buydrax — Sistema de Gestión de Recursos Humanos

Buydrax es un sistema web para la gestión de recursos humanos y operaciones de una empresa del sector construcción.

El proyecto está compuesto por:

- **Frontend:** React + TypeScript + Vite
- **Backend:** FastAPI + SQLAlchemy
- **Base de datos:** PostgreSQL
- **Autenticación:** JWT + bcrypt
- **Documentación de API:** OpenAPI / Swagger

## Contenido del repositorio

```text
Proyecto_Buydrax/
├── BASE_DE_DATOS_BUYDRAX_CORREGIDA.sql
├── SQL_RESET_PASSWORD_Admin123.sql
├── BUYDRAX_USUARIOS_Y_GUIA_INSTALACION.txt
├── README.md
├── backend/
│   ├── app/
│   ├── scripts/
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    └── .env.example
```

## Roles del sistema

Buydrax contempla cuatro perfiles:

| Perfil | Función general |
|---|---|
| `ADMIN_RRHH` | Administración de empleados y procesos de RRHH |
| `SUPERVISOR` | Gestión operativa de proyectos y personal a cargo |
| `CONTADOR` | Procesos relacionados con nómina y contabilidad |
| `EMPLEADO` | Consulta y gestión de información propia |

El sistema utiliza autenticación mediante JWT y las rutas e interfaces disponibles dependen del perfil del usuario autenticado.

---

# Instalación y ejecución

Para reconstruir el proyecto en un equipo nuevo, se recomienda seguir el archivo:

**`BUYDRAX_USUARIOS_Y_GUIA_INSTALACION.txt`**

La instalación se divide en tres partes:

1. PostgreSQL y base de datos
2. Backend FastAPI
3. Frontend React

## Requisitos

- Git
- PostgreSQL 14 o superior
- Python 3.10 o superior
- Node.js 18 o superior
- npm
- DBeaver, pgAdmin o `psql` para ejecutar los scripts SQL

> El proyecto fue probado durante el desarrollo con Python 3.14.3 y Node.js 24.x.

---

# 1. Base de datos

Los archivos SQL incluidos en el repositorio son:

```text
BASE_DE_DATOS_BUYDRAX_CORREGIDA.sql
SQL_RESET_PASSWORD_Admin123.sql
```

El script principal crea las tablas, tipos, relaciones y datos necesarios para ejecutar el sistema.

**El script no crea una base de datos ni cambia de conexión automáticamente.**

Por tanto, primero debes tener una base PostgreSQL disponible y ejecutar ambos scripts sobre la base que utilizarás para Buydrax.

En el entorno de desarrollo actual se utiliza:

```text
Base de datos: postgres
Host: localhost
Puerto: 5432
Usuario: postgres
```

Si utilizas otra base de datos, solamente debes colocarla posteriormente en `DATABASE_URL`.

### Orden de ejecución

Ejecutar:

1. `BASE_DE_DATOS_BUYDRAX_CORREGIDA.sql`
2. `SQL_RESET_PASSWORD_Admin123.sql`

El segundo script establece la contraseña de prueba:

```text
Admin123!
```

para los usuarios existentes.

---

# 2. Backend

Entrar en:

```bash
cd backend
```

Crear el entorno virtual.

### Windows

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### Linux / macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Instalar dependencias:

```bash
pip install -r requirements.txt
```

Crear el archivo `.env` a partir del ejemplo.

### Windows

```powershell
Copy-Item .env.example .env
```

### Linux / macOS

```bash
cp .env.example .env
```

Editar `.env` y configurar los valores correspondientes al equipo.

Ejemplo:

```env
DATABASE_URL=postgresql+psycopg2://postgres:TU_PASSWORD@localhost:5432/postgres
SECRET_KEY=GENERA_UNA_CLAVE_SECRETA_LARGA_Y_ALEATORIA
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480

APP_NAME=Buydrax API
APP_ENV=development
DEBUG=True
API_PREFIX=/api
```

**No subir el archivo `.env` a Git.**

El repositorio contiene únicamente `.env.example`.

### Ejecutar el backend

Desde `backend/`:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

La API estará disponible en:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

Health check:

```text
http://127.0.0.1:8000/health
```

OpenAPI:

```text
http://127.0.0.1:8000/openapi.json
```

---

# 3. Frontend

Abrir una segunda terminal y entrar en:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

El frontend incluye `.env.example` con la configuración de conexión al backend:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Si se necesita un `.env` local, copiar `.env.example`:

### Windows

```powershell
Copy-Item .env.example .env
```

### Linux / macOS

```bash
cp .env.example .env
```

Luego ejecutar:

```bash
npm run dev
```

Vite mostrará en la terminal la dirección local, normalmente:

```text
http://localhost:5173
```

---

# 4. Orden de arranque

Cada vez que se quiera ejecutar Buydrax:

### 1. PostgreSQL

Verificar que el servicio de PostgreSQL esté ejecutándose.

### 2. Backend

Desde `backend/`:

```powershell
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

En Linux/macOS:

```bash
source .venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 3. Frontend

Desde `frontend/`:

```bash
npm run dev
```

### 4. Navegador

Abrir:

```text
http://localhost:5173
```

---

# 5. Usuarios de prueba

Después de ejecutar:

```text
SQL_RESET_PASSWORD_Admin123.sql
```

los usuarios de prueba pueden iniciar sesión con:

| Perfil | Correo | Contraseña |
|---|---|---|
| ADMIN_RRHH | claudia.cardenas@construandes.com.co | Admin123! |
| SUPERVISOR | ricardo.gil@construandes.com.co | Admin123! |
| EMPLEADO | martha.gomez@construandes.com.co | Admin123! |

También existen otros usuarios de prueba incluidos en los datos de la base de datos.

---

# 6. Funcionalidades principales

## Autenticación

- Inicio de sesión mediante API.
- Contraseñas almacenadas mediante bcrypt.
- Generación de tokens JWT.
- Rutas protegidas.
- Control de acceso según perfil.
- Cierre de sesión.
- Redirección cuando el token deja de ser válido.

## Gestión de recursos humanos

- Gestión de empleados.
- Proyectos.
- Asignaciones.
- Contratos.
- Afiliaciones.
- Certificaciones.
- Historial laboral.

## Gestión operativa

- Asistencia.
- Turnos.
- Horas extra.
- Observaciones.
- Evaluaciones de desempeño.

## Nómina

- Nómina.
- Detalles de nómina.
- Desprendibles.
- PILA.
- Préstamos.
- Viáticos.

## Solicitudes y notificaciones

- Solicitudes.
- Notificaciones.
- Procesos de aprobación.

---

# 7. Estructura del backend

```text
backend/
├── app/
│   ├── main.py
│   ├── api/
│   ├── base_datos/
│   ├── modelos/
│   ├── nucleo/
│   ├── esquemas/
│   └── servicios/
├── scripts/
├── requirements.txt
└── .env.example
```

La API está organizada mediante módulos y endpoints de FastAPI.

---

# 8. Estructura del frontend

```text
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── proyectos/
│   │   ├── empleados/
│   │   ├── aprobaciones/
│   │   ├── operaciones/
│   │   ├── nomina/
│   │   ├── reportes/
│   │   ├── dashboard/
│   │   └── supervisor/
│   ├── pages/
│   ├── services/
│   ├── config/
│   └── ...
├── package.json
└── .env.example
```

---

# 9. Git y ramas

La rama principal actual del proyecto es:

```text
master
```

La rama `main` se conserva como parte del historial anterior del proyecto.

Para obtener el proyecto:

```bash
git clone https://github.com/YerikHerrera/Proyecto_Buydrax.git
cd Proyecto_Buydrax
```

Después se puede comprobar la rama actual con:

```bash
git branch
```

---

# 10. Solución de problemas

## El backend no conecta a PostgreSQL

Verificar:

- PostgreSQL está ejecutándose.
- El usuario y contraseña son correctos.
- El puerto es correcto.
- `DATABASE_URL` apunta a la base correcta.
- La base contiene las tablas de Buydrax.

## El login devuelve credenciales incorrectas

Verificar que se haya ejecutado:

```text
SQL_RESET_PASSWORD_Admin123.sql
```

La contraseña de prueba es:

```text
Admin123!
```

## El frontend no conecta con el backend

Verificar que el backend esté ejecutándose en:

```text
http://127.0.0.1:8000
```

y que:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

No utilizar `/api/v1`, ya que el prefijo actual de la API es `/api`.

## Puerto 8000 ocupado

Ejecutar el backend en otro puerto:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

En ese caso también debe actualizarse `VITE_API_BASE_URL`.

## Puerto 5173 ocupado

Vite puede ejecutarse en otro puerto:

```bash
npm run dev -- --port 5174
```

## bcrypt / passlib presentan errores

El proyecto utiliza las versiones especificadas en `backend/requirements.txt`. Instalar siempre las dependencias mediante:

```bash
pip install -r requirements.txt
```

Si es necesario, actualizar `pip` dentro del entorno virtual:

```bash
python -m pip install --upgrade pip
```

---

# Estado del proyecto

Buydrax cuenta actualmente con:

- Frontend React + TypeScript.
- Backend FastAPI.
- PostgreSQL.
- Autenticación JWT.
- Control de acceso por roles.
- Datos y usuarios de prueba.
- Documentación Swagger/OpenAPI.
- Scripts SQL para reconstruir la base de datos.
- `.env.example` para configurar cada entorno.

Para la instalación completa y detallada, consultar:

```text
BUYDRAX_USUARIOS_Y_GUIA_INSTALACION.txt
```
