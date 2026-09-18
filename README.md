# Buydrax

Sistema de gestión de recursos humanos y nómina orientado a empresas del sector de la construcción.

Buydrax centraliza la gestión de empleados, asistencia, turnos, asignación de personal a proyectos, novedades, horas extra, préstamos, viáticos, nómina, liquidaciones y procesos relacionados con la administración del talento humano.

El proyecto fue desarrollado como parte de la formación **Tecnólogo en Análisis y Desarrollo de Software — SENA**.

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
- Scripts SQL para creación y configuración de la estructura de datos

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
│   ├── requirements.txt
│   └── .env.example
│
├── docs/                             → Documentación técnica
│
├── BASE_DE_DATOS_BUYDRAX_CORREGIDA.sql
│                                      → Script principal de la BD
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

Buydrax contempla diferentes perfiles de usuario con permisos y funcionalidades específicas:

- **ADMIN_RRHH** — administración de recursos humanos.
- **SUPERVISOR** — gestión y seguimiento del personal y proyectos asignados.
- **CONTADOR** — procesos relacionados con nómina y gestión contable.
- **EMPLEADO** — consulta y gestión de información correspondiente al empleado.

---

## Funcionalidades principales

Entre las funcionalidades implementadas se encuentran:

- Gestión de empleados.
- Gestión de usuarios y perfiles.
- Autenticación mediante usuario y contraseña.
- Autorización basada en roles.
- Generación y validación de tokens JWT.
- Gestión de proyectos.
- Asignación de empleados a proyectos.
- Registro y consulta de asistencia.
- Gestión de turnos.
- Registro de novedades.
- Gestión de horas extra.
- Certificaciones y documentación laboral.
- Evaluaciones de desempeño.
- Préstamos y viáticos.
- Gestión de contratos.
- Procesos de nómina.
- Liquidaciones.
- Desprendibles de nómina.
- Gestión de PILA y aportes.
- Solicitudes y notificaciones.
- Reportes y consultas administrativas.

---

## Configuración de la base de datos

El proyecto utiliza **PostgreSQL**.

El archivo:

```text
BASE_DE_DATOS_BUYDRAX_CORREGIDA.sql
```

contiene la estructura y configuración SQL necesaria para preparar las tablas del sistema.

> El script no crea automáticamente una base de datos ni ejecuta un cambio de conexión. Debe ejecutarse sobre una base de datos PostgreSQL existente.

Para el entorno local de desarrollo utilizado durante la configuración del proyecto se trabajó con:

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
```

Activarlo:

```powershell
.\.venv\Scripts\Activate.ps1
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Crear el archivo `.env`

Copiar:

```text
.env.example
```

como:

```text
.env
```

El archivo debe contener las variables necesarias para la conexión y configuración del backend.

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

> El archivo `.env` contiene configuración local y secretos, por lo que **no debe subirse al repositorio**.

### 5. Ejecutar el backend

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

La API estará disponible en:

```text
http://127.0.0.1:8000
```

Documentación interactiva:

```text
http://127.0.0.1:8000/docs
```

Especificación OpenAPI:

```text
http://127.0.0.1:8000/openapi.json
```

Endpoint de comprobación:

```text
http://127.0.0.1:8000/health
```

---

## Configuración del frontend

### 1. Entrar al frontend

```bash
cd frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar la URL de la API

El proyecto incluye:

```text
.env.example
```

con la configuración correspondiente al backend:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Si se requiere una configuración local diferente, puede crearse un archivo `.env` a partir de esta plantilla.

### 4. Ejecutar el frontend

```bash
npm run dev
```

Vite mostrará en la terminal la dirección local para acceder a la aplicación, normalmente:

```text
http://localhost:5173
```

---

## Usuarios de prueba

Para facilitar las pruebas del sistema se dispone de usuarios configurados mediante el script:

```text
SQL_RESET_PASSWORD_Admin123.sql
```

Usuarios de referencia:

| Usuario | Contraseña | Rol |
|---|---|---|
| claudia.cardenas@construandes.com.co | Admin123! | ADMIN_RRHH |
| ricardo.gil@construandes.com.co | Admin123! | SUPERVISOR |
| martha.gomez@construandes.com.co | Admin123! | EMPLEADO |

> Estas credenciales corresponden al entorno académico/de desarrollo. No deben utilizarse como credenciales reales de producción.

---

## Ejecución completa del proyecto

Para ejecutar Buydrax localmente:

### Terminal 1 — Backend

```bash
cd backend
```

Activar el entorno virtual:

```powershell
.\.venv\Scripts\Activate.ps1
```

Ejecutar:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Finalmente, acceder a la dirección indicada por Vite.

---

## Documentación técnica

La documentación técnica del proyecto se encuentra en:

```text
docs/
```

Incluye documentación relacionada con:

- Casos de uso.
- Diagramas de actividades.
- Diagrama de clases.
- Modelo de dominio.
- Modelo Entidad-Relación.
- Modelo relacional.
- Diccionario de datos.
- Otros documentos utilizados durante el desarrollo.

Los archivos fuente editables, cuando corresponda, se encuentran dentro de:

```text
docs/fuentes/
```

---

## Mockups y prototipos

El diseño inicial de la aplicación fue desarrollado a partir de mockups y prototipos elaborados durante la etapa de diseño del proyecto.

Los archivos originales de los mockups se mantienen en un espacio privado destinado al equipo de desarrollo.

Las interfaces implementadas en React toman como referencia dichos diseños y fueron adaptadas durante el proceso de desarrollo.

---

## Seguridad y configuración

El backend utiliza:

- Hash de contraseñas mediante bcrypt.
- Autenticación mediante JWT.
- Control de acceso basado en roles.
- Variables de entorno para configuración sensible.
- Validación de datos mediante Pydantic.

Los archivos `.env` se encuentran excluidos del control de versiones mediante `.gitignore`.

El repositorio incluye archivos `.env.example` como referencia para la configuración local.

---

## Convención de ramas y commits

La rama principal de desarrollo actual es:

```text
master
```

La rama:

```text
main
```

se conserva por motivos históricos y documentales del proyecto.

Para los commits se utiliza la siguiente convención:

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

Buydrax se encuentra en desarrollo académico y cuenta actualmente con una arquitectura funcional de frontend, backend y base de datos.

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

