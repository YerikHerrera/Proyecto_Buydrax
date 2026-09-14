"""Servicio de asistencias — EP-26 … EP-28."""

from typing import Sequence
from sqlalchemy.orm import Session
from app.modelos import Asistencia
from app.nucleo.excepciones import NotFoundError
from app.repositorios.repositorio_asistencias import RepositorioAsistencias
from app.esquemas.negocio import AsistenciaCreate

class ServicioAsistencias:
    def __init__(self, db: Session):
        self.repo = RepositorioAsistencias(db)

    def registrar(self, id_empleado: int, body: AsistenciaCreate) -> Asistencia:
        if self.repo.get_empleado(id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")
        a = Asistencia(id_empleado=id_empleado, **body.model_dump())
        return self.repo.crear_asistencia(a)

    def listar_empleado(self, id_empleado: int) -> Sequence[Asistencia]:
        if self.repo.get_empleado(id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")
        return self.repo.listar_asistencias_empleado(id_empleado)

    def obtener(self, id_asistencia: int) -> Asistencia:
        a = self.repo.get_asistencia(id_asistencia)
        if a is None:
            raise NotFoundError("Asistencia no encontrada")
        return a

    def listar_todas(self, skip: int = 0, limit: int = 100):
        return self.repo.listar_todas_asistencias(skip=skip, limit=limit)
