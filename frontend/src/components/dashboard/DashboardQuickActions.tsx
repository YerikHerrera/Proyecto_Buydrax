import { Link } from 'react-router-dom';

type Props = { mostrarRegistrarEmpleado: boolean };

export default function DashboardQuickActions({
  mostrarRegistrarEmpleado
}: Props) {
  return (
    <div style={{ marginTop: 28 }}>
      <h2
        style={{
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 12,
          color: '#0f172a'
        }}
      >
        Acciones de gestión
      </h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {mostrarRegistrarEmpleado && (
          <Link to="/empleados/registrar" className="dash-action-btn">
            <i className="bi bi-person-plus" /> Nuevo empleado
          </Link>
        )}
        <Link to="/proyectos" className="dash-action-btn">
          <i className="bi bi-folder-plus" /> Crear proyecto
        </Link>
        <Link to="/asistencia/validaciones" className="dash-action-btn">
          <i className="bi bi-check2-square" /> Validar / aprobar
        </Link>
        <Link to="/users" className="dash-action-btn">
          <i className="bi bi-shield-lock" /> Usuarios
        </Link>
      </div>

      <style>{`
        .dash-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 10px;
          background: #fff;
          border: 1px solid #e2e8f0;
          color: #0f172a;
          font-weight: 600;
          font-size: 13px;
          text-decoration: none;
          transition: background .15s, border-color .15s, transform .15s, box-shadow .15s;
        }
        .dash-action-btn:hover {
          background: #fff7ed;
          border-color: #f59e0b;
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(249, 115, 22, .12);
        }
      `}</style>
    </div>
  );
}
