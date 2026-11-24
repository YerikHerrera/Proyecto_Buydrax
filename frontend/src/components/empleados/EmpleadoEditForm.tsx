const CARGOS = [
  "Ayudante de obra",
  "Oficial de construcción",
  "Operario",
  "Maestro de obra",
  "Electricista",
  "Plomero",
  "Ingeniero civil",
  "Arquitecto",
  "Supervisor de obra",
  "Auxiliar administrativo",
];
const FORMAS = ["TRANSFERENCIA", "EFECTIVO", "CHEQUE"];
const ESTADOS = ["ACTIVO", "INCAPACITADO", "RETIRADO"];
const TIPOS_DOC = ["CC", "CE", "TI", "PAS"];
const BANCOS = [
  "Bancolombia",
  "Banco de Bogotá",
  "Davivienda",
  "BBVA",
  "Banco Popular",
  "Nequi",
];

export interface EmpleadoEditFormProps {
  tipoDocumento: string;
  setTipoDocumento: (v: string) => void;
  numeroDocumento: string;
  setNumeroDocumento: (v: string) => void;
  fechaNacimiento: string;
  setFechaNacimiento: (v: string) => void;
  calle: string;
  setCalle: (v: string) => void;
  barrio: string;
  setBarrio: (v: string) => void;
  ciudad: string;
  setCiudad: (v: string) => void;
  telefono: string;
  setTelefono: (v: string) => void;
  correoPersonal: string;
  setCorreoPersonal: (v: string) => void;
  cargo: string;
  setCargo: (v: string) => void;
  fechaIngreso: string;
  setFechaIngreso: (v: string) => void;
  salario: string;
  setSalario: (v: string) => void;
  formaPago: string;
  setFormaPago: (v: string) => void;
  banco: string;
  setBanco: (v: string) => void;
  numeroCuenta: string;
  setNumeroCuenta: (v: string) => void;
  estadoLaboral: string;
  setEstadoLaboral: (v: string) => void;
  idSupervisor: string;
  setIdSupervisor: (v: string) => void;
}

export default function EmpleadoEditForm(p: EmpleadoEditFormProps) {
  return (
    <div className="agregar-form" style={{ marginTop: 16 }}>
      <div>
        <label className="agregar-label">Tipo documento</label>
        <select
          className="agregar-input"
          value={p.tipoDocumento}
          onChange={(e) => p.setTipoDocumento(e.target.value)}
        >
          {TIPOS_DOC.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="agregar-label">Número documento *</label>
        <input
          className="agregar-input"
          value={p.numeroDocumento}
          onChange={(e) => p.setNumeroDocumento(e.target.value)}
        />
      </div>

      <div>
        <label className="agregar-label">Fecha nacimiento</label>
        <input
          className="agregar-input"
          type="date"
          value={p.fechaNacimiento}
          onChange={(e) => p.setFechaNacimiento(e.target.value)}
        />
      </div>

      <div>
        <label className="agregar-label">Teléfono *</label>
        <input
          className="agregar-input"
          value={p.telefono}
          onChange={(e) => p.setTelefono(e.target.value)}
        />
      </div>

      <div>
        <label className="agregar-label">Correo personal</label>
        <input
          className="agregar-input"
          type="email"
          value={p.correoPersonal}
          onChange={(e) => p.setCorreoPersonal(e.target.value)}
        />
      </div>

      <div>
        <label className="agregar-label">Calle</label>
        <input
          className="agregar-input"
          value={p.calle}
          onChange={(e) => p.setCalle(e.target.value)}
        />
      </div>

      <div>
        <label className="agregar-label">Barrio</label>
        <input
          className="agregar-input"
          value={p.barrio}
          onChange={(e) => p.setBarrio(e.target.value)}
        />
      </div>

      <div>
        <label className="agregar-label">Ciudad *</label>
        <input
          className="agregar-input"
          value={p.ciudad}
          onChange={(e) => p.setCiudad(e.target.value)}
        />
      </div>

      <div>
        <label className="agregar-label">Cargo *</label>
        <select
          className="agregar-input"
          value={p.cargo}
          onChange={(e) => p.setCargo(e.target.value)}
        >
          <option value="">Seleccionar</option>
          {CARGOS.map((c) => (
            <option key={c}>{c}</option>
          ))}
          {p.cargo && !CARGOS.includes(p.cargo) && (
            <option value={p.cargo}>{p.cargo}</option>
          )}
        </select>
      </div>

      <div>
        <label className="agregar-label">Fecha ingreso</label>
        <input
          className="agregar-input"
          type="date"
          value={p.fechaIngreso}
          onChange={(e) => p.setFechaIngreso(e.target.value)}
        />
      </div>

      <div>
        <label className="agregar-label">Salario *</label>
        <input
          className="agregar-input"
          type="number"
          min="0"
          step="0.01"
          value={p.salario}
          onChange={(e) => p.setSalario(e.target.value)}
        />
      </div>

      <div>
        <label className="agregar-label">Forma de pago</label>
        <select
          className="agregar-input"
          value={p.formaPago}
          onChange={(e) => p.setFormaPago(e.target.value)}
        >
          {FORMAS.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="agregar-label">Banco</label>
        <select
          className="agregar-input"
          value={p.banco}
          onChange={(e) => p.setBanco(e.target.value)}
        >
          <option value="">—</option>
          {BANCOS.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="agregar-label">Número de cuenta</label>
        <input
          className="agregar-input"
          value={p.numeroCuenta}
          onChange={(e) => p.setNumeroCuenta(e.target.value)}
        />
      </div>

      <div>
        <label className="agregar-label">Estado laboral</label>
        <select
          className="agregar-input"
          value={p.estadoLaboral}
          onChange={(e) => p.setEstadoLaboral(e.target.value)}
        >
          {ESTADOS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="agregar-label">ID Supervisor</label>
        <input
          className="agregar-input"
          type="number"
          value={p.idSupervisor}
          onChange={(e) => p.setIdSupervisor(e.target.value)}
        />
      </div>
    </div>
  );
}
