"""Repositorio de empleados — acceso a datos de empleado_expediente."""

from typing import Optional, Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modelos import Afiliacion, Empleado, HistorialLaboral, Usuario


class RepositorioEmpleados:
    def __init__(self, db: Session):
        self.db = db

    # ---- Empleado ----
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

    def listar(
        self,
        *,
        documento: Optional[str] = None,
        estado: Optional[str] = None,
        supervisor: Optional[int] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> Sequence[Empleado]:
        q = select(Empleado)
        if documento:
            q = q.where(Empleado.numero_documento.ilike(f"%{documento}%"))
        if estado:
            q = q.where(Empleado.estado_laboral == estado.upper())
        if supervisor is not None:
            q = q.where(Empleado.id_supervisor == supervisor)
        return self.db.execute(
            q.order_by(Empleado.id_empleado).offset(skip).limit(limit)
        ).scalars().all()

    def listar_todos(self) -> Sequence[Empleado]:
        return self.db.execute(
            select(Empleado).order_by(Empleado.id_empleado)
        ).scalars().all()

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

    # ---- Afiliación ----
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

    # ---- Historial ----
    def listar_historial(self, id_empleado: int) -> Sequence[HistorialLaboral]:
        return self.db.execute(
            select(HistorialLaboral)
            .where(HistorialLaboral.id_empleado == id_empleado)
            .order_by(HistorialLaboral.fecha_movimiento.desc())
        ).scalars().all()


    # ---- Certificaciones ----
    def listar_certificaciones(self, id_empleado: int):
        from app.modelos import Certificacion
        from sqlalchemy import select
        return self.db.execute(
            select(Certificacion).where(Certificacion.id_empleado == id_empleado)
        ).scalars().all()

    def get_certificacion(self, id_certificacion: int):
        from app.modelos import Certificacion
        return self.db.get(Certificacion, id_certificacion)

    def crear_certificacion(self, obj):
        self.db.add(obj); self.db.commit(); self.db.refresh(obj); return obj

    def actualizar_certificacion(self, obj):
        self.db.commit(); self.db.refresh(obj); return obj


    def listar_supervisores(self):
        from app.modelos import Supervisor
        from sqlalchemy import select
        return self.db.execute(select(Supervisor).order_by(Supervisor.id_supervisor)).scalars().all()

    def get_supervisor(self, id_supervisor: int):
        from app.modelos import Supervisor
        return self.db.get(Supervisor, id_supervisor)

    def listar_empleados_supervisor(self, id_supervisor: int):
        from sqlalchemy import select
        return self.db.execute(select(Empleado).where(Empleado.id_supervisor == id_supervisor)).scalars().all()
