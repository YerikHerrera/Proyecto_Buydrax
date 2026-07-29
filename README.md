# Buydrax

Sistema de gestión de recursos humanos y nómina para empresas del sector de la construcción.

Buydrax centraliza el registro de empleados, el control de asistencia y turnos, la asignación de personal a proyectos de obra, el cálculo de nómina y liquidaciones, y la gestión documental de certificaciones, todo en un solo lugar.

---

## Equipo de desarrollo

| Integrante                         | Rol                                 |
|------------------------------------|-------------------------------------|
| Samuel Castro Vanegas              | Líder del Proyecto & Subprogramador |
| Rodney Sebastián Marín Mateus      | Analista                            |
| Yerik Julián Castañeda Herrera     | Programador                         |
| Kevin Johansen Rondón Novoa        | Asegurador de Calidad (QA)          |
| Edwar Julián García Bernate        | Arquitecto                          |
| Hanna Valentina Nausa Rodriguez    | Arquitecta                          |

Proyecto desarrollado como parte de la formación Tecnólogo en Análisis y Desarrollo de Software — SENA.

---

## Stack tecnológico

**Frontend**
- React 19
- TypeScript
- Vite
- React Router DOM
- Bootstrap 5 + Bootstrap Icons

**Backend**
- Python 3 — módulo de programación orientada a objetos (encapsulación, herencia, polimorfismo, abstracción y manejo de excepciones)

**Base de datos**
- MySQL — esquema relacional normalizado en 3FN

> **Nota:** el proyecto se encuentra en fase de desarrollo académico. Actualmente no hay un servidor backend (API) ni una base de datos conectada en tiempo de ejecución — el frontend funciona con datos de ejemplo y el módulo Python es un ejercicio independiente (standalone).

---

## Estructura del repositorio
Proyecto_Buydrax/

├── frontend/        → Aplicación React + TypeScript

├── backend/         → Módulo Python (POO)

├── db/              → Script SQL del esquema de base de datos

├── docs/            → Documentación técnica (diagramas, modelos, diccionario de datos)

└── README.md        → Ubicado en la rama main, describe todo el proyecto

---

## Cómo ejecutar el frontend

```bash
cd frontend
npm install
npm run dev
```

El proyecto corre por defecto en `http://localhost:5173`.

---

## Cómo ejecutar el código Python

El módulo Python demuestra los cuatro pilares de la programación orientada a objetos aplicados a la gestión de empleados de Buydrax (Operario, Supervisor e Ingeniero).

```bash
cd backend/empleados
python main.py
```

Esto ejecuta una simulación de liquidación de empleados, mostrando en consola el cálculo de salario de cada tipo de empleado y el manejo de errores ante datos inválidos (nombre vacío, salario negativo, porcentaje fuera de rango).

---

## Cómo visualizar los mockups y prototipos

El diseño visual de las páginas del frontend se basó en mockups estáticos elaborados previamente en Figma.

Los archivos fuente de estos mockups se encuentran almacenados en una carpeta de Google Drive de acceso privado, exclusiva para los integrantes del equipo, con el fin de proteger la confidencialidad del proyecto.

Los integrantes del equipo pueden acceder a los mockups desde el canal interno del grupo. Las páginas finales implementadas en React conservan la estructura general de estos mockups, con ajustes menores realizados durante el desarrollo.

---

## Documentación técnica

Toda la documentación técnica del proyecto —diagramas de casos de uso, diagramas de actividades, diagrama de clases, modelo de dominio, MER conceptual, modelo relacional y diccionario de datos— se encuentra disponible en la carpeta [`docs/`](./docs) de este repositorio.

Los archivos fuente editables (`.drawio`) están disponibles en [`docs/fuentes/`](./docs/fuentes).

---

## Base de datos

El script SQL con el esquema completo de la base de datos (`buydrax_db`) se encuentra en DBeaver y actualmente no está conectado a la página.

---

## Convención de ramas y commits

Este proyecto sigue un flujo de trabajo basado en ramas por funcionalidad y Pull Requests hacia `master`.

| Prefijo de commit | Uso                                                 |
|-------------------|-----------------------------------------------------|
| `feat:`           | Nueva funcionalidad o página                        |
| `fix:`            | Corrección de errores                               |
| `style:`          | Cambios visuales sin alterar lógica                 |
| `docs:`           | Documentación tecnica                               |

---

## Licencia

Proyecto de uso académico desarrollado en el marco del programa Tecnólogo en Análisis y Desarrollo de Software del SENA.
