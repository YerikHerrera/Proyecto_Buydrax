import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import { listarProyectos, type Proyecto } from "../services/proyectosService";
import { apiRequest } from "../services/apiClient";
import "../styles/Nomina.css";

type ConfigRow = {
  id_configuracion: number;
  anio_vigencia: number;
  smlmv?: number;
};

type NominaOut = {
  id_nomina: number;
};

export default function GenerarNomina() {
  const navigate = useNavigate();
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [configs, setConfigs] = useState<ConfigRow[]>([]);
  const [idProyecto, setIdProyecto] = useState("");
  const [idConfig, setIdConfig] = useState("");
  const [tipoNomina, setTipoNomina] = useState("QUINCENAL");
  const [periodoInicio, setPeriodoInicio] = useState("");
  const [periodoFin, setPeriodoFin] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [p, c] = await Promise.all([
          listarProyectos("ACTIVO"),
          apiRequest<ConfigRow[]>("/configuraciones").catch(() => [] as ConfigRow[]),
        ]);
        setProyectos(Array.isArray(p) ? p : []);
        const cfgs = Array.isArray(c) ? c : [];
        setConfigs(cfgs);
        if (cfgs.length) {
          const sorted = [...cfgs].sort((a, b) => b.anio_vigencia - a.anio_vigencia);
          setIdConfig(String(sorted[0].id_configuracion));
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const generar = async () => {
    if (!periodoInicio || !periodoFin) {
      setError("Completa el rango de fechas del periodo.");
      return;
    }
    if (periodoFin < periodoInicio) {
      setError("El fin del periodo debe ser posterior al inicio.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      setOk("");
      const body: Record<string, unknown> = {
        periodo_inicio: periodoInicio,
        periodo_fin: periodoFin,
        tipo_nomina: tipoNomina,
      };
      if (idProyecto) body.id_obra = Number(idProyecto);
      if (idConfig) body.id_configuracion = Number(idConfig);

      const nomina = await apiRequest<NominaOut>("/nominas", {
        method: "POST",
        body: JSON.stringify(body),
      });

      // Calcular automáticamente
      try {
        await apiRequest(`/nominas/${nomina.id_nomina}/calcular`, { method: "POST" });
        setOk(`Nómina #${nomina.id_nomina} creada y calculada.`);
      } catch (calcErr: unknown) {
        setOk(
          `Nómina #${nomina.id_nomina} creada en borrador. Cálculo pendiente: ${
            calcErr instanceof Error ? calcErr.message : "error"
          }`
        );
      }
      setTimeout(() => navigate("/nomina"), 1200);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "No se pudo generar la nómina");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Nómina", to: "/nomina" },
          { label: "Generar nómina" },
        ]}
      />
      <div className="page-card">
        <h1 className="page-title">Generar nómina</h1>
        <p className="page-subtitle">
          Crea el periodo, calcula netos por empleado (salario prorrateado + salud/pensión) y deja
          la nómina en borrador lista para aprobar.
        </p>
        {error && <p style={{ color: "#b00020" }}>{error}</p>}
        {ok && (
          <p style={{ color: "#047857" }}>
            {ok}{" "}
            <Link to="/nomina" style={{ color: "#1e3a8a", fontWeight: 600 }}>
              Ir al panel →
            </Link>
          </p>
        )}

        <div className="agregar-form" style={{ marginTop: 20, maxWidth: 720 }}>
          <div>
            <label className="agregar-label">Proyecto / obra (opcional)</label>
            <select
              className="agregar-input"
              value={idProyecto}
              onChange={(e) => setIdProyecto(e.target.value)}
              disabled={loading}
            >
              <option value="">Todos los empleados activos</option>
              {proyectos.map((p) => (
                <option key={p.id_proyecto} value={p.id_proyecto}>
                  {p.nombre}
                </option>
              ))}
            </select>
            <small className="field-hint">
              Si eliges obra, solo se liquidan empleados con asignación activa ahí.
            </small>
          </div>

          <div>
            <label className="agregar-label">Tipo de nómina *</label>
            <select
              className="agregar-input"
              value={tipoNomina}
              onChange={(e) => setTipoNomina(e.target.value)}
            >
              <option value="QUINCENAL">Quincenal</option>
              <option value="MENSUAL">Mensual</option>
            </select>
          </div>

          <div>
            <label className="agregar-label">Configuración salarial</label>
            <select
              className="agregar-input"
              value={idConfig}
              onChange={(e) => setIdConfig(e.target.value)}
              disabled={loading || configs.length === 0}
            >
              {configs.length === 0 ? (
                <option value="">Sin configuración — créala en el menú</option>
              ) : (
                configs
                  .slice()
                  .sort((a, b) => b.anio_vigencia - a.anio_vigencia)
                  .map((c) => (
                    <option key={c.id_configuracion} value={c.id_configuracion}>
                      Año {c.anio_vigencia} (id {c.id_configuracion})
                    </option>
                  ))
              )}
            </select>
          </div>

          <div>
            <label className="agregar-label">Inicio del periodo *</label>
            <input
              type="date"
              className="agregar-input"
              value={periodoInicio}
              onChange={(e) => setPeriodoInicio(e.target.value)}
            />
          </div>
          <div>
            <label className="agregar-label">Fin del periodo *</label>
            <input
              type="date"
              className="agregar-input"
              value={periodoFin}
              onChange={(e) => setPeriodoFin(e.target.value)}
            />
          </div>
        </div>

        <div className="agregar-botones" style={{ marginTop: 24 }}>
          <button
            type="button"
            className="agregar-btn-primario"
            onClick={generar}
            disabled={saving || loading}
          >
            {saving ? "Generando…" : "Crear y calcular"}
          </button>
          <Link to="/nomina" className="agregar-btn-secundario" style={{ textDecoration: "none" }}>
            Volver al panel
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
