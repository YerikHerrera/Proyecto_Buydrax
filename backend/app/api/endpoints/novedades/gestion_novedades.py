"""Endpoints de novedades — capa HTTP delgada."""

from fastapi import APIRouter
from app.nucleo.dependencias import CurrentUser, DbSession
from app.esquemas.negocio import NovedadCreate, NovedadOut, NovedadUpdate
from app.servicios.servicio_novedades import ServicioNovedades

router = APIRouter(tags=["Novedades"])

@router.get("/empleados/{id_empleado}/novedades", response_model=list[NovedadOut], summary="EP-34 Listar novedades")
def listar_novedades(id_empleado: int, db: DbSession, actor: CurrentUser):
    return ServicioNovedades(db).listar_empleado(id_empleado)

@router.post("/empleados/{id_empleado}/novedades", response_model=NovedadOut, status_code=201, summary="EP-35 Registrar novedad")
def registrar_novedad(id_empleado: int, body: NovedadCreate, db: DbSession, actor: CurrentUser):
    return ServicioNovedades(db).crear(id_empleado, body)

@router.get("/novedades/{id_novedad}", response_model=NovedadOut, summary="EP-36 Consultar novedad")
def consultar_novedad(id_novedad: int, db: DbSession, actor: CurrentUser):
    return ServicioNovedades(db).obtener(id_novedad)

@router.patch("/novedades/{id_novedad}", response_model=NovedadOut, summary="EP-37 Gestionar novedad")
def gestionar_novedad(id_novedad: int, body: NovedadUpdate, db: DbSession, actor: CurrentUser):
    return ServicioNovedades(db).gestionar(id_novedad, body)
