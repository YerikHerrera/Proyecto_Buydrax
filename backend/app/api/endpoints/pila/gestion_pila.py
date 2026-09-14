"""Endpoints de PILA — capa HTTP delgada."""

from fastapi import APIRouter
from app.nucleo.dependencias import AdminRrhhUser, CurrentUser, DbSession
from app.esquemas.negocio import PilaOut
from app.servicios.servicio_pila import ServicioPila

router = APIRouter(tags=["PILA"])

@router.post("/nominas/{id_nomina}/pila", summary="EP-78 Generar PILA")
def generar_pila(id_nomina: int, db: DbSession, actor: AdminRrhhUser):
    return ServicioPila(db).generar(id_nomina)

@router.get("/nominas/{id_nomina}/pila", response_model=PilaOut, summary="EP-79 Consultar PILA de nómina")
def consultar_pila(id_nomina: int, db: DbSession, actor: CurrentUser):
    return ServicioPila(db).consultar_por_nomina(id_nomina)

@router.get("/pila/{id_pila}/aportes", summary="EP-80 Aportes PILA")
def aportes_pila(id_pila: int, db: DbSession, actor: CurrentUser):
    return ServicioPila(db).aportes(id_pila)

@router.get("/pila/{id_pila}/archivo", summary="EP-81 Archivo PILA")
def archivo_pila(id_pila: int, db: DbSession, actor: CurrentUser):
    return ServicioPila(db).archivo(id_pila)
