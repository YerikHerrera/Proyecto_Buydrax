import { useMemo, useState } from "react";
import Pagination from "../ui/Pagination";
import { useClientPagination } from "../../hooks/useClientPagination";

export type UsuarioRow = {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  correo: string;
  rol?: string | null;
  estado: boolean;
};

type Props = { rows: UsuarioRow[] };

export default function UsuariosTable({ rows }: Props) {
  const [q, setQ] = useState("");
  const filtrados = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (u) =>
        `${u.nombres} ${u.apellidos}`.toLowerCase().includes(s) ||
        u.correo.toLowerCase().includes(s) ||
        (u.rol || "").toLowerCase().includes(s)
    );
  }, [rows, q]);

  const { filas, pagina, totalPaginas, total, onAnterior, onSiguiente } =
    useClientPagination(filtrados, 8);

  return (
    <>
      <div style={{ marginTop: 12, marginBottom: 8, maxWidth: 360 }}>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar usuario, correo o rol…"
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1.5px solid #e2e8f0",
            fontSize: 13,
          }}
        />
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
              <th style={{ padding: 10 }}>Nombre</th>
              <th style={{ padding: 10 }}>Correo</th>
              <th style={{ padding: 10 }}>Rol</th>
              <th style={{ padding: 10 }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filas.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: 24, color: "#94a3b8", textAlign: "center" }}>
                  No hay usuarios o el endpoint no devolvió datos.
                </td>
              </tr>
            ) : (
              filas.map((u) => (
                <tr key={u.id_usuario} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: 10 }}>
                    {u.nombres} {u.apellidos}
                  </td>
                  <td style={{ padding: 10 }}>{u.correo}</td>
                  <td style={{ padding: 10 }}>{u.rol || "—"}</td>
                  <td style={{ padding: 10 }}>{u.estado ? "Activo" : "Inactivo"}</td>
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
        etiqueta="usuarios"
        onAnterior={onAnterior}
        onSiguiente={onSiguiente}
      />
    </>
  );
}
