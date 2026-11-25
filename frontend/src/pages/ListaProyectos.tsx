import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import RoleGate from "../components/RoleGate";
import ProyectoTable from "../components/proyectos/ProyectoTable";
import { listarProyectos, type Proyecto } from "../services/proyectosService";

export default function ListaProyectos() {
  return (
    <RoleGate require="admin">
      <ListaProyectosInner />
    </RoleGate>
  );
}

function ListaProyectosInner() {
  const navigate = useNavigate();
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listarProyectos()
      .then((list) => {
        const arr = Array.isArray(list) ? list : [];
        arr.sort((a, b) => (b.id_proyecto || 0) - (a.id_proyecto || 0));
        setProyectos(arr);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error al cargar"))
      .finally(() => setLoading(false));
  }, []);

  const ordenados = useMemo(
    () => [...proyectos].sort((a, b) => (b.id_proyecto || 0) - (a.id_proyecto || 0)),
    [proyectos]
  );

  return (
    <AppShell>
      <Breadcrumb items={[{ label: "Proyectos", to: "/proyectos" }, { label: "Listado" }]} />
      <div className="page-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "flex-start",
            marginBottom: 8,
          }}
        >
          <div>
            <h1 className="page-title">Listado de proyectos</h1>
            <p className="page-subtitle">
              Más recientes primero. Usa <strong>Editar</strong> para abrir el formulario de
              edición.
            </p>
          </div>
          <Link
            to="/proyectos/crear"
            className="agregar-btn-primario"
            style={{ textDecoration: "none", whiteSpace: "nowrap" }}
          >
            + Crear proyecto
          </Link>
        </div>
        {error && <p style={{ color: "#b00020" }}>{error}</p>}
        {loading && <p style={{ color: "#64748b" }}>Cargando…</p>}
        <ProyectoTable
          proyectos={ordenados}
          onEditar={(p) => navigate(`/proyectos/crear?edit=${p.id_proyecto}`)}
        />
      </div>
    </AppShell>
  );
}
