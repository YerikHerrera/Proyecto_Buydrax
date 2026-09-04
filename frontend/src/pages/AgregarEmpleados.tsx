import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import { crearEmpleado, guardarAfiliacion, listarEmpleados } from "../services/empleadosService";
import { listarSupervisores } from "../services/proyectosService";
import {
  listarUsuarios,
  nombreUsuario,
  type UsuarioPublic,
} from "../services/usuariosService";
import "../styles/AgregarEmpleados.css";

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

export default function AgregarEmpleados() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectUsuario = searchParams.get("id_usuario") || "";

  const [loading, setLoading] = useState(false);
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);
  const [error, setError] = useState("");
  const [usuarios, setUsuarios] = useState<UsuarioPublic[]>([]);
  const [supervisores, setSupervisores] = useState<
    { id_supervisor: number; numero_tarjeta_profesional: string }[]
  >([]);
  const [idsUsuarioConEmpleado, setIdsUsuarioConEmpleado] = useState<Set<number>>(
    new Set()
  );

  const [idUsuario, setIdUsuario] = useState(preselectUsuario);
  const [tipoDocumento, setTipoDocumento] = useState("CC");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [calle, setCalle] = useState("");
  const [barrio, setBarrio] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correoPersonal, setCorreoPersonal] = useState("");
  const [cargo, setCargo] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [salario, setSalario] = useState("");
  const [formaPago, setFormaPago] = useState("TRANSFERENCIA");
  const [banco, setBanco] = useState("");
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [idSupervisor, setIdSupervisor] = useState("");

  const [eps, setEps] = useState("Nueva EPS");
  const [fondoPension, setFondoPension] = useState("Porvenir");
  const [arl, setArl] = useState("Positiva ARL");
  const [caja, setCaja] = useState("Compensar");
  const [nivelArl, setNivelArl] = useState("1");

  useEffect(() => {
    if (preselectUsuario) setIdUsuario(preselectUsuario);
  }, [preselectUsuario]);

  useEffect(() => {
    (async () => {
      try {
        setCargandoCatalogos(true);
        setError("");
        const [us, sups, emps] = await Promise.all([
          listarUsuarios({ limit: 200 }),
          listarSupervisores().catch(() => []),
          listarEmpleados().catch(() => []),
        ]);
        setUsuarios(us);
        setSupervisores(Array.isArray(sups) ? sups : []);
        setIdsUsuarioConEmpleado(
          new Set((emps || []).map((e) => Number(e.id_usuario)).filter(Boolean))
        );
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudieron cargar usuarios. ¿Sesión ADMIN_RRHH?"
        );
      } finally {
        setCargandoCatalogos(false);
      }
    })();
  }, []);

  const usuariosDisponibles = useMemo(() => {
    return usuarios.filter((u) => {
      const id = Number(u.id_usuario);
      // permitir el preseleccionado aunque ya tuviera empleado (caso raro)
      if (preselectUsuario && String(id) === String(preselectUsuario)) return true;
      return !idsUsuarioConEmpleado.has(id);
    });
  }, [usuarios, idsUsuarioConEmpleado, preselectUsuario]);

  const usuarioSeleccionado = usuarios.find(
    (u) => String(u.id_usuario) === String(idUsuario)
  );

  const handleGuardar = async () => {
    setError("");
    const faltantes: string[] = [];
    if (!idUsuario) faltantes.push("Usuario del sistema");
    if (!numeroDocumento.trim()) faltantes.push("Número de documento");
    if (!fechaNacimiento) faltantes.push("Fecha de nacimiento");
    if (!calle.trim()) faltantes.push("Calle");
    if (!ciudad.trim()) faltantes.push("Ciudad");
    if (!telefono.trim()) faltantes.push("Teléfono");
    if (!cargo.trim()) faltantes.push("Cargo");
    if (!fechaIngreso) faltantes.push("Fecha de ingreso");
    if (!salario || Number(salario) < 0) faltantes.push("Salario");
    if (faltantes.length) {
      setError(`Faltan campos obligatorios: ${faltantes.join(", ")}`);
      return;
    }
    try {
      setLoading(true);
      const empleado = await crearEmpleado({
        id_usuario: Number(idUsuario),
        id_supervisor: idSupervisor ? Number(idSupervisor) : null,
        tipo_documento: tipoDocumento,
        numero_documento: numeroDocumento.trim(),
        fecha_nacimiento: fechaNacimiento,
        calle: calle.trim(),
        barrio: barrio.trim() || null,
        ciudad: ciudad.trim(),
        telefono: telefono.trim(),
        correo_personal: correoPersonal.trim() || null,
        cargo: cargo.trim(),
        fecha_ingreso: fechaIngreso,
        salario: Number(salario),
        forma_pago: formaPago,
        banco: banco.trim() || null,
        numero_cuenta: numeroCuenta.trim() || null,
        estado_laboral: "ACTIVO",
      });
      try {
        if (eps && fondoPension && arl && caja) {
          await guardarAfiliacion(empleado.id_empleado, {
            eps,
            fondo_pension: fondoPension,
            arl,
            caja_compensacion: caja,
            nivel_riesgo_arl: Number(nivelArl),
            estado_afiliacion: "ACTIVO",
          });
        }
      } catch {
        // empleado ya creado; afiliación opcional en fallo
      }
      alert(
        `Perfil guardado. ID empleado (auto): ${empleado.id_empleado}` +
          (usuarioSeleccionado
            ? `\nNombre: ${nombreUsuario(usuarioSeleccionado)}`
            : "")
      );
      navigate("/empleados");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "No se pudo guardar el empleado"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Empleados", to: "/empleados" },
          { label: "1. Cuenta", to: "/empleados/registrar" },
          { label: "2. Perfil laboral" },
        ]}
      />
      <div className="page-card">
        <h2 className="page-title">Paso 2 — Perfil laboral del empleado</h2>
        <p className="page-subtitle">
          El <strong>id_empleado</strong> lo genera la base de datos al guardar (no se escribe).
          Eliges el <strong>usuario del sistema</strong> por nombre, no un ID a mano.
        </p>
        {error && (
          <div style={{ marginBottom: 16, color: "#b00020", fontSize: 14 }}>{error}</div>
        )}
        {cargandoCatalogos && <p>Cargando usuarios…</p>}

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
                <Link to="/empleados/registrar">Crear cuenta primero (paso 1)</Link>
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
              <option value="CC">CC</option>
              <option value="CE">CE</option>
              <option value="TI">TI</option>
              <option value="PAS">PAS</option>
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
            <input className="agregar-input" value={calle} onChange={(e) => setCalle(e.target.value)} />
          </div>
          <div>
            <label className="agregar-label">Barrio</label>
            <input className="agregar-input" value={barrio} onChange={(e) => setBarrio(e.target.value)} />
          </div>
          <div>
            <label className="agregar-label">Ciudad *</label>
            <input className="agregar-input" value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
          </div>
          <div>
            <label className="agregar-label">Cargo *</label>
            <select className="agregar-input" value={cargo} onChange={(e) => setCargo(e.target.value)}>
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
            <select className="agregar-input" value={formaPago} onChange={(e) => setFormaPago(e.target.value)}>
              <option value="TRANSFERENCIA">Transferencia</option>
              <option value="EFECTIVO">Efectivo</option>
              <option value="CHEQUE">Cheque</option>
            </select>
          </div>
          <div>
            <label className="agregar-label">Banco</label>
            <select className="agregar-input" value={banco} onChange={(e) => setBanco(e.target.value)}>
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
            <select className="agregar-input" value={eps} onChange={(e) => setEps(e.target.value)}>
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
            <select className="agregar-input" value={arl} onChange={(e) => setArl(e.target.value)}>
              <option>Positiva ARL</option>
              <option>Sura ARL</option>
              <option>Colmena ARL</option>
            </select>
          </div>
          <div>
            <label className="agregar-label">Caja compensación</label>
            <select className="agregar-input" value={caja} onChange={(e) => setCaja(e.target.value)}>
              <option>Compensar</option>
              <option>Cafam</option>
              <option>Colsubsidio</option>
            </select>
          </div>
          <div>
            <label className="agregar-label">Nivel riesgo ARL</label>
            <select className="agregar-input" value={nivelArl} onChange={(e) => setNivelArl(e.target.value)}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>

        <div className="agregar-botones" style={{ marginTop: 20 }}>
          <Link to="/empleados/registrar" className="agregar-btn-secundario" style={{ textDecoration: "none" }}>
            ← Paso 1 (cuenta)
          </Link>
          <button
            className="agregar-btn-primario"
            type="button"
            onClick={handleGuardar}
            disabled={loading || cargandoCatalogos}
          >
            {loading ? "Guardando…" : "Guardar perfil laboral"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
