import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { EMPLEADOS_MOCK } from "../data/empleados";
import type { Empleado } from "../data/empleados";
import "../styles/Perfiles.css";

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(" ");

  if (partes.length === 1) {
    return partes[0][0].toUpperCase();
  }

  return (
    partes[0][0] + partes[1][0]
  ).toUpperCase();
}

function Perfiles() {

  const [busqueda, setBusqueda] = useState("");

  const [empleadoSeleccionado, setEmpleadoSeleccionado] =
    useState<Empleado | null>(null);

  const [mostrarResultados, setMostrarResultados] =
    useState(false);


  // BUSCAR EMPLEADO
  const buscarEmpleado = () => {

    if (!busqueda.trim()) {
      alert("Escribe un nombre o número de documento.");
      return;
    }

    const resultado = EMPLEADOS_MOCK.find((empleado) =>
      empleado.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      empleado.numDoc.includes(busqueda)
    );

    if (!resultado) {
      alert("No se encontró ningún empleado.");
      return;
    }

    setEmpleadoSeleccionado(resultado);
    setMostrarResultados(true);
  };


  // VOLVER A LA BÚSQUEDA
  const volverBusqueda = () => {
    setMostrarResultados(false);
    setEmpleadoSeleccionado(null);
  };


  return (
    <div className="ContenedorDashboard">

      <Navbar />

      <div className="dashboard-body">

        <div className="dashboard-sidebar">
          <Sidebar />
        </div>


        <main className="dashboard-main">


          {/* BREADCRUMB */}

          <div className="breadcrumb-perfiles">

            <span>Inicio</span>

            <i className="bi bi-chevron-right"></i>

            <span>Empleados</span>

            <i className="bi bi-chevron-right"></i>

            <span>Búsqueda</span>

            <i className="bi bi-chevron-right"></i>

            <strong>
              {mostrarResultados ? "Resultados" : "Búsqueda"}
            </strong>

          </div>


          {/* STEPPER */}

          <div className="stepper-perfiles">


            <div
              className={`stepper-item ${
                !mostrarResultados ? "activo" : "completado"
              }`}
            >

              <div className="stepper-circulo">

                {!mostrarResultados ? (
                  <i className="bi bi-search"></i>
                ) : (
                  <i className="bi bi-check"></i>
                )}

              </div>

              <span>
                Búsqueda de Empleado
              </span>

            </div>


            <div className="stepper-linea"></div>


            <div
              className={`stepper-item ${
                mostrarResultados ? "activo" : ""
              }`}
            >

              <div className="stepper-circulo">

                <i className="bi bi-person"></i>

              </div>

              <span>
                Empleado encontrado
              </span>

            </div>


            <div className="stepper-linea"></div>


            <div className="stepper-item">

              <div className="stepper-circulo">

                <i className="bi bi-flag"></i>

              </div>

              <span>
                Resultados
              </span>

            </div>

          </div>


          {/* =========================
              PANTALLA DE BÚSQUEDA
             ========================= */}

          {!mostrarResultados && (

            <>

              <div className="perfiles-header">

                <div className="perfiles-icono">

                  <i className="bi bi-search"></i>

                </div>

                <div>

                  <h1>
                    Búsqueda de Empleado
                  </h1>

                  <p>
                    Busca un empleado por nombre o número de documento.
                  </p>

                </div>

              </div>


              <div className="busqueda-perfil-card">

                <label>
                  Buscar empleado
                </label>


                <div className="busqueda-input">

                  <i className="bi bi-search"></i>

                  <input
                    type="text"
                    placeholder="Nombre o número de documento"
                    value={busqueda}
                    onChange={(e) =>
                      setBusqueda(e.target.value)
                    }
                    onKeyDown={(e) => {

                      if (e.key === "Enter") {
                        buscarEmpleado();
                      }

                    }}
                  />

                </div>


                <button
                  className="btn-buscar-perfil"
                  onClick={buscarEmpleado}
                >

                  <i className="bi bi-search"></i>

                  Buscar empleado

                </button>

              </div>

            </>

          )}


          {/* =========================
              RESULTADO DEL EMPLEADO
             ========================= */}

          {mostrarResultados && empleadoSeleccionado && (

            <>

              <div className="perfiles-header">

                <div className="perfiles-icono">

                  <i className="bi bi-person"></i>

                </div>

                <div>

                  <h1>
                    Resultados de Búsqueda
                  </h1>

                  <p>
                    Estos son los datos del empleado encontrado.
                  </p>

                </div>

              </div>


              <div className="perfil-card">


                {/* AVATAR */}

                <div
                  className="perfil-avatar"
                  style={{
                    backgroundColor:
                      empleadoSeleccionado.color + "20",
                    color:
                      empleadoSeleccionado.color,
                  }}
                >

                  <span>
                    {iniciales(
                      empleadoSeleccionado.nombre
                    )}
                  </span>


                  <div className="estado-online"></div>

                </div>


                {/* INFORMACIÓN */}

                <div className="perfil-informacion">

                  <h2>
                    {empleadoSeleccionado.nombre}
                  </h2>


                  <div className="perfil-dato">

                    <i className="bi bi-briefcase"></i>

                    <span>
                      {empleadoSeleccionado.cargo}
                    </span>

                  </div>


                  <div className="perfil-dato">

                    <i className="bi bi-card-text"></i>

                    <span>
                      {empleadoSeleccionado.tipoDoc}{" "}
                      {empleadoSeleccionado.numDoc}
                    </span>

                  </div>


                  <div className="perfil-dato">

                    <i className="bi bi-telephone"></i>

                    <span>
                      {empleadoSeleccionado.telefono}
                    </span>

                  </div>


                  <div className="perfil-dato">

                    <i className="bi bi-house"></i>

                    <span>
                      Estrato {empleadoSeleccionado.estrato}
                    </span>

                  </div>

                </div>

              </div>


              {/* BOTÓN ANTERIOR */}

              <div className="perfiles-footer">

                <button
                  className="btn-anterior-perfil"
                  onClick={volverBusqueda}
                >

                  <i className="bi bi-arrow-left"></i>

                  Anterior

                </button>

              </div>

            </>

          )}

        </main>

      </div>

    </div>
  );
}

export default Perfiles;