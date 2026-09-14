"""Endpoints de asignaciones — capa HTTP delgada (EP-47 … EP-51)."""

from fastapi import APIRouter

from app.nucleo.dependencias import AdminRrhhUser, CurrentUser, DbSession
from app.esquemas.negocio import AsignacionCreate, AsignacionOut
from app.servicios.servicio_asignaciones import ServicioAsignaciones

router = APIRouter(tags=["Asignaciones"])


@router.get("/asignaciones-proyecto", response_model=list[AsignacionOut], summary="EP-47 Listar asignaciones")
def listar_asignaciones(db: DbSession, actor: CurrentUser):
    return ServicioAsignaciones(db).listar()


@router.get("/proyectos/{id_proyecto}/asignaciones", response_model=list[AsignacionOut], summary="EP-48 Asignaciones de proyecto")
def asignaciones_de_proyecto(id_proyecto: int, db: DbSession, actor: CurrentUser):
    return ServicioAsignaciones(db).listar_por_proyecto(id_proyecto)


@router.get("/empleados/{id_empleado}/asignaciones-proyecto", response_model=list[AsignacionOut], summary="EP-49 Asignaciones de empleado")
def asignaciones_de_empleado(id_empleado: int, db: DbSession, actor: CurrentUser):
    return ServicioAsignaciones(db).listar_por_empleado(id_empleado)


@router.post("/proyectos/{id_proyecto}/asignaciones", response_model=AsignacionOut, status_code=201, summary="EP-50 Crear asignación")
def asignar_empleado(id_proyecto: int, body: AsignacionCreate, db: DbSession, actor: AdminRrhhUser):
    return ServicioAsignaciones(db).crear(id_proyecto, body)


@router.patch("/asignaciones-proyecto/{id_asignacion}", response_model=AsignacionOut, summary="EP-51 Retirar asignación")
def retirar_asignacion(id_asignacion: int, db: DbSession, actor: AdminRrhhUser):
    return ServicioAsignaciones(db).retirar(id_asignacion)
