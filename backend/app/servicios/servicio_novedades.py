"""Servicio de novedades — EP-34 … EP-37."""

from typing import Sequence
from sqlalchemy.orm import Session
from app.modelos import Novedad
from app.nucleo.excepciones import NotFoundError
from app.repositorios.repositorio_novedades import RepositorioNovedades
from app.esquemas.negocio import NovedadCreate, NovedadUpdate

class ServicioNovedades:
    def __init__(self, db: Session):
        self.repo = RepositorioNovedades(db)

    def listar_empleado(self, id_empleado: int) -> Sequence[Novedad]:
        if self.repo.get_empleado(id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")
        return self.repo.listar_novedades_empleado(id_empleado)

    def crear(self, id_empleado: int, body: NovedadCreate) -> Novedad:
        if self.repo.get_empleado(id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")
        n = Novedad(id_empleado=id_empleado, **body.model_dump())
        return self.repo.crear_novedad(n)

    def obtener(self, id_novedad: int) -> Novedad:
        n = self.repo.get_novedad(id_novedad)
        if n is None:
            raise NotFoundError("Novedad no encontrada")
        return n

    def gestionar(self, id_novedad: int, body: NovedadUpdate) -> Novedad:
        n = self.obtener(id_novedad)
        for k, v in body.model_dump(exclude_unset=True).items():
            setattr(n, k, v)
        return self.repo.actualizar_novedad(n)
