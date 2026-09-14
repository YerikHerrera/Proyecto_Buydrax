"""Servicio de observaciones."""

from sqlalchemy.orm import Session


class ServicioObservaciones:
    def __init__(self, db: Session):
        self.db = db

    # La lógica de negocio se moverá aquí desde los endpoints monolíticos.
