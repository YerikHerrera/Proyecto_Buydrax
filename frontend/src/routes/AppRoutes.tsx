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
import EditarEmpleado from "../pages/EditarEmpleado";
import Turnos from "../pages/Turnos";
import Aprobaciones from "../pages/Aprobaciones";
import ProtectedRoute from "../components/ProtectedRoute";
import ReportePersonal from "../pages/reportes/ReportePersonal";
import ReporteAsistencia from "../pages/reportes/ReporteAsistencia";
import ReporteHorasExtra from "../pages/reportes/ReporteHorasExtra";
import ReporteTurnos from "../pages/reportes/ReporteTurnos";
import ReporteProyectos from "../pages/reportes/ReporteProyectos";
import ReporteGeneral from "../pages/reportes/ReporteGeneral";
import PortalEmpleado from "../pages/PortalEmpleado";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* Empleados */}
        <Route
          path="/empleados"
          element={
            <ProtectedRoute>
              <ListaEmpleados />
            </ProtectedRoute>
          }
        />
        <Route
          path="/empleados/lista"
          element={
            <ProtectedRoute>
              <ListaEmpleados />
            </ProtectedRoute>
          }
        />
        <Route
          path="/empleados/agregar"
          element={
            <ProtectedRoute>
              <AgregarEmpleados />
            </ProtectedRoute>
          }
        />
        <Route
          path="/empleados/editar/:id"
          element={
            <ProtectedRoute>
              <EditarEmpleado />
            </ProtectedRoute>
          }
        />
        <Route
          path="/empleados/registrar"
          element={
            <ProtectedRoute>
              <RegistrarEmpleado />
            </ProtectedRoute>
          }
        />
        <Route
          path="/empleados/buscar"
          element={
            <ProtectedRoute>
              <BuscarEmpleado />
            </ProtectedRoute>
          }
        />
        <Route
          path="/empleados/cargos"
          element={
            <ProtectedRoute>
              <ListaEmpleados />
            </ProtectedRoute>
          }
        />
        <Route
          path="/empleados/documentos"
          element={
            <ProtectedRoute>
              <Certificaciones />
            </ProtectedRoute>
          }
        />

        {/* Proyectos */}
        <Route
          path="/proyectos"
          element={
            <ProtectedRoute>
              <CrearProyecto />
            </ProtectedRoute>
          }
        />
        <Route
          path="/proyectos/asignacion"
          element={
            <ProtectedRoute>
              <AsignacionEmpleado />
            </ProtectedRoute>
          }
        />
        <Route
          path="/proyectos/supervisor"
          element={
            <ProtectedRoute>
              <Supervisor />
            </ProtectedRoute>
          }
        />

        {/* Asistencia — páginas de acción existentes */}
        <Route
          path="/asistencia"
          element={
            <ProtectedRoute>
              <Asistencia />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asistencia/turno"
          element={
            <ProtectedRoute>
              <Turnos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asistencia/reporte"
          element={
            <ProtectedRoute>
              <HorasExtras />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asistencia/validaciones"
          element={
            <ProtectedRoute>
              <Aprobaciones />
            </ProtectedRoute>
          }
        />

        {/* Reportes nuevos (visual / mock) */}
        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              <Reportes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportes/personal"
          element={
            <ProtectedRoute>
              <ReportePersonal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportes/asistencia"
          element={
            <ProtectedRoute>
              <ReporteAsistencia />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportes/horas-extra"
          element={
            <ProtectedRoute>
              <ReporteHorasExtra />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportes/turnos"
          element={
            <ProtectedRoute>
              <ReporteTurnos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportes/proyectos"
          element={
            <ProtectedRoute>
              <ReporteProyectos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportes/general"
          element={
            <ProtectedRoute>
              <ReporteGeneral />
            </ProtectedRoute>
          }
        />

        {/* Nómina */}
        <Route
          path="/nomina"
          element={
            <ProtectedRoute>
              <Nomina />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nomina/generar"
          element={
            <ProtectedRoute>
              <Nomina />
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfiles"
          element={
            <ProtectedRoute>
              <Perfiles />
            </ProtectedRoute>
          }
        />

        {/* Portal empleado */}
        <Route
          path="/portal"
          element={
            <ProtectedRoute>
              <PortalEmpleado />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portal/pagos"
          element={
            <ProtectedRoute>
              <PortalEmpleado seccion="pagos" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portal/prestamos"
          element={
            <ProtectedRoute>
              <PortalEmpleado seccion="prestamos" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portal/solicitudes"
          element={
            <ProtectedRoute>
              <PortalEmpleado seccion="solicitudes" />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
