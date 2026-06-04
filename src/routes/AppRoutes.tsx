import { BrowserRouter, Routes, Route } from "react-router-dom";
import AgregarEmpleado from "../pages/empleados";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Empleados from "../pages/AgregarEmpleados";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/empleados/agregar" element={<AgregarEmpleado />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/empleados" element={<Empleados />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;