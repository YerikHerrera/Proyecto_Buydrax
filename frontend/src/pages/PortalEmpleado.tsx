import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import { etiquetaRol, leerSesion } from "../services/session";

type Props = { seccion?: "inicio" | "pagos" | "prestamos" | "solicitudes" };

export default function PortalEmpleado({ seccion = "inicio" }: Props) {
  const s = leerSesion();

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Mi portal", to: "/portal" },
          ...(seccion !== "inicio"
            ? [{ label: seccion === "pagos" ? "Mis pagos" : seccion === "prestamos" ? "Mis préstamos" : "Mis solicitudes" }]
            : []),
        ]}
      />
      <div className="page-card">
        <h1 className="page-title">Portal del empleado</h1>
        <p className="page-subtitle">
          Hola <strong>{s?.nombre || "colaborador"}</strong>
          {s?.rol ? ` · ${etiquetaRol(s.rol)}` : ""}. Consulta tu información personal y de pagos.
        </p>

        {seccion === "inicio" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 14,
              marginTop: 16,
            }}
          >
            {[
              {
                to: "/portal/pagos",
                title: "Último pago / Desprendibles",
                desc: "Historial y descarga PDF",
                icon: "bi-receipt",
              },
              {
                to: "/portal/prestamos",
                title: "Mis préstamos",
                desc: "Saldo y próxima cuota",
                icon: "bi-wallet2",
              },
              {
                to: "/portal/solicitudes",
                title: "Mis solicitudes",
                desc: "Permisos y vacaciones",
                icon: "bi-inbox",
              },
              {
                to: "/perfiles",
                title: "Mi información personal",
                desc: "Datos de contacto y ficha",
                icon: "bi-person-vcard",
              },
            ].map((c) => (
              <Link
                key={c.to}
                to={c.to}
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
                <i className={`bi ${c.icon}`} style={{ fontSize: 22, color: "#ea580c" }} />
                <h3 style={{ margin: "10px 0 4px", fontSize: 15 }}>{c.title}</h3>
                <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>{c.desc}</p>
              </Link>
            ))}
          </div>
        )}

        {seccion === "pagos" && (
          <div style={{ marginTop: 12 }}>
            <p style={{ color: "#64748b" }}>
              Historial de desprendibles (vista previa). Cuando el backend exponga los endpoints, aquí
              verás período, neto y descarga PDF.
            </p>
            <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: 12, marginTop: 12 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#fff7ed" }}>
                    {["Período", "Tipo", "Fecha pago", "Neto (COP)", "Acción"].map((h) => (
                      <th key={h} style={{ padding: 12, textAlign: "left", color: "#9a3412" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: 12 }}>2026-08 Q2</td>
                    <td style={{ padding: 12 }}>Quincenal</td>
                    <td style={{ padding: 12 }}>2026-08-30</td>
                    <td style={{ padding: 12, fontWeight: 700 }}>$ 1.850.000</td>
                    <td style={{ padding: 12 }}>
                      <button
                        type="button"
                        style={{
                          padding: "6px 12px",
                          borderRadius: 8,
                          border: "none",
                          background: "#f97316",
                          color: "#fff",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Descargar PDF
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {seccion === "prestamos" && (
          <div style={{ marginTop: 12 }}>
            <p style={{ color: "#64748b" }}>Saldo de préstamo activo (vista previa).</p>
            <div
              style={{
                marginTop: 12,
                padding: 16,
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                background: "#fff",
                maxWidth: 360,
              }}
            >
              <div style={{ fontSize: 12, color: "#64748b" }}>Saldo pendiente</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>$ 420.000</div>
              <div style={{ height: 8, background: "#f1f5f9", borderRadius: 999, margin: "10px 0" }}>
                <div style={{ width: "58%", height: "100%", background: "#f59e0b", borderRadius: 999 }} />
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Próxima cuota: $ 70.000 · 15/09/2026</div>
            </div>
          </div>
        )}

        {seccion === "solicitudes" && (
          <div style={{ marginTop: 12 }}>
            <p style={{ color: "#64748b" }}>
              Aquí podrás crear solicitudes de permiso o vacaciones. Módulo visual listo para conectar API.
            </p>
            <button
              type="button"
              style={{
                marginTop: 12,
                padding: "10px 16px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg,#ea580c,#f59e0b)",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + Nueva solicitud
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
