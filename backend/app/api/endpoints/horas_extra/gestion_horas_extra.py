"""Endpoints de horas extra — capa HTTP delgada."""

from typing import Optional
from fastapi import APIRouter
from app.nucleo.dependencias import CurrentUser, DbSession
from app.esquemas.negocio import HoraExtraCreate, HoraExtraOut, HoraExtraUpdate
from app.servicios.servicio_horas_extra import ServicioHorasExtra

router = APIRouter(tags=["Horas Extra"])

@router.get("/horas-extra", response_model=list[HoraExtraOut], summary="EP-38 Listar horas extra")
def listar_horas_extra(db: DbSession, actor: CurrentUser, id_empleado: Optional[int] = None, estado: Optional[str] = None):
    return ServicioHorasExtra(db).listar(id_empleado=id_empleado, estado=estado)

@router.post("/empleados/{id_empleado}/horas-extra", response_model=HoraExtraOut, status_code=201, summary="EP-39 Registrar hora extra")
def registrar_hora_extra(id_empleado: int, body: HoraExtraCreate, db: DbSession, actor: CurrentUser):
    return ServicioHorasExtra(db).crear(id_empleado, body, actor)

@router.get("/horas-extra/{id_hora_extra}", response_model=HoraExtraOut, summary="EP-40 Consultar hora extra")
def consultar_hora_extra(id_hora_extra: int, db: DbSession, actor: CurrentUser):
    return ServicioHorasExtra(db).obtener(id_hora_extra)

@router.patch("/horas-extra/{id_hora_extra}", response_model=HoraExtraOut, summary="EP-41 Gestionar hora extra")
def gestionar_hora_extra(id_hora_extra: int, body: HoraExtraUpdate, db: DbSession, actor: CurrentUser):
    return ServicioHorasExtra(db).gestionar(id_hora_extra, body, actor)
