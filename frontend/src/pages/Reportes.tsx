import { useEffect, useState } from "react";

import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import { listarProyectos, type Proyecto } from "../services/proyectosService";
import "../styles/Reportes.css";
import ReporteAccessGrid, { type AccesoReporte } from "../components/reportes/ReporteAccessGrid";
import ReporteNoteForm from "../components/reportes/ReporteNoteForm";
import ReporteNoteList, { type Reporte } from "../components/reportes/ReporteNoteList";

const TIPOS = [
  "Reporte de asistencia",
  "Reporte de personal",
  "Reporte de proyecto",
  "Reporte de horas extras",
];

const ACCESOS: AccesoReporte[] = [
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
        <p className="page-subtitle">Accesos a reportes operativos (vista visual). Los datos mock se reemplazarán al conectar endpoints.</p>
        <ReporteAccessGrid accesos={ACCESOS} />
      </div>
      <div className="page-card" style={{ marginBottom: 20 }}>
        <h2 className="page-title" style={{ fontSize: 18 }}>Crear nota de reporte</h2>
        <p className="page-subtitle">Los proyectos salen de la API. El listado se guarda en este navegador (aún sin endpoint de reportes).</p>
        <ReporteNoteForm nombre={nombre} proyecto={proyecto} tipo={tipo} fecha={fecha} descripcion={descripcion} proyectos={proyectos} tipos={TIPOS}
          setNombre={setNombre} setProyecto={setProyecto} setTipo={setTipo} setFecha={setFecha} setDescripcion={setDescripcion}
          onGuardar={guardar} onCancelar={()=>{setNombre("");setProyecto("");setTipo("");setFecha("");setDescripcion("");}} />
      </div>
      <div className="page-card">
        <h2 className="page-title" style={{ fontSize: 16 }}>Notas guardadas</h2>
        <ReporteNoteList reportes={reportes} onEliminar={eliminar} />
      </div>
    </AppShell>
  );
}
