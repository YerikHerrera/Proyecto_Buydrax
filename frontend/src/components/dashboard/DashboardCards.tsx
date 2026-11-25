import { Link } from 'react-router-dom';

export type CardDef = {
  titulo: string;
  path: string;
  color: string;
  icon: string;
  desc: string;
  roles: ('admin' | 'supervisor' | 'contador' | 'empleado')[];
};

type Props = { cards: CardDef[] };

export default function DashboardCards({ cards }: Props) {
  return (
    <>
      <div className="dashboard-grid">
        {cards.map((c) => (
          <Link
            key={c.path + c.titulo}
            to={c.path}
            className="dashboard-card"
            style={{ borderTop: `4px solid ${c.color}` }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: `${c.color}18`,
                color: c.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                marginBottom: 12
              }}
            >
              <i className={`bi ${c.icon}`} />
            </div>
            <h3
              style={{
                margin: '0 0 6px',
                fontSize: 16,
                fontWeight: 700,
                color: '#0f172a'
              }}
            >
              {c.titulo}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: '#64748b',
                lineHeight: 1.4
              }}
            >
              {c.desc}
            </p>
          </Link>
        ))}
      </div>
      <style>{`
        .dashboard-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.1);
        }
      `}</style>
    </>
  );
}
