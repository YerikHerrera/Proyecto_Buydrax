"""Servicio de liquidaciones — EP-64 … EP-67."""

from typing import Any, Sequence
from sqlalchemy.orm import Session
from app.modelos import Liquidacion
from app.nucleo.excepciones import NotFoundError
from app.repositorios.repositorio_nominas import RepositorioNominas
from app.esquemas.negocio import LiquidacionCreate, LiquidacionOut

class ServicioLiquidaciones:
    def __init__(self, db: Session):
        self.repo = RepositorioNominas(db)

    def listar(self) -> Sequence[Liquidacion]:
        return self.repo.listar_liquidaciones()

    def obtener(self, id_liquidacion: int) -> Liquidacion:
        liq = self.repo.get_liquidacion(id_liquidacion)
        if liq is None:
            raise NotFoundError("Liquidación no encontrada")
        return liq

    def crear(self, id_empleado: int, body: LiquidacionCreate) -> Liquidacion:
        emp = self.repo.get_empleado(id_empleado)
        if emp is None:
            raise NotFoundError("Empleado no encontrado")
        if self.repo.get_configuracion(body.id_configuracion) is None:
            raise NotFoundError("Configuración no encontrada")
        liq = Liquidacion(id_empleado=id_empleado, **body.model_dump())
        liq = self.repo.crear_liquidacion(liq)
        emp.estado_laboral = "RETIRADO"
        user = self.repo.get_usuario(emp.id_usuario)
        if user:
            user.estado = False
            self.repo.db.commit()
        return liq

    def documento(self, id_liquidacion: int) -> dict[str, Any]:
        liq = self.obtener(id_liquidacion)
        return {
            "id_liquidacion": liq.id_liquidacion,
            "message": "Documento generado a partir de datos registrados",
            "data": LiquidacionOut.model_validate(liq).model_dump(mode="json"),
            "nota": "Formato de archivo oficial pendiente de definición en fuentes",
        }
