"""Endpoints de nóminas — capa HTTP delgada."""

from fastapi import APIRouter
from app.nucleo.dependencias import AdminRrhhUser, CurrentUser, DbSession
from app.esquemas.negocio import (
    DesprendibleOut, DetalleNominaOut, NominaCreate, NominaOut, NominaUpdate,
)
from app.servicios.servicio_nominas import ServicioNominas

router = APIRouter(tags=["Nóminas"])

@router.post("/nominas", response_model=NominaOut, status_code=201, summary="EP-68 Crear nómina")
def crear_nomina(body: NominaCreate, db: DbSession, actor: AdminRrhhUser):
    return ServicioNominas(db).crear(body, actor)

@router.get("/nominas", response_model=list[NominaOut], summary="EP-69 Listar nóminas")
def listar_nominas(db: DbSession, actor: CurrentUser):
    return ServicioNominas(db).listar()

@router.get("/nominas/{id_nomina}", response_model=NominaOut, summary="EP-70 Consultar nómina")
def consultar_nomina(id_nomina: int, db: DbSession, actor: CurrentUser):
    return ServicioNominas(db).obtener(id_nomina)

@router.post("/nominas/{id_nomina}/calcular", summary="EP-71 Calcular nómina")
def calcular_nomina(id_nomina: int, db: DbSession, actor: AdminRrhhUser):
    return ServicioNominas(db).calcular(id_nomina)

@router.get("/nominas/{id_nomina}/detalles", response_model=list[DetalleNominaOut], summary="EP-72 Detalles de nómina")
def detalles_nomina(id_nomina: int, db: DbSession, actor: CurrentUser):
    return ServicioNominas(db).listar_detalles(id_nomina)

@router.get("/nominas/{id_nomina}/detalles/{id_detalle}", response_model=DetalleNominaOut, summary="EP-73 Detalle nómina")
def detalle_nomina(id_nomina: int, id_detalle: int, db: DbSession, actor: CurrentUser):
    return ServicioNominas(db).obtener_detalle(id_nomina, id_detalle)

@router.patch("/nominas/{id_nomina}", response_model=NominaOut, summary="EP-74 Actualizar estado nómina")
def actualizar_nomina(id_nomina: int, body: NominaUpdate, db: DbSession, actor: AdminRrhhUser):
    return ServicioNominas(db).actualizar(id_nomina, body)

@router.get("/empleados/{id_empleado}/desprendibles", response_model=list[DesprendibleOut], summary="EP-75 Desprendibles empleado")
def desprendibles_empleado(id_empleado: int, db: DbSession, actor: CurrentUser):
    return ServicioNominas(db).desprendibles_empleado(id_empleado)

@router.get("/desprendibles/{id_desprendible}", response_model=DesprendibleOut, summary="EP-76 Consultar desprendible")
def consultar_desprendible(id_desprendible: int, db: DbSession, actor: CurrentUser):
    return ServicioNominas(db).obtener_desprendible(id_desprendible)

@router.get("/desprendibles/{id_desprendible}/archivo", summary="EP-77 Archivo desprendible")
def archivo_desprendible(id_desprendible: int, db: DbSession, actor: CurrentUser):
    d = ServicioNominas(db).obtener_desprendible(id_desprendible)
    return {"id_desprendible": id_desprendible, "message": "Archivo pendiente de definición en fuentes"}
