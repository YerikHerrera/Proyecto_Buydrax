"""Repositorio de asistencias y turnos."""

from typing import Optional, Sequence
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.modelos import Asistencia, Empleado, Turno

class RepositorioAsistencias:
    def __init__(self, db: Session):
        self.db = db

    def get_asistencia(self, id_asistencia: int) -> Optional[Asistencia]:
        return self.db.get(Asistencia, id_asistencia)

    def listar_asistencias_empleado(self, id_empleado: int) -> Sequence[Asistencia]:
        return self.db.execute(
            select(Asistencia).where(Asistencia.id_empleado == id_empleado).order_by(Asistencia.id_asistencia.desc())
        ).scalars().all()

    def crear_asistencia(self, obj: Asistencia) -> Asistencia:
        self.db.add(obj); self.db.commit(); self.db.refresh(obj); return obj

    def get_empleado(self, id_empleado: int) -> Optional[Empleado]:
        return self.db.get(Empleado, id_empleado)

    def get_turno(self, id_turno: int) -> Optional[Turno]:
        return self.db.get(Turno, id_turno)

    def listar_turnos(self) -> Sequence[Turno]:
        return self.db.execute(select(Turno).order_by(Turno.id_turno)).scalars().all()

    def crear_turno(self, obj: Turno) -> Turno:
        self.db.add(obj); self.db.commit(); self.db.refresh(obj); return obj

    def actualizar_turno(self, obj: Turno) -> Turno:
        self.db.commit(); self.db.refresh(obj); return obj

    def eliminar_turno(self, obj: Turno) -> None:
        self.db.delete(obj); self.db.commit()

    def listar_todas_asistencias(self, skip: int = 0, limit: int = 100):
        from sqlalchemy import select
        from app.modelos import Asistencia
        return self.db.execute(
            select(Asistencia).order_by(Asistencia.fecha.desc()).offset(skip).limit(limit)
        ).scalars().all()
