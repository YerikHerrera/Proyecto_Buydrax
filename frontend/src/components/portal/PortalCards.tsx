import { Link } from "react-router-dom";

const cards = [
  { to: "/portal/asignacion", title: "Mi cuadrilla / proyecto", desc: "Dónde estás asignado", icon: "bi-people" },
  { to: "/portal/turnos", title: "Mis turnos", desc: "Horarios programados", icon: "bi-calendar-week" },
  { to: "/portal/asistencia", title: "Mi asistencia", desc: "Marcas del mes", icon: "bi-calendar-check" },
  { to: "/portal/horas-extra", title: "Mis horas extra", desc: "Estado de solicitudes", icon: "bi-clock-history" },
  { to: "/portal/certificaciones", title: "Mis certificaciones", desc: "Vigencia y vencimientos", icon: "bi-award" },
  { to: "/portal/perfil", title: "Mi perfil", desc: "Datos de usuario y ficha", icon: "bi-person-vcard" },
  { to: "/portal/pagos", title: "Mis pagos", desc: "Desprendibles", icon: "bi-receipt" },
  { to: "/portal/prestamos", title: "Mis préstamos", desc: "Saldo y cuotas", icon: "bi-wallet2" },
  { to: "/portal/solicitudes", title: "Mis solicitudes", desc: "Permisos y vacaciones", icon: "bi-inbox" },
];

export default function PortalCards() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginTop: 16 }}>
      {cards.map((card) => (
        <Link
          key={card.to}
          to={card.to}
          style={{
            display: "block",
            padding: 18,
            borderRadius: 14,
            border: "1px solid #e2e8f0",
            background: "#fff",
            textDecoration: "none",
            color: "inherit",
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
