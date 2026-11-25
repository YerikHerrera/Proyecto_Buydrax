"""Repositorio de empleados — tenant por dominio del correo del usuario."""

from typing import Optional, Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modelos import Afiliacion, Empleado, HistorialLaboral, Usuario
from app.nucleo.tenant import sql_dominio_correo


class RepositorioEmpleados:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, id_empleado: int) -> Optional[Empleado]:
        return self.db.get(Empleado, id_empleado)

    def get_by_documento(self, numero_documento: str) -> Optional[Empleado]:
        return self.db.execute(
            select(Empleado).where(Empleado.numero_documento == numero_documento)
        ).scalar_one_or_none()

    def get_by_usuario(self, id_usuario: int) -> Optional[Empleado]:
        return self.db.execute(
            select(Empleado).where(Empleado.id_usuario == id_usuario)
        ).scalar_one_or_none()

    def _base(self, *, dominio: Optional[str] = None):
        q = select(Empleado).join(Usuario, Empleado.id_usuario == Usuario.id_usuario)
        q = q.where(Usuario.estado.is_(True))
        q = q.where(Empleado.estado_laboral != "RETIRADO")
        if dominio:
            q = q.where(sql_dominio_correo(Usuario.correo) == dominio.lower())
        return q

    def listar(
        self,
        *,
        documento: Optional[str] = None,
        estado: Optional[str] = None,
        supervisor: Optional[int] = None,
        dominio: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> Sequence[Empleado]:
        q = self._base(dominio=dominio)
        if documento:
            q = q.where(Empleado.numero_documento.ilike(f"%{documento}%"))
        if estado:
            q = q.where(Empleado.estado_laboral == estado.upper())
        if supervisor is not None:
            q = q.where(Empleado.id_supervisor == supervisor)
        return self.db.execute(
            q.order_by(Empleado.id_empleado).offset(skip).limit(limit)
        ).scalars().all()

    def listar_todos(self, *, dominio: Optional[str] = None) -> Sequence[Empleado]:
        return self.db.execute(self._base(dominio=dominio).order_by(Empleado.id_empleado)).scalars().all()

    def crear(self, empleado: Empleado) -> Empleado:
        self.db.add(empleado)
        self.db.commit()
        self.db.refresh(empleado)
        return empleado

    def actualizar(self, empleado: Empleado) -> Empleado:
        self.db.commit()
        self.db.refresh(empleado)
        return empleado

    def get_usuario(self, id_usuario: int) -> Optional[Usuario]:
        return self.db.get(Usuario, id_usuario)

    def get_afiliacion(self, id_empleado: int) -> Optional[Afiliacion]:
        return self.db.execute(
            select(Afiliacion).where(Afiliacion.id_empleado == id_empleado)
        ).scalar_one_or_none()

    def guardar_afiliacion(self, afiliacion: Afiliacion) -> Afiliacion:
        self.db.add(afiliacion)
        self.db.commit()
        self.db.refresh(afiliacion)
        return afiliacion

    def actualizar_afiliacion(self, afiliacion: Afiliacion) -> Afiliacion:
        self.db.commit()
        self.db.refresh(afiliacion)
        return afiliacion

    def listar_historial(self, id_empleado: int) -> Sequence[HistorialLaboral]:
        return self.db.execute(
            select(HistorialLaboral)
            .where(HistorialLaboral.id_empleado == id_empleado)
            .order_by(HistorialLaboral.id_historial.desc())
        ).scalars().all()
