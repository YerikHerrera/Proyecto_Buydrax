import { useEffect, useState } from "react";
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
        <h1 className="page-title">Crear reporte</h1>
        <p className="page-subtitle">
          Los proyectos salen de la API. El listado de reportes se guarda en este navegador
          (aún no hay endpoint de reportes operativos en el backend).
        </p>
        <div className="agregar-form" style={{ marginTop: 16 }}>
          <div>
            <label className="agregar-label">Nombre</label>
            <input className="agregar-input" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div>
            <label className="agregar-label">Proyecto</label>
            <select className="agregar-input" value={proyecto} onChange={(e) => setProyecto(e.target.value)}>
              <option value="">Seleccionar</option>
              {proyectos.map((p) => (
                <option key={p.id_proyecto} value={p.nombre}>{p.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="agregar-label">Tipo</label>
            <select className="agregar-input" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="">Seleccionar</option>
              {TIPOS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="agregar-label">Fecha</label>
            <input className="agregar-input" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="agregar-label">Descripción</label>
            <textarea className="agregar-input" maxLength={500} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} />
          </div>
        </div>
        <div className="agregar-botones" style={{ marginTop: 16 }}>
          <button className="agregar-btn-primario" type="button" onClick={guardar}>
            Guardar reporte
          </button>
        </div>
      </div>

      <div className="page-card">
        <h2 className="page-title" style={{ fontSize: 16 }}>Reportes guardados</h2>
        {reportes.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>No hay reportes aún.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                  <th style={{ padding: 10 }}>Nombre</th>
                  <th style={{ padding: 10 }}>Proyecto</th>
                  <th style={{ padding: 10 }}>Tipo</th>
                  <th style={{ padding: 10 }}>Fecha</th>
                  <th style={{ padding: 10 }}></th>
                </tr>
              </thead>
              <tbody>
                {reportes.map((r) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: 10 }}>{r.nombre}</td>
                    <td style={{ padding: 10 }}>{r.proyecto}</td>
                    <td style={{ padding: 10 }}>{r.tipo}</td>
                    <td style={{ padding: 10 }}>{r.fecha}</td>
                    <td style={{ padding: 10 }}>
                      <button type="button" className="agregar-btn-secundario" onClick={() => eliminar(r.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
