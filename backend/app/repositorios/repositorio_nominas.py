"""Repositorio de nóminas, PILA y liquidaciones."""

from typing import Optional, Sequence
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.modelos import (
    AporteEmpleado, Configuracion, Desprendible, DetalleNomina,
    Empleado, Liquidacion, Nomina, Pila, Usuario,
)

class RepositorioNominas:
    def __init__(self, db: Session):
        self.db = db

    def get_empleado(self, id_empleado: int):
        return self.db.get(Empleado, id_empleado)

    def get_usuario(self, id_usuario: int):
        return self.db.get(Usuario, id_usuario)

    def get_configuracion(self, id_config: int):
        return self.db.get(Configuracion, id_config)

    # Nomina
    def get_nomina(self, id_nomina: int) -> Optional[Nomina]:
        return self.db.get(Nomina, id_nomina)

    def listar_nominas(self) -> Sequence[Nomina]:
        return self.db.execute(select(Nomina).order_by(Nomina.id_nomina.desc())).scalars().all()

    def crear_nomina(self, obj: Nomina) -> Nomina:
        self.db.add(obj); self.db.commit(); self.db.refresh(obj); return obj

    def actualizar_nomina(self, obj: Nomina) -> Nomina:
        self.db.commit(); self.db.refresh(obj); return obj

    def listar_detalles(self, id_nomina: int) -> Sequence[DetalleNomina]:
        return self.db.execute(select(DetalleNomina).where(DetalleNomina.id_nomina == id_nomina)).scalars().all()

    def get_detalle(self, id_detalle: int) -> Optional[DetalleNomina]:
        return self.db.get(DetalleNomina, id_detalle)

    def listar_desprendibles_empleado(self, id_empleado: int) -> Sequence[Desprendible]:
        return self.db.execute(select(Desprendible).where(Desprendible.id_empleado == id_empleado)).scalars().all()

    def get_desprendible(self, id_desprendible: int) -> Optional[Desprendible]:
        return self.db.get(Desprendible, id_desprendible)

    # PILA
    def get_pila(self, id_pila: int) -> Optional[Pila]:
        return self.db.get(Pila, id_pila)

    def get_pila_por_nomina(self, id_nomina: int) -> Optional[Pila]:
        return self.db.execute(select(Pila).where(Pila.id_nomina == id_nomina)).scalar_one_or_none()

    def crear_pila(self, obj: Pila) -> Pila:
        self.db.add(obj); self.db.commit(); self.db.refresh(obj); return obj

    def listar_aportes(self, id_pila: int) -> Sequence[AporteEmpleado]:
        return self.db.execute(select(AporteEmpleado).where(AporteEmpleado.id_pila == id_pila)).scalars().all()

    # Liquidacion
    def get_liquidacion(self, id_liquidacion: int) -> Optional[Liquidacion]:
        return self.db.get(Liquidacion, id_liquidacion)

    def listar_liquidaciones(self) -> Sequence[Liquidacion]:
        return self.db.execute(select(Liquidacion).order_by(Liquidacion.id_liquidacion.desc())).scalars().all()

    def crear_liquidacion(self, obj: Liquidacion) -> Liquidacion:
        self.db.add(obj); self.db.commit(); self.db.refresh(obj); return obj
