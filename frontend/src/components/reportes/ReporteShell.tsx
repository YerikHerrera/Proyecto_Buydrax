import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import AppShell from "../layout/AppShell";
import Breadcrumb from "../layout/Breadcrumb";

type Props = {
  titulo: string;
  subtitulo?: string;
  crumbs?: { label: string; to?: string }[];
  actions?: ReactNode;
  children: ReactNode;
  /** Enlace a la pantalla de registro / acción operativa */
  accionHref?: string;
  accionLabel?: string;
};

export default function ReporteShell({
  titulo,
  subtitulo,
  crumbs = [],
  actions,
  children,
  accionHref,
  accionLabel,
}: Props) {
  return (
    <AppShell>
      <div className="page-card" style={{ maxWidth: "100%" }}>
        {crumbs.length > 0 && <Breadcrumb items={crumbs} />}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <div>
            <h1 className="page-title" style={{ marginBottom: 4 }}>
              {titulo}
            </h1>
            {subtitulo && <p className="page-subtitle">{subtitulo}</p>}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            {accionHref && accionLabel && (
              <Link
                to={accionHref}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 16px",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #ea580c, #f59e0b)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: "none",
                  boxShadow: "0 6px 14px rgba(249, 115, 22, 0.25)",
                  transition: "transform 0.15s, box-shadow 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <i className="bi bi-plus-lg" /> {accionLabel}
              </Link>
            )}
            {actions}
          </div>
        </div>
        {children}
      </div>
    </AppShell>
  );
}
