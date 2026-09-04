import { useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import { listarEmpleados, type Empleado } from "../services/empleadosService";
import { mapaUsuarios, nombreUsuario, type UsuarioPublic } from "../services/usuariosService";
import { leerSesion } from "../services/session";

/**
 * Ficha rápida: consulta los datos laborales de un empleado
 * (o los tuyos si buscas tu documento). No sustituye "Editar empleado".
 */
export default function Perfiles() {
  const sesion = leerSesion();
  const [q, setQ] = useState("");
  const [emp, setEmp] = useState<Empleado | null>(null);
  const [map, setMap] = useState<Record<number, UsuarioPublic>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nombre = (e: Empleado) => {
    const u = map[e.id_usuario];
    return u ? nombreUsuario(u) : `${e.cargo} · ${e.numero_documento}`;
  };

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
      const [lista, users] = await Promise.all([
        /^\d+$/.test(v)
          ? listarEmpleados({ documento: v })
          : listarEmpleados(),
        mapaUsuarios().catch(() => ({})),
      ]);
      setMap(users);
      let found = lista;
      if (!/^\d+$/.test(v)) {
        const lower = v.toLowerCase();
        found = lista.filter((e) => {
          const u = users[e.id_usuario];
          const n = u ? nombreUsuario(u).toLowerCase() : "";
          return (
            n.includes(lower) ||
            e.numero_documento.includes(v) ||
            e.cargo.toLowerCase().includes(lower)
          );
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
      <Breadcrumb
        items={[
          { label: "Empleados", to: "/empleados" },
          { label: "Ficha rápida" },
        ]}
      />
      <div className="page-card">
        <h1 className="page-title">Ficha rápida de empleado</h1>
        <p className="page-subtitle" style={{ maxWidth: 640, lineHeight: 1.55 }}>
          <strong>¿Para qué sirve?</strong> Consultar en un vistazo los datos laborales
          (cargo, documento, teléfono, estado) de una persona. No es el formulario de
          alta ni el de edición: para modificar usa la lista → lápiz, o{" "}
          <Link to="/empleados">Lista de empleados</Link>.
        </p>
        {sesion && (
          <p style={{ fontSize: 13, color: "#64748b" }}>
            Sesión actual: {sesion.nombre}
            {sesion.rol ? ` · ${sesion.rol}` : ""}
          </p>
        )}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
          <input
            className="agregar-input"
            style={{ flex: 1, minWidth: 220 }}
            placeholder="Nombre o documento"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscar()}
          />
          <button className="agregar-btn-primario" type="button" onClick={buscar} disabled={loading}>
            {loading ? "Buscando…" : "Buscar ficha"}
          </button>
        </div>
        {error && <p style={{ color: "#b00020", marginTop: 12 }}>{error}</p>}
        {emp && (
          <div
            style={{
              marginTop: 24,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
              gap: 14,
              padding: 16,
              background: "#f8fafc",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
            }}
          >
            <div>
              <span style={{ fontSize: 11, color: "#64748b" }}>Nombre</span>
              <div style={{ fontWeight: 700 }}>{nombre(emp)}</div>
            </div>
            <div>
              <span style={{ fontSize: 11, color: "#64748b" }}>Documento</span>
              <div style={{ fontWeight: 600 }}>
                {emp.tipo_documento} {emp.numero_documento}
              </div>
            </div>
            <div>
              <span style={{ fontSize: 11, color: "#64748b" }}>Cargo</span>
              <div style={{ fontWeight: 600 }}>{emp.cargo}</div>
            </div>
            <div>
              <span style={{ fontSize: 11, color: "#64748b" }}>Teléfono</span>
              <div style={{ fontWeight: 600 }}>{emp.telefono}</div>
            </div>
            <div>
              <span style={{ fontSize: 11, color: "#64748b" }}>Ciudad</span>
              <div style={{ fontWeight: 600 }}>{emp.ciudad}</div>
            </div>
            <div>
              <span style={{ fontSize: 11, color: "#64748b" }}>Estado</span>
              <div style={{ fontWeight: 600 }}>{emp.estado_laboral}</div>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <Link
                to={`/empleados/editar/${emp.id_empleado}`}
                className="agregar-btn-secundario"
                style={{ textDecoration: "none", display: "inline-block" }}
              >
                Editar este empleado
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
