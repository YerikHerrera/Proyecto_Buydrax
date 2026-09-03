import { useState } from "react";
import { EMPLEADOS_MOCK } from "../data/empleados";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import "../styles/Turnos.css";

export default function Turnos() {
  const [empleadoId, setEmpleadoId] = useState("");
  const [turno, setTurno] = useState("");
  const [horaInicio, setHoraInicio] = useState("07:00");
  const [horaFin, setHoraFin] = useState("17:00");

  const guardar = () => {
    if (!empleadoId || !turno) {
      alert("Selecciona el empleado y el turno.");
      return;
    }
    const empleado = EMPLEADOS_MOCK.find((e) => String(e.id) === empleadoId)?.nombre;
    alert(`Turno ${turno} asignado a ${empleado}.`);
  };

  return (
    <div className="turnos-page">
      <Navbar />
      <div className="turnos-body">
        <Sidebar />
        <main className="turnos-main">
          <nav className="turnos-breadcrumb">
            <i className="bi bi-house-fill"></i><span>›</span><span>Asistencia</span><span>›</span><strong>Turnos</strong>
          </nav>

          <section className="turnos-card">
            <div className="turnos-header">
              <div className="turnos-icono"><i className="bi bi-calendar2-check"></i></div>
              <div><h1>TURNOS</h1><p>Registra y asigna turnos al empleado.</p></div>
            </div>
            <hr />

            <div className="turnos-grid">
              <label>Nombre del empleado
                <div className="turnos-field"><i className="bi bi-person"></i>
                  <select value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)}>
                    <option value="">Seleccionar empleado</option>
                    {EMPLEADOS_MOCK.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                  </select><i className="bi bi-chevron-down"></i>
                </div>
              </label>

              <label>Hora finalizado
                <div className="turnos-field"><i className="bi bi-clock"></i><input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} /></div>
              </label>

              <label>Turnos
                <div className="turnos-field"><i className="bi bi-calendar-check"></i>
                  <select value={turno} onChange={(e) => setTurno(e.target.value)}>
                    <option value="">Seleccionar turno</option>
                    <option value="Diurno">Diurno</option>
                    <option value="Nocturno">Nocturno</option>
                  </select><i className="bi bi-chevron-down"></i>
                </div>
              </label>

              <label>Hora inicio
                <div className="turnos-field"><i className="bi bi-clock"></i><input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} /></div>
              </label>
            </div>

            <div className="turnos-actions"><button onClick={guardar}><i className="bi bi-floppy"></i> Guardar y Asignar Empleado</button></div>
          </section>
        </main>
      </div>
    </div>
  );
}
