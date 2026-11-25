"""Endpoints de cuadrillas y vínculo a proyectos."""

from typing import Optional

from fastapi import APIRouter, Query

from app.esquemas.negocio.cuadrilla import (
    CuadrillaCreate,
    CuadrillaOut,
    CuadrillaProyectoLink,
    CuadrillaProyectoOut,
    CuadrillaUpdate,
    DesvincularOpciones,
)
from app.nucleo.dependencias import AdminSupervisorUser, CurrentUser, DbSession
from app.servicios.servicio_cuadrillas import ServicioCuadrillas

router = APIRouter(tags=["Cuadrillas"])


@router.get("/cuadrillas", response_model=list[CuadrillaOut], summary="Listar cuadrillas")
def listar_cuadrillas(
    db: DbSession,
    actor: CurrentUser,
    solo_activas: bool = Query(True),
):
    return ServicioCuadrillas(db).listar(solo_activas=solo_activas)


@router.post("/cuadrillas", response_model=CuadrillaOut, status_code=201, summary="Crear cuadrilla")
def crear_cuadrilla(body: CuadrillaCreate, db: DbSession, actor: AdminSupervisorUser):
    return ServicioCuadrillas(db).crear(body)


@router.patch("/cuadrillas/{id_cuadrilla}", response_model=CuadrillaOut, summary="Actualizar cuadrilla")
def actualizar_cuadrilla(id_cuadrilla: int, body: CuadrillaUpdate, db: DbSession, actor: AdminSupervisorUser):
    return ServicioCuadrillas(db).actualizar(id_cuadrilla, body)


@router.get(
    "/cuadrillas/vinculos",
    response_model=list[CuadrillaProyectoOut],
    summary="Listar vínculos cuadrilla–proyecto",
)
def listar_vinculos(
    db: DbSession,
    actor: CurrentUser,
    id_cuadrilla: Optional[int] = None,
    id_proyecto: Optional[int] = None,
    solo_activos: bool = Query(True),
):
    return ServicioCuadrillas(db).listar_vinculos(
        id_cuadrilla=id_cuadrilla, id_proyecto=id_proyecto, solo_activos=solo_activos
    )


@router.post(
    "/cuadrillas/{id_cuadrilla}/proyectos",
    response_model=CuadrillaProyectoOut,
    status_code=201,
    summary="Asignar cuadrilla a un proyecto",
)
def vincular_proyecto(id_cuadrilla: int, body: CuadrillaProyectoLink, db: DbSession, actor: AdminSupervisorUser):
    return ServicioCuadrillas(db).vincular_a_proyecto(id_cuadrilla, body)


@router.post(
    "/cuadrillas/{id_cuadrilla}/proyectos/{id_proyecto}/desvincular",
    summary="Quitar cuadrilla de un proyecto",
)
def desvincular_proyecto(
    id_cuadrilla: int,
    id_proyecto: int,
    body: DesvincularOpciones,
    db: DbSession,
    actor: AdminSupervisorUser,
):
    return ServicioCuadrillas(db).desvincular_de_proyecto(
        id_cuadrilla, id_proyecto, forzar=body.forzar
    )
