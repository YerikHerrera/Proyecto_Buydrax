import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  return (
    <aside
      style={{
        backgroundColor: "#F97316",
        width: "220px",
        minHeight: "100vh",
        padding: "20px 0",
      }}
    >
      <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
        <li>
          <SidebarLink to="/dashboard" icon="bi-house-fill" label="Inicio" />
        </li>
        <li>
          <SidebarLink to="/users" icon="bi-people-fill" label="Empleados" />
        </li>
        <li>
          <SidebarLink to="/projects" icon="bi-folder-fill" label="Proyectos" />
        </li>
        <li>
          <SidebarLink to="/support" icon="bi-headset" label="Asistencia" />
        </li>
<<<<<<< HEAD
>>>>>>> 009dea9 (Primer Commit del Proyecto)
=======
>>>>>>> d826519 (Resolver conflicto de merge en los componentes Navbar y Sidebar del layout)
      </ul>
    </aside>
  );
}

function SidebarLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: string;
  label: string;
}) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "25px 35px",
        color: isActive ? "#F97316" : "#fff",
        backgroundColor: isActive ? "#fff" : "transparent",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: "500",
      }}
    >
      <i className={`bi ${icon}`}></i> {label}
    </Link>
  );
}

<<<<<<< HEAD
=======
>>>>>>> 009dea9 (Primer Commit del Proyecto)
=======
>>>>>>> d826519 (Resolver conflicto de merge en los componentes Navbar y Sidebar del layout)
export default Sidebar;