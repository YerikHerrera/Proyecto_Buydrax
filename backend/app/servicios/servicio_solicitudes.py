"""Servicio de solicitudes — EP-95 … EP-99."""

from typing import Optional, Sequence
from sqlalchemy.orm import Session
from app.modelos import Solicitud
from app.nucleo.excepciones import NotFoundError
from app.repositorios.repositorio_solicitudes import RepositorioSolicitudes
from app.esquemas.negocio import SolicitudCreate, SolicitudUpdate

class ServicioSolicitudes:
    def __init__(self, db: Session):
        self.repo = RepositorioSolicitudes(db)

    def listar(self, estado: Optional[str] = None) -> Sequence[Solicitud]:
        return self.repo.listar_solicitudes(estado=estado)

    def mis_solicitudes(self, id_usuario: int) -> Sequence[Solicitud]:
        return self.repo.listar_por_usuario(id_usuario)

    def crear(self, body: SolicitudCreate, id_usuario: int) -> Solicitud:
        data = body.model_dump()
        data["id_usuario"] = id_usuario
        s = Solicitud(**data)
        return self.repo.crear_solicitud(s)

    def obtener(self, id_solicitud: int) -> Solicitud:
        s = self.repo.get_solicitud(id_solicitud)
        if s is None:
            raise NotFoundError("Solicitud no encontrada")
        return s

    def gestionar(self, id_solicitud: int, body: SolicitudUpdate) -> Solicitud:
        s = self.obtener(id_solicitud)
        for k, v in body.model_dump(exclude_unset=True).items():
            setattr(s, k, v)
        return self.repo.actualizar_solicitud(s)
