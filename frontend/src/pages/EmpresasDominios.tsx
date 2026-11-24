import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import {
  actualizarEmpresa,
  crearAdminParaDominio,
  crearEmpresa,
  listarEmpresas,
  type Empresa,
} from "../services/empresasService";
import { esEmpresa } from "../services/session";

export default function EmpresasDominios() {
  const [items, setItems] = useState<Empresa[]>([]);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(true);

  const [nombre, setNombre] = useState("");
  const [dominio, setDominio] = useState("");
  const [tipo, setTipo] = useState<"EMPRESA" | "EXTERNO">("EMPRESA");

  const [idEmpAdmin, setIdEmpAdmin] = useState<number | "">("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");

  const cargar = async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await listarEmpresas());
    } catch (e: any) {
      setError(e?.response?.data?.detail || e?.message || "No se pudieron cargar los dominios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const onCrearDominio = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOk("");
    try {
      await crearEmpresa({ nombre, dominio, tipo });
      setOk(`Dominio @${dominio.replace(/^@/, "")} creado`);
      setNombre("");
      setDominio("");
      await cargar();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Error al crear dominio");
    }
  };

  const onCrearAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOk("");
    if (!idEmpAdmin) {
      setError("Selecciona un dominio");
      return;
    }
    try {
      const res = await crearAdminParaDominio({
        id_empresa: Number(idEmpAdmin),
        nombres,
        apellidos,
        correo,
        contrasena: pass,
        area_responsable: "Gestión humana",
      });
      setOk(res.mensaje || `Admin creado: ${res.correo}`);
      setNombres("");
      setApellidos("");
      setCorreo("");
      setPass("");
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Error al crear admin");
    }
  };

  const toggleActivo = async (emp: Empresa) => {
    try {
      await actualizarEmpresa(emp.id_empresa, { activo: !emp.activo });
      await cargar();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "No se pudo actualizar");
    }
  };

  if (!esEmpresa()) {
    return (
      <AppShell>
        <div className="card" style={{ padding: 16 }}>
          Esta sección es solo para el rol <strong>EMPRESA</strong> (plataforma).
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <h1 style={{ marginTop: 0 }}>Empresas y dominios</h1>
      <p className="page-lead" style={{ marginBottom: 12 }}>
        Registra dominios corporativos o externos y asigna un <strong>Admin RRHH</strong> cuyo
        correo <em>debe</em> pertenecer a ese dominio. Así se evita que una empresa tome un
        dominio ajeno con permisos de administración.
      </p>

      {error && <div className="alert error" style={{ marginBottom: 12 }}>{String(error)}</div>}
      {ok && <div className="alert success" style={{ marginBottom: 12 }}>{ok}</div>}

      <div className="grid-2" style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
        <form className="card" onSubmit={onCrearDominio} style={{ padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>1. Crear dominio</h3>
          <label className="field">
            <span>Nombre de la empresa</span>
            <input className="agregar-input" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </label>
          <label className="field">
            <span>Dominio (sin @)</span>
            <input
              className="agregar-input"
              placeholder="colcenter.com"
              value={dominio}
              onChange={(e) => setDominio(e.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>Tipo</span>
            <select className="agregar-input" value={tipo} onChange={(e) => setTipo(e.target.value as any)}>
              <option value="EMPRESA">Empresa (corporativo)</option>
              <option value="EXTERNO">Externo (autorizado)</option>
            </select>
          </label>
          <button type="submit" className="btn-primary" style={{ marginTop: 8 }}>
            Registrar dominio
          </button>
        </form>

        <form className="card" onSubmit={onCrearAdmin} style={{ padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>2. Crear Admin RRHH para un dominio</h3>
          <label className="field">
            <span>Dominio</span>
            <select
              className="agregar-input"
              value={idEmpAdmin}
              onChange={(e) => setIdEmpAdmin(e.target.value ? Number(e.target.value) : "")}
              required
            >
              <option value="">Seleccionar…</option>
              {items.filter((i) => i.activo).map((i) => (
                <option key={i.id_empresa} value={i.id_empresa}>
                  {i.nombre} (@{i.dominio})
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Nombres</span>
            <input className="agregar-input" value={nombres} onChange={(e) => setNombres(e.target.value)} required />
          </label>
          <label className="field">
            <span>Apellidos</span>
            <input className="agregar-input" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required />
          </label>
          <label className="field">
            <span>Correo (debe ser del dominio)</span>
            <input
              className="agregar-input"
              type="email"
              placeholder="admin@colcenter.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>Contraseña</span>
            <input className="agregar-input" type="password" value={pass} onChange={(e) => setPass(e.target.value)} required minLength={6} />
          </label>
          <button type="submit" className="btn-primary" style={{ marginTop: 8 }}>
            Crear Admin RRHH
          </button>
        </form>
      </div>

      <div className="card" style={{ marginTop: 16, padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>Dominios registrados</h3>
        {loading ? (
          <p>Cargando…</p>
        ) : items.length === 0 ? (
          <p>No hay dominios. Crea el primero arriba.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Dominio</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((e) => (
                  <tr key={e.id_empresa}>
                    <td>{e.nombre}</td>
                    <td>@{e.dominio}</td>
                    <td>{e.tipo}</td>
                    <td>{e.activo ? "Activo" : "Inactivo"}</td>
                    <td>
                      <button type="button" className="btn-secondary" onClick={() => toggleActivo(e)}>
                        {e.activo ? "Desactivar" : "Activar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
