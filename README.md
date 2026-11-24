# Buydrax

Sistema de gestión de recursos humanos y nómina orientado a empresas del sector de la construcción.

Buydrax centraliza la gestión de empleados, asistencia, turnos, asignación de personal a proyectos, novedades, horas extra, préstamos, viáticos, nómina, liquidaciones y procesos relacionados con la administración del talento humano.

El proyecto fue desarrollado como parte de la formación **Tecnólogo en Análisis y Desarrollo de Software — SENA**.

A partir de 2026 el sistema evolucionó a una arquitectura **SaaS Multi-Tenant** con soporte de dominios, soft delete, recuperación de contraseña, autenticación Google y cuadrillas como entidad independiente multi-proyecto.

---

## Equipo de desarrollo

| Integrante | Rol |
|---|---|
| Samuel Castro Vanegas | Líder del Proyecto & Subprogramador |
| Rodney Sebastián Marín Mateus | Analista |
| Yerik Julián Castañeda Herrera | Programador |
| Kevin Johansen Rondón Novoa | Asegurador de Calidad (QA) |
| Edwar Julián García Bernate | Arquitecto |
| Hanna Valentina Nausa Rodriguez | Arquitecta |

---

## Stack tecnológico

### Frontend
- React 19
- TypeScript
- Vite
- React Router DOM
- Bootstrap 5
- Bootstrap Icons
- jsPDF

### Backend
- Python 3
- FastAPI
- SQLAlchemy
- Pydantic
- Pydantic Settings
- Uvicorn
- JWT
- Passlib + bcrypt
- PostgreSQL mediante `psycopg2`

### Base de datos
- PostgreSQL
- Modelo relacional
- SQLAlchemy como ORM
- Scripts SQL para creación, migraciones y configuración de la estructura de datos

---

## Arquitectura general

```text
Proyecto_Buydrax/
│
├── frontend/                         → Aplicación web React + TypeScript
│   ├── src/
│   │   ├── components/              → Componentes reutilizables
│   │   ├── pages/                   → Páginas y vistas
│   │   ├── services/                → Comunicación con la API
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── .env.example
│
├── backend/                          → API REST desarrollada con FastAPI
│   ├── app/
│   │   ├── base_datos/              → Conexión y sesiones de BD
│   │   ├── modelos/                 → Modelos de datos
│   │   ├── esquemas/                → Esquemas de validación
│   │   ├── servicios/               → Lógica de negocio
│   │   ├── nucleo/                  → Configuración y seguridad
│   │   └── ...
│   ├── scripts/
│   │   └── sql/                     → Scripts de migración
│   ├── requirements.txt
│   └── .env.example
│
├── docs/                             → Documentación técnica
│
├── BASE_DE_DATOS_BUYDRAX_CORREGIDA.sql
│                                      → Script principal de la BD (versión base)
│
├── BASE_DE_DATOS_BUYDRAX_V2.sql       → Script unificado (base + migraciones + correcciones)
│
├── SQL_RESET_PASSWORD_Admin123.sql
│                                      → Script de configuración de usuarios
│
├── BUYDRAX_USUARIOS_Y_GUIA_INSTALACION.txt
│                                      → Guía de instalación y usuarios
│
└── README.md
```

---

## Roles del sistema

Buydrax contempla cinco perfiles de usuario:

| Perfil | Función general |
|---|---|
| `EMPRESA` | Administrador de plataforma (multi-tenant). Crea dominios, registra empresas y asigna el ADMIN_RRHH de cada tenant. |
| `ADMIN_RRHH` | Administración de empleados, usuarios y procesos de RRHH **solo de su propio dominio**. |
| `SUPERVISOR` | Gestión operativa de proyectos, cuadrillas y personal a cargo. |
| `CONTADOR` | Procesos relacionados con nómina y contabilidad. |
| `EMPLEADO` | Consulta y gestión de información propia. |

El sistema utiliza autenticación mediante JWT (y opcionalmente Google) y las rutas e interfaces disponibles dependen del perfil del usuario autenticado.

---

## Funcionalidades principales

Entre las funcionalidades implementadas se encuentran:

- Gestión de empleados y usuarios con aislamiento por dominio (multi-tenant).
- Soft delete (borrado lógico) de usuarios, empleados y proyectos.
- Recuperación de contraseña por token (SMTP o log local).
- Autenticación con Google (opcional, requiere `GOOGLE_CLIENT_ID`).
- Gestión de proyectos y asignación de personal.
- **Cuadrillas como entidad independiente** (una cuadrilla puede estar en varios proyectos).
- Registro de asistencia vinculada a proyecto + cálculo automático de PRESENTE / RETARDO.
- Gestión de turnos, novedades y horas extra.
- Certificaciones, historial laboral y evaluaciones de desempeño.
- Préstamos, viáticos, contratos y afiliaciones.
- Procesos de nómina, liquidaciones, desprendibles y PILA.
- Solicitudes, notificaciones y reportes administrativos.
- Gestión de dominios / empresas (solo rol EMPRESA).

---

## Configuración de la base de datos

El proyecto utiliza **PostgreSQL**.

### Scripts disponibles

