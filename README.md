# Buydrax — Proyecto completo (Frontend + Backend + SQL)

## Contenido

```
buydrax_completo/
├── BASE_DE_DATOS_BUYDRAX_CORREGIDA.sql   # Esquema + semillas
├── SQL_RESET_PASSWORD_Admin123.sql       # Pone Admin123! a todos los usuarios
├── backend/                              # API FastAPI
└── frontend/                             # React + Vite (auth, listas, selects)
```

## 1. Base de datos

```sql
CREATE DATABASE buydrax;
```

Conéctate a `buydrax` y ejecuta **en orden**:

1. `BASE_DE_DATOS_BUYDRAX_CORREGIDA.sql`
2. `SQL_RESET_PASSWORD_Admin123.sql`  ← contraseña de prueba: **Admin123!**

## 2. Backend

```bash
cd backend
python -m venv .venv

# Windows:
.\.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env   # Windows: copy .env.example .env
```

Edita `.env`:

```env
DATABASE_URL=postgresql+psycopg2://USUARIO:PASSWORD@localhost:5432/buydrax
SECRET_KEY=cambia-esta-clave-por-una-larga
```

Arranca:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- Docs: http://127.0.0.1:8000/docs  
- Health: http://127.0.0.1:8000/health  

### Alternativa para resetear contraseñas desde Python

```bash
python scripts/set_passwords.py --password Admin123! --apply
```

## 3. Frontend

```bash
cd frontend
npm install
# opcional:
echo "VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1" > .env
npm run dev
```

Abre http://localhost:5173

## 4. Login de prueba (después del SQL de reset)

| Correo | Rol | Contraseña |
|--------|-----|------------|
| claudia.cardenas@construandes.com.co | ADMIN_RRHH | Admin123! |
| laura.munoz@construandes.com.co | ADMIN_RRHH | Admin123! |
| ricardo.gil@construandes.com.co | SUPERVISOR | Admin123! |

## Correcciones incluidas en este paquete

### Autenticación
- Rutas protegidas (`ProtectedRoute`) — sin token redirige al login
- Navbar usa el usuario real del login (ya no mocks)
- Logout limpia token + usuario
- apiClient redirige en 401 y muestra error si el backend no está
- Login mapea `rol` desde `usuario.rol` o `usuario.perfil.nombre`

### Validaciones / datos
- Listas y asignación usan API (empleados/proyectos reales)
- Selects de cargos, EPS, ARL, fondos, cajas, bancos alineados a la BD
- Contraseña de semillas conocida (`Admin123!`) vía script SQL

### Sidebar
- Drawer responsive en móvil (no se rompe el layout)

## Orden al arrancar

1. PostgreSQL  
2. Backend (`uvicorn ... --port 8000`)  
3. Frontend (`npm run dev`)  
4. Navegador → login con **Admin123!**  
