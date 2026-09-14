import { Link } from "react-router-dom";
import { nombreUsuario, type UsuarioPublic } from "../../services/usuariosService";

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
  "Analista de Recursos Humanos",
];

type Supervisor = {
  id_supervisor: number;
  numero_tarjeta_profesional: string;
};

export interface EmpleadoFormProps {
  idUsuario: string;
  setIdUsuario: (value: string) => void;
  tipoDocumento: string;
  setTipoDocumento: (value: string) => void;
  numeroDocumento: string;
  setNumeroDocumento: (value: string) => void;
  fechaNacimiento: string;
  setFechaNacimiento: (value: string) => void;
  calle: string;
  setCalle: (value: string) => void;
  barrio: string;
  setBarrio: (value: string) => void;
  ciudad: string;
  setCiudad: (value: string) => void;
  telefono: string;
  setTelefono: (value: string) => void;
  correoPersonal: string;
  setCorreoPersonal: (value: string) => void;
  cargo: string;
  setCargo: (value: string) => void;
  fechaIngreso: string;
  setFechaIngreso: (value: string) => void;
  salario: string;
  setSalario: (value: string) => void;
  formaPago: string;
  setFormaPago: (value: string) => void;
  banco: string;
  setBanco: (value: string) => void;
  numeroCuenta: string;
  setNumeroCuenta: (value: string) => void;
  idSupervisor: string;
  setIdSupervisor: (value: string) => void;
  eps: string;
  setEps: (value: string) => void;
  fondoPension: string;
  setFondoPension: (value: string) => void;
  arl: string;
  setArl: (value: string) => void;
  caja: string;
  setCaja: (value: string) => void;
  nivelArl: string;
  setNivelArl: (value: string) => void;
  usuarios: UsuarioPublic[];
  usuariosDisponibles: UsuarioPublic[];
  supervisores: Supervisor[];
  cargandoCatalogos: boolean;
}

