import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import AgregarEmpleados from "../pages/AgregarEmpleados";  // solo este
import ListaEmpleados from "../pages/ListaEmpleados";

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
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;