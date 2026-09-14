"""Servicio de asignaciones — lógica de negocio EP-47 … EP-51."""

from typing import Sequence

from sqlalchemy.orm import Session

from app.modelos import AsignacionProyecto
from app.nucleo.excepciones import ConflictError, NotFoundError
from app.repositorios.repositorio_proyectos import RepositorioProyectos
from app.repositorios.repositorio_empleados import RepositorioEmpleados
from app.esquemas.negocio import AsignacionCreate


class ServicioAsignaciones:
    def __init__(self, db: Session):
        self.repo = RepositorioProyectos(db)
        self.repo_emp = RepositorioEmpleados(db)

    def listar(self) -> Sequence[AsignacionProyecto]:
        return self.repo.listar_asignaciones()

    def listar_por_proyecto(self, id_proyecto: int) -> Sequence[AsignacionProyecto]:
        if self.repo.get_by_id(id_proyecto) is None:
            raise NotFoundError("Proyecto no encontrado")
        return self.repo.listar_asignaciones_proyecto(id_proyecto)

    def listar_por_empleado(self, id_empleado: int) -> Sequence[AsignacionProyecto]:
        if self.repo_emp.get_by_id(id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")
        return self.repo.listar_asignaciones_empleado(id_empleado)

    def crear(self, id_proyecto: int, body: AsignacionCreate) -> AsignacionProyecto:
        if self.repo.get_by_id(id_proyecto) is None:
            raise NotFoundError("Proyecto no encontrado")
        if self.repo_emp.get_by_id(body.id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")
        # Check duplicate
        existentes = self.repo.listar_asignaciones_proyecto(id_proyecto)
        for a in existentes:
            if a.id_empleado == body.id_empleado and getattr(a, "activo", True):
                raise ConflictError("Asignación ya existe")
        a = AsignacionProyecto(id_proyecto=id_proyecto, **body.model_dump())
        return self.repo.crear_asignacion(a)

    def retirar(self, id_asignacion: int) -> AsignacionProyecto:
        a = self.repo.get_asignacion(id_asignacion)
        if a is None:
            raise NotFoundError("Asignación no encontrada")
        a.activo = False
        return self.repo.actualizar_asignacion(a)
