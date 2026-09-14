"""Endpoints de solicitudes — capa HTTP delgada."""

from typing import Optional
from fastapi import APIRouter
from app.nucleo.dependencias import CurrentUser, DbSession
from app.esquemas.negocio import SolicitudCreate, SolicitudOut, SolicitudUpdate
from app.servicios.servicio_solicitudes import ServicioSolicitudes

router = APIRouter(tags=["Solicitudes"])

@router.get("/solicitudes", response_model=list[SolicitudOut], summary="EP-95 Listar solicitudes")
def listar_solicitudes(db: DbSession, actor: CurrentUser, estado: Optional[str] = None):
    return ServicioSolicitudes(db).listar(estado=estado)

@router.get("/mis-solicitudes", response_model=list[SolicitudOut], summary="EP-96 Mis solicitudes")
def mis_solicitudes(db: DbSession, actor: CurrentUser):
    return ServicioSolicitudes(db).mis_solicitudes(actor.id_usuario)

@router.post("/solicitudes", response_model=SolicitudOut, status_code=201, summary="EP-97 Crear solicitud")
def crear_solicitud(body: SolicitudCreate, db: DbSession, actor: CurrentUser):
    return ServicioSolicitudes(db).crear(body, actor.id_usuario)

@router.get("/solicitudes/{id_solicitud}", response_model=SolicitudOut, summary="EP-98 Consultar solicitud")
def consultar_solicitud(id_solicitud: int, db: DbSession, actor: CurrentUser):
    return ServicioSolicitudes(db).obtener(id_solicitud)

@router.patch("/solicitudes/{id_solicitud}", response_model=SolicitudOut, summary="EP-99 Gestionar solicitud")
def gestionar_solicitud(id_solicitud: int, body: SolicitudUpdate, db: DbSession, actor: CurrentUser):
    return ServicioSolicitudes(db).gestionar(id_solicitud, body)
