"""Servicio de certificaciones — EP-18 … EP-21."""

from typing import Sequence
from sqlalchemy.orm import Session
from app.modelos import Certificacion
from app.nucleo.excepciones import NotFoundError
from app.repositorios.repositorio_empleados import RepositorioEmpleados
from app.esquemas.negocio import CertificacionCreate, CertificacionUpdate

class ServicioCertificaciones:
    def __init__(self, db: Session):
        self.repo = RepositorioEmpleados(db)

    def listar(self, id_empleado: int) -> Sequence[Certificacion]:
        if self.repo.get_by_id(id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")
        return self.repo.listar_certificaciones(id_empleado)

    def crear(self, id_empleado: int, body: CertificacionCreate) -> Certificacion:
        if self.repo.get_by_id(id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")
        c = Certificacion(id_empleado=id_empleado, **body.model_dump())
        return self.repo.crear_certificacion(c)

    def actualizar(self, id_certificacion: int, body: CertificacionUpdate) -> Certificacion:
        c = self.repo.get_certificacion(id_certificacion)
        if c is None:
            raise NotFoundError("Certificación no encontrada")
        for k, v in body.model_dump(exclude_unset=True).items():
            setattr(c, k, v)
        return self.repo.actualizar_certificacion(c)

    def obtener(self, id_certificacion: int) -> Certificacion:
        c = self.repo.get_certificacion(id_certificacion)
        if c is None:
            raise NotFoundError("Certificación no encontrada")
        return c
