"""Servicio de nóminas — EP-68 … EP-77."""

from typing import Any, Sequence
from sqlalchemy.orm import Session
from app.modelos import Nomina
from app.nucleo.excepciones import NotFoundError, InvalidStateError
from app.repositorios.repositorio_nominas import RepositorioNominas
from app.esquemas.negocio import NominaCreate, NominaUpdate
from app.api.endpoints._compartido.helpers import admin_rrhh_id_of

class ServicioNominas:
    def __init__(self, db: Session):
        self.repo = RepositorioNominas(db)
        self.db = db

    def crear(self, body: NominaCreate, actor) -> Nomina:
        admin_id = admin_rrhh_id_of(self.db, actor)
        data = body.model_dump()
        if admin_id:
            data.setdefault("id_admin_rrhh", admin_id)
        n = Nomina(**data)
        return self.repo.crear_nomina(n)

    def listar(self) -> Sequence[Nomina]:
        return self.repo.listar_nominas()

    def obtener(self, id_nomina: int) -> Nomina:
        n = self.repo.get_nomina(id_nomina)
        if n is None:
            raise NotFoundError("Nómina no encontrada")
        return n

    def calcular(self, id_nomina: int) -> dict[str, Any]:
        n = self.obtener(id_nomina)
        return {
            "id_nomina": n.id_nomina,
            "message": "Cálculo de nómina pendiente: fórmulas no definidas en fuentes",
            "estado": getattr(n, "estado_nomina", None),
        }

    def listar_detalles(self, id_nomina: int):
        self.obtener(id_nomina)
        return self.repo.listar_detalles(id_nomina)

    def obtener_detalle(self, id_nomina: int, id_detalle: int):
        self.obtener(id_nomina)
        d = self.repo.get_detalle(id_detalle)
        if d is None:
            raise NotFoundError("Detalle de nómina no encontrado")
        return d

    def actualizar(self, id_nomina: int, body: NominaUpdate) -> Nomina:
        n = self.obtener(id_nomina)
        for k, v in body.model_dump(exclude_unset=True).items():
            setattr(n, k, v)
        return self.repo.actualizar_nomina(n)

    def desprendibles_empleado(self, id_empleado: int):
        if self.repo.get_empleado(id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")
        return self.repo.listar_desprendibles_empleado(id_empleado)

    def obtener_desprendible(self, id_desprendible: int):
        d = self.repo.get_desprendible(id_desprendible)
        if d is None:
            raise NotFoundError("Desprendible no encontrado")
        return d
