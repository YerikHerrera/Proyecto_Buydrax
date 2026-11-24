import Pagination from "../ui/Pagination";
import { useClientPagination } from "../../hooks/useClientPagination";

const ROWS = [
  { nomina: "16–31 ago 2026", estado: "VALIDADO", salud: 18200000, pension: 21400000, arl: 4100000 },
  { nomina: "01–15 sep 2026", estado: "PENDIENTE", salud: 0, pension: 0, arl: 0 },
];

const money = (n: number) =>
  n
    ? n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })
    : "—";

export default function PilaTable() {
  const { filas, pagina, totalPaginas, total, onAnterior, onSiguiente } =
    useClientPagination(ROWS, 8);

  return (
    <>
      <div
        className="nomina-table-wrap"
        style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden" }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", background: "#f8fafc" }}>
              {["Nómina", "Estado", "Salud", "Pensión", "ARL"].map((h) => (
                <th key={h} style={{ padding: 12 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((r) => (
              <tr key={r.nomina} style={{ borderTop: "1px solid #f1f5f9" }}>
                <td style={{ padding: 12 }}>{r.nomina}</td>
                <td style={{ padding: 12 }}>{r.estado}</td>
                <td style={{ padding: 12 }}>{money(r.salud)}</td>
                <td style={{ padding: 12 }}>{money(r.pension)}</td>
                <td style={{ padding: 12 }}>{money(r.arl)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        pagina={pagina}
        totalPaginas={totalPaginas}
        total={total}
        etiqueta="periodos PILA"
        onAnterior={onAnterior}
        onSiguiente={onSiguiente}
      />
    </>
  );
}
