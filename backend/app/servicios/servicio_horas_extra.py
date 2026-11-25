"""Servicio de horas extra — EP-38 … EP-41."""

from typing import Optional, Sequence

from sqlalchemy.orm import Session

from app.modelos import HoraExtra
from app.nucleo.excepciones import NotFoundError, ValidationAppError
from app.repositorios.repositorio_novedades import RepositorioNovedades
from app.esquemas.negocio import HoraExtraCreate, HoraExtraUpdate


def _max_horas_por_rango(fecha_inicio, fecha_fin) -> float:
    """Tope razonable: 16 h el mismo día; 12 h/día si el rango es mayor."""
    dias = (fecha_fin - fecha_inicio).days + 1
    if dias <= 1:
        return 16.0
    return float(dias * 12)


class ServicioHorasExtra:
    def __init__(self, db: Session):
        self.repo = RepositorioNovedades(db)
        self.db = db

    def listar(
        self, id_empleado: Optional[int] = None, estado: Optional[str] = None
    ) -> Sequence[HoraExtra]:
        return self.repo.listar_horas_extra(id_empleado=id_empleado, estado=estado)

    def crear(self, id_empleado: int, body: HoraExtraCreate, actor) -> HoraExtra:
        if self.repo.get_empleado(id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")

        if body.fecha_inicio > body.fecha_fin:
            raise ValidationAppError(
                "La fecha de inicio no puede ser posterior a la fecha de fin. "
                f"Recibido: inicio={body.fecha_inicio.isoformat()}, "
                f"fin={body.fecha_fin.isoformat()}."
            )
        if body.cantidad_horas <= 0:
            raise ValidationAppError("La cantidad de horas debe ser mayor que 0.")

        tope = _max_horas_por_rango(body.fecha_inicio, body.fecha_fin)
        if body.cantidad_horas > tope:
            dias = (body.fecha_fin - body.fecha_inicio).days + 1
            raise ValidationAppError(
                f"Cantidad de horas no realista para ese rango ({dias} día(s)). "
                f"Máximo permitido: {tope:g} h "
                f"(16 h el mismo día o 12 h por día en rangos más largos)."
            )

        data = body.model_dump()
        data.setdefault("estado_he", "PENDIENTE")
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
