# Mejoras visuales finales — guía de commits y fusión

**Base de este paquete:** código de Samuel (`Proyecto_Buydrax_Nuevo`) + las 8 mejoras visuales aplicadas encima.

**Su repo (Kevin / Julián):** `buydrax_completo` ya en GitHub.  
Deben **fusionar** este frontend (y lo que falte del backend de Samuel) sobre su `master`/`feature` actual.

---

## Cómo unir Samuel + lo de ustedes

```powershell
cd ruta\del\repo   # el que ya subieron a GitHub

git checkout master
git pull origin master
git checkout -b feature/mejoras-visuales-finales

# Opción A (recomendada): copiar solo frontend/src (y assets) de este zip
# Opción B: diff manual archivo por archivo si hay conflictos
```

Si el zip de Samuel trae cosas que ustedes no tienen (cuadrillas, etc.), copien también esas rutas del backend.

**No** sobrescriban `.env`.

---

## Commits sugeridos (uno por punto)

Hagan **un commit por mejora** para el historial limpio:

### 1. Adjuntar archivo en estado Excusa
```text
feat(asistencia): adjuntar soporte cuando el estado es Excusa
```
Archivos:
- `frontend/src/components/operaciones/AsistenciaForm.tsx`
- `frontend/src/pages/asistencia.tsx`

Cómo verlo: Registrar asistencia → Tipo “Excusa” → aparece input de archivo → guardar → toast de éxito; la observación queda `EXCUSA | archivo: nombre.pdf`.

### 2. Flechita en listas desplegables
```text
style(ui): chevron en selects nativos
```
Archivos:
- `frontend/src/styles/globals.css` (bloque `select.agregar-input` + `appearance`)

Cómo verlo: cualquier `<select>` del sistema muestra flecha a la derecha.

### 3. Dropdown ciudad / barrio / salario (perfil laboral)
```text
feat(empleados): listas desplegables de ciudad, barrio y salario
```
Archivos:
- `frontend/src/data/ubicacionesColombia.ts` (**nuevo**)
- `frontend/src/components/empleados/EmpleadoForm.tsx`
- `frontend/src/components/empleados/EmpleadoEditForm.tsx`

Cómo verlo: Registrar / Editar empleado → sección dirección y salario con selects + campo “Otro”.

### 4. Validaciones como ventana emergente (toast)
```text
feat(ui): mensajes de validación con Toast emergente
```
Archivos:
- `frontend/src/pages/asistencia.tsx`
- `frontend/src/pages/ListaProyectos.tsx`
- (ya existían) `frontend/src/components/ui/Toast.tsx`, `frontend/src/hooks/useToast.ts`

Cómo verlo: forzar error en asistencia (sin empleado) → toast rojo centrado arriba; éxito → toast verde.

### 5. Listado de proyectos solo vinculados (supervisor)
```text
fix(proyectos): supervisor solo ve proyectos vinculados
```
Archivos:
- `frontend/src/pages/ListaProyectos.tsx`
- `frontend/src/components/proyectos/ProyectoTable.tsx` (`onEditar` opcional)
- usa `RoleGate require="aprobar"`

Cómo verlo: login como SUPERVISOR → `/proyectos` → solo proyectos de su `id_supervisor`; sin botón crear/editar. Admin sigue viendo todos.

### 6. Colores más llamativos en interfaces
```text
style(ui): acentos naranja y botones con gradiente
```
Archivos:
- `frontend/src/styles/globals.css` (`.page-card` borde superior, `.agregar-btn-primario` gradiente)

Cómo verlo: cualquier página con `page-card` tiene franja naranja; botones primarios más vivos.

### 7. Logo del login en blanco
```text
style(login): logo con letras blancas sobre fondo oscuro
```
Archivos:
- `frontend/src/pages/Login.tsx` (`className="login-logo-white"`)
- `frontend/src/styles/globals.css` (`.login-logo-white`)

Cómo verlo: pantalla de login → logo legible en blanco.

### 8. Sidebar móvil: botón de 3 rayas en el navbar
```text
fix(layout): menú hamburguesa en navbar (móvil)
```
Archivos:
- `frontend/src/components/layout/SidebarContext.tsx` (**nuevo**)
- `frontend/src/components/layout/AppShell.tsx`
- `frontend/src/components/layout/Sidebar.tsx` (sin botón flotante)
- `frontend/src/components/layout/Navbar.tsx` (botón `app-navbar__menu-btn`)
- `frontend/src/styles/globals.css`

Cómo verlo: DevTools → modo móvil (&lt;768px) → el ícono de 3 rayas está **junto al logo en el navbar**, no abajo a la derecha. Abre el drawer naranja.

---

## Orden práctico de commits

```powershell
# tras copiar los archivos del zip al repo:

git add frontend/src/components/layout/SidebarContext.tsx frontend/src/components/layout/AppShell.tsx frontend/src/components/layout/Sidebar.tsx frontend/src/components/layout/Navbar.tsx frontend/src/styles/globals.css
git commit -m "fix(layout): menú hamburguesa en navbar (móvil)"

git add frontend/src/pages/Login.tsx frontend/src/styles/globals.css
git commit -m "style(login): logo con letras blancas sobre fondo oscuro"

git add frontend/src/styles/globals.css
git commit -m "style(ui): chevron en selects y acentos de color"

git add frontend/src/data/ubicacionesColombia.ts frontend/src/components/empleados/EmpleadoForm.tsx frontend/src/components/empleados/EmpleadoEditForm.tsx
git commit -m "feat(empleados): listas desplegables de ciudad, barrio y salario"

git add frontend/src/components/operaciones/AsistenciaForm.tsx frontend/src/pages/asistencia.tsx
git commit -m "feat(asistencia): adjuntar soporte en Excusa y toasts de validación"

git add frontend/src/pages/ListaProyectos.tsx frontend/src/components/proyectos/ProyectoTable.tsx
git commit -m "fix(proyectos): supervisor solo ve proyectos vinculados"

git push -u origin feature/mejoras-visuales-finales
```

(Pueden agrupar 2+3 de estilos en un solo commit si prefieren menos pasos.)

---

## Cómo probar en local

```powershell
cd frontend
npm install
npm run dev
```

Backend igual que siempre (`uvicorn`). Hard refresh (`Ctrl+F5`) tras copiar archivos.

---

## Nota sobre el error de `<Route` duplicado

En **esta** base (`Proyecto_Buydrax_Nuevo` / Samuel) la ruta `/empresas` está bien formada:

```tsx
<Route
  path="/empresas"
  element={
    <ProtectedRoute>
      <EmpresasDominios />
    </ProtectedRoute>
  }
/>
```

Si en su copia de GitHub quedó un `<Route` cortado o duplicado, reemplacen el bloque completo de `AppRoutes.tsx` por el de este zip o revisen que cada `Route` tenga `path` y `element` cerrados.
