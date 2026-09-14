import type { CSSProperties } from "react";
import type { Empleado } from "../../services/empleadosService";

const thStyle: CSSProperties = {
  padding: "12px 16px",
  textAlign: "left",
  fontSize: "12.5px",
  fontWeight: 600,
  color: "#64748B",
  whiteSpace: "nowrap",
};

const celdaStyle: CSSProperties = {
  padding: "14px 16px",
  fontSize: "13.5px",
  color: "#475569",
};

const btnPagStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "9px 18px",
  borderRadius: "8px",
  border: "1.5px solid #E2E8F0",
  backgroundColor: "#fff",
  color: "#1E3A8A",
  fontSize: "13px",
  fontWeight: 600,
};

export interface EmpleadoTableProps {
  filas: Empleado[];
  paginaActual: number;
  totalPaginas: number;
  totalFiltrados: number;
  nombreDe: (e: Empleado) => string;
  onRetirar: (e: Empleado) => void;
  onEditar: (e: Empleado) => void;
  onAnterior: () => void;
  onSiguiente: () => void;
}

function iniciales(nombre: string) {
  const p = nombre.trim().split(" ");

  return p.length === 1
    ? (p[0][0] || "?").toUpperCase()
    : ((p[0][0] || "") + (p[1][0] || "")).toUpperCase();
}

export default function EmpleadoTable({
  filas,
  paginaActual,
  totalPaginas,
  totalFiltrados,
  nombreDe,
  onRetirar,
  onEditar,
  onAnterior,
  onSiguiente,
}: EmpleadoTableProps) {
  return (
    <>
      <div className="tabla-wrapper">
        <table>
          <thead>
            <tr style={{ borderBottom: "2px solid #F1F5F9" }}>
              <th style={thStyle}>Nombre empleado</th>
              <th style={thStyle} className="col-tipo-doc">
                Tipo de documento
              </th>
              <th style={thStyle} className="col-num-doc">
                Número de documento
              </th>
              <th style={thStyle}>Cargo</th>
              <th style={thStyle} className="col-telefono">
                Teléfono
              </th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filas.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#94A3B8",
                    fontSize: "14px",
                  }}
                >
                  <i
                    className="bi bi-search"
                    style={{
                      fontSize: "24px",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  />
                  No se encontraron empleados con esos filtros.
                </td>
              </tr>
            ) : (
              filas.map((emp, idx) => (
                <tr
                  key={emp.id_empleado}
                  style={{
                    borderBottom: "1px solid #F1F5F9",
                    backgroundColor: idx % 2 === 0 ? "#fff" : "#FAFBFC",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#F0F7FF")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      idx % 2 === 0 ? "#fff" : "#FAFBFC")
                  }
                >
                  <td style={celdaStyle}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          backgroundColor: "#1E3A8A",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "12px",
                          flexShrink: 0,
                        }}
                      >
                        {iniciales(nombreDe(emp))}
                      </div>
                      <span
                        style={{
                          fontSize: "13.5px",
                          fontWeight: 500,
                          color: "#0F172A",
                          minWidth: 0,
                          wordBreak: "break-word",
                        }}
                      >
                        {nombreDe(emp)}
                      </span>
                    </div>
                  </td>

                  <td style={celdaStyle} className="col-tipo-doc">
                    {emp.tipo_documento}
                  </td>

                  <td style={celdaStyle} className="col-num-doc">
                    {emp.numero_documento}
                  </td>

                  <td style={celdaStyle}>
                    <span
                      style={{
                        backgroundColor: "#F0F7FF",
                        color: "#1E3A8A",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {emp.cargo}
                    </span>
                  </td>

                  <td style={celdaStyle} className="col-telefono">
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#475569",
                      }}
                    >
                      <i
                        className="bi bi-telephone-fill"
                        style={{ color: "#94A3B8", fontSize: "12px" }}
                      />
                      {emp.telefono}
                    </span>
                  </td>

                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        title="Retirar empleado"
                        disabled={emp.estado_laboral === "RETIRADO"}
                        onClick={() => onRetirar(emp)}
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "8px",
                          border: "1.5px solid #FEE2E2",
                          backgroundColor: "#FFF5F5",
                          color: "#EF4444",
                          cursor:
                            emp.estado_laboral === "RETIRADO"
                              ? "not-allowed"
                              : "pointer",
                          opacity: emp.estado_laboral === "RETIRADO" ? 0.4 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                        }}
                      >
                        <i className="bi bi-trash3-fill" />
                      </button>

                      <button
                        onClick={() => onEditar(emp)}
                        title="Editar"
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "8px",
                          border: "none",
                          backgroundColor: "#F97316",
                          color: "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                        }}
                      >
                        <i className="bi bi-pencil-fill" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="lista-paginacion">
        <button
          onClick={onAnterior}
          disabled={paginaActual === 1}
          style={{
            ...btnPagStyle,
            opacity: paginaActual === 1 ? 0.4 : 1,
            cursor: paginaActual === 1 ? "not-allowed" : "pointer",
          }}
        >
          <i className="bi bi-arrow-left" /> Anterior
        </button>

        <span
          style={{
            fontSize: "13px",
            color: "#64748B",
            textAlign: "center",
          }}
        >
          Página <strong style={{ color: "#0F172A" }}>{paginaActual}</strong> de{" "}
          <strong style={{ color: "#0F172A" }}>{totalPaginas}</strong> ·{" "}
          {totalFiltrados} empleado{totalFiltrados !== 1 ? "s" : ""}
        </span>

        <button
          onClick={onSiguiente}
          disabled={paginaActual === totalPaginas}
          style={{
            ...btnPagStyle,
            backgroundColor: "#1E3A8A",
            color: "#fff",
            border: "none",
            opacity: paginaActual === totalPaginas ? 0.4 : 1,
            cursor:
              paginaActual === totalPaginas ? "not-allowed" : "pointer",
          }}
        >
          Siguiente <i className="bi bi-arrow-right" />
        </button>
      </div>
    </>
  );
}
