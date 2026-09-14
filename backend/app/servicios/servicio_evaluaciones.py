"""Servicio de evaluaciones y observaciones — EP-87 … EP-94."""

from typing import Sequence
from sqlalchemy.orm import Session
from app.modelos import EvaluacionDesempeno, Observacion
from app.nucleo.excepciones import NotFoundError
from app.repositorios.repositorio_evaluaciones import RepositorioEvaluaciones
from app.esquemas.negocio import (
    EvaluacionCreate, EvaluacionUpdate, ObservacionCreate, ObservacionUpdate,
)
from app.api.endpoints._compartido.helpers import supervisor_id_of

class ServicioEvaluaciones:
    def __init__(self, db: Session):
        self.repo = RepositorioEvaluaciones(db)
        self.db = db

    def listar_evaluaciones(self, id_empleado: int) -> Sequence[EvaluacionDesempeno]:
        if self.repo.get_empleado(id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")
        return self.repo.listar_evaluaciones(id_empleado)

    def obtener_evaluacion(self, id_evaluacion: int) -> EvaluacionDesempeno:
        e = self.repo.get_evaluacion(id_evaluacion)
        if e is None:
            raise NotFoundError("Evaluación no encontrada")
        return e

    def crear_evaluacion(self, id_empleado: int, body: EvaluacionCreate, actor) -> EvaluacionDesempeno:
        if self.repo.get_empleado(id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")
        data = body.model_dump()
        sid = supervisor_id_of(self.db, actor)
        if sid:
            data.setdefault("id_supervisor", sid)
        e = EvaluacionDesempeno(id_empleado=id_empleado, **data)
        return self.repo.crear_evaluacion(e)

    def actualizar_evaluacion(self, id_evaluacion: int, body: EvaluacionUpdate) -> EvaluacionDesempeno:
        e = self.obtener_evaluacion(id_evaluacion)
        for k, v in body.model_dump(exclude_unset=True).items():
            setattr(e, k, v)
        return self.repo.actualizar_evaluacion(e)

    def listar_observaciones(self, id_empleado: int) -> Sequence[Observacion]:
        if self.repo.get_empleado(id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")
        return self.repo.listar_observaciones(id_empleado)

    def crear_observacion(self, id_empleado: int, body: ObservacionCreate, actor) -> Observacion:
        if self.repo.get_empleado(id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")
        data = body.model_dump()
        sid = supervisor_id_of(self.db, actor)
        if sid:
            data.setdefault("id_supervisor", sid)
        o = Observacion(id_empleado=id_empleado, **data)
        return self.repo.crear_observacion(o)

    def obtener_observacion(self, id_observacion: int) -> Observacion:
        o = self.repo.get_observacion(id_observacion)
        if o is None:
            raise NotFoundError("Observación no encontrada")
        return o

    def actualizar_observacion(self, id_observacion: int, body: ObservacionUpdate) -> Observacion:
        o = self.obtener_observacion(id_observacion)
        for k, v in body.model_dump(exclude_unset=True).items():
            setattr(o, k, v)
        return self.repo.actualizar_observacion(o)
