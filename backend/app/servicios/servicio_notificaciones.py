"""Servicio de notificaciones — EP-100 … EP-102."""

from typing import Optional, Sequence
from sqlalchemy.orm import Session
from app.modelos import Notificacion
from app.nucleo.excepciones import NotFoundError
from app.repositorios.repositorio_solicitudes import RepositorioSolicitudes
from app.esquemas.negocio import NotificacionUpdate

class ServicioNotificaciones:
    def __init__(self, db: Session):
        self.repo = RepositorioSolicitudes(db)

    def listar(self, id_usuario: int, leida: Optional[bool] = None) -> Sequence[Notificacion]:
        return self.repo.listar_notificaciones(id_usuario, leida=leida)

    def obtener(self, id_notificacion: int) -> Notificacion:
        n = self.repo.get_notificacion(id_notificacion)
        if n is None:
            raise NotFoundError("Notificación no encontrada")
        return n

    def actualizar(self, id_notificacion: int, body: NotificacionUpdate) -> Notificacion:
        n = self.obtener(id_notificacion)
        for k, v in body.model_dump(exclude_unset=True).items():
            setattr(n, k, v)
        return self.repo.actualizar_notificacion(n)
