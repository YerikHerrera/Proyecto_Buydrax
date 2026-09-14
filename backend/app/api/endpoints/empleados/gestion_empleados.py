"""Endpoints de empleados — capa HTTP delgada (EP-09 … EP-17)."""

from typing import Optional

from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse

from app.nucleo.dependencias import AdminRrhhUser, CurrentUser, DbSession
from app.esquemas.negocio import (
    AfiliacionOut,
    AfiliacionUpsert,
    EmpleadoCreate,
    EmpleadoOut,
    EmpleadoUpdate,
    HistorialOut,
)
from app.servicios.servicio_empleados import ServicioEmpleados

router = APIRouter(tags=["Empleados"])


@router.get("/empleados", response_model=list[EmpleadoOut], summary="EP-09 Listar empleados")
def listar_empleados(
    db: DbSession,
    actor: CurrentUser,
    nombre: Optional[str] = None,
    documento: Optional[str] = None,
    estado: Optional[str] = None,
    supervisor: Optional[int] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
):
    return ServicioEmpleados(db).listar(
        documento=documento,
        estado=estado,
        supervisor=supervisor,
        skip=skip,
        limit=limit,
    )


@router.post("/empleados", response_model=EmpleadoOut, status_code=201, summary="EP-10 Registrar empleado")
def crear_empleado(body: EmpleadoCreate, db: DbSession, actor: AdminRrhhUser):
    return ServicioEmpleados(db).crear(body)


@router.get("/empleados/{id_empleado}", response_model=EmpleadoOut, summary="EP-11 Consultar empleado")
def obtener_empleado(id_empleado: int, db: DbSession, actor: CurrentUser):
    return ServicioEmpleados(db).obtener(id_empleado)


@router.patch("/empleados/{id_empleado}", response_model=EmpleadoOut, summary="EP-12/13 Actualizar o retirar empleado")
def actualizar_empleado(id_empleado: int, body: EmpleadoUpdate, db: DbSession, actor: AdminRrhhUser):
    return ServicioEmpleados(db).actualizar(id_empleado, body)


@router.get("/empleados/export", summary="EP-14 Exportar empleados")
def exportar_empleados(db: DbSession, actor: CurrentUser, formato: str = Query("json")):
    result = ServicioEmpleados(db).exportar(formato)
    if "csv" in result:
        return JSONResponse(content=result)
    return result


@router.get("/empleados/{id_empleado}/afiliacion", response_model=AfiliacionOut, summary="EP-15 Consultar afiliación")
def get_afiliacion(id_empleado: int, db: DbSession, actor: CurrentUser):
    return ServicioEmpleados(db).obtener_afiliacion(id_empleado)


@router.put("/empleados/{id_empleado}/afiliacion", response_model=AfiliacionOut, summary="EP-16 Crear/actualizar afiliación")
def upsert_afiliacion(id_empleado: int, body: AfiliacionUpsert, db: DbSession, actor: AdminRrhhUser):
    return ServicioEmpleados(db).upsert_afiliacion(id_empleado, body)


@router.get(
    "/empleados/{id_empleado}/historial-laboral",
    response_model=list[HistorialOut],
    summary="EP-17 Historial laboral",
)
def historial_laboral(id_empleado: int, db: DbSession, actor: CurrentUser):
    return ServicioEmpleados(db).listar_historial(id_empleado)
