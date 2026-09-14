"""Repositorio de solicitudes y notificaciones."""

from typing import Optional, Sequence
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.modelos import Notificacion, Solicitud

class RepositorioSolicitudes:
    def __init__(self, db: Session):
        self.db = db

    def get_solicitud(self, id_solicitud: int) -> Optional[Solicitud]:
        return self.db.get(Solicitud, id_solicitud)

    def listar_solicitudes(self, estado: Optional[str] = None) -> Sequence[Solicitud]:
        q = select(Solicitud)
        if estado:
            q = q.where(Solicitud.estado_solicitud == estado.upper())
        return self.db.execute(q.order_by(Solicitud.id_solicitud.desc())).scalars().all()

    def listar_por_usuario(self, id_usuario: int) -> Sequence[Solicitud]:
        return self.db.execute(
            select(Solicitud).where(Solicitud.id_usuario == id_usuario).order_by(Solicitud.id_solicitud.desc())
        ).scalars().all()

    def crear_solicitud(self, obj: Solicitud) -> Solicitud:
        self.db.add(obj); self.db.commit(); self.db.refresh(obj); return obj

    def actualizar_solicitud(self, obj: Solicitud) -> Solicitud:
        self.db.commit(); self.db.refresh(obj); return obj

    def get_notificacion(self, id_notif: int) -> Optional[Notificacion]:
        return self.db.get(Notificacion, id_notif)

    def listar_notificaciones(self, id_usuario: int, leida: Optional[bool] = None) -> Sequence[Notificacion]:
        q = select(Notificacion).where(Notificacion.id_usuario == id_usuario)
        if leida is not None:
            q = q.where(Notificacion.leida == leida)
        return self.db.execute(q.order_by(Notificacion.id_notificacion.desc())).scalars().all()

    def actualizar_notificacion(self, obj: Notificacion) -> Notificacion:
        self.db.commit(); self.db.refresh(obj); return obj
