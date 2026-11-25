import { dominioDeCorreo, sugerirCorreo } from "../../utils/dominio";
import { leerSesion } from "../../services/session";

type Props = {
  nombres: string;
  apellidos: string;
  correo: string;
  contrasena: string;
  rol: string;
  areaResponsable: string;
  numeroTarjeta: string;
  cuadrilla: string;
  areaNomina: string;
  loading: boolean;
  onNombresChange: (value: string) => void;
  onApellidosChange: (value: string) => void;
  onCorreoChange: (value: string) => void;
  onContrasenaChange: (value: string) => void;
  onRolChange: (value: string) => void;
  onAreaResponsableChange: (value: string) => void;
  onNumeroTarjetaChange: (value: string) => void;
  onCuadrillaChange: (value: string) => void;
  onAreaNominaChange: (value: string) => void;
  onSubmit: () => void;
};

const ROLES = [
  { value: "EMPLEADO", label: "Empleado" },
  { value: "SUPERVISOR", label: "Supervisor" },
  { value: "CONTADOR", label: "Contador" },
  { value: "ADMIN_RRHH", label: "Administrador de RRHH (todos los permisos)" },
];

export default function RegistrarUsuarioForm(props: Props) {
  return (
    <div className="agregar-form" style={{ marginTop: 16 }}>
      <div>
        <label className="agregar-label">Nombres *</label>
        <input
          className="agregar-input"
          value={props.nombres}
          onChange={(e) => props.onNombresChange(e.target.value)}
        />
      </div>
      <div>
        <label className="agregar-label">Apellidos *</label>
        <input
          className="agregar-input"
          value={props.apellidos}
          onChange={(e) => props.onApellidosChange(e.target.value)}
        />
      </div>
      <div>
        <label className="agregar-label">Correo corporativo *</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="agregar-input"
            type="email"
            value={props.correo}
            onChange={(e) => props.onCorreoChange(e.target.value)}
            style={{ flex: 1 }}
          />
          <button
            type="button"
            className="agregar-btn-secundario"
            style={{ whiteSpace: "nowrap", height: 42 }}
            onClick={() => {
              const dom =
                dominioDeCorreo(leerSesion()?.email || null) ||
                dominioDeCorreo(props.correo);
              const s = sugerirCorreo(props.nombres, props.apellidos, dom);
              if (s) props.onCorreoChange(s);
            }}
          >
            Sugerir
          </button>
        </div>
        <small className="field-hint">
          Usa el dominio de tu empresa (ej. @construandes.com.co). @gmail.com crea otro
          “tenant” distinto al filtrar por dominio.
        </small>
      </div>
      <div>
        <label className="agregar-label">Contraseña temporal *</label>
        <input
          className="agregar-input"
          type="password"
          value={props.contrasena}
          onChange={(e) => props.onContrasenaChange(e.target.value)}
          placeholder="Mínimo 8 caracteres"
        />
      </div>
      <div style={{ gridColumn: "1 / -1" }}>
        <label className="agregar-label">Rol del sistema *</label>
        <select
          className="agregar-input"
          value={props.rol}
          onChange={(e) => props.onRolChange(e.target.value)}
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {props.rol === "ADMIN_RRHH" && (
        <div style={{ gridColumn: "1 / -1" }}>
          <label className="agregar-label">Área responsable *</label>
          <input
            className="agregar-input"
            value={props.areaResponsable}
            onChange={(e) => props.onAreaResponsableChange(e.target.value)}
            placeholder="Ej. Gestión humana, Nómina, Operaciones"
          />
          <small className="field-hint">Obligatorio para ADMIN_RRHH.</small>
        </div>
      )}

      {props.rol === "SUPERVISOR" && (
        <>
          <div>
            <label className="agregar-label">Nº tarjeta profesional *</label>
            <input
              className="agregar-input"
              value={props.numeroTarjeta}
              onChange={(e) => props.onNumeroTarjetaChange(e.target.value)}
            />
          </div>
          <div>
            <label className="agregar-label">Cuadrilla asignada</label>
            <input
              className="agregar-input"
              value={props.cuadrilla}
              onChange={(e) => props.onCuadrillaChange(e.target.value)}
              placeholder="Opcional"
            />
          </div>
        </>
      )}

      {props.rol === "CONTADOR" && (
        <>
          <div>
            <label className="agregar-label">Nº tarjeta profesional *</label>
            <input
              className="agregar-input"
              value={props.numeroTarjeta}
              onChange={(e) => props.onNumeroTarjetaChange(e.target.value)}
            />
          </div>
          <div>
            <label className="agregar-label">Área de nómina *</label>
            <input
              className="agregar-input"
              value={props.areaNomina}
              onChange={(e) => props.onAreaNominaChange(e.target.value)}
              placeholder="Ej. Nómina operativa"
            />
          </div>
        </>
      )}

      <div className="agregar-botones" style={{ gridColumn: "1 / -1", marginTop: 4 }}>
        <button
          className="agregar-btn-primario"
          type="button"
          onClick={props.onSubmit}
          disabled={props.loading}
        >
          {props.loading ? "Creando…" : "Crear cuenta y continuar →"}
        </button>
      </div>
    </div>
  );
}
