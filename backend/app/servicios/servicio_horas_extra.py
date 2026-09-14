"""Servicio de horas extra — EP-38 … EP-41."""

from typing import Optional, Sequence
from sqlalchemy.orm import Session
from app.modelos import HoraExtra
from app.nucleo.excepciones import NotFoundError
from app.repositorios.repositorio_novedades import RepositorioNovedades
from app.esquemas.negocio import HoraExtraCreate, HoraExtraUpdate
from app.api.endpoints._compartido.helpers import supervisor_id_of

class ServicioHorasExtra:
    def __init__(self, db: Session):
        self.repo = RepositorioNovedades(db)
        self.db = db

    def listar(self, id_empleado: Optional[int] = None, estado: Optional[str] = None) -> Sequence[HoraExtra]:
        return self.repo.listar_horas_extra(id_empleado=id_empleado, estado=estado)

    def crear(self, id_empleado: int, body: HoraExtraCreate, actor) -> HoraExtra:
        if self.repo.get_empleado(id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")
        data = body.model_dump()
        he = HoraExtra(id_empleado=id_empleado, **data)
        return self.repo.crear_hora_extra(he)

    def obtener(self, id_hora_extra: int) -> HoraExtra:
        he = self.repo.get_hora_extra(id_hora_extra)
        if he is None:
            raise NotFoundError("Hora extra no encontrada")
        return he

    def gestionar(self, id_hora_extra: int, body: HoraExtraUpdate, actor) -> HoraExtra:
        he = self.obtener(id_hora_extra)
        for k, v in body.model_dump(exclude_unset=True).items():
            setattr(he, k, v)
        return self.repo.actualizar_hora_extra(he)
