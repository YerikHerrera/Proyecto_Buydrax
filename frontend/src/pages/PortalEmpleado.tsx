import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import PortalCards from "../components/portal/PortalCards";
import PortalLoan from "../components/portal/PortalLoan";
import PortalPayments from "../components/portal/PortalPayments";
import PortalRequests from "../components/portal/PortalRequests";
import PortalMiAsignacion from "../components/portal/PortalMiAsignacion";
import PortalMisTurnos from "../components/portal/PortalMisTurnos";
import PortalMiAsistencia from "../components/portal/PortalMiAsistencia";
import PortalMisHorasExtra from "../components/portal/PortalMisHorasExtra";
import PortalMisCertificaciones from "../components/portal/PortalMisCertificaciones";
import PortalMiPerfil from "../components/portal/PortalMiPerfil";
import { etiquetaRol, leerSesion } from "../services/session";

export type PortalSeccion =
  | "inicio"
  | "pagos"
  | "prestamos"
  | "solicitudes"
  | "asignacion"
  | "turnos"
  | "asistencia"
  | "horas-extra"
  | "certificaciones"
  | "perfil";

const TITULOS: Record<PortalSeccion, string> = {
  inicio: "Inicio",
  pagos: "Mis pagos",
  prestamos: "Mis préstamos",
  solicitudes: "Mis solicitudes",
  asignacion: "Mi cuadrilla / proyecto",
  turnos: "Mis turnos",
  asistencia: "Mi asistencia",
  "horas-extra": "Mis horas extra",
  certificaciones: "Mis certificaciones",
  perfil: "Mi perfil",
};

type Props = { seccion?: PortalSeccion };

export default function PortalEmpleado({ seccion = "inicio" }: Props) {
  const s = leerSesion();

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Mi portal", to: "/portal" },
          ...(seccion !== "inicio" ? [{ label: TITULOS[seccion] }] : []),
        ]}
      />
      <div className="page-card">
        <h1 className="page-title">
          {seccion === "inicio" ? "Portal del empleado" : TITULOS[seccion]}
        </h1>
        <p className="page-subtitle">
          Hola <strong>{s?.nombre || "colaborador"}</strong>
          {s?.rol ? ` · ${etiquetaRol(s.rol)}` : ""}. Solo ves tu propia información.
        </p>

        {seccion === "inicio" && <PortalCards />}
        {seccion === "pagos" && <PortalPayments />}
        {seccion === "prestamos" && <PortalLoan />}
        {seccion === "solicitudes" && <PortalRequests />}
        {seccion === "asignacion" && <PortalMiAsignacion />}
        {seccion === "turnos" && <PortalMisTurnos />}
        {seccion === "asistencia" && <PortalMiAsistencia />}
        {seccion === "horas-extra" && <PortalMisHorasExtra />}
        {seccion === "certificaciones" && <PortalMisCertificaciones />}
        {seccion === "perfil" && <PortalMiPerfil />}
      </div>
    </AppShell>
  );
}
