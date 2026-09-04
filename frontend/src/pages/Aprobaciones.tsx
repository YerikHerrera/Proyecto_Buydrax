import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import RoleGate from "../components/RoleGate";
import { apiRequest } from "../services/apiClient";
import { listarEmpleados, type Empleado } from "../services/empleadosService";
import { mapaUsuarios, nombreUsuario } from "../services/usuariosService";

type HoraExtra = {
  id_hora_extra: number;
  id_empleado: number;
  motivo: string;
  fecha_inicio: string;
  fecha_fin: string;
  cantidad_horas: number;
  tipo_hora: string;
  estado_he: string;
};

type Turno = {
  id_turno: number;
  id_empleado: number;
  id_proyecto: number;
  tipo_turno: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
};

type Asistencia = {
  id_asistencia: number;
  id_empleado: number;
  fecha: string;
  hora_entrada: string;
  hora_salida?: string | null;
  estado_asistencia: string;
};

export default function Aprobaciones() {
  return (
    <RoleGate require="aprobar">
      <AprobacionesInner />
    </RoleGate>
  );
}

function AprobacionesInner() {
  const [tab, setTab] = useState<"he" | "turnos" | "asistencias">("he");
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
        mapaUsuarios().catch(() => ({})),
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

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "16px 0" }}>
          {(
            [
              ["he", "Horas extras"],
              ["turnos", "Turnos"],
              ["asistencias", "Asistencias"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              className={tab === k ? "agregar-btn-primario" : "agregar-btn-secundario"}
              onClick={() => setTab(k)}
            >
              {label}
            </button>
          ))}
          <button type="button" className="agregar-btn-secundario" onClick={() => void cargar()}>
            Actualizar
          </button>
        </div>

        {tab === "he" && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                <th style={{ padding: 8 }}>Empleado</th>
                <th style={{ padding: 8 }}>Motivo</th>
                <th style={{ padding: 8 }}>Horas</th>
                <th style={{ padding: 8 }}>Estado</th>
                <th style={{ padding: 8 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {he.map((h) => (
                <tr key={h.id_hora_extra} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: 8 }}>{nombres[h.id_empleado] || `#${h.id_empleado}`}</td>
                  <td style={{ padding: 8 }}>{h.motivo}</td>
                  <td style={{ padding: 8 }}>
                    {h.cantidad_horas} ({h.tipo_hora})
                  </td>
                  <td style={{ padding: 8 }}>{h.estado_he}</td>
                  <td style={{ padding: 8, display: "flex", gap: 6 }}>
                    {h.estado_he === "PENDIENTE" && (
                      <>
                        <button
                          type="button"
                          className="agregar-btn-primario"
                          style={{ padding: "6px 10px", fontSize: 12 }}
                          onClick={() => void decidirHe(h.id_hora_extra, "APROBADA")}
                        >
                          Aprobar
                        </button>
                        <button
                          type="button"
                          className="agregar-btn-secundario"
                          style={{ padding: "6px 10px", fontSize: 12 }}
                          onClick={() => void decidirHe(h.id_hora_extra, "RECHAZADA")}
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {!he.length && (
                <tr>
                  <td colSpan={5} style={{ padding: 16, color: "#94a3b8" }}>
                    Sin registros de horas extras
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {tab === "turnos" && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                <th style={{ padding: 8 }}>Empleado</th>
                <th style={{ padding: 8 }}>Proyecto</th>
                <th style={{ padding: 8 }}>Tipo</th>
                <th style={{ padding: 8 }}>Fecha</th>
                <th style={{ padding: 8 }}>Horario</th>
              </tr>
            </thead>
            <tbody>
              {turnos.map((t) => (
                <tr key={t.id_turno} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: 8 }}>{nombres[t.id_empleado] || `#${t.id_empleado}`}</td>
                  <td style={{ padding: 8 }}>#{t.id_proyecto}</td>
                  <td style={{ padding: 8 }}>{t.tipo_turno}</td>
                  <td style={{ padding: 8 }}>{t.fecha}</td>
                  <td style={{ padding: 8 }}>
                    {t.hora_inicio} – {t.hora_fin}
                  </td>
                </tr>
              ))}
              {!turnos.length && (
                <tr>
                  <td colSpan={5} style={{ padding: 16, color: "#94a3b8" }}>
                    Sin turnos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {tab === "asistencias" && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                <th style={{ padding: 8 }}>Empleado</th>
                <th style={{ padding: 8 }}>Fecha</th>
                <th style={{ padding: 8 }}>Entrada</th>
                <th style={{ padding: 8 }}>Salida</th>
                <th style={{ padding: 8 }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {asistencias.map((a) => (
                <tr key={a.id_asistencia} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: 8 }}>{nombres[a.id_empleado] || `#${a.id_empleado}`}</td>
                  <td style={{ padding: 8 }}>{a.fecha}</td>
                  <td style={{ padding: 8 }}>{a.hora_entrada}</td>
                  <td style={{ padding: 8 }}>{a.hora_salida || "—"}</td>
                  <td style={{ padding: 8 }}>{a.estado_asistencia}</td>
                </tr>
              ))}
              {!asistencias.length && (
                <tr>
                  <td colSpan={5} style={{ padding: 16, color: "#94a3b8" }}>
                    Sin asistencias cargadas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </AppShell>
  );
}
