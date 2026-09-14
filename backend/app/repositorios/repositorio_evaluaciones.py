"""Repositorio de evaluaciones y observaciones."""

from typing import Optional, Sequence
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.modelos import Empleado, EvaluacionDesempeno, Observacion

class RepositorioEvaluaciones:
    def __init__(self, db: Session):
        self.db = db

    def get_empleado(self, id_empleado: int):
        return self.db.get(Empleado, id_empleado)

    def get_evaluacion(self, id_eval: int) -> Optional[EvaluacionDesempeno]:
        return self.db.get(EvaluacionDesempeno, id_eval)

    def listar_evaluaciones(self, id_empleado: int) -> Sequence[EvaluacionDesempeno]:
        return self.db.execute(
            select(EvaluacionDesempeno).where(EvaluacionDesempeno.id_empleado == id_empleado)
        ).scalars().all()

    def crear_evaluacion(self, obj: EvaluacionDesempeno) -> EvaluacionDesempeno:
        self.db.add(obj); self.db.commit(); self.db.refresh(obj); return obj

    def actualizar_evaluacion(self, obj: EvaluacionDesempeno) -> EvaluacionDesempeno:
        self.db.commit(); self.db.refresh(obj); return obj

    def get_observacion(self, id_obs: int) -> Optional[Observacion]:
        return self.db.get(Observacion, id_obs)

    def listar_observaciones(self, id_empleado: int) -> Sequence[Observacion]:
        return self.db.execute(
            select(Observacion).where(Observacion.id_empleado == id_empleado)
        ).scalars().all()

    def crear_observacion(self, obj: Observacion) -> Observacion:
        self.db.add(obj); self.db.commit(); self.db.refresh(obj); return obj

    def actualizar_observacion(self, obj: Observacion) -> Observacion:
        self.db.commit(); self.db.refresh(obj); return obj
