"""Endpoints de proyectos — capa HTTP delgada (EP-42 … EP-46)."""

from typing import Optional

from fastapi import APIRouter

from app.nucleo.dependencias import AdminRrhhUser, CurrentUser, DbSession
from app.esquemas.negocio import MessageOut, ProyectoCreate, ProyectoOut, ProyectoUpdate
from app.servicios.servicio_proyectos import ServicioProyectos

router = APIRouter(tags=["Proyectos"])


@router.get("/proyectos", response_model=list[ProyectoOut], summary="EP-42 Listar proyectos")
def listar_proyectos(db: DbSession, actor: CurrentUser, estado: Optional[str] = None):
    return ServicioProyectos(db).listar(estado=estado)


@router.post("/proyectos", response_model=ProyectoOut, status_code=201, summary="EP-43 Crear proyecto")
def crear_proyecto(body: ProyectoCreate, db: DbSession, actor: AdminRrhhUser):
    return ServicioProyectos(db).crear(body)


@router.get("/proyectos/{id_proyecto}", response_model=ProyectoOut, summary="EP-44 Consultar proyecto")
def consultar_proyecto(id_proyecto: int, db: DbSession, actor: CurrentUser):
    return ServicioProyectos(db).obtener(id_proyecto)


@router.patch("/proyectos/{id_proyecto}", response_model=ProyectoOut, summary="EP-45 Actualizar proyecto")
def actualizar_proyecto(id_proyecto: int, body: ProyectoUpdate, db: DbSession, actor: AdminRrhhUser):
    return ServicioProyectos(db).actualizar(id_proyecto, body)


@router.delete("/proyectos/{id_proyecto}", response_model=MessageOut, summary="EP-46 Eliminar/suspender proyecto")
def suspender_proyecto(id_proyecto: int, db: DbSession, actor: AdminRrhhUser):
    ServicioProyectos(db).suspender(id_proyecto)
    return MessageOut(message="Proyecto suspendido")
