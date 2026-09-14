const ROWS = [
  {
    nomina: '16–31 ago 2026',
    estado: 'VALIDADO',
    salud: 18200000,
    pension: 21400000,
    arl: 4100000
  },
  {
    nomina: '01–15 sep 2026',
    estado: 'PENDIENTE',
    salud: 0,
    pension: 0,
    arl: 0
  }
];

const money = (n: number) =>
  n
    ? n.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
      })
    : '—';

export default function PilaTable() {
  return (
    <div
      className="nomina-table-wrap"
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 14,
        overflow: 'hidden'
      }}
    >
      <table>
        <thead>
          <tr>
            <th>Nómina</th>
            <th>Salud</th>
            <th>Pensión</th>
            <th>ARL</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.nomina}>
              <td>{r.nomina}</td>
              <td>{money(r.salud)}</td>
              <td>{money(r.pension)}</td>
              <td>{money(r.arl)}</td>
              <td>
                <span
                  className="nomina-status"
                  style={
                    r.estado === 'PENDIENTE'
                      ? { background: '#ffedd5', color: '#c2410c' }
                      : undefined
                  }
                >
                  {r.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
