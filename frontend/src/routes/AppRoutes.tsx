import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import ForgotPassword from "../pages/forgotPassword";
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
import Reportes from "../pages/Reportes";
import Perfiles from "../pages/Perfiles";
import Nomina from "../pages/Nomina";
import RegistrarEmpleado from "../pages/RegistrarEmpleado";
import BuscarEmpleado from "../pages/BuscarEmpleado";
import Turnos from "../pages/Turnos";

/*Estas son las rutas que se utilizarán en la aplicación, define como se localiza cada elemento*/
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas de autenticación */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />

        {/* Empleados */}
        <Route path="/empleados" element={<ListaEmpleados />} />
        <Route path="/empleados/lista" element={<ListaEmpleados />} />
        <Route path="/empleados/agregar" element={<AgregarEmpleados />} />
        <Route path="/empleados/registrar" element={<RegistrarEmpleado />} />
        <Route path="/empleados/buscar" element={<BuscarEmpleado />} />
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
        <Route path="/asistencia/turno" element={<Turnos />} />
        <Route path="/asistencia/reporte" element={<HorasExtras />} />

        //reportes
        <Route path="/reportes" element={<Reportes />} />

        {/* Nómina */}
        <Route path="/nomina" element={<Nomina />} />

        //perfiles
        <Route path="/perfiles" element={<Perfiles />} /> 
        //supervisores
        <Route path="/proyectos/supervisor" element={<Supervisor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;