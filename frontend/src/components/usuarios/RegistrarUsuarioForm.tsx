type Props = {
  nombres: string; apellidos: string; correo: string; contrasena: string; loading: boolean;
  onNombresChange: (value: string) => void; onApellidosChange: (value: string) => void;
  onCorreoChange: (value: string) => void; onContrasenaChange: (value: string) => void;
  onSubmit: () => void;
};

export default function RegistrarUsuarioForm(props: Props) {
  return (
    <div className="agregar-form" style={{ marginTop: 16 }}>
      <div><label className="agregar-label">Nombres *</label><input className="agregar-input" value={props.nombres} onChange={(e) => props.onNombresChange(e.target.value)} /></div>
      <div><label className="agregar-label">Apellidos *</label><input className="agregar-input" value={props.apellidos} onChange={(e) => props.onApellidosChange(e.target.value)} /></div>
      <div><label className="agregar-label">Correo corporativo *</label><input className="agregar-input" type="email" value={props.correo} onChange={(e) => props.onCorreoChange(e.target.value)} /></div>
      <div>
        <label className="agregar-label">Contraseña temporal *</label>
        <input className="agregar-input" type="password" value={props.contrasena} onChange={(e) => props.onContrasenaChange(e.target.value)} placeholder="Mínimo 8 caracteres" />
      </div>
      <div className="agregar-botones" style={{ gridColumn: "1 / -1", marginTop: 4 }}>
        <button className="agregar-btn-primario" type="button" onClick={props.onSubmit} disabled={props.loading}>
          {props.loading ? "Creando…" : "Crear cuenta y continuar →"}
        </button>
      </div>
    </div>
  );
}
