"""Repositorio de proyectos — tenant vía supervisor → usuario.correo."""

from typing import Optional, Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modelos import AsignacionProyecto, Proyecto, Supervisor, Usuario
from app.nucleo.tenant import sql_dominio_correo


class RepositorioProyectos:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, id_proyecto: int) -> Optional[Proyecto]:
        return self.db.get(Proyecto, id_proyecto)

    def listar(
        self,
        *,
        estado: Optional[str] = None,
        dominio: Optional[str] = None,
        incluir_eliminados: bool = False,
    ) -> Sequence[Proyecto]:
        q = select(Proyecto)
        if not incluir_eliminados:
            q = q.where(Proyecto.estado_proyecto != "FINALIZADO")
        if estado:
            q = q.where(Proyecto.estado_proyecto == estado.upper())
        if dominio:
            q = (
                q.join(Supervisor, Proyecto.id_supervisor == Supervisor.id_supervisor)
                .join(Usuario, Supervisor.id_usuario == Usuario.id_usuario)
                .where(sql_dominio_correo(Usuario.correo) == dominio.lower())
            )
        return self.db.execute(q.order_by(Proyecto.id_proyecto.desc())).scalars().all()

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

    def listar_asignaciones(self, *, dominio: Optional[str] = None) -> Sequence[AsignacionProyecto]:
        q = select(AsignacionProyecto).join(Proyecto, AsignacionProyecto.id_proyecto == Proyecto.id_proyecto)
        q = q.where(Proyecto.estado_proyecto != "FINALIZADO")
        if dominio:
            q = (
                q.join(Supervisor, Proyecto.id_supervisor == Supervisor.id_supervisor)
                .join(Usuario, Supervisor.id_usuario == Usuario.id_usuario)
                .where(sql_dominio_correo(Usuario.correo) == dominio.lower())
            )
        return self.db.execute(q.order_by(AsignacionProyecto.id_asignacion)).scalars().all()

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
        existente = self.db.execute(
            select(AsignacionProyecto).where(
                AsignacionProyecto.id_proyecto == asig.id_proyecto,
                AsignacionProyecto.id_empleado == asig.id_empleado,
            )
        ).scalar_one_or_none()

        if existente is not None:
            if not existente.activo:
                existente.activo = True
                existente.cuadrilla = asig.cuadrilla
                existente.id_cuadrilla = asig.id_cuadrilla
                existente.rol_en_proyecto = asig.rol_en_proyecto
                existente.fecha_asignacion = asig.fecha_asignacion
                self.db.commit()
                self.db.refresh(existente)
                return existente
            raise ValueError(
                f"El empleado {asig.id_empleado} ya tiene una asignación activa en el proyecto {asig.id_proyecto}."
            )

        self.db.add(asig)
        self.db.commit()
        self.db.refresh(asig)
        return asig

    def actualizar_asignacion(self, asig: AsignacionProyecto) -> AsignacionProyecto:
        self.db.commit()
        self.db.refresh(asig)
        return asig