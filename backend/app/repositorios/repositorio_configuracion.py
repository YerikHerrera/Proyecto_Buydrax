"""Repositorio de configuración del sistema."""

from typing import Optional, Sequence
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.modelos import Configuracion

class RepositorioConfiguracion:
    def __init__(self, db: Session):
        self.db = db

    def get(self, id_configuracion: int) -> Optional[Configuracion]:
        return self.db.get(Configuracion, id_configuracion)

    def listar(self) -> Sequence[Configuracion]:
        return self.db.execute(select(Configuracion).order_by(Configuracion.id_configuracion)).scalars().all()

    def crear(self, obj: Configuracion) -> Configuracion:
        self.db.add(obj); self.db.commit(); self.db.refresh(obj); return obj

    def actualizar(self, obj: Configuracion) -> Configuracion:
        self.db.commit(); self.db.refresh(obj); return obj

    def listar_historial(self, id_configuracion: int):
        from sqlalchemy import select
        from app.modelos import CambioConfiguracion
        return self.db.execute(
            select(CambioConfiguracion)
            .where(CambioConfiguracion.id_configuracion == id_configuracion)
            .order_by(CambioConfiguracion.fecha_cambio.desc())
        ).scalars().all()
