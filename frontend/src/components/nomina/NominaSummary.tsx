import { Link } from 'react-router-dom';
import type { DashboardData } from '../../services/dashboardService';

export default function NominaSummary({
  stats
}: {
  stats: DashboardData | null;
}) {
  return (
    <div className="nomina-summary-grid" style={{ marginTop: 16 }}>
      <div className="nomina-summary-card">
        <div className="nomina-summary-icon blue">
          <i className="bi bi-people-fill" />
        </div>
        <div>
          <span>Empleados activos</span>
          <strong>{stats?.empleados_activos ?? '—'}</strong>
          <Link to="/empleados">
            <small>Ver empleados →</small>
          </Link>
        </div>
      </div>

      <div className="nomina-summary-card">
        <div className="nomina-summary-icon orange">
          <i className="bi bi-clock-fill" />
        </div>
        <div>
          <span>Horas extra pend.</span>
          <strong>{stats?.horas_extra_pendientes ?? '—'}</strong>
          <Link to="/reportes/horas-extra">
            <small>Ver horas extra →</small>
          </Link>
        </div>
      </div>

      <div className="nomina-summary-card">
        <div className="nomina-summary-icon purple">
          <i className="bi bi-file-earmark-text-fill" />
        </div>
        <div>
          <span>Nóminas borrador</span>
          <strong>{stats?.nominas_borrador ?? '—'}</strong>
        </div>
      </div>
    </div>
  );
}