| Archivo | Descripción |
|---|---|
| `BASE_DE_DATOS_BUYDRAX_CORREGIDA.sql` | Script base (tablas, ENUMs, datos de prueba) |
| `2026_rol_empresa_dominios.sql` | Rol EMPRESA + tabla `empresa` + `usuarios.id_empresa` |
| `2026_multitenant_dominio_soft_delete.sql` | Columnas `dominio` / `eliminado_en` + tabla `recuperacion_password` |
| `2026_asistencia_id_proyecto.sql` | Columna `asistencia.id_proyecto` |
| `2026_cuadrillas_entidad.sql` | Tablas `cuadrilla` y `cuadrilla_proyecto` |
| `2026_fix_cuadrilla_creado_en.sql` | Parche DEFAULT NOW() en `cuadrilla.creado_en` (redundante si se usa el script unificado) |
| `BASE_DE_DATOS_BUYDRAX_V2.sql` | **Script unificado recomendado** (base + migraciones + correcciones de aislamiento) |
| `SQL_RESET_PASSWORD_Admin123.sql` | Establece contraseña de prueba `Admin123!` |

> Los scripts no crean automáticamente una base de datos. Deben ejecutarse sobre una base PostgreSQL existente.

### Orden recomendado de ejecución (desde cero)

1. `BASE_DE_DATOS_BUYDRAX_CORREGIDA.sql` (o directamente el V2)
2. `2026_rol_empresa_dominios.sql`
3. `2026_multitenant_dominio_soft_delete.sql`
4. `2026_asistencia_id_proyecto.sql`
5. `2026_cuadrillas_entidad.sql`
6. `2026_fix_cuadrilla_creado_en.sql` (opcional)
7. `SQL_RESET_PASSWORD_Admin123.sql`

**Recomendado:** usar el script unificado `BASE_DE_DATOS_BUYDRAX_V2.sql` que ya integra todo lo anterior más las correcciones de aislamiento multi-tenant en cuadrillas.

Para el entorno local de desarrollo se trabajó con:

```text
Host: localhost
Puerto: 5432
Base de datos: postgres
Usuario: postgres
```

La conexión utilizada por el backend se configura mediante la variable `DATABASE_URL`.

---

## Configuración del backend

### 1. Entrar al backend

```bash
cd backend
```

### 2. Crear un entorno virtual

En Windows:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

En Linux / macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Crear el archivo `.env`

Copiar `.env.example` a `.env` y configurar:

```env
DATABASE_URL=postgresql+psycopg2://postgres:TU_PASSWORD@localhost:5432/postgres
SECRET_KEY=GENERA_UNA_CLAVE_SECRETA_LARGA_Y_ALEATORIA
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480

APP_NAME=Buydrax API
APP_ENV=development
DEBUG=True
API_PREFIX=/api

# Autenticación Google (opcional)
GOOGLE_CLIENT_ID=

# SMTP para recuperación de contraseña (opcional)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
```

> Sin SMTP configurado, los correos de recuperación se escriben en `backend/logs/correos_enviados.log`.

El archivo `.env` **no debe subirse al repositorio**.

### 5. Ejecutar el backend

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- API: http://127.0.0.1:8000
- Swagger: http://127.0.0.1:8000/docs
- Health: http://127.0.0.1:8000/health

---

## Configuración del frontend

```bash
cd frontend
npm install
```

Configurar `.env` (a partir de `.env.example`):

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_GOOGLE_CLIENT_ID=          # mismo valor que GOOGLE_CLIENT_ID del backend (opcional)
```

Ejecutar:

```bash
npm run dev
```

Normalmente disponible en http://localhost:5173

---

## Usuarios de prueba

Después de ejecutar el script de reset de contraseñas:

| Usuario | Contraseña | Rol |
|---|---|---|
| plataforma@buydrax.local | Admin123! | EMPRESA |
| claudia.cardenas@construandes.com.co | Admin123! | ADMIN_RRHH |
| ricardo.gil@construandes.com.co | Admin123! | SUPERVISOR |
| martha.gomez@construandes.com.co | Admin123! | EMPLEADO |

> Estas credenciales son solo para el entorno académico/de desarrollo.

---

## Ejecución completa del proyecto

**Terminal 1 — Backend**

```bash
cd backend
source .venv/bin/activate   # o .\.venv\Scripts\Activate.ps1 en Windows
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Terminal 2 — Frontend**

```bash
cd frontend
npm run dev
```

Abrir http://localhost:5173

---

## Convención de ramas y commits

La rama principal de desarrollo actual es:

```text
master
```

La rama `main` se conserva por motivos históricos.

| Prefijo | Uso |
|---|---|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de errores |
| `style:` | Cambios visuales o de formato |
| `docs:` | Cambios en documentación |
| `refactor:` | Reestructuración o mejora interna del código |
| `chore:` | Tareas de mantenimiento o configuración |

---

## Estado del proyecto

Buydrax se encuentra en desarrollo académico y cuenta actualmente con una arquitectura funcional de frontend, backend y base de datos multi-tenant.

El frontend se comunica con una API desarrollada en FastAPI y el backend utiliza PostgreSQL para la persistencia de datos.

El proyecto continúa evolucionando y podrá incorporar posteriormente mejoras relacionadas con:

- Contenerización mediante Docker.
- Pruebas automatizadas.
- Mejoras de calidad y mantenimiento del código.
- Optimización del despliegue.
- Nuevas funcionalidades del sistema.

---

## Licencia

Proyecto de uso académico desarrollado en el marco del programa **Tecnólogo en Análisis y Desarrollo de Software del SENA**.
