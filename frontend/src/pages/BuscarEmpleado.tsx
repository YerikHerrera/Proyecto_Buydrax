import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { EMPLEADOS_MOCK } from "../data/empleados";
import "../styles/BuscarEmpleado.css";

export default function BuscarEmpleado() {
  const [searchParams] = useSearchParams();
  const [busqueda, setBusqueda] = useState(searchParams.get("nombre") || "");
  const [resultadoId, setResultadoId] = useState<number | null>(null);
  const [sinResultado, setSinResultado] = useState(false);

  useEffect(() => {
    const consulta = searchParams.get("nombre") || "";
    if (!consulta.trim()) return;
    setBusqueda(consulta);
    const valor = consulta.trim().toLowerCase();
    const empleado = EMPLEADOS_MOCK.find(
      (item) => item.nombre.toLowerCase().includes(valor) || item.numDoc.includes(valor)
    );
    if (!empleado) {
      setResultadoId(null);
      setSinResultado(true);
    } else {
      setResultadoId(empleado.id);
      setSinResultado(false);
    }
  }, [searchParams]);

  const buscar = () => {
    const valor = busqueda.trim().toLowerCase();
    if (!valor) return;

    const empleado = EMPLEADOS_MOCK.find(
      (item) => item.nombre.toLowerCase().includes(valor) || item.numDoc.includes(valor)
    );

    if (!empleado) {
      setResultadoId(null);
      setSinResultado(true);
      return;
    }

    setResultadoId(empleado.id);
    setSinResultado(false);
  };

  const resultado = EMPLEADOS_MOCK.find((item) => item.id === resultadoId);

  return (
    <div className="buscar-page">
      <Navbar />
      <div className="buscar-body">
        <Sidebar />
        <main className="buscar-main">
          <div className="buscar-breadcrumb"><i className="bi bi-house-fill"></i><span>›</span><span>Empleados</span><span>›</span><strong>Buscar empleado</strong></div>

          <div className="buscar-stepper">
            <div className={`buscar-step ${!resultado ? "activo" : "completado"}`}><span>{resultado ? <i className="bi bi-check"></i> : 1}</span><b>Búsqueda</b></div>
            <div className="buscar-linea"></div>
            <div className={`buscar-step ${resultado ? "activo" : ""}`}><span>2</span><b>Empleado encontrado</b></div>
            <div className="buscar-linea"></div>
            <div className="buscar-step"><span>3</span><b>Resultados</b></div>
          </div>

          {!resultado && (
            <section className="buscar-card">
              <div className="buscar-title"><div className="buscar-icono"><i className="bi bi-search"></i></div><div><h1>Buscar empleado</h1><p>Busca por nombre o número de documento.</p></div></div>
              <label>Nombre o número de documento<div className="buscar-input"><i className="bi bi-person-search"></i><input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} onKeyDown={(e) => e.key === "Enter" && buscar()} placeholder="Ej. Juan Pérez o 1024511530" /></div></label>
              {sinResultado && <div className="buscar-error"><i className="bi bi-exclamation-circle-fill"></i> No se encontró ningún empleado con ese criterio.</div>}
              <button className="buscar-btn" onClick={buscar}><i className="bi bi-search"></i> Buscar empleado</button>
            </section>
          )}

          {resultado && (
            <section className="buscar-resultado-card">
              <div className="buscar-result-header"><div><p className="buscar-eyebrow">RESULTADO DE BÚSQUEDA</p><h1>Empleado encontrado</h1><p>Estos son los datos disponibles del empleado.</p></div><button className="buscar-volver" onClick={() => { setResultadoId(null); setSinResultado(false); }}>Nueva búsqueda</button></div>
              <div className="buscar-persona">
                <div className="buscar-avatar" style={{ backgroundColor: `${resultado.color}20`, color: resultado.color }}>{resultado.nombre.split(" ").slice(0, 2).map((p) => p[0]).join("")}</div>
                <div><h2>{resultado.nombre}</h2><p>{resultado.cargo}</p><span><i className="bi bi-card-text"></i> {resultado.tipoDoc} {resultado.numDoc}</span></div>
              </div>
              <div className="buscar-datos">
                <div><span>Teléfono</span><strong>{resultado.telefono}</strong></div>
                <div><span>Estrato</span><strong>{resultado.estrato}</strong></div>
                <div><span>Estado</span><strong className="buscar-activo">Activo</strong></div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
