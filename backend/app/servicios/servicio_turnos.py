"""Servicio de turnos — EP-29 … EP-33."""

from typing import Sequence
from sqlalchemy.orm import Session
from app.modelos import Turno
from app.nucleo.excepciones import NotFoundError
from app.repositorios.repositorio_asistencias import RepositorioAsistencias
from app.esquemas.negocio import TurnoCreate, TurnoUpdate

class ServicioTurnos:
    def __init__(self, db: Session):
        self.repo = RepositorioAsistencias(db)

    def listar(self) -> Sequence[Turno]:
        return self.repo.listar_turnos()

    def obtener(self, id_turno: int) -> Turno:
        t = self.repo.get_turno(id_turno)
        if t is None:
            raise NotFoundError("Turno no encontrado")
        return t

    def crear(self, body: TurnoCreate) -> Turno:
        t = Turno(**body.model_dump())
        return self.repo.crear_turno(t)

    def actualizar(self, id_turno: int, body: TurnoUpdate) -> Turno:
        t = self.obtener(id_turno)
        for k, v in body.model_dump(exclude_unset=True).items():
            setattr(t, k, v)
        return self.repo.actualizar_turno(t)

    def eliminar(self, id_turno: int) -> None:
        t = self.obtener(id_turno)
        self.repo.eliminar_turno(t)
