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
        id_usuario_supervisor: Optional[int] = None,
    ) -> Sequence[Proyecto]:
        q = select(Proyecto)
        if not incluir_eliminados:
            q = q.where(Proyecto.estado_proyecto != "FINALIZADO")
        if id_usuario_supervisor is not None:
            # Sin ficha de supervisor la subconsulta queda vacía: no ve ningún proyecto
            q = q.where(
                Proyecto.id_supervisor.in_(
                    select(Supervisor.id_supervisor).where(
                        Supervisor.id_usuario == id_usuario_supervisor
                    )
                )
            )
        if estado:
            q = q.where(Proyecto.estado_proyecto == estado.upper())
        if dominio:
            q = (
                q.join(Supervisor, Proyecto.id_supervisor == Supervisor.id_supervisor)
                .join(Usuario, Supervisor.id_usuario == Usuario.id_usuario)
                .where(sql_dominio_correo(Usuario.correo) == dominio.lower())
            )
        return self.db.execute(q.order_by(Proyecto.id_proyecto.desc())).scalars().all()

    def es_del_supervisor(self, proyecto: Proyecto, id_usuario: int) -> bool:
        supervisor = self.get_supervisor(proyecto.id_supervisor)
        return supervisor is not None and supervisor.id_usuario == id_usuario

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
        self.db.add(asig)
        self.db.commit()
        self.db.refresh(asig)
        return asig

    def actualizar_asignacion(self, asig: AsignacionProyecto) -> AsignacionProyecto:
        self.db.commit()
        self.db.refresh(asig)
        return asig
