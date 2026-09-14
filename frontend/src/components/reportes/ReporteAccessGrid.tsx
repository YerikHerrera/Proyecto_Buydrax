import { Link } from 'react-router-dom';

export type AccesoReporte = {
  to: string;
  title: string;
  desc: string;
  icon: string;
};

export default function ReporteAccessGrid({
  accesos
}: {
  accesos: AccesoReporte[];
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 12,
        marginTop: 16
      }}
    >
      {accesos.map((a) => (
        <Link
          key={a.to}
          to={a.to}
          style={{
            display: 'block',
            padding: 16,
            borderRadius: 12,
            border: '1px solid #e2e8f0',
            background: '#fff',
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          <i className={`bi ${a.icon}`} style={{ color: '#ea580c', fontSize: 20 }} />
          <div style={{ fontWeight: 700, marginTop: 8, fontSize: 14 }}>
            {a.title}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
            {a.desc}
          </div>
        </Link>
      ))}
    </div>
  );
}
