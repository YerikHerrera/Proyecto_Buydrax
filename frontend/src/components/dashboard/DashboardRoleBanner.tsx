import { etiquetaRol } from '../../services/session';

type Props = {
  admin: boolean;
  nombre?: string | null;
  rol?: string | null;
  supervisor: boolean;
  contador: boolean;
  empleado: boolean;
};

export default function DashboardRoleBanner({
  admin,
  nombre,
  rol,
  supervisor,
  contador,
  empleado
}: Props) {
  return (
    <div
      style={{
        marginBottom: 16,
        padding: '12px 16px',
        borderRadius: 12,
        background: admin ? 'linear-gradient(90deg, #fffbeb, #fef3c7)' : '#fff7ed',
        border: `1px solid ${admin ? '#fbbf24' : '#fed7aa'}`,
        fontSize: 14,
        color: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap'
      }}
    >
      {admin ? (
        <>
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 0.8,
              color: '#78350f',
              background: 'linear-gradient(135deg, #fde68a, #f59e0b)',
              padding: '4px 10px',
              borderRadius: 999,
              border: '1px solid #d97706'
            }}
          >
            ADMIN
          </span>
          <span>
            Sesión <strong>ADMIN_RRHH</strong> — acceso completo de gestión.
          </span>
        </>
      ) : (
        <>
          <span>
            Hola <strong>{nombre || 'usuario'}</strong>
            {rol ? ` (${etiquetaRol(rol as any)})` : ''}.
          </span>
          {supervisor &&
            ' Puedes consultar personal de tu ámbito, validar asistencia y gestionar turnos/proyectos.'}
          {contador && ' Acceso a nómina, liquidaciones y reportes financieros.'}
          {empleado && ' Portal del empleado: consulta tus pagos y solicitudes.'}
        </>
      )}
    </div>
  );
}
