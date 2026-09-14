import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import { listarProyectos, type Proyecto } from "../services/proyectosService";
import "../styles/Reportes.css";

type Reporte = {
  id: number;
  nombre: string;
  proyecto: string;
  tipo: string;
  fecha: string;
  descripcion: string;
};

const TIPOS = [
  "Reporte de asistencia",
  "Reporte de personal",
  "Reporte de proyecto",
  "Reporte de horas extras",
];

const ACCESOS = [
  { to: "/reportes/general", title: "General por proyecto", desc: "Resúmenes y avance", icon: "bi-pie-chart" },
  { to: "/reportes/personal", title: "Personal activo", desc: "Proyecto · nombre · cargo · estado", icon: "bi-people" },
  { to: "/reportes/asistencia", title: "Asistencia", desc: "Calendario visual por empleado", icon: "bi-calendar-check" },
  { to: "/reportes/horas-extra", title: "Horas extra", desc: "Filtros por proyecto y estado", icon: "bi-clock-history" },
  { to: "/reportes/turnos", title: "Turnos", desc: "Horarios asignados", icon: "bi-alarm" },
  { to: "/reportes/proyectos", title: "Proyectos / obras", desc: "Presupuesto y % avance", icon: "bi-building" },
];

export default function Reportes() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [nombre, setNombre] = useState("");
  const [proyecto, setProyecto] = useState("");
  const [tipo, setTipo] = useState("");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [reportes, setReportes] = useState<Reporte[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("reportes") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    listarProyectos().then(setProyectos).catch(() => setProyectos([]));
  }, []);

  const persist = (list: Reporte[]) => {
    setReportes(list);
    localStorage.setItem("reportes", JSON.stringify(list));
  };

  const guardar = () => {
    if (!nombre || !proyecto || !tipo || !fecha || !descripcion) {
      alert("Completa todos los campos.");
      return;
    }
    persist([
      ...reportes,
      { id: Date.now(), nombre, proyecto, tipo, fecha, descripcion },
    ]);
    setNombre("");
    setProyecto("");
    setTipo("");
    setFecha("");
    setDescripcion("");
  };

  const eliminar = (id: number) => {
    if (!confirm("¿Eliminar este reporte?")) return;
    persist(reportes.filter((r) => r.id !== id));
  };

  return (
    <AppShell>
      <Breadcrumb items={[{ label: "Reportes" }]} />

      <div className="page-card" style={{ marginBottom: 20 }}>
        <h1 className="page-title">Centro de reportes</h1>
        <p className="page-subtitle">
          Accesos a reportes operativos (vista visual). Los datos mock se reemplazarán al conectar endpoints.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 12,
            marginTop: 16,
          }}
        >
          {ACCESOS.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              style={{
                display: "block",
                padding: 16,
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                background: "#fff",
                textDecoration: "none",
                color: "inherit",
                transition: "border-color 0.15s, box-shadow 0.15s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#f59e0b";
                e.currentTarget.style.boxShadow = "0 8px 18px rgba(249,115,22,0.12)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "none";
              }}
            >
              <i className={`bi ${a.icon}`} style={{ color: "#ea580c", fontSize: 20 }} />
              <div style={{ fontWeight: 700, marginTop: 8, fontSize: 14 }}>{a.title}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{a.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="page-card" style={{ marginBottom: 20 }}>
        <h2 className="page-title" style={{ fontSize: 18 }}>Crear nota de reporte</h2>
        <p className="page-subtitle">
          Los proyectos salen de la API. El listado se guarda en este navegador (aún sin endpoint de reportes).
        </p>
        <div className="agregar-form" style={{ marginTop: 16 }}>
          <div>
            <label className="agregar-label">Nombre</label>
            <input className="agregar-input" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div>
            <label className="agregar-label">Proyecto</label>
            <select className="agregar-input" value={proyecto} onChange={(e) => setProyecto(e.target.value)}>
              <option value="">Selecciona…</option>
              {proyectos.map((p) => (
                <option key={p.id_proyecto} value={p.nombre}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="agregar-label">Tipo</label>
            <select className="agregar-input" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="">Selecciona…</option>
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="agregar-label">Fecha</label>
            <input type="date" className="agregar-input" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="agregar-label">Descripción</label>
            <textarea
              className="agregar-input"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
        </div>
        <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
          <button type="button" className="agregar-btn-primario" onClick={guardar}>
            Guardar
          </button>
          <button
            type="button"
            className="agregar-btn-secundario btn-cancel-hover"
            onClick={() => {
              setNombre("");
              setProyecto("");
              setTipo("");
              setFecha("");
              setDescripcion("");
            }}
          >
            Cancelar
          </button>
        </div>
      </div>

      <div className="page-card">
        <h2 className="page-title" style={{ fontSize: 16 }}>Notas guardadas</h2>
        {reportes.length === 0 ? (
          <p style={{ color: "#94a3b8", marginTop: 12 }}>Aún no hay reportes guardados en este navegador.</p>
        ) : (
          <ul style={{ marginTop: 12, listStyle: "none", padding: 0 }}>
            {reportes.map((r) => (
              <li
                key={r.id}
                style={{
                  padding: 12,
                  borderBottom: "1px solid #f1f5f9",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <strong>{r.nombre}</strong> · {r.tipo} · {r.proyecto}
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    {r.fecha} — {r.descripcion}
                  </div>
                </div>
                <button type="button" className="agregar-btn-secundario btn-cancel-hover" onClick={() => eliminar(r.id)}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
