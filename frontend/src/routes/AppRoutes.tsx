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
import Certificaciones from "../pages/Certificaciones";

/*Estas son las rutas que se utilizarán en la aplicación, define como se localiza cada elemento*/
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />

        {/* Empleados */}
        <Route path="/empleados" element={<ListaEmpleados />} />
        <Route path="/empleados/lista" element={<ListaEmpleados />} />
        <Route path="/empleados/agregar" element={<AgregarEmpleados />} />
        {/* TODO: reemplazar por el componente real de Perfiles cuando exista */}
        <Route path="/empleados/cargos" element={<ListaEmpleados />} />
        <Route path="/empleados/documentos" element={<Certificaciones />} />

        {/* Proyectos */}
        <Route path="/proyectos" element={<CrearProyecto />} />
        <Route path="/proyectos/asignacion" element={<AsignacionEmpleado />} />
        <Route path="/proyectos/supervisor" element={<Supervisor />} />

        {/* Asistencia */}
        <Route path="/asistencia" element={<Asistencia />} />
        {/* TODO: reemplazar por el componente real de Turnos cuando exista */}
        <Route path="/asistencia/turno" element={<Asistencia />} />
        <Route path="/asistencia/reporte" element={<HorasExtras />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;