export default function EmpleadoForm(props: EmpleadoFormProps) {
  const {
    idUsuario,
    setIdUsuario,
    tipoDocumento,
    setTipoDocumento,
    numeroDocumento,
    setNumeroDocumento,
    fechaNacimiento,
    setFechaNacimiento,
    calle,
    setCalle,
    barrio,
    setBarrio,
    ciudad,
    setCiudad,
    telefono,
    setTelefono,
    correoPersonal,
    setCorreoPersonal,
    cargo,
    setCargo,
    fechaIngreso,
    setFechaIngreso,
    salario,
    setSalario,
    formaPago,
    setFormaPago,
    banco,
    setBanco,
    numeroCuenta,
    setNumeroCuenta,
    idSupervisor,
    setIdSupervisor,
    eps,
    setEps,
    fondoPension,
    setFondoPension,
    arl,
    setArl,
    caja,
    setCaja,
    nivelArl,
    setNivelArl,
    usuariosDisponibles,
    supervisores,
    cargandoCatalogos,
  } = props;

  return (
    <div className="agregar-form">
      <div style={{ gridColumn: "1 / -1" }}>
        <label className="agregar-label">Usuario del sistema *</label>
        <select
          className="agregar-input"
          value={idUsuario}
          onChange={(e) => setIdUsuario(e.target.value)}
          disabled={cargandoCatalogos}
        >
          <option value="">Seleccionar persona (nombre y correo)</option>
          {usuariosDisponibles.map((u) => (
            <option key={u.id_usuario} value={u.id_usuario}>
              {nombreUsuario(u)} — {u.correo}
            </option>
          ))}
        </select>

        {!cargandoCatalogos && usuariosDisponibles.length === 0 && (
          <p style={{ color: "#b45309", fontSize: 13, marginTop: 6 }}>
            No hay usuarios libres.{" "}
            <Link to="/empleados/registrar">
              Crear cuenta primero (paso 1)
            </Link>
          </p>
        )}
      </div>

      <div>
        <label className="agregar-label">Supervisor (opcional)</label>
        <select
          className="agregar-input"
          value={idSupervisor}
          onChange={(e) => setIdSupervisor(e.target.value)}
        >
          <option value="">Sin supervisor</option>
          {supervisores.map((s) => (
            <option key={s.id_supervisor} value={s.id_supervisor}>
              Supervisor #{s.id_supervisor} — TP {s.numero_tarjeta_profesional}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="agregar-label">Tipo documento *</label>
        <select
          className="agregar-input"
          value={tipoDocumento}
          onChange={(e) => setTipoDocumento(e.target.value)}
        >
          {["CC", "CE", "TI", "PAS"].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="agregar-label">Número documento *</label>
        <input
          className="agregar-input"
          value={numeroDocumento}
          onChange={(e) => setNumeroDocumento(e.target.value)}
        />
      </div>

      <div>
        <label className="agregar-label">Fecha nacimiento *</label>
        <input
          className="agregar-input"
          type="date"
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
        />
      </div>

      <div>
        <label className="agregar-label">Teléfono *</label>
        <input
          className="agregar-input"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
      </div>

      <div>
        <label className="agregar-label">Correo personal</label>
        <input
          className="agregar-input"
          type="email"
          value={correoPersonal}
          onChange={(e) => setCorreoPersonal(e.target.value)}
        />
      </div>

      <div>
        <label className="agregar-label">Calle *</label>
        <input
          className="agregar-input"
          value={calle}
          onChange={(e) => setCalle(e.target.value)}
        />
      </div>

      <div>
        <label className="agregar-label">Barrio</label>
        <input
          className="agregar-input"
          value={barrio}
          onChange={(e) => setBarrio(e.target.value)}
        />
      </div>

      <div>
        <label className="agregar-label">Ciudad *</label>
        <input
          className="agregar-input"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
        />
      </div>

      <div>
        <label className="agregar-label">Cargo *</label>
        <select
          className="agregar-input"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
        >
          <option value="">Seleccionar cargo</option>
          {CARGOS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="agregar-label">Fecha ingreso *</label>
        <input
          className="agregar-input"
          type="date"
          value={fechaIngreso}
          onChange={(e) => setFechaIngreso(e.target.value)}
        />
      </div>

      <div>
        <label className="agregar-label">Salario *</label>
        <input
          className="agregar-input"
          type="number"
          min="0"
          step="0.01"
          value={salario}
          onChange={(e) => setSalario(e.target.value)}
        />
      </div>

      <div>
        <label className="agregar-label">Forma de pago *</label>
        <select
          className="agregar-input"
          value={formaPago}
          onChange={(e) => setFormaPago(e.target.value)}
        >
          <option value="TRANSFERENCIA">Transferencia</option>
          <option value="EFECTIVO">Efectivo</option>
          <option value="CHEQUE">Cheque</option>
        </select>
      </div>

      <div>
        <label className="agregar-label">Banco</label>
        <select
          className="agregar-input"
          value={banco}
          onChange={(e) => setBanco(e.target.value)}
        >
          <option value="">Seleccionar</option>
          <option value="Bancolombia">Bancolombia</option>
          <option value="Banco de Bogotá">Banco de Bogotá</option>
          <option value="Davivienda">Davivienda</option>
          <option value="BBVA">BBVA</option>
          <option value="Nequi">Nequi</option>
        </select>
      </div>

      <div>
        <label className="agregar-label">Número de cuenta</label>
        <input
          className="agregar-input"
          value={numeroCuenta}
          onChange={(e) => setNumeroCuenta(e.target.value)}
        />
      </div>

      <div>
        <label className="agregar-label">EPS</label>
        <select
          className="agregar-input"
          value={eps}
          onChange={(e) => setEps(e.target.value)}
        >
          <option>Nueva EPS</option>
          <option>Sura</option>
          <option>Sanitas</option>
          <option>Compensar</option>
        </select>
      </div>

      <div>
        <label className="agregar-label">Fondo pensión</label>
        <select
          className="agregar-input"
          value={fondoPension}
          onChange={(e) => setFondoPension(e.target.value)}
        >
          <option>Porvenir</option>
          <option>Protección</option>
          <option>Colpensiones</option>
        </select>
      </div>

      <div>
        <label className="agregar-label">ARL</label>
        <select
          className="agregar-input"
          value={arl}
          onChange={(e) => setArl(e.target.value)}
        >
          <option>Positiva ARL</option>
          <option>Sura ARL</option>
          <option>Colmena ARL</option>
        </select>
      </div>

      <div>
        <label className="agregar-label">Caja compensación</label>
        <select
          className="agregar-input"
          value={caja}
          onChange={(e) => setCaja(e.target.value)}
        >
          <option>Compensar</option>
          <option>Cafam</option>
          <option>Colsubsidio</option>
        </select>
      </div>

      <div>
        <label className="agregar-label">Nivel riesgo ARL</label>
        <select
          className="agregar-input"
          value={nivelArl}
          onChange={(e) => setNivelArl(e.target.value)}
        >
          {[1, 2, 3, 4, 5].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
