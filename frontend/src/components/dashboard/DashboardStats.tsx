import type { DashboardData } from '../../services/dashboardService';

type Props = { stats: DashboardData; hidden?: boolean };

export default function DashboardStats({ stats, hidden = false }: Props) {
  if (hidden) return null;

  const items = [
    ['Empleados activos', stats.empleados_activos],
    ['Proyectos activos', stats.proyectos_activos],
    ['Horas extra pend.', stats.horas_extra_pendientes],
    ['Novedades pend.', stats.novedades_pendientes]
  ];

  return (
    <div className="dashboard-stats">
      {items.map(([label, value]) => (
        <div className="dashboard-stat" key={String(label)}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}
