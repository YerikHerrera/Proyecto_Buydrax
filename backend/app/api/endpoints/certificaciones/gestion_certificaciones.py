"""Endpoints de certificaciones — capa HTTP delgada."""

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.nucleo.dependencias import AdminRrhhUser, CurrentUser, DbSession
from app.esquemas.negocio import CertificacionCreate, CertificacionOut, CertificacionUpdate
from app.servicios.servicio_certificaciones import ServicioCertificaciones

router = APIRouter(tags=["Certificaciones"])

@router.get("/empleados/{id_empleado}/certificaciones", response_model=list[CertificacionOut], summary="EP-18 Listar certificaciones")
def listar_certificaciones(id_empleado: int, db: DbSession, actor: CurrentUser):
    return ServicioCertificaciones(db).listar(id_empleado)

@router.post("/empleados/{id_empleado}/certificaciones", response_model=CertificacionOut, status_code=201, summary="EP-19 Registrar certificación")
def registrar_certificacion(id_empleado: int, body: CertificacionCreate, db: DbSession, actor: AdminRrhhUser):
    return ServicioCertificaciones(db).crear(id_empleado, body)

@router.patch("/certificaciones/{id_certificacion}", response_model=CertificacionOut, summary="EP-20 Actualizar certificación")
def actualizar_certificacion(id_certificacion: int, body: CertificacionUpdate, db: DbSession, actor: AdminRrhhUser):
    return ServicioCertificaciones(db).actualizar(id_certificacion, body)

@router.get("/certificaciones/{id_certificacion}/archivo", summary="EP-21 Descargar archivo certificación")
def descargar_archivo(id_certificacion: int, db: DbSession, actor: CurrentUser):
    c = ServicioCertificaciones(db).obtener(id_certificacion)
    return JSONResponse(content={"archivo": getattr(c, "archivo_ruta", None), "id_certificacion": id_certificacion})
