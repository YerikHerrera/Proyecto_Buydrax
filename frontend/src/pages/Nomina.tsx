import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { EMPLEADOS_MOCK } from "../data/empleados";
import "../styles/Nomina.css";

export default function Nomina() {
  const [periodo, setPeriodo] = useState("Mayo 2025");
  const [busqueda, setBusqueda] = useState("");

  const empleados = useMemo(
    () =>
      EMPLEADOS_MOCK.filter((empleado) =>
        empleado.nombre.toLowerCase().includes(busqueda.toLowerCase())
      ),
    [busqueda]
  );

  const totalNomina = 215450000;
  const totalHorasExtras = 186.5;

  return (
    <div className="nomina-page">
      <Navbar />
      <div className="nomina-body">
        <Sidebar />
        <main className="nomina-main">
          <div className="nomina-breadcrumb">
            <i className="bi bi-house-fill"></i>
            <span>›</span>
            <span>Nómina</span>
            <span>›</span>
            <strong>Gestión de nómina</strong>
          </div>

          <div className="nomina-topbar">
            <div>
              <p className="nomina-eyebrow">GESTIÓN DE PERSONAL</p>
              <h1>Gestión de Nómina</h1>
              <p>Administra y consulta la nómina de la empresa de forma rápida y segura.</p>
            </div>

            <div className="nomina-periodo">
              <i className="bi bi-calendar3"></i>
              <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
                <option>Mayo 2025</option>
                <option>Abril 2025</option>
                <option>Marzo 2025</option>
              </select>
              <i className="bi bi-chevron-down"></i>
            </div>
          </div>

          <div className="nomina-summary-grid">
            <div className="nomina-summary-card">
              <div className="nomina-summary-icon blue"><i className="bi bi-people-fill"></i></div>
              <div><span>Empleados activos</span><strong>{empleados.length + 118}</strong><small>Ver empleados →</small></div>
            </div>
            <div className="nomina-summary-card">
              <div className="nomina-summary-icon green"><i className="bi bi-cash-stack"></i></div>
              <div><span>Costo total nómina</span><strong>$ {totalNomina.toLocaleString("es-CO")}</strong><small>Ver detalles →</small></div>
            </div>
            <div className="nomina-summary-card">
              <div className="nomina-summary-icon orange"><i className="bi bi-clock-fill"></i></div>
              <div><span>Horas extra del mes</span><strong>{totalHorasExtras} h</strong><small>Ver horas extra →</small></div>
            </div>
            <div className="nomina-summary-card">
              <div className="nomina-summary-icon purple"><i className="bi bi-file-earmark-text-fill"></i></div>
              <div><span>Nóminas pendientes</span><strong>5</strong><small>Generar nómina →</small></div>
            </div>
          </div>

          <div className="nomina-actions-grid">
            <Link to="/empleados" className="nomina-action-card orange-card">
              <i className="bi bi-people-fill"></i>
              <strong>Empleados</strong>
              <span>Gestiona la información y novedades del personal.</span>
              <b>Ir a empleados →</b>
            </Link>
            <Link to="/nomina" className="nomina-action-card green-card">
              <i className="bi bi-cash-coin"></i>
              <strong>Nómina</strong>
              <span>Administra y procesa la nómina de la empresa.</span>
              <b>Gestión de nómina →</b>
            </Link>
            <Link to="/reportes" className="nomina-action-card blue-card">
              <i className="bi bi-bar-chart-fill"></i>
              <strong>Reportes</strong>
              <span>Consulta reportes y análisis clave de la información.</span>
              <b>Ir a reportes →</b>
            </Link>
          </div>

          <section className="nomina-table-card">
            <div className="nomina-table-header">
              <div>
                <h2>Personal y novedades de nómina</h2>
                <p>Consulta los empleados incluidos en el periodo seleccionado.</p>
              </div>
              <div className="nomina-search">
                <i className="bi bi-search"></i>
                <input
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar empleado..."
                />
              </div>
            </div>

            <div className="nomina-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Empleado</th>
                    <th>Cargo</th>
                    <th>Documento</th>
                    <th>Horas</th>
                    <th>Horas extra</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {empleados.map((empleado, index) => (
                    <tr key={empleado.id}>
                      <td>
                        <div className="nomina-person">
                          <span style={{ backgroundColor: empleado.color }}>{empleado.nombre.charAt(0)}</span>
                          <div><strong>{empleado.nombre}</strong><small>{empleado.telefono}</small></div>
                        </div>
                      </td>
                      <td>{empleado.cargo}</td>
                      <td>{empleado.tipoDoc} {empleado.numDoc}</td>
                      <td>120 h</td>
                      <td>{index % 2 === 0 ? "12 h" : "8 h"}</td>
                      <td><span className="nomina-status">Procesada</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
