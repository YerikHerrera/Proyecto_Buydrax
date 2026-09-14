"""Endpoints de asistencias — capa HTTP delgada."""

from typing import Optional

from fastapi import APIRouter, Query

from app.nucleo.dependencias import CurrentUser, DbSession
from app.esquemas.negocio import AsistenciaCreate, AsistenciaOut
from app.servicios.servicio_asistencias import ServicioAsistencias

router = APIRouter(tags=["Asistencias"])


@router.post("/empleados/{id_empleado}/asistencias", response_model=AsistenciaOut, status_code=201, summary="EP-26 Registrar asistencia")
def registrar_asistencia(id_empleado: int, body: AsistenciaCreate, db: DbSession, actor: CurrentUser):
    return ServicioAsistencias(db).registrar(id_empleado, body)


@router.get("/empleados/{id_empleado}/asistencias", response_model=list[AsistenciaOut], summary="EP-27 Listar asistencias")
def listar_asistencias(id_empleado: int, db: DbSession, actor: CurrentUser):
    return ServicioAsistencias(db).listar_empleado(id_empleado)


@router.get("/asistencias", response_model=list[AsistenciaOut], summary="Listar asistencias (control)")
def listar_todas_asistencias(
    db: DbSession,
    actor: CurrentUser,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
):
    """Listado global para supervisores/admin (control operativo)."""
    return ServicioAsistencias(db).listar_todas(skip=skip, limit=limit)


@router.get("/asistencias/{id_asistencia}", response_model=AsistenciaOut, summary="EP-28 Consultar asistencia")
def consultar_asistencia(id_asistencia: int, db: DbSession, actor: CurrentUser):
    return ServicioAsistencias(db).obtener(id_asistencia)
