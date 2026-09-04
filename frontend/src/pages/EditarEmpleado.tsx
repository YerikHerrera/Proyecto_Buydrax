import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import {
  obtenerEmpleado,
  actualizarEmpleado,
  type Empleado,
} from "../services/empleadosService";

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
const BANCOS = ["Bancolombia", "Banco de Bogotá", "Davivienda", "BBVA", "Banco Popular", "Nequi"];

export default function EditarEmpleado() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [emp, setEmp] = useState<Empleado | null>(null);

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
  const [estadoLaboral, setEstadoLaboral] = useState("ACTIVO");
  const [idSupervisor, setIdSupervisor] = useState("");

  useEffect(() => {
    const idNum = Number(id);
    if (!idNum) {
      setError("ID de empleado inválido");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const e = await obtenerEmpleado(idNum);
        setEmp(e);
        setTipoDocumento(e.tipo_documento || "CC");
        setNumeroDocumento(e.numero_documento || "");
        setFechaNacimiento((e.fecha_nacimiento || "").slice(0, 10));
        setCalle(e.calle || "");
        setBarrio(e.barrio || "");
        setCiudad(e.ciudad || "");
        setTelefono(e.telefono || "");
        setCorreoPersonal(e.correo_personal || "");
        setCargo(e.cargo || "");
        setFechaIngreso((e.fecha_ingreso || "").slice(0, 10));
        setSalario(String(e.salario ?? ""));
        setFormaPago(e.forma_pago || "TRANSFERENCIA");
        setBanco(e.banco || "");
        setNumeroCuenta(e.numero_cuenta || "");
        setEstadoLaboral(e.estado_laboral || "ACTIVO");
        setIdSupervisor(e.id_supervisor != null ? String(e.id_supervisor) : "");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "No se pudo cargar el empleado");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const guardar = async () => {
    if (!emp) return;
    if (!numeroDocumento || !cargo || !ciudad || !telefono || !salario) {
      setError("Completa documento, cargo, ciudad, teléfono y salario.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      setOk("");
      await actualizarEmpleado(emp.id_empleado, {
        tipo_documento: tipoDocumento,
        numero_documento: numeroDocumento.trim(),
        fecha_nacimiento: fechaNacimiento || undefined,
        calle: calle.trim(),
        barrio: barrio.trim() || null,
        ciudad: ciudad.trim(),
        telefono: telefono.trim(),
        correo_personal: correoPersonal.trim() || null,
        cargo: cargo.trim(),
        fecha_ingreso: fechaIngreso || undefined,
        salario: Number(salario),
        forma_pago: formaPago,
        banco: banco.trim() || null,
        numero_cuenta: numeroCuenta.trim() || null,
        estado_laboral: estadoLaboral,
        id_supervisor: idSupervisor ? Number(idSupervisor) : null,
      });
      setOk("Empleado actualizado correctamente.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Empleados", to: "/empleados" },
          { label: `Editar #${id}` },
        ]}
      />
      <div className="page-card">
        <h1 className="page-title">Editar empleado</h1>
        <p className="page-subtitle">
          PATCH /empleados/&#123;id&#125; — no es el formulario de alta.
        </p>
        {loading && <p>Cargando…</p>}
        {error && <p style={{ color: "#b00020" }}>{error}</p>}
        {ok && <p style={{ color: "#047857" }}>{ok}</p>}
        {!loading && emp && (
          <>
            <div className="agregar-form" style={{ marginTop: 16 }}>
              <div>
                <label className="agregar-label">Tipo documento</label>
                <select className="agregar-input" value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)}>
                  {TIPOS_DOC.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="agregar-label">Número documento *</label>
                <input className="agregar-input" value={numeroDocumento} onChange={(e) => setNumeroDocumento(e.target.value)} />
              </div>
              <div>
                <label className="agregar-label">Fecha nacimiento</label>
                <input className="agregar-input" type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />
              </div>
              <div>
                <label className="agregar-label">Teléfono *</label>
                <input className="agregar-input" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
              </div>
              <div>
                <label className="agregar-label">Correo personal</label>
                <input className="agregar-input" type="email" value={correoPersonal} onChange={(e) => setCorreoPersonal(e.target.value)} />
              </div>
              <div>
                <label className="agregar-label">Calle</label>
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
                  <option value="">Seleccionar</option>
                  {CARGOS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  {cargo && !CARGOS.includes(cargo) && (
                    <option value={cargo}>{cargo}</option>
                  )}
                </select>
              </div>
              <div>
                <label className="agregar-label">Fecha ingreso</label>
                <input className="agregar-input" type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} />
              </div>
              <div>
                <label className="agregar-label">Salario *</label>
                <input className="agregar-input" type="number" min="0" step="0.01" value={salario} onChange={(e) => setSalario(e.target.value)} />
              </div>
              <div>
                <label className="agregar-label">Forma de pago</label>
                <select className="agregar-input" value={formaPago} onChange={(e) => setFormaPago(e.target.value)}>
                  {FORMAS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="agregar-label">Banco</label>
                <select className="agregar-input" value={banco} onChange={(e) => setBanco(e.target.value)}>
                  <option value="">—</option>
                  {BANCOS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="agregar-label">Número de cuenta</label>
                <input className="agregar-input" value={numeroCuenta} onChange={(e) => setNumeroCuenta(e.target.value)} />
              </div>
              <div>
                <label className="agregar-label">Estado laboral</label>
                <select className="agregar-input" value={estadoLaboral} onChange={(e) => setEstadoLaboral(e.target.value)}>
                  {ESTADOS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="agregar-label">ID Supervisor</label>
                <input className="agregar-input" type="number" value={idSupervisor} onChange={(e) => setIdSupervisor(e.target.value)} />
              </div>
            </div>
            <div className="agregar-botones" style={{ marginTop: 20 }}>
              <button className="agregar-btn-secundario" type="button" onClick={() => navigate("/empleados")}>
                Volver a lista
              </button>
              <button className="agregar-btn-primario" type="button" onClick={guardar} disabled={saving}>
                {saving ? "Guardando…" : "Guardar cambios"}
              </button>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
