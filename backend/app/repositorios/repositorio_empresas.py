from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.modelos.empresa import Empresa


class RepositorioEmpresas:
    def __init__(self, db: Session):
        self.db = db

    def get(self, id_empresa: int) -> Optional[Empresa]:
        return self.db.get(Empresa, id_empresa)

    def get_by_dominio(self, dominio: str) -> Optional[Empresa]:
        stmt = select(Empresa).where(func.lower(Empresa.dominio) == dominio.lower().strip())
        return self.db.execute(stmt).scalar_one_or_none()

    def listar(self, solo_activos: bool = False) -> list[Empresa]:
        stmt = select(Empresa).order_by(Empresa.nombre)
        if solo_activos:
            stmt = stmt.where(Empresa.activo.is_(True))
        return list(self.db.execute(stmt).scalars().all())

    def add(self, obj: Empresa) -> Empresa:
        self.db.add(obj)
        self.db.flush()
        return obj

    def commit(self) -> None:
        self.db.commit()
