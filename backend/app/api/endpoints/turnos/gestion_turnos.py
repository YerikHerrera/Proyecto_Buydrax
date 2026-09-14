"""Endpoints de turnos — capa HTTP delgada."""

from fastapi import APIRouter
from app.nucleo.dependencias import AdminRrhhUser, CurrentUser, DbSession
from app.esquemas.negocio import MessageOut, TurnoCreate, TurnoOut, TurnoUpdate
from app.servicios.servicio_turnos import ServicioTurnos

router = APIRouter(tags=["Turnos"])

@router.get("/turnos", response_model=list[TurnoOut], summary="EP-29 Listar turnos")
def listar_turnos(db: DbSession, actor: CurrentUser):
    return ServicioTurnos(db).listar()

@router.post("/turnos", response_model=TurnoOut, status_code=201, summary="EP-30 Registrar turno")
def registrar_turno(body: TurnoCreate, db: DbSession, actor: AdminRrhhUser):
    return ServicioTurnos(db).crear(body)

@router.get("/turnos/{id_turno}", response_model=TurnoOut, summary="EP-31 Consultar turno")
def consultar_turno(id_turno: int, db: DbSession, actor: CurrentUser):
    return ServicioTurnos(db).obtener(id_turno)

@router.patch("/turnos/{id_turno}", response_model=TurnoOut, summary="EP-32 Actualizar turno")
def actualizar_turno(id_turno: int, body: TurnoUpdate, db: DbSession, actor: AdminRrhhUser):
    return ServicioTurnos(db).actualizar(id_turno, body)

@router.delete("/turnos/{id_turno}", response_model=MessageOut, summary="EP-33 Eliminar turno")
def eliminar_turno(id_turno: int, db: DbSession, actor: AdminRrhhUser):
    ServicioTurnos(db).eliminar(id_turno)
    return MessageOut(message="Turno eliminado")
