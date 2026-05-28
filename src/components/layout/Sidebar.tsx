<<<<<<< HEAD
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  return (
    <aside style={{
      backgroundColor: '#F97316',
      width: '220px',
      minHeight: '100vh',
      padding: '20px 0',
    }}>
      <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
        <li><SidebarLink to="/dashboard" icon="bi-house-fill" label="Inicio" /></li>
        <li><SidebarLink to="/users" icon="bi-people-fill" label="Empleados" /></li>
        <li><SidebarLink to="/projects" icon="bi-folder-fill" label="Proyectos" /></li>
        <li><SidebarLink to="/support" icon="bi-headset" label="Asistencia" /></li>
=======
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <ul>
        <li>
          <Link to="/dashboard">
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/users">
            Usuarios
          </Link>
        </li>
>>>>>>> 009dea9 (Primer Commit del Proyecto)
      </ul>
    </aside>
  );
}

<<<<<<< HEAD
function SidebarLink({ to, icon, label }: { to: string; icon: string; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '25px 35px',
        color: isActive ? '#F97316' : '#fff',
        backgroundColor: isActive ? '#fff' : 'transparent',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'background 0.2s, color 0.2s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.backgroundColor = '#fff';
        el.style.color = '#F97316';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.backgroundColor = isActive ? '#fff' : 'transparent';
        el.style.color = isActive ? '#F97316' : '#fff';
      }}
    >
      <i className={`bi ${icon}`}></i> {label}
    </Link>
  );
}

=======
>>>>>>> 009dea9 (Primer Commit del Proyecto)
export default Sidebar;