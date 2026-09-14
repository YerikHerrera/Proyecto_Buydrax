"""Endpoints de notificaciones — capa HTTP delgada."""

from typing import Optional
from fastapi import APIRouter
from app.nucleo.dependencias import CurrentUser, DbSession
from app.esquemas.negocio import NotificacionOut, NotificacionUpdate
from app.servicios.servicio_notificaciones import ServicioNotificaciones

router = APIRouter(tags=["Notificaciones"])

@router.get("/notificaciones", response_model=list[NotificacionOut], summary="EP-100 Listar notificaciones")
def listar_notificaciones(db: DbSession, actor: CurrentUser, leida: Optional[bool] = None):
    return ServicioNotificaciones(db).listar(actor.id_usuario, leida=leida)

@router.get("/notificaciones/{id_notificacion}", response_model=NotificacionOut, summary="EP-101 Consultar notificación")
def consultar_notificacion(id_notificacion: int, db: DbSession, actor: CurrentUser):
    return ServicioNotificaciones(db).obtener(id_notificacion)

@router.patch("/notificaciones/{id_notificacion}", response_model=NotificacionOut, summary="EP-102 Marcar leída")
def actualizar_notificacion(id_notificacion: int, body: NotificacionUpdate, db: DbSession, actor: CurrentUser):
    return ServicioNotificaciones(db).actualizar(id_notificacion, body)
