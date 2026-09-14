"""Endpoints de configuración — capa HTTP delgada."""

from fastapi import APIRouter
from app.nucleo.dependencias import AdminRrhhUser, CurrentUser, DbSession
from app.esquemas.negocio import ConfiguracionCreate, ConfiguracionOut, ConfiguracionUpdate
from app.servicios.servicio_configuracion import ServicioConfiguracion

router = APIRouter(tags=["Configuración"])

@router.get("/configuraciones", response_model=list[ConfiguracionOut], summary="EP-82 Listar configuraciones")
def listar_configuraciones(db: DbSession, actor: CurrentUser):
    return ServicioConfiguracion(db).listar()

@router.get("/configuraciones/{id_configuracion}", response_model=ConfiguracionOut, summary="EP-83 Consultar configuración")
def consultar_configuracion(id_configuracion: int, db: DbSession, actor: CurrentUser):
    return ServicioConfiguracion(db).obtener(id_configuracion)

@router.post("/configuraciones", response_model=ConfiguracionOut, status_code=201, summary="EP-84 Crear configuración")
def crear_configuracion(body: ConfiguracionCreate, db: DbSession, actor: AdminRrhhUser):
    return ServicioConfiguracion(db).crear(body)

@router.patch("/configuraciones/{id_configuracion}", response_model=ConfiguracionOut, summary="EP-85 Actualizar configuración")
def actualizar_configuracion(id_configuracion: int, body: ConfiguracionUpdate, db: DbSession, actor: AdminRrhhUser):
    return ServicioConfiguracion(db).actualizar(id_configuracion, body)


@router.get("/configuraciones/{id_configuracion}/historial", summary="EP-86 Historial configuración")
def historial_configuracion(id_configuracion: int, db: DbSession, actor: CurrentUser):
    return ServicioConfiguracion(db).historial(id_configuracion)
