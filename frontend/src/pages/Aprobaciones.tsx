import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import RoleGate from "../components/RoleGate";
import AprobacionesTabs, { type AprobacionTab } from "../components/aprobaciones/AprobacionesTabs";
import AprobacionesHorasExtraTable from "../components/aprobaciones/AprobacionesHorasExtraTable";
import AprobacionesTurnosTable from "../components/aprobaciones/AprobacionesTurnosTable";
import AprobacionesAsistenciaTable from "../components/aprobaciones/AprobacionesAsistenciaTable";
import { apiRequest } from "../services/apiClient";
import { listarEmpleados, type Empleado } from "../services/empleadosService";
import { mapaUsuarios, nombreUsuario, type UsuarioPublic } from "../services/usuariosService";
import type { Asistencia } from "../components/aprobaciones/AprobacionesAsistenciaTable";
import type { HoraExtra } from "../components/aprobaciones/AprobacionesHorasExtraTable";
import type { Turno } from "../components/aprobaciones/AprobacionesTurnosTable";




export default function Aprobaciones() {
  return (
    <RoleGate require="aprobar">
      <AprobacionesInner />
    </RoleGate>
  );
}

function AprobacionesInner() {
  const [tab, setTab] = useState<AprobacionTab>("he");
  const [he, setHe] = useState<HoraExtra[]>([]);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [nombres, setNombres] = useState<Record<number, string>>({});
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    try {
      setLoading(true);
      setError("");
      const [heData, turnosData, emps, map] = await Promise.all([
        apiRequest<HoraExtra[]>("/horas-extra").catch(() => []),
        apiRequest<Turno[]>("/turnos").catch(() => []),
        listarEmpleados().catch(() => [] as Empleado[]),
        mapaUsuarios().catch(() => ({} as Record<number, UsuarioPublic>)),
      ]);
      setHe(Array.isArray(heData) ? heData : []);
      setTurnos(Array.isArray(turnosData) ? turnosData : []);
      const nom: Record<number, string> = {};
      for (const e of emps) {
        const u = map[e.id_usuario];
        nom[e.id_empleado] = u ? nombreUsuario(u) : e.numero_documento;
      }
      setNombres(nom);

      // Asistencias: agregar por empleado (endpoint global no existe en todos los deploys)
      const asis: Asistencia[] = [];
      const muestra = emps.slice(0, 30);
      await Promise.all(
        muestra.map(async (e) => {
          try {
            const rows = await apiRequest<Asistencia[]>(
              `/empleados/${e.id_empleado}/asistencias`
            );
            if (Array.isArray(rows)) asis.push(...rows);
          } catch {
            /* ignore */
          }
        })
      );
      setAsistencias(asis.sort((a, b) => (a.fecha < b.fecha ? 1 : -1)));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void cargar();
  }, []);

  const decidirHe = async (id: number, estado: "APROBADA" | "RECHAZADA") => {
    try {
      setOk("");
      await apiRequest(`/horas-extra/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ estado_he: estado }),
      });
      setOk(`Hora extra #${id} → ${estado}`);
      setHe((prev) =>
        prev.map((h) => (h.id_hora_extra === id ? { ...h, estado_he: estado } : h))
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar");
    }
  };

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Asistencia", to: "/asistencia" },
          { label: "Validaciones" },
        ]}
      />
      <div className="page-card">
        <h1 className="page-title">Validar asistencia, turnos y horas extras</h1>
        <p className="page-subtitle">
          Visible para <strong>ADMIN_RRHH</strong> y <strong>SUPERVISOR</strong>.
          Las horas extras se aprueban o rechazan con la API oficial. Asistencias y
          turnos se consultan aquí para control operativo.
        </p>
        {error && <p style={{ color: "#b00020" }}>{error}</p>}
        {ok && <p style={{ color: "#047857" }}>{ok}</p>}
        {loading && <p>Cargando…</p>}

        <AprobacionesTabs tab={tab} setTab={setTab} onActualizar={() => void cargar()} />

        {tab === "he" && <AprobacionesHorasExtraTable rows={he} nombres={nombres} onDecidir={decidirHe} />}

        {tab === "turnos" && <AprobacionesTurnosTable rows={turnos} nombres={nombres} />}

        {tab === "asistencias" && <AprobacionesAsistenciaTable rows={asistencias} nombres={nombres} />}
      </div>
    </AppShell>
  );
}
