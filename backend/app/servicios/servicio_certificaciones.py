"""Servicio de certificaciones — EP-18 … EP-21."""

from datetime import date, timedelta
from typing import Sequence

from sqlalchemy.orm import Session

from app.modelos import Certificacion
from app.nucleo.excepciones import NotFoundError, ValidationAppError
from app.repositorios.repositorio_empleados import RepositorioEmpleados
from app.esquemas.negocio import CertificacionCreate, CertificacionUpdate


def _estado_por_fechas(emision: date, vencimiento: date, hoy: date | None = None) -> str:
    if emision > vencimiento:
        raise ValidationAppError(
            "La fecha de obtención/emisión no puede ser posterior a la de vencimiento."
        )
    ref = hoy or date.today()
    if vencimiento < ref:
        return "VENCIDO"
    if vencimiento <= ref + timedelta(days=30):
        return "PROXIMO_VENCER"
    return "ACTIVO"


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
        data = body.model_dump()
        data["estado_certificacion"] = _estado_por_fechas(
            data["fecha_emision"], data["fecha_vencimiento"]
        )
        c = Certificacion(id_empleado=id_empleado, **data)
        return self.repo.crear_certificacion(c)

    def actualizar(self, id_certificacion: int, body: CertificacionUpdate) -> Certificacion:
        c = self.repo.get_certificacion(id_certificacion)
        if c is None:
            raise NotFoundError("Certificación no encontrada")
        data = body.model_dump(exclude_unset=True)
        emision = data.get("fecha_emision", c.fecha_emision)
        venc = data.get("fecha_vencimiento", c.fecha_vencimiento)
        if "fecha_emision" in data or "fecha_vencimiento" in data or "estado_certificacion" not in data:
            data["estado_certificacion"] = _estado_por_fechas(emision, venc)
        for k, v in data.items():
            setattr(c, k, v)
        return self.repo.actualizar_certificacion(c)

    def obtener(self, id_certificacion: int) -> Certificacion:
        c = self.repo.get_certificacion(id_certificacion)
        if c is None:
            raise NotFoundError("Certificación no encontrada")
        return c
