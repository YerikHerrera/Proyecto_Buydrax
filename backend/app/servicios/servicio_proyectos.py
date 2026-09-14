"""Servicio de proyectos — lógica de negocio EP-42 … EP-46."""

from typing import Optional, Sequence

from sqlalchemy.orm import Session

from app.modelos import Proyecto
from app.nucleo.excepciones import NotFoundError, ValidationAppError
from app.repositorios.repositorio_proyectos import RepositorioProyectos
from app.esquemas.negocio import ProyectoCreate, ProyectoUpdate


class ServicioProyectos:
    def __init__(self, db: Session):
        self.repo = RepositorioProyectos(db)

    def listar(self, *, estado: Optional[str] = None) -> Sequence[Proyecto]:
        return self.repo.listar(estado=estado)

    def obtener(self, id_proyecto: int) -> Proyecto:
        p = self.repo.get_by_id(id_proyecto)
        if p is None:
            raise NotFoundError("Proyecto no encontrado")
        return p

    def crear(self, body: ProyectoCreate) -> Proyecto:
        if body.fecha_inicio >= body.fecha_fin:
            raise ValidationAppError("fecha_inicio debe ser menor que fecha_fin")
        if self.repo.get_supervisor(body.id_supervisor) is None:
            raise NotFoundError("Supervisor no encontrado")
        p = Proyecto(**body.model_dump())
        return self.repo.crear(p)

    def actualizar(self, id_proyecto: int, body: ProyectoUpdate) -> Proyecto:
        p = self.obtener(id_proyecto)
        for k, v in body.model_dump(exclude_unset=True).items():
            setattr(p, k, v)
        return self.repo.actualizar(p)

    def suspender(self, id_proyecto: int) -> None:
        p = self.obtener(id_proyecto)
        p.estado_proyecto = "SUSPENDIDO"
        self.repo.actualizar(p)
