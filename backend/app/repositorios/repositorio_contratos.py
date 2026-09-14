"""Repositorio de contratos, préstamos y viáticos."""

from typing import Optional, Sequence
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.modelos import Contrato, Empleado, Prestamo, Viatico

class RepositorioContratos:
    def __init__(self, db: Session):
        self.db = db

    def get_empleado(self, id_empleado: int):
        return self.db.get(Empleado, id_empleado)

    # Contratos
    def get_contrato(self, id_contrato: int) -> Optional[Contrato]:
        return self.db.get(Contrato, id_contrato)

    def listar_contratos_empleado(self, id_empleado: int) -> Sequence[Contrato]:
        return self.db.execute(select(Contrato).where(Contrato.id_empleado == id_empleado)).scalars().all()

    def crear_contrato(self, obj: Contrato) -> Contrato:
        self.db.add(obj); self.db.commit(); self.db.refresh(obj); return obj

    def actualizar_contrato(self, obj: Contrato) -> Contrato:
        self.db.commit(); self.db.refresh(obj); return obj

    # Préstamos
    def get_prestamo(self, id_prestamo: int) -> Optional[Prestamo]:
        return self.db.get(Prestamo, id_prestamo)

    def listar_prestamos_empleado(self, id_empleado: int) -> Sequence[Prestamo]:
        return self.db.execute(select(Prestamo).where(Prestamo.id_empleado == id_empleado)).scalars().all()

    def crear_prestamo(self, obj: Prestamo) -> Prestamo:
        self.db.add(obj); self.db.commit(); self.db.refresh(obj); return obj

    def actualizar_prestamo(self, obj: Prestamo) -> Prestamo:
        self.db.commit(); self.db.refresh(obj); return obj

    # Viáticos
    def get_viatico(self, id_viatico: int) -> Optional[Viatico]:
        return self.db.get(Viatico, id_viatico)

    def listar_viaticos_empleado(self, id_empleado: int) -> Sequence[Viatico]:
        return self.db.execute(select(Viatico).where(Viatico.id_empleado == id_empleado)).scalars().all()

    def crear_viatico(self, obj: Viatico) -> Viatico:
        self.db.add(obj); self.db.commit(); self.db.refresh(obj); return obj

    def actualizar_viatico(self, obj: Viatico) -> Viatico:
        self.db.commit(); self.db.refresh(obj); return obj

    def listar_todos_viaticos(self, id_empleado=None):
        from sqlalchemy import select
        from app.modelos import Viatico
        q = select(Viatico)
        if id_empleado is not None:
            q = q.where(Viatico.id_empleado == id_empleado)
        return self.db.execute(q.order_by(Viatico.id_viatico.desc())).scalars().all()
