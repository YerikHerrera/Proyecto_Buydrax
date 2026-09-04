# Buydrax Frontend conectado al Backend

## Requisitos
1. Backend corriendo en http://127.0.0.1:8000
2. Node.js 18+

## Arranque
```bash
cd Buydrax_Frontend_Conectado
npm install
npm run dev
```

Opcional: crear `.env` con:
```
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## Pantallas ya conectadas
- Login → POST /auth/login
- Dashboard → GET /dashboard
- Lista empleados → GET /empleados
- Agregar empleado → POST /empleados + PUT afiliación
- Crear proyecto → GET/POST /proyectos + GET /supervisores

## Token
Tras el login se guarda `access_token` en localStorage y se envía en todas las peticiones.
