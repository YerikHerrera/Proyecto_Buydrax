import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import PortalCards from "../components/portal/PortalCards";
import PortalLoan from "../components/portal/PortalLoan";
import PortalPayments from "../components/portal/PortalPayments";
import PortalRequests from "../components/portal/PortalRequests";
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

        {seccion === "inicio" && <PortalCards />}
        {seccion === "pagos" && <PortalPayments />}
        {seccion === "prestamos" && <PortalLoan />}
        {seccion === "solicitudes" && <PortalRequests />}
      </div>
    </AppShell>
  );
}
