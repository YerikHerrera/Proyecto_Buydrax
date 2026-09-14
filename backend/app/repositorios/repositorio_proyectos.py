"""Repositorio de proyectos — acceso a datos de proyecto_asignacion."""

from typing import Optional, Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modelos import AsignacionProyecto, Proyecto, Supervisor


class RepositorioProyectos:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, id_proyecto: int) -> Optional[Proyecto]:
        return self.db.get(Proyecto, id_proyecto)

    def listar(self, *, estado: Optional[str] = None) -> Sequence[Proyecto]:
        q = select(Proyecto)
        if estado:
            q = q.where(Proyecto.estado_proyecto == estado.upper())
        return self.db.execute(q.order_by(Proyecto.id_proyecto)).scalars().all()

    def crear(self, proyecto: Proyecto) -> Proyecto:
        self.db.add(proyecto)
        self.db.commit()
        self.db.refresh(proyecto)
        return proyecto

    def actualizar(self, proyecto: Proyecto) -> Proyecto:
        self.db.commit()
        self.db.refresh(proyecto)
        return proyecto

    def get_supervisor(self, id_supervisor: int) -> Optional[Supervisor]:
        return self.db.get(Supervisor, id_supervisor)

    # Asignaciones
    def listar_asignaciones(self) -> Sequence[AsignacionProyecto]:
        return self.db.execute(
            select(AsignacionProyecto).order_by(AsignacionProyecto.id_asignacion)
        ).scalars().all()

    def listar_asignaciones_proyecto(self, id_proyecto: int) -> Sequence[AsignacionProyecto]:
        return self.db.execute(
            select(AsignacionProyecto).where(AsignacionProyecto.id_proyecto == id_proyecto)
        ).scalars().all()

    def listar_asignaciones_empleado(self, id_empleado: int) -> Sequence[AsignacionProyecto]:
        return self.db.execute(
            select(AsignacionProyecto).where(AsignacionProyecto.id_empleado == id_empleado)
        ).scalars().all()

    def get_asignacion(self, id_asignacion: int) -> Optional[AsignacionProyecto]:
        return self.db.get(AsignacionProyecto, id_asignacion)

    def crear_asignacion(self, asig: AsignacionProyecto) -> AsignacionProyecto:
        self.db.add(asig)
        self.db.commit()
        self.db.refresh(asig)
        return asig

    def actualizar_asignacion(self, asig: AsignacionProyecto) -> AsignacionProyecto:
        self.db.commit()
        self.db.refresh(asig)
        return asig
