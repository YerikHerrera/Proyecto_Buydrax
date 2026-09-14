"""Endpoints de evaluaciones y observaciones — capa HTTP delgada."""

from fastapi import APIRouter
from app.nucleo.dependencias import CurrentUser, DbSession
from app.esquemas.negocio import (
    EvaluacionCreate, EvaluacionOut, EvaluacionUpdate,
    ObservacionCreate, ObservacionOut, ObservacionUpdate,
)
from app.servicios.servicio_evaluaciones import ServicioEvaluaciones

router = APIRouter(tags=["Evaluaciones"])

@router.get("/empleados/{id_empleado}/evaluaciones", response_model=list[EvaluacionOut], summary="EP-87 Listar evaluaciones")
def listar_evaluaciones(id_empleado: int, db: DbSession, actor: CurrentUser):
    return ServicioEvaluaciones(db).listar_evaluaciones(id_empleado)

@router.get("/evaluaciones/{id_evaluacion}", response_model=EvaluacionOut, summary="EP-88 Consultar evaluación")
def consultar_evaluacion(id_evaluacion: int, db: DbSession, actor: CurrentUser):
    return ServicioEvaluaciones(db).obtener_evaluacion(id_evaluacion)

@router.post("/empleados/{id_empleado}/evaluaciones", response_model=EvaluacionOut, status_code=201, summary="EP-89 Registrar evaluación")
def registrar_evaluacion(id_empleado: int, body: EvaluacionCreate, db: DbSession, actor: CurrentUser):
    return ServicioEvaluaciones(db).crear_evaluacion(id_empleado, body, actor)

@router.patch("/evaluaciones/{id_evaluacion}", response_model=EvaluacionOut, summary="EP-90 Actualizar evaluación")
def actualizar_evaluacion(id_evaluacion: int, body: EvaluacionUpdate, db: DbSession, actor: CurrentUser):
    return ServicioEvaluaciones(db).actualizar_evaluacion(id_evaluacion, body)

@router.get("/empleados/{id_empleado}/observaciones", response_model=list[ObservacionOut], summary="EP-91 Listar observaciones")
def listar_observaciones(id_empleado: int, db: DbSession, actor: CurrentUser):
    return ServicioEvaluaciones(db).listar_observaciones(id_empleado)

@router.post("/empleados/{id_empleado}/observaciones", response_model=ObservacionOut, status_code=201, summary="EP-92 Registrar observación")
def registrar_observacion(id_empleado: int, body: ObservacionCreate, db: DbSession, actor: CurrentUser):
    return ServicioEvaluaciones(db).crear_observacion(id_empleado, body, actor)

@router.get("/observaciones/{id_observacion}", response_model=ObservacionOut, summary="EP-93 Consultar observación")
def consultar_observacion(id_observacion: int, db: DbSession, actor: CurrentUser):
    return ServicioEvaluaciones(db).obtener_observacion(id_observacion)

@router.patch("/observaciones/{id_observacion}", response_model=ObservacionOut, summary="EP-94 Actualizar observación")
def actualizar_observacion(id_observacion: int, body: ObservacionUpdate, db: DbSession, actor: CurrentUser):
    return ServicioEvaluaciones(db).actualizar_observacion(id_observacion, body)
