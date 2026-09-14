import logo from '../../assets/logoo.png';

type Props = { roleLabel: string };

export default function DashboardHero({ roleLabel }: Props) {
  return (
    <div className="dashboard-hero">
      <img src={logo} alt="Buydrax" />
      <p
        style={{
          fontSize: 12,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: '#f59e0b',
          margin: '0 0 6px'
        }}
      >
        Panel principal
      </p>
      <h1
        style={{
          fontSize: 32,
          fontWeight: 800,
          margin: '0 0 8px',
          color: '#0f172a'
        }}
      >
        ¡Bienvenido a Buydrax!
      </h1>
      <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
        Accesos rápidos según tu rol · {roleLabel}
      </p>
    </div>
  );
}
