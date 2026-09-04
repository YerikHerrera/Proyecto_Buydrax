import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import { listarEmpleados, type Empleado } from "../services/empleadosService";
import { listarUsuarios, nombreUsuario, type UsuarioPublic } from "../services/usuariosService";
import "../styles/BuscarEmpleado.css";

function nombreCompleto(e: Empleado, map?: Record<number, UsuarioPublic>) {
  if (map && map[e.id_usuario]) return nombreUsuario(map[e.id_usuario]);
  const n = (e as any).nombres || (e as any).nombre || "";
  const a = (e as any).apellidos || "";
  return `${n} ${a}`.trim() || `Doc. ${e.numero_documento}`;
}

export default function BuscarEmpleado() {
  const [searchParams] = useSearchParams();
  const [busqueda, setBusqueda] = useState(searchParams.get("nombre") || "");
  const [resultado, setResultado] = useState<Empleado | null>(null);
  const [sinResultado, setSinResultado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usuariosMap, setUsuariosMap] = useState<Record<number, UsuarioPublic>>({});

  const ejecutarBusqueda = async (texto: string) => {
    const valor = texto.trim();
    if (!valor) return;
    try {
      setLoading(true);
      setError("");
      setSinResultado(false);
      setResultado(null);

      // Buscar por documento si parece numérico; si no, listar y filtrar en cliente
      const soloDigitos = /^\d+$/.test(valor);
      let lista: Empleado[] = [];
      if (soloDigitos) {
        lista = await listarEmpleados({ documento: valor });
      } else {
        lista = await listarEmpleados();
        const lower = valor.toLowerCase();
        lista = lista.filter((e) => {
          const full = nombreCompleto(e, usuariosMap).toLowerCase();
          const cargo = (e.cargo || "").toLowerCase();
          const doc = (e.numero_documento || "").toLowerCase();
          return full.includes(lower) || cargo.includes(lower) || doc.includes(valor);
        });
      }

      if (!lista.length) {
        setSinResultado(true);
        setResultado(null);
      } else {
        setResultado(lista[0]);
        setSinResultado(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al buscar");
      setResultado(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listarUsuarios({ limit: 200 }).then((users) => {
      const map: Record<number, UsuarioPublic> = {};
      for (const u of users) map[u.id_usuario] = u;
      setUsuariosMap(map);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const consulta = searchParams.get("nombre") || "";
    if (consulta.trim()) {
      setBusqueda(consulta);
      void ejecutarBusqueda(consulta);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const buscar = () => {
    void ejecutarBusqueda(busqueda);
  };

  return (
    <AppShell>
      <Breadcrumb items={[{ label: "Empleados", to: "/empleados" }, { label: "Buscar" }]} />

          <div className="buscar-stepper">
            <div className={`buscar-step ${!resultado ? "activo" : "completado"}`}>
              <span>{resultado ? <i className="bi bi-check"></i> : 1}</span>
              <b>Búsqueda</b>
            </div>
            <div className="buscar-linea"></div>
            <div className={`buscar-step ${resultado ? "activo" : ""}`}>
              <span>2</span>
              <b>Empleado encontrado</b>
            </div>
            <div className="buscar-linea"></div>
            <div className="buscar-step">
              <span>3</span>
              <b>Resultados</b>
            </div>
          </div>

          {!resultado && (
            <section className="buscar-card">
              <div className="buscar-title">
                <div className="buscar-icono">
                  <i className="bi bi-search"></i>
                </div>
                <div>
                  <h1>Buscar empleado</h1>
                  <p>Busca por nombre o número de documento (datos reales de la API).</p>
                </div>
              </div>
              <label>
                Nombre o número de documento
                <div className="buscar-input">
                  <i className="bi bi-person-search"></i>
                  <input
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && buscar()}
                    placeholder="Ej. Claudia Cardenas o 1024511530"
                  />
                </div>
              </label>
              {error && (
                <div className="buscar-error">
                  <i className="bi bi-exclamation-circle-fill"></i> {error}
                </div>
              )}
              {sinResultado && (
                <div className="buscar-error">
                  <i className="bi bi-exclamation-circle-fill"></i> No se encontró
                  ningún empleado con ese criterio.
                </div>
              )}
              <button className="buscar-btn" onClick={buscar} disabled={loading}>
                <i className="bi bi-search"></i>{" "}
                {loading ? "Buscando..." : "Buscar empleado"}
              </button>
            </section>
          )}

          {resultado && (
            <section className="buscar-resultado-card">
              <div className="buscar-result-header">
                <div>
                  <p className="buscar-eyebrow">RESULTADO DE BÚSQUEDA</p>
                  <h1>Empleado encontrado</h1>
                  <p>Datos provenientes de la base de datos vía API.</p>
                </div>
                <button
                  className="buscar-volver"
                  onClick={() => {
                    setResultado(null);
                    setSinResultado(false);
                  }}
                >
                  Nueva búsqueda
                </button>
              </div>
              <div className="buscar-persona">
                <div
                  className="buscar-avatar"
                  style={{ backgroundColor: "#1E3A8A20", color: "#1E3A8A" }}
                >
                  {nombreCompleto(resultado, usuariosMap)
                    .split(" ")
                    .slice(0, 2)
                    .map((p) => p[0] || "")
                    .join("")}
                </div>
                <div>
                  <h2>{nombreCompleto(resultado, usuariosMap)}</h2>
                  <p>{resultado.cargo}</p>
                  <span>
                    <i className="bi bi-card-text"></i> {resultado.tipo_documento}{" "}
                    {resultado.numero_documento}
                  </span>
                </div>
              </div>
              <div className="buscar-datos">
                <div>
                  <span>Teléfono</span>
                  <strong>{resultado.telefono || "—"}</strong>
                </div>
                <div>
                  <span>Ciudad</span>
                  <strong>{(resultado as any).ciudad || "—"}</strong>
                </div>
                <div>
                  <span>Estado laboral</span>
                  <strong className="buscar-activo">
                    {resultado.estado_laboral || "ACTIVO"}
                  </strong>
                </div>
                <div>
                  <span>Salario</span>
                  <strong>
                    {resultado.salario != null
                      ? Number(resultado.salario).toLocaleString("es-CO", {
                          style: "currency",
                          currency: "COP",
                          maximumFractionDigits: 0,
                        })
                      : "—"}
                  </strong>
                </div>
              </div>
            </section>
          )}
    </AppShell>
  );
}
