"""Servicio de supervisores — EP-22 … EP-25."""

from typing import Sequence
from sqlalchemy.orm import Session
from app.modelos import Empleado, Proyecto, Supervisor
from app.nucleo.excepciones import NotFoundError, ValidationAppError
from app.repositorios.repositorio_empleados import RepositorioEmpleados
from app.repositorios.repositorio_proyectos import RepositorioProyectos
from sqlalchemy import select

class ServicioSupervisores:
    def __init__(self, db: Session):
        self.db = db
        self.repo_emp = RepositorioEmpleados(db)
        self.repo_proy = RepositorioProyectos(db)

    def listar(self) -> Sequence[Supervisor]:
        return self.repo_emp.listar_supervisores()

    def asignar_a_empleado(self, id_empleado: int, id_supervisor: int) -> Empleado:
        emp = self.repo_emp.get_by_id(id_empleado)
        if emp is None:
            raise NotFoundError("Empleado no encontrado")
        if self.repo_emp.get_supervisor(id_supervisor) is None:
            raise NotFoundError("Supervisor no encontrado")
        emp.id_supervisor = id_supervisor
        return self.repo_emp.actualizar(emp)

    def empleados_del_supervisor(self, id_supervisor: int) -> Sequence[Empleado]:
        if self.repo_emp.get_supervisor(id_supervisor) is None:
            raise NotFoundError("Supervisor no encontrado")
        return self.repo_emp.listar_empleados_supervisor(id_supervisor)

    def proyectos_del_supervisor(self, id_supervisor: int) -> Sequence[Proyecto]:
        if self.repo_emp.get_supervisor(id_supervisor) is None:
            raise NotFoundError("Supervisor no encontrado")
        return self.db.execute(
            select(Proyecto).where(Proyecto.id_supervisor == id_supervisor)
        ).scalars().all()
