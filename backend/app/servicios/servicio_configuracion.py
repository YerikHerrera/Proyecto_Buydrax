"""Servicio de configuración — EP-82 … EP-86."""

from typing import Sequence
from sqlalchemy.orm import Session
from app.modelos import Configuracion
from app.nucleo.excepciones import NotFoundError
from app.repositorios.repositorio_configuracion import RepositorioConfiguracion
from app.esquemas.negocio import ConfiguracionCreate, ConfiguracionUpdate

class ServicioConfiguracion:
    def __init__(self, db: Session):
        self.repo = RepositorioConfiguracion(db)

    def listar(self) -> Sequence[Configuracion]:
        return self.repo.listar()

    def obtener(self, id_configuracion: int) -> Configuracion:
        c = self.repo.get(id_configuracion)
        if c is None:
            raise NotFoundError("Configuración no encontrada")
        return c

    def crear(self, body: ConfiguracionCreate) -> Configuracion:
        c = Configuracion(**body.model_dump())
        return self.repo.crear(c)

    def actualizar(self, id_configuracion: int, body: ConfiguracionUpdate) -> Configuracion:
        c = self.obtener(id_configuracion)
        for k, v in body.model_dump(exclude_unset=True).items():
            setattr(c, k, v)
        return self.repo.actualizar(c)

    def historial(self, id_configuracion: int):
        self.obtener(id_configuracion)  # 404 si no existe
        rows = self.repo.listar_historial(id_configuracion)
        return [
            {
                "id_cambio": r.id_cambio,
                "campo": r.campo,
                "valor_anterior": r.valor_anterior,
                "valor_nuevo": r.valor_nuevo,
                "id_modificado_por": getattr(r, "id_modificado_por", None),
                "fecha_cambio": r.fecha_cambio.isoformat() if getattr(r, "fecha_cambio", None) else None,
            }
            for r in rows
        ]
