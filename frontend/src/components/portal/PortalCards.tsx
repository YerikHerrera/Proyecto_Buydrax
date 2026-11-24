import { Link } from "react-router-dom";

const cards = [
  { to: "/portal/pagos", title: "Último pago / Desprendibles", desc: "Historial y descarga PDF", icon: "bi-receipt" },
  { to: "/portal/prestamos", title: "Mis préstamos", desc: "Saldo y próxima cuota", icon: "bi-wallet2" },
  { to: "/portal/solicitudes", title: "Mis solicitudes", desc: "Permisos y vacaciones", icon: "bi-inbox" },
  { to: "/perfiles", title: "Mi información personal", desc: "Datos de contacto y ficha", icon: "bi-person-vcard" },
];

export default function PortalCards() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14, marginTop: 16 }}>
      {cards.map((card) => (
        <Link
          key={card.to}
          to={card.to}
          style={{
            display: "block", padding: 18, borderRadius: 14, border: "1px solid #e2e8f0",
            background: "#fff", textDecoration: "none", color: "inherit",
            transition: "transform 0.15s, box-shadow 0.15s, border-color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.borderColor = "#f59e0b";
            e.currentTarget.style.boxShadow = "0 8px 18px rgba(249,115,22,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <i className={`bi ${card.icon}`} style={{ fontSize: 22, color: "#ea580c" }} />
          <h3 style={{ margin: "10px 0 4px", fontSize: 15 }}>{card.title}</h3>
          <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>{card.desc}</p>
        </Link>
      ))}
    </div>
  );
}
