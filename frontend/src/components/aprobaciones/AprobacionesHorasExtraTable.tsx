import Pagination from "../ui/Pagination";
import { useClientPagination } from "../../hooks/useClientPagination";

export type HoraExtra = {
  id_hora_extra: number;
  id_empleado: number;
  motivo: string;
  fecha_inicio: string;
  fecha_fin: string;
  cantidad_horas: number;
  tipo_hora: string;
  estado_he: string;
};

export default function AprobacionesHorasExtraTable({
  rows,
  nombres,
  onDecidir,
}: {
  rows: HoraExtra[];
  nombres: Record<number, string>;
  onDecidir: (id: number, estado: "APROBADA" | "RECHAZADA") => void;
}) {
  const { filas, pagina, totalPaginas, total, onAnterior, onSiguiente } =
    useClientPagination(rows, 8);

  return (
    <>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left", background: "#0f172a" }}>
              {["Empleado", "Motivo", "Horas", "Estado", "Acciones"].map((h) => (
                <th key={h} style={{ padding: "12px 14px", color: "#fff", fontWeight: 600 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((h) => (
              <tr key={h.id_hora_extra} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px 14px", verticalAlign: "middle" }}>
                  {nombres[h.id_empleado] || `#${h.id_empleado}`}
                </td>
                <td style={{ padding: "12px 14px", verticalAlign: "middle", maxWidth: 280 }}>
                  {h.motivo}
                </td>
                <td style={{ padding: "12px 14px", verticalAlign: "middle" }}>{h.cantidad_horas}</td>
                <td style={{ padding: "12px 14px", verticalAlign: "middle" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      background:
                        String(h.estado_he).toUpperCase() === "PENDIENTE"
                          ? "#fef3c7"
                          : String(h.estado_he).toUpperCase() === "APROBADA"
                            ? "#d1fae5"
                            : "#fee2e2",
                      color:
                        String(h.estado_he).toUpperCase() === "PENDIENTE"
                          ? "#92400e"
                          : String(h.estado_he).toUpperCase() === "APROBADA"
                            ? "#065f46"
                            : "#991b1b",
                    }}
                  >
                    {h.estado_he}
                  </span>
                </td>
                <td style={{ padding: "12px 14px", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                  {String(h.estado_he).toUpperCase() === "PENDIENTE" ? (
                    <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                      <button
                        type="button"
                        onClick={() => onDecidir(h.id_hora_extra, "APROBADA")}
                        style={{
                          padding: "7px 14px",
                          borderRadius: 8,
                          border: "none",
                          background: "#1e3a8a",
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: 12.5,
                          cursor: "pointer",
                        }}
                      >
                        Aprobar
                      </button>
                      <button
                        type="button"
                        onClick={() => onDecidir(h.id_hora_extra, "RECHAZADA")}
                        style={{
                          padding: "7px 14px",
                          borderRadius: 8,
                          border: "1.5px solid #e2e8f0",
                          background: "#fff",
                          color: "#b91c1c",
                          fontWeight: 600,
                          fontSize: 12.5,
                          cursor: "pointer",
                        }}
                      >
                        Rechazar
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: "#94a3b8", fontSize: 12 }}>—</span>
                  )}
                </td>
              </tr>
            ))}
            {!filas.length && (
              <tr>
                <td colSpan={5} style={{ padding: 16, color: "#94a3b8" }}>
                  Sin registros de horas extras
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
        etiqueta="horas extras"
        onAnterior={onAnterior}
        onSiguiente={onSiguiente}
      />
    </>
  );
}
