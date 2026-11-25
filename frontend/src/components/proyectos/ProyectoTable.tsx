import type { Proyecto } from "../../services/proyectosService";
import Pagination from "../ui/Pagination";
import { useClientPagination } from "../../hooks/useClientPagination";

interface Props {
  proyectos: Proyecto[];
  onEditar: (proyecto: Proyecto) => void;
}

export default function ProyectoTable({ proyectos, onEditar }: Props) {
  const { filas, pagina, totalPaginas, total, onAnterior, onSiguiente } =
    useClientPagination(proyectos, 8);

  return (
    <>
      <div style={{ overflowX: "auto", marginTop: 12 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
              {["Nombre", "Ubicación", "Supervisor", "Fechas", "Estado", ""].map((h) => (
                <th key={h || "acciones"} style={{ padding: 10 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((proyecto) => (
              <tr key={proyecto.id_proyecto} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: 10 }}>{proyecto.nombre}</td>
                <td style={{ padding: 10 }}>{proyecto.ubicacion_calle}</td>
                <td style={{ padding: 10 }}>#{proyecto.id_supervisor}</td>
                <td style={{ padding: 10 }}>
                  {proyecto.fecha_inicio} → {proyecto.fecha_fin}
                </td>
                <td style={{ padding: 10 }}>{proyecto.estado_proyecto}</td>
                <td style={{ padding: 10 }}>
                  <button
                    type="button"
                    className="agregar-btn-secundario"
                    onClick={() => onEditar(proyecto)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
            {filas.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 20, textAlign: "center", color: "#94a3b8" }}>
                  Sin proyectos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        pagina={pagina}
        totalPaginas={totalPaginas}
        total={total}
        etiqueta="proyectos"
        onAnterior={onAnterior}
        onSiguiente={onSiguiente}
      />
    </>
  );
}
