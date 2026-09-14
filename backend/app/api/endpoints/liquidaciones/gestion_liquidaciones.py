"""Endpoints de liquidaciones — capa HTTP delgada."""

from fastapi import APIRouter
from app.nucleo.dependencias import AdminRrhhUser, CurrentUser, DbSession
from app.esquemas.negocio import LiquidacionCreate, LiquidacionOut
from app.servicios.servicio_liquidaciones import ServicioLiquidaciones

router = APIRouter(tags=["Liquidaciones"])

@router.get("/liquidaciones", response_model=list[LiquidacionOut], summary="EP-64 Listar liquidaciones")
def listar_liquidaciones(db: DbSession, actor: CurrentUser):
    return ServicioLiquidaciones(db).listar()

@router.get("/liquidaciones/{id_liquidacion}", response_model=LiquidacionOut, summary="EP-65 Consultar liquidación")
def consultar_liquidacion(id_liquidacion: int, db: DbSession, actor: CurrentUser):
    return ServicioLiquidaciones(db).obtener(id_liquidacion)

@router.post("/empleados/{id_empleado}/liquidacion", response_model=LiquidacionOut, status_code=201, summary="EP-66 Crear liquidación")
def crear_liquidacion(id_empleado: int, body: LiquidacionCreate, db: DbSession, actor: AdminRrhhUser):
    return ServicioLiquidaciones(db).crear(id_empleado, body)

@router.get("/liquidaciones/{id_liquidacion}/documento", summary="EP-67 Documento liquidación")
def documento_liquidacion(id_liquidacion: int, db: DbSession, actor: CurrentUser):
    return ServicioLiquidaciones(db).documento(id_liquidacion)
