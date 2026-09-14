"""Repositorio de novedades y horas extra."""

from typing import Optional, Sequence
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.modelos import Empleado, HoraExtra, Novedad

class RepositorioNovedades:
    def __init__(self, db: Session):
        self.db = db

    def get_empleado(self, id_empleado: int):
        return self.db.get(Empleado, id_empleado)

    def get_novedad(self, id_novedad: int) -> Optional[Novedad]:
        return self.db.get(Novedad, id_novedad)

    def listar_novedades_empleado(self, id_empleado: int) -> Sequence[Novedad]:
        return self.db.execute(
            select(Novedad).where(Novedad.id_empleado == id_empleado)
        ).scalars().all()

    def crear_novedad(self, obj: Novedad) -> Novedad:
        self.db.add(obj); self.db.commit(); self.db.refresh(obj); return obj

    def actualizar_novedad(self, obj: Novedad) -> Novedad:
        self.db.commit(); self.db.refresh(obj); return obj

    def get_hora_extra(self, id_he: int) -> Optional[HoraExtra]:
        return self.db.get(HoraExtra, id_he)

    def listar_horas_extra(self, id_empleado=None, estado=None) -> Sequence[HoraExtra]:
        q = select(HoraExtra)
        if id_empleado is not None:
            q = q.where(HoraExtra.id_empleado == id_empleado)
        if estado:
            q = q.where(HoraExtra.estado_he == estado.upper())
        return self.db.execute(q.order_by(HoraExtra.id_hora_extra.desc())).scalars().all()

    def crear_hora_extra(self, obj: HoraExtra) -> HoraExtra:
        self.db.add(obj); self.db.commit(); self.db.refresh(obj); return obj

    def actualizar_hora_extra(self, obj: HoraExtra) -> HoraExtra:
        self.db.commit(); self.db.refresh(obj); return obj
