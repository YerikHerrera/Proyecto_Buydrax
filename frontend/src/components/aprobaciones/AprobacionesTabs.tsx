export type AprobacionTab = 'he' | 'turnos' | 'asistencias';

export default function AprobacionesTabs({
  tab,
  setTab,
  onActualizar,
}: {
  tab: AprobacionTab;
  setTab: (t: AprobacionTab) => void;
  onActualizar: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        margin: '16px 0',
      }}
    >
      {(
        [
          ['he', 'Horas extras'],
          ['turnos', 'Turnos'],
          ['asistencias', 'Asistencias'],
        ] as const
      ).map(([k, label]) => (
        <button
          key={k}
          type="button"
          className={
            tab === k
              ? 'agregar-btn-primario'
              : 'agregar-btn-secundario'
          }
          onClick={() => setTab(k)}
        >
          {label}
        </button>
      ))}
      <button
        type="button"
        className="agregar-btn-secundario"
        onClick={onActualizar}
      >
        Actualizar
      </button>
    </div>
  );
}
