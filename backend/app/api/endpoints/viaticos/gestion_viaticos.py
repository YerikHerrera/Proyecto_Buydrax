"""Endpoints de viáticos — capa HTTP delgada."""

from typing import Optional

from fastapi import APIRouter

from app.nucleo.dependencias import AdminRrhhUser, CurrentUser, DbSession
from app.esquemas.negocio import ViaticoCreate, ViaticoOut, ViaticoUpdate
from app.servicios.servicio_viaticos import ServicioViaticos

router = APIRouter(tags=["Viáticos"])


@router.get("/viaticos", response_model=list[ViaticoOut], summary="EP-60 Listar viáticos")
def listar_viaticos(db: DbSession, actor: CurrentUser, id_empleado: Optional[int] = None):
    return ServicioViaticos(db).listar_todos(id_empleado=id_empleado)


@router.get("/empleados/{id_empleado}/viaticos", response_model=list[ViaticoOut], summary="EP-60 Listar viáticos de empleado")
def listar_viaticos_empleado(id_empleado: int, db: DbSession, actor: CurrentUser):
    return ServicioViaticos(db).listar_empleado(id_empleado)


@router.post("/empleados/{id_empleado}/viaticos", response_model=ViaticoOut, status_code=201, summary="EP-61 Registrar viático")
def registrar_viatico(id_empleado: int, body: ViaticoCreate, db: DbSession, actor: CurrentUser):
    return ServicioViaticos(db).crear(id_empleado, body)


@router.get("/viaticos/{id_viatico}", response_model=ViaticoOut, summary="EP-62 Consultar viático")
def consultar_viatico(id_viatico: int, db: DbSession, actor: CurrentUser):
    return ServicioViaticos(db).obtener(id_viatico)


@router.patch("/viaticos/{id_viatico}", response_model=ViaticoOut, summary="EP-63 Gestionar viático")
def gestionar_viatico(id_viatico: int, body: ViaticoUpdate, db: DbSession, actor: AdminRrhhUser):
    return ServicioViaticos(db).gestionar(id_viatico, body)
