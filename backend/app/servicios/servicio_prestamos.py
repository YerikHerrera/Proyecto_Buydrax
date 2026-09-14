"""Servicio de préstamos — EP-56 … EP-59."""

from typing import Sequence
from sqlalchemy.orm import Session
from app.modelos import Prestamo
from app.nucleo.excepciones import NotFoundError
from app.repositorios.repositorio_contratos import RepositorioContratos
from app.esquemas.negocio import PrestamoCreate, PrestamoUpdate

class ServicioPrestamos:
    def __init__(self, db: Session):
        self.repo = RepositorioContratos(db)

    def listar_empleado(self, id_empleado: int) -> Sequence[Prestamo]:
        if self.repo.get_empleado(id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")
        return self.repo.listar_prestamos_empleado(id_empleado)

    def crear(self, id_empleado: int, body: PrestamoCreate) -> Prestamo:
        if self.repo.get_empleado(id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")
        p = Prestamo(id_empleado=id_empleado, **body.model_dump())
        return self.repo.crear_prestamo(p)

    def obtener(self, id_prestamo: int) -> Prestamo:
        p = self.repo.get_prestamo(id_prestamo)
        if p is None:
            raise NotFoundError("Préstamo no encontrado")
        return p

    def actualizar(self, id_prestamo: int, body: PrestamoUpdate) -> Prestamo:
        p = self.obtener(id_prestamo)
        for k, v in body.model_dump(exclude_unset=True).items():
            setattr(p, k, v)
        return self.repo.actualizar_prestamo(p)
