import type { Empleado } from "../../services/empleadosService";
import { nombreUsuario, type UsuarioPublic } from "../../services/usuariosService";

type Props = {
  empleado: Empleado;
  usuarios: Record<number, UsuarioPublic>;
  onNewSearch: () => void;
};

function nombreCompleto(e: Empleado, map: Record<number, UsuarioPublic>) {
  if (map[e.id_usuario]) return nombreUsuario(map[e.id_usuario]);
  const n = (e as any).nombres || (e as any).nombre || "";
  const a = (e as any).apellidos || "";
  return `${n} ${a}`.trim() || `Doc. ${e.numero_documento}`;
}

export default function BuscarEmpleadoResult({ empleado, usuarios, onNewSearch }: Props) {
  const nombre = nombreCompleto(empleado, usuarios);
  const iniciales = nombre.split(" ").slice(0, 2).map((p) => p[0] || "").join("");

  return (
    <section className="buscar-resultado-card">
      <div className="buscar-result-header">
        <div>
          <p className="buscar-eyebrow">RESULTADO DE BÚSQUEDA</p>
          <h1>Empleado encontrado</h1>
          <p>Datos provenientes de la base de datos vía API.</p>
        </div>
        <button className="buscar-volver" onClick={onNewSearch}>Nueva búsqueda</button>
      </div>
      <div className="buscar-persona">
        <div className="buscar-avatar" style={{ backgroundColor: "#1E3A8A20", color: "#1E3A8A" }}>{iniciales}</div>
        <div>
          <h2>{nombre}</h2>
          <p>{empleado.cargo}</p>
          <span><i className="bi bi-card-text"></i> {empleado.tipo_documento} {empleado.numero_documento}</span>
        </div>
      </div>
      <div className="buscar-datos">
        <div><span>Teléfono</span><strong>{empleado.telefono || "—"}</strong></div>
        <div><span>Ciudad</span><strong>{(empleado as any).ciudad || "—"}</strong></div>
        <div><span>Estado laboral</span><strong className="buscar-activo">{empleado.estado_laboral || "ACTIVO"}</strong></div>
        <div>
          <span>Salario</span>
          <strong>
            {empleado.salario != null
              ? Number(empleado.salario).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })
              : "—"}
          </strong>
        </div>
      </div>
    </section>
  );
}
