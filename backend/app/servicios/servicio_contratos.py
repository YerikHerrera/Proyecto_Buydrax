"""Servicio de contratos — EP-52 … EP-55."""

from typing import Sequence
from sqlalchemy.orm import Session
from app.modelos import Contrato
from app.nucleo.excepciones import NotFoundError
from app.repositorios.repositorio_contratos import RepositorioContratos
from app.esquemas.negocio import ContratoCreate, ContratoUpdate

class ServicioContratos:
    def __init__(self, db: Session):
        self.repo = RepositorioContratos(db)

    def listar_empleado(self, id_empleado: int) -> Sequence[Contrato]:
        if self.repo.get_empleado(id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")
        return self.repo.listar_contratos_empleado(id_empleado)

    def crear(self, id_empleado: int, body: ContratoCreate) -> Contrato:
        if self.repo.get_empleado(id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")
        c = Contrato(id_empleado=id_empleado, **body.model_dump())
        return self.repo.crear_contrato(c)

    def obtener(self, id_contrato: int) -> Contrato:
        c = self.repo.get_contrato(id_contrato)
        if c is None:
            raise NotFoundError("Contrato no encontrado")
        return c

    def actualizar(self, id_contrato: int, body: ContratoUpdate) -> Contrato:
        c = self.obtener(id_contrato)
        for k, v in body.model_dump(exclude_unset=True).items():
            setattr(c, k, v)
        return self.repo.actualizar_contrato(c)
