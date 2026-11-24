const ROWS = [
  { nombre: 'Obra Norte', pct: 72, valor: '$ 85.2M' },
  { nombre: 'Torre Centro', pct: 45, valor: '$ 210.0M' },
  { nombre: 'Ampliación Sur', pct: 88, valor: '$ 42.5M' },
  { nombre: 'Puente Oriente', pct: 100, valor: '$ 156.8M' }
];

export default function NominaProyectoPreview() {
  return (
    <>
      <h3 style={{ fontSize: 14, fontWeight: 700, margin: '22px 0 10px' }}>
        Costo estimado por obra (vista previa)
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ROWS.map((r) => (
          <div
            key={r.nombre}
            style={{ display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <span style={{ width: 130, fontSize: 13, fontWeight: 600 }}>
              {r.nombre}
            </span>

            <div
              style={{
                flex: 1,
                height: 12,
                background: '#f1f5f9',
                borderRadius: 999,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${r.pct}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #ea580c, #f59e0b)',
                  borderRadius: 999
                }}
              />
            </div>

            <span
              style={{
                width: 72,
                textAlign: 'right',
                fontSize: 12,
                fontWeight: 700,
                color: '#0f172a'
              }}
            >
              {r.valor}
            </span>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 10, fontSize: 12, color: '#94a3b8' }}>
        Los valores de barra son ilustrativos. Se calcularán con datos reales de
        nómina por proyecto.
      </p>
    </>
  );
}
