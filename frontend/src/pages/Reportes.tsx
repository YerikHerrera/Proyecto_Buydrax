import { useState } from "react";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import "../styles/Reportes.css";

interface Reporte {
  id: number;
  nombre: string;
  proyecto: string;
  tipo: string;
  fecha: string;
  descripcion: string;
}

function Reportes() {
  const [nombre, setNombre] = useState("");
  const [proyecto, setProyecto] = useState("");
  const [tipo, setTipo] = useState("");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [reportes, setReportes] = useState<Reporte[]>(() => {
    const reportesGuardados = localStorage.getItem("reportes");

    if (reportesGuardados) {
      return JSON.parse(reportesGuardados);
    }

    return [];
  });

  const [reporteEditando, setReporteEditando] = useState<number | null>(null);

  // GUARDAR REPORTE
  const guardarReporte = () => {
    if (!nombre || !proyecto || !tipo || !fecha || !descripcion) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const nuevoReporte: Reporte = {
      id: Date.now(),
      nombre,
      proyecto,
      tipo,
      fecha,
      descripcion,
    };

    const nuevosReportes = [...reportes, nuevoReporte];

    setReportes(nuevosReportes);

    localStorage.setItem(
      "reportes",
      JSON.stringify(nuevosReportes)
    );

    alert("Reporte guardado correctamente.");

    limpiarFormulario();
  };

  // EDITAR REPORTE
  const editarReporte = () => {
    if (reporteEditando === null) {
      alert("Selecciona un reporte para editar.");
      return;
    }

    if (!nombre || !proyecto || !tipo || !fecha || !descripcion) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const reportesActualizados = reportes.map((reporte) =>
      reporte.id === reporteEditando
        ? {
            ...reporte,
            nombre,
            proyecto,
            tipo,
            fecha,
            descripcion,
          }
        : reporte
    );

    setReportes(reportesActualizados);

    localStorage.setItem(
      "reportes",
      JSON.stringify(reportesActualizados)
    );

    alert("Reporte actualizado correctamente.");

    setReporteEditando(null);

    limpiarFormulario();
  };

  // CARGAR REPORTE PARA EDITAR
  const cargarReporte = (reporte: Reporte) => {
    setNombre(reporte.nombre);
    setProyecto(reporte.proyecto);
    setTipo(reporte.tipo);
    setFecha(reporte.fecha);
    setDescripcion(reporte.descripcion);

    setReporteEditando(reporte.id);
  };

  // ELIMINAR REPORTE
  const eliminarReporte = (id: number) => {
  const confirmar = window.confirm(
    "¿Seguro que quieres eliminar este reporte?"
  );

  if (!confirmar) {
    return;
  }

  const reportesActualizados = reportes.filter(
    (reporte) => reporte.id !== id
  );

  setReportes(reportesActualizados);

  localStorage.setItem(
    "reportes",
    JSON.stringify(reportesActualizados)
  );

  alert("Reporte eliminado correctamente.");
};

  // LIMPIAR FORMULARIO
  const limpiarFormulario = () => {
    setNombre("");
    setProyecto("");
    setTipo("");
    setFecha("");
    setDescripcion("");
  };

  return (
    <div className="ContenedorDashboard">

      <Navbar />

      <div className="dashboard-body">

        <div className="dashboard-sidebar">
          <Sidebar />
        </div>

        <main className="dashboard-main">

          {/* ENCABEZADO */}

          <div className="reportes-header">

            <i className="bi bi-bar-chart-line"></i>

            <div>
              <h1>Crear Reporte</h1>

              <p>
                Completa la información para crear un nuevo reporte.
              </p>
            </div>

          </div>


          {/* FORMULARIO */}

          <div className="reportes-form">

            <div className="campo-reporte">

              <label>Nombre del reporte</label>

              <input
                type="text"
                placeholder="Nombre del reporte"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />

            </div>


            <div className="campo-reporte">

              <label>Proyecto</label>

              <select
                value={proyecto}
                onChange={(e) => setProyecto(e.target.value)}
              >

                <option value="">
                  Seleccionar proyecto
                </option>

                <option value="Construcción CR 60">
                  Construcción CR 60
                </option>

                <option value="Ampliación Terminal">
                  Ampliación Terminal
                </option>

              </select>

            </div>


            <div className="campo-reporte">

              <label>Tipo de reporte</label>

              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >

                <option value="">
                  Seleccionar tipo de reporte
                </option>

                <option value="Reporte de asistencia">
                  Reporte de asistencia
                </option>

                <option value="Reporte de personal">
                  Reporte de personal
                </option>

                <option value="Reporte de proyecto">
                  Reporte de proyecto
                </option>

                <option value="Reporte de horas extras">
                  Reporte de horas extras
                </option>

              </select>

            </div>


            <div className="campo-reporte">

              <label>Fecha del reporte</label>

              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />

            </div>


            <div className="campo-reporte campo-completo">

              <label>Descripción</label>

              <textarea
                placeholder="Escriba la información del reporte..."
                maxLength={500}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              ></textarea>

              <span>
                {descripcion.length} / 500
              </span>

            </div>


            {/* BOTONES */}

            <div className="botones-reportes">

              <button
                className="btn-guardar-reporte"
                onClick={guardarReporte}
              >

                <i className="bi bi-save"></i>

                Guardar Reporte

              </button>


              <button
                className="btn-editar-reporte"
                onClick={editarReporte}
              >

                <i className="bi bi-pencil"></i>

                Editar Reporte

              </button>

            </div>

          </div>


          {/* TABLA DE REPORTES */}

          <div className="lista-reportes">

            <h2>Reportes guardados</h2>

            {reportes.length === 0 ? (

              <p className="sin-reportes">
                No hay reportes guardados.
              </p>

            ) : (

              <div className="tabla-contenedor">

                <table className="tabla-reportes">

                  <thead>

                    <tr>
                      <th>Nombre</th>
                      <th>Proyecto</th>
                      <th>Tipo</th>
                      <th>Fecha</th>
                      <th>Descripción</th>
                      <th>Acciones</th>
                    </tr>

                  </thead>


                  <tbody>

                    {reportes.map((reporte) => (

                      <tr key={reporte.id}>

                        <td>
                          {reporte.nombre}
                        </td>

                        <td>
                          {reporte.proyecto}
                        </td>

                        <td>
                          {reporte.tipo}
                        </td>

                        <td>
                          {reporte.fecha}
                        </td>

                        <td className="descripcion-tabla">
                          {reporte.descripcion}
                        </td>

                        <td>

                          <button
                            className="btn-seleccionar-reporte"
                            onClick={() => cargarReporte(reporte)}
                          >

                            <i className="bi bi-pencil"></i>

                            Editar

                          </button>

  <button
    className="btn-eliminar-reporte"
    onClick={() => eliminarReporte(reporte.id)}
  >

    <i className="bi bi-trash"></i>

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

        </main>

      </div>

    </div>
  );
}

export default Reportes;
