import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import RoleGate from "../components/RoleGate";
import ProyectoTable from "../components/proyectos/ProyectoTable";
import {
  listarProyectos,
  type Proyecto,
} from "../services/proyectosService";
import { esAdminRrhh, esSupervisor } from "../services/session";
import Toast from "../components/ui/Toast";
import { useToast } from "../hooks/useToast";

export default function ListaProyectos() {
  // Admin y Supervisor pueden ver listado (supervisor solo los suyos)
  return (
    <RoleGate require="aprobar">
      <ListaProyectosInner />
    </RoleGate>
  );
}

function ListaProyectosInner() {
  const navigate = useNavigate();
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast, showToast, closeToast } = useToast();
  const esAdmin = esAdminRrhh();
  const soloSupervisor = esSupervisor() && !esAdmin;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await listarProyectos();
        // El backend ya entrega solo los proyectos permitidos según el rol
        const arr = Array.isArray(list) ? [...list] : [];
        arr.sort((a, b) => (b.id_proyecto || 0) - (a.id_proyecto || 0));
        if (!cancelled) setProyectos(arr);
      } catch (e) {
        if (!cancelled)
          showToast(e instanceof Error ? e.message : "Error al cargar proyectos", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showToast]);

  const ordenados = useMemo(
    () => [...proyectos].sort((a, b) => (b.id_proyecto || 0) - (a.id_proyecto || 0)),
    [proyectos]
  );

  return (
    <AppShell>
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
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
              {soloSupervisor
                ? "Solo se muestran los proyectos a los que estás vinculado como supervisor."
                : "Más recientes primero. Usa Editar para abrir el formulario de edición."}
            </p>
          </div>
          {esAdmin && (
            <Link
              to="/proyectos/crear"
              className="agregar-btn-primario"
              style={{ textDecoration: "none", whiteSpace: "nowrap" }}
            >
              + Crear proyecto
            </Link>
          )}
        </div>
        {loading && <p style={{ color: "#64748b" }}>Cargando…</p>}
        {!loading && ordenados.length === 0 && (
          <p style={{ color: "#64748b" }}>
            {soloSupervisor
              ? "No tienes proyectos vinculados todavía."
              : "No hay proyectos registrados."}
          </p>
        )}
        <ProyectoTable
          proyectos={ordenados}
          onEditar={
            esAdmin
              ? (p) => navigate(`/proyectos/crear?edit=${p.id_proyecto}`)
              : undefined
          }
        />
      </div>
    </AppShell>
  );
}
