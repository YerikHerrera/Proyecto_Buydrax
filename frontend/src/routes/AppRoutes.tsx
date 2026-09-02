import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import AgregarEmpleados from "../pages/AgregarEmpleados";
import CrearProyecto from "../pages/CrearProyecto";
import ListaEmpleados from "../pages/ListaEmpleados";
import AsignacionEmpleado from "../pages/AsignacionEmpleado";
import Supervisor from "../pages/Supervisor";
import Asistencia from "../pages/asistencia";
import HorasExtras from "../pages/HorasExtras";

// NUEVO: página de reportes
import Reportes from "../pages/Reportes";

/* Estas son las rutas que se utilizarán en la aplicación */
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/users" element={<Users />} />

        {/* EMPLEADOS */}
        <Route path="/empleados" element={<ListaEmpleados />} />
        <Route path="/empleados/lista" element={<ListaEmpleados />} />
        <Route
          path="/empleados/agregar"
          element={<AgregarEmpleados />}
        />

        {/* PROYECTOS */}
        <Route path="/proyectos" element={<CrearProyecto />} />
        <Route
          path="/proyectos/asignacion"
          element={<AsignacionEmpleado />}
        />
        <Route
          path="/proyectos/supervisor"
          element={<Supervisor />}
        />

        {/* ASISTENCIA */}
        <Route path="/asistencia" element={<Asistencia />} />
        <Route
          path="/asistencia/reporte"
          element={<HorasExtras />}
        />

        {/* REPORTES */}
        <Route path="/reportes" element={<Reportes />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;