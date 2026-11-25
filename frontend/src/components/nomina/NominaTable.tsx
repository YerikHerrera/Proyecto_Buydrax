import Pagination from "../ui/Pagination";
import { useClientPagination } from "../../hooks/useClientPagination";

export type NominaRow = {
  id_nomina: number;
  id_obra?: number | null;
  periodo_inicio: string;
  periodo_fin: string;
  tipo_nomina: string;
  estado_nomina: string;
  total_pagado?: number;
  cantidad_empleados?: number;
};

export default function NominaTable({
  rows,
  busyId,
  onVerDetalles,
  onCalcular,
  onAprobar,
  onPagar,
}: {
  rows: NominaRow[];
  busyId?: number | null;
  onVerDetalles?: (id: number) => void;
  onCalcular?: (id: number) => void;
  onAprobar?: (id: number) => void;
  onPagar?: (id: number) => void;
}) {
  const { filas, pagina, totalPaginas, total, onAnterior, onSiguiente } =
    useClientPagination(rows, 8);

  return (
    <>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
              {["ID", "Periodo", "Tipo", "Estado", "Empleados", "Total", "Acciones"].map((h) => (
                <th key={h} style={{ padding: 10 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>
                  No hay nóminas. Genera la primera desde el botón superior.
                </td>
              </tr>
            ) : (
              filas.map((n) => (
                <tr key={n.id_nomina} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: 10 }}>{n.id_nomina}</td>
                  <td style={{ padding: 10 }}>
                    {n.periodo_inicio} → {n.periodo_fin}
                  </td>
                  <td style={{ padding: 10 }}>{n.tipo_nomina}</td>
                  <td style={{ padding: 10 }}>
                    <span className={`badge-estado badge-${(n.estado_nomina || "").toLowerCase()}`}>
                      {n.estado_nomina}
                    </span>
                  </td>
                  <td style={{ padding: 10 }}>{n.cantidad_empleados ?? "—"}</td>
                  <td style={{ padding: 10 }}>
                    {n.total_pagado != null
                      ? Number(n.total_pagado).toLocaleString("es-CO", {
                          style: "currency",
                          currency: "COP",
                          maximumFractionDigits: 0,
                        })
                      : "—"}
                  </td>
                  <td style={{ padding: 10 }}>
                    <div className="table-actions">
                      {onVerDetalles && (
                        <button
                          type="button"
                          className="agregar-btn-secundario btn-sm"
                          onClick={() => onVerDetalles(n.id_nomina)}
                        >
                          Detalles
                        </button>
                      )}
                      {onCalcular && n.estado_nomina === "BORRADOR" && (
                        <button
                          type="button"
                          className="agregar-btn-secundario btn-sm"
                          disabled={busyId === n.id_nomina}
                          onClick={() => onCalcular(n.id_nomina)}
                        >
                          {busyId === n.id_nomina ? "…" : "Calcular"}
                        </button>
                      )}
                      {onAprobar && n.estado_nomina === "BORRADOR" && (
                        <button
                          type="button"
                          className="agregar-btn-primario btn-sm"
                          disabled={busyId === n.id_nomina}
                          onClick={() => onAprobar(n.id_nomina)}
                        >
                          Aprobar
                        </button>
                      )}
                      {onPagar && n.estado_nomina === "APROBADA" && (
                        <button
                          type="button"
                          className="agregar-btn-primario btn-sm"
                          disabled={busyId === n.id_nomina}
                          onClick={() => onPagar(n.id_nomina)}
                        >
                          Marcar pagada
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        pagina={pagina}
        totalPaginas={totalPaginas}
        total={total}
        etiqueta="nóminas"
        onAnterior={onAnterior}
        onSiguiente={onSiguiente}
      />
    </>
  );
}
