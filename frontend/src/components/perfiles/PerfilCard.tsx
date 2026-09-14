import { Link } from "react-router-dom";
import type { Empleado } from "../../services/empleadosService";
import { nombreUsuario, type UsuarioPublic } from "../../services/usuariosService";

type Props = { empleado: Empleado; usuarios: Record<number, UsuarioPublic> };

export default function PerfilCard({ empleado, usuarios }: Props) {
  const usuario = usuarios[empleado.id_usuario];
  const nombre = usuario ? nombreUsuario(usuario) : `${empleado.cargo} · ${empleado.numero_documento}`;

  return (
    <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, padding: 16, background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0" }}>
      <div><span style={{ fontSize: 11, color: "#64748b" }}>Nombre</span><div style={{ fontWeight: 700 }}>{nombre}</div></div>
      <div><span style={{ fontSize: 11, color: "#64748b" }}>Documento</span><div style={{ fontWeight: 600 }}>{empleado.tipo_documento} {empleado.numero_documento}</div></div>
      <div><span style={{ fontSize: 11, color: "#64748b" }}>Cargo</span><div style={{ fontWeight: 600 }}>{empleado.cargo}</div></div>
      <div><span style={{ fontSize: 11, color: "#64748b" }}>Teléfono</span><div style={{ fontWeight: 600 }}>{empleado.telefono}</div></div>
      <div><span style={{ fontSize: 11, color: "#64748b" }}>Ciudad</span><div style={{ fontWeight: 600 }}>{empleado.ciudad}</div></div>
      <div><span style={{ fontSize: 11, color: "#64748b" }}>Estado</span><div style={{ fontWeight: 600 }}>{empleado.estado_laboral}</div></div>
      <div style={{ gridColumn: "1 / -1" }}>
        <Link to={`/empleados/editar/${empleado.id_empleado}`} className="agregar-btn-secundario" style={{ textDecoration: "none", display: "inline-block" }}>
          Editar este empleado
        </Link>
      </div>
    </div>
  );
}
