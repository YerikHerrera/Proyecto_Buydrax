import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import AgregarEmpleados from "../pages/AgregarEmpleados";  // solo este
import CrearProyecto from "../pages/CrearProyecto";
import ListaEmpleados from "../pages/ListaEmpleados";
import AsignacionEmpleado from "../pages/AsignacionEmpleado";
import Supervisor from "../pages/Supervisor";

<><Route path="/proyectos" element={<CrearProyecto />} /><Route path="/proyectos/asignacion" element={<AsignacionEmpleado />} /><Route path="/proyectos/supervisor" element={<Supervisor />} /></>
 
/*Estas son las rutas que se utilizarán en la aplicación, define como se localiza cada elemento*/ 
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/empleados" element={<ListaEmpleados />} />
        <Route path="/empleados/lista" element={<ListaEmpleados />} />
        <Route path="/empleados/agregar" element={<AgregarEmpleados />} />  {/* ← formulario real */}
        <Route path="/proyectos" element={<CrearProyecto />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;