"""Endpoints de contratos — capa HTTP delgada."""

from fastapi import APIRouter
from app.nucleo.dependencias import AdminRrhhUser, CurrentUser, DbSession
from app.esquemas.negocio import ContratoCreate, ContratoOut, ContratoUpdate
from app.servicios.servicio_contratos import ServicioContratos

router = APIRouter(tags=["Contratos"])

@router.get("/empleados/{id_empleado}/contratos", response_model=list[ContratoOut], summary="EP-52 Listar contratos")
def listar_contratos(id_empleado: int, db: DbSession, actor: CurrentUser):
    return ServicioContratos(db).listar_empleado(id_empleado)

@router.post("/empleados/{id_empleado}/contratos", response_model=ContratoOut, status_code=201, summary="EP-53 Crear contrato")
def crear_contrato(id_empleado: int, body: ContratoCreate, db: DbSession, actor: AdminRrhhUser):
    return ServicioContratos(db).crear(id_empleado, body)

@router.get("/contratos/{id_contrato}", response_model=ContratoOut, summary="EP-54 Consultar contrato")
def consultar_contrato(id_contrato: int, db: DbSession, actor: CurrentUser):
    return ServicioContratos(db).obtener(id_contrato)

@router.patch("/contratos/{id_contrato}", response_model=ContratoOut, summary="EP-55 Actualizar contrato")
def actualizar_contrato(id_contrato: int, body: ContratoUpdate, db: DbSession, actor: AdminRrhhUser):
    return ServicioContratos(db).actualizar(id_contrato, body)
