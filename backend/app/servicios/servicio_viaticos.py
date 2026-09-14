"""Servicio de viáticos — EP-60 … EP-63."""

from typing import Sequence
from sqlalchemy.orm import Session
from app.modelos import Viatico
from app.nucleo.excepciones import NotFoundError
from app.repositorios.repositorio_contratos import RepositorioContratos
from app.esquemas.negocio import ViaticoCreate, ViaticoUpdate

class ServicioViaticos:
    def __init__(self, db: Session):
        self.repo = RepositorioContratos(db)

    def listar_empleado(self, id_empleado: int) -> Sequence[Viatico]:
        if self.repo.get_empleado(id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")
        return self.repo.listar_viaticos_empleado(id_empleado)

    def crear(self, id_empleado: int, body: ViaticoCreate) -> Viatico:
        if self.repo.get_empleado(id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")
        v = Viatico(id_empleado=id_empleado, **body.model_dump())
        return self.repo.crear_viatico(v)

    def obtener(self, id_viatico: int) -> Viatico:
        v = self.repo.get_viatico(id_viatico)
        if v is None:
            raise NotFoundError("Viático no encontrado")
        return v

    def gestionar(self, id_viatico: int, body: ViaticoUpdate) -> Viatico:
        v = self.obtener(id_viatico)
        for k, v_ in body.model_dump(exclude_unset=True).items():
            setattr(v, k, v_)
        return self.repo.actualizar_viatico(v)

    def listar_todos(self, id_empleado=None):
        return self.repo.listar_todos_viaticos(id_empleado=id_empleado)
