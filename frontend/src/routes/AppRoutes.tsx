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

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Rutas protegidas: requieren token JWT */}
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

        {/* Asistencia */}
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

        {/* Reportes / Nómina / Perfiles */}
        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              <Reportes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nomina"
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
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
