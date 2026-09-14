import { useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import PerfilCard from "../components/perfiles/PerfilCard";
import PerfilSearch from "../components/perfiles/PerfilSearch";
import { listarEmpleados, type Empleado } from "../services/empleadosService";
import { mapaUsuarios, nombreUsuario, type UsuarioPublic } from "../services/usuariosService";
import { leerSesion } from "../services/session";

export default function Perfiles() {
  const sesion = leerSesion();
  const [q, setQ] = useState("");
  const [emp, setEmp] = useState<Empleado | null>(null);
  const [map, setMap] = useState<Record<number, UsuarioPublic>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const buscar = async () => {
    const v = q.trim();
    if (!v) {
      setError("Escribe un nombre o número de documento.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setEmp(null);
      const porDocumento = /^\d+$/.test(v);
      const [lista, users] = await Promise.all([
        porDocumento ? listarEmpleados({ documento: v }) : listarEmpleados(),
        mapaUsuarios().catch(() => ({})),
      ]);
      setMap(users);

      let found = lista;
      if (!porDocumento) {
        const lower = v.toLowerCase();
        found = lista.filter((e) => {
          const u = users[e.id_usuario];
          const n = u ? nombreUsuario(u).toLowerCase() : "";
          return n.includes(lower) || e.numero_documento.includes(v) || e.cargo.toLowerCase().includes(lower);
        });
      }
      if (!found.length) setError("No se encontró ningún empleado.");
      else setEmp(found[0]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al buscar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <Breadcrumb items={[{ label: "Empleados", to: "/empleados" }, { label: "Ficha rápida" }]} />
      <div className="page-card">
        <h1 className="page-title">Ficha rápida de empleado</h1>
        <p className="page-subtitle" style={{ maxWidth: 640, lineHeight: 1.55 }}>
          <strong>¿Para qué sirve?</strong> Consultar en un vistazo los datos laborales
          (cargo, documento, teléfono, estado) de una persona. No es el formulario de
          alta ni el de edición: para modificar usa la lista → lápiz, o{" "}
          <Link to="/empleados">Lista de empleados</Link>.
        </p>
        {sesion && <p style={{ fontSize: 13, color: "#64748b" }}>Sesión actual: {sesion.nombre}{sesion.rol ? ` · ${sesion.rol}` : ""}</p>}
        <PerfilSearch value={q} loading={loading} onChange={setQ} onSearch={buscar} />
        {error && <p style={{ color: "#b00020", marginTop: 12 }}>{error}</p>}
        {emp && <PerfilCard empleado={emp} usuarios={map} />}
      </div>
    </AppShell>
  );
}
