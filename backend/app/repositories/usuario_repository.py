"""Acceso a datos de usuarios, perfiles y roles especializados."""

from typing import Optional, Sequence

from sqlalchemy import and_, func, or_, select
from sqlalchemy.orm import Session, joinedload

from app.models import AdminRrhh, Contador, Perfil, Supervisor, Usuario


class UsuarioRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, id_usuario: int) -> Optional[Usuario]:
        stmt = (
            select(Usuario)
            .options(
                joinedload(Usuario.perfil),
                joinedload(Usuario.supervisor),
                joinedload(Usuario.contador),
                joinedload(Usuario.admin_rrhh),
            )
            .where(Usuario.id_usuario == id_usuario)
        )
        return self.db.execute(stmt).unique().scalar_one_or_none()

    def get_by_correo(self, correo: str) -> Optional[Usuario]:
        stmt = (
            select(Usuario)
            .options(joinedload(Usuario.perfil))
            .where(func.lower(Usuario.correo) == correo.lower())
        )
        return self.db.execute(stmt).unique().scalar_one_or_none()

    def list(
        self,
        *,
        nombre: Optional[str] = None,
        correo: Optional[str] = None,
        rol: Optional[str] = None,
        estado: Optional[bool] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> tuple[Sequence[Usuario], int]:
        filters = []
        if nombre:
            pattern = f"%{nombre}%"
            filters.append(
                or_(
                    Usuario.nombres.ilike(pattern),
                    Usuario.apellidos.ilike(pattern),
                    func.concat(Usuario.nombres, " ", Usuario.apellidos).ilike(pattern),
                )
            )
        if correo:
            filters.append(Usuario.correo.ilike(f"%{correo}%"))
        if estado is not None:
            filters.append(Usuario.estado == estado)
        if rol:
            filters.append(Perfil.nombre == rol.upper())

        base = select(Usuario).options(joinedload(Usuario.perfil)).outerjoin(Perfil)
        count_stmt = select(func.count(Usuario.id_usuario)).select_from(Usuario).outerjoin(Perfil)

        if filters:
            base = base.where(and_(*filters))
            count_stmt = count_stmt.where(and_(*filters))

        total = self.db.execute(count_stmt).scalar_one()
        rows = (
            self.db.execute(base.order_by(Usuario.id_usuario).offset(skip).limit(limit))
            .unique()
            .scalars()
            .all()
        )
        return rows, total

    def get_perfil_by_nombre(self, nombre: str) -> Optional[Perfil]:
        stmt = select(Perfil).where(Perfil.nombre == nombre.upper())
        return self.db.execute(stmt).scalar_one_or_none()

    def list_perfiles(self) -> Sequence[Perfil]:
        return self.db.execute(select(Perfil).order_by(Perfil.id_perfil)).scalars().all()

    def add(self, usuario: Usuario) -> Usuario:
        self.db.add(usuario)
        self.db.flush()
        return usuario

    def add_supervisor(self, supervisor: Supervisor) -> Supervisor:
        self.db.add(supervisor)
        self.db.flush()
        return supervisor

    def add_contador(self, contador: Contador) -> Contador:
        self.db.add(contador)
        self.db.flush()
        return contador

    def add_admin_rrhh(self, admin: AdminRrhh) -> AdminRrhh:
        self.db.add(admin)
        self.db.flush()
        return admin

    def commit(self) -> None:
        self.db.commit()

    def refresh(self, obj) -> None:
        self.db.refresh(obj)
