import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Breadcrumb from "../components/layout/Breadcrumb";
import EmpleadoFilters from "../components/empleados/EmpleadoFilters";
import EmpleadoTable from "../components/empleados/EmpleadoTable";
import { listarEmpleados, retirarEmpleado, exportarEmpleadosExcel, type Empleado } from "../services/empleadosService";
import { mapaUsuarios, nombreUsuario, type UsuarioPublic } from "../services/usuariosService";
import "../styles/ListaEmpleados.css";

const POR_PAGINA=5;
export default function ListaEmpleados(){
 const navigate=useNavigate(); const [busqueda,setBusqueda]=useState(""),[filtroCargo,setFiltroCargo]=useState(""),[filtroEstado,setFiltroEstado]=useState(""),[pagina,setPagina]=useState(1),[empleados,setEmpleados]=useState<Empleado[]>([]),[usuariosMap,setUsuariosMap]=useState<Record<number,UsuarioPublic>>({}),[loading,setLoading]=useState(true),[error,setError]=useState("");
 useEffect(()=>{let alive=true;(async()=>{try{setLoading(true);setError("");const [data,map]=await Promise.all([listarEmpleados(),mapaUsuarios().catch(()=>({} as Record<number,UsuarioPublic>))]);if(alive){setEmpleados(Array.isArray(data)?data:[]);setUsuariosMap(map)}}catch(err:unknown){if(alive)setError(err instanceof Error?err.message:"Error al cargar empleados")}finally{if(alive)setLoading(false)}})();return()=>{alive=false}},[]);
 const cargos=useMemo(()=>[...new Set(empleados.map(e=>e.cargo))].sort(),[empleados]);
 const nombreDe=(e:Empleado)=>{const u=usuariosMap[Number(e.id_usuario)];if(u)return nombreUsuario(u);return e.cargo?`${e.cargo} · ${e.numero_documento}`:e.numero_documento};
 const filtrados=empleados.filter(e=>{const texto=`${nombreDe(e)} ${e.numero_documento} ${e.cargo} ${e.ciudad}`.toLowerCase();return (texto.includes(busqueda.toLowerCase())||e.numero_documento.includes(busqueda))&&(!filtroCargo||e.cargo===filtroCargo)&&(!filtroEstado||e.estado_laboral===filtroEstado)});
 const totalPaginas=Math.max(1,Math.ceil(filtrados.length/POR_PAGINA));const paginaActual=Math.min(pagina,totalPaginas);const filas=filtrados.slice((paginaActual-1)*POR_PAGINA,paginaActual*POR_PAGINA);
 useEffect(()=>{if(pagina>totalPaginas)setPagina(totalPaginas)},[pagina,totalPaginas]);
 const retirar=async(emp:Empleado)=>{if(!window.confirm(`¿Retirar empleado #${emp.id_empleado}? Se marcará como RETIRADO en la API.`))return;try{await retirarEmpleado(emp.id_empleado);setEmpleados(prev=>prev.map(x=>x.id_empleado===emp.id_empleado?{...x,estado_laboral:"RETIRADO"}:x))}catch(err:unknown){alert(err instanceof Error?err.message:"No se pudo retirar")}};
 const exportar=()=>{const nombres:Record<number,string>={};for(const [id,u] of Object.entries(usuariosMap))nombres[Number(id)]=nombreUsuario(u);void exportarEmpleadosExcel(filtrados.length?filtrados:empleados,nombres)};
 return <AppShell><Breadcrumb items={[{label:"Empleados",to:"/empleados"},{label:"Lista"}]}/><div className="lista-card">{loading&&<p style={{padding:16,color:"#64748B"}}>Cargando empleados...</p>}{error&&<p style={{padding:16,color:"#b00020"}}>{error}</p>}<div className="lista-header"><div className="lista-header-left"><div style={{width:"52px",height:"52px",borderRadius:"50%",backgroundColor:"#FFF3E8",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><i className="bi bi-people-fill" style={{color:"#F97316",fontSize:"22px"}}/></div><div style={{minWidth:0}}><h1 className="lista-titulo">LISTA DE EMPLEADOS</h1><p style={{fontSize:"13px",color:"#64748B",margin:"2px 0 0"}}>Consulta y gestiona la información de los empleados de la empresa.</p></div></div><button type="button" className="lista-export-btn" onClick={exportar}><i className="bi bi-download"/> Exportar Excel</button></div><EmpleadoFilters {...{busqueda,setBusqueda:(v:string)=>{setBusqueda(v);setPagina(1)},filtroCargo,setFiltroCargo:(v:string)=>{setFiltroCargo(v);setPagina(1)},filtroEstado,setFiltroEstado:(v:string)=>{setFiltroEstado(v);setPagina(1)},cargos,onRegistrar:()=>navigate("/empleados/agregar")}}/><EmpleadoTable {...{filas,paginaActual,totalPaginas,totalFiltrados:filtrados.length,nombreDe,onRetirar:retirar,onEditar:(emp:Empleado)=>navigate(`/empleados/editar/${emp.id_empleado}`),onAnterior:()=>setPagina(p=>Math.max(1,p-1)),onSiguiente:()=>setPagina(p=>Math.min(totalPaginas,p+1))}}/></div></AppShell>
}
