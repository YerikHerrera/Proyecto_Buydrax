"""Endpoints de supervisores — capa HTTP delgada."""

from fastapi import APIRouter, Body

from app.nucleo.dependencias import AdminRrhhUser, CurrentUser, DbSession
from app.nucleo.excepciones import ValidationAppError
from app.esquemas.negocio import EmpleadoOut, ProyectoOut, SupervisorOut
from app.servicios.servicio_supervisores import ServicioSupervisores

router = APIRouter(tags=["Supervisores"])


@router.get("/supervisores", response_model=list[SupervisorOut], summary="EP-22 Listar supervisores")
def listar_supervisores(db: DbSession, actor: CurrentUser):
    return ServicioSupervisores(db).listar()


@router.patch("/empleados/{id_empleado}/supervisor", response_model=EmpleadoOut, summary="EP-23 Asignar supervisor")
def asignar_supervisor(
    id_empleado: int,
    db: DbSession,
    actor: AdminRrhhUser,
    body: dict = Body(...),
):
    id_sup = body.get("id_supervisor") or body.get("idSupervisor")
    if id_sup is None:
        raise ValidationAppError("id_supervisor es obligatorio")
    return ServicioSupervisores(db).asignar_a_empleado(id_empleado, int(id_sup))


@router.get("/supervisores/{id_supervisor}/empleados", response_model=list[EmpleadoOut], summary="EP-24 Empleados del supervisor")
def empleados_del_supervisor(id_supervisor: int, db: DbSession, actor: CurrentUser):
    return ServicioSupervisores(db).empleados_del_supervisor(id_supervisor)


@router.get("/supervisores/{id_supervisor}/proyectos", response_model=list[ProyectoOut], summary="EP-25 Proyectos del supervisor")
def proyectos_del_supervisor(id_supervisor: int, db: DbSession, actor: CurrentUser):
    return ServicioSupervisores(db).proyectos_del_supervisor(id_supervisor)
