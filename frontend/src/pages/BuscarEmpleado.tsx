import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import BuscarEmpleadoForm from "../components/busqueda/BuscarEmpleadoForm";
import BuscarEmpleadoResult from "../components/busqueda/BuscarEmpleadoResult";
import { listarEmpleados, type Empleado } from "../services/empleadosService";
import { listarUsuarios, type UsuarioPublic } from "../services/usuariosService";
import "../styles/BuscarEmpleado.css";

export default function BuscarEmpleado() {
  const [searchParams] = useSearchParams();
  const [busqueda, setBusqueda] = useState(searchParams.get("nombre") || "");
  const [resultado, setResultado] = useState<Empleado | null>(null);
  const [sinResultado, setSinResultado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usuariosMap, setUsuariosMap] = useState<Record<number, UsuarioPublic>>({});

  const ejecutarBusqueda = async (texto: string) => {
    const valor = texto.trim();
    if (!valor) return;
    try {
      setLoading(true);
      setError("");
      setSinResultado(false);
      setResultado(null);

      const soloDigitos = /^\d+$/.test(valor);
      let lista: Empleado[] = soloDigitos
        ? await listarEmpleados({ documento: valor })
        : await listarEmpleados();

      if (!soloDigitos) {
        const lower = valor.toLowerCase();
        lista = lista.filter((e) => {
          const u = usuariosMap[e.id_usuario];
          const full = u ? `${u.nombres} ${u.apellidos}`.toLowerCase() : "";
          const cargo = (e.cargo || "").toLowerCase();
          const doc = (e.numero_documento || "").toLowerCase();
          return full.includes(lower) || cargo.includes(lower) || doc.includes(valor);
        });
      }

      if (!lista.length) {
        setSinResultado(true);
      } else {
        setResultado(lista[0]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al buscar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listarUsuarios({ limit: 200 }).then((users) => {
      const map: Record<number, UsuarioPublic> = {};
      for (const u of users) map[u.id_usuario] = u;
      setUsuariosMap(map);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const consulta = searchParams.get("nombre") || "";
    if (consulta.trim()) {
      setBusqueda(consulta);
      void ejecutarBusqueda(consulta);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const buscar = () => void ejecutarBusqueda(busqueda);
  const nuevaBusqueda = () => {
    setResultado(null);
    setSinResultado(false);
    setError("");
  };

  return (
    <AppShell>
      <Breadcrumb items={[{ label: "Empleados", to: "/empleados" }, { label: "Buscar" }]} />
      <div className="buscar-stepper">
        <div className={`buscar-step ${!resultado ? "activo" : "completado"}`}>
          <span>{resultado ? <i className="bi bi-check"></i> : 1}</span><b>Búsqueda</b>
        </div>
        <div className="buscar-linea"></div>
        <div className={`buscar-step ${resultado ? "activo" : ""}`}><span>2</span><b>Empleado encontrado</b></div>
        <div className="buscar-linea"></div>
        <div className="buscar-step"><span>3</span><b>Resultados</b></div>
      </div>

      {!resultado && (
        <BuscarEmpleadoForm
          value={busqueda}
          loading={loading}
          error={error}
          sinResultado={sinResultado}
          onChange={setBusqueda}
          onSearch={buscar}
        />
      )}

      {resultado && (
        <BuscarEmpleadoResult
          empleado={resultado}
          usuarios={usuariosMap}
          onNewSearch={nuevaBusqueda}
        />
      )}
    </AppShell>
  );
}
