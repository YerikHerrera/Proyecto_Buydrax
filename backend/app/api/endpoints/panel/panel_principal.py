"""EP-08 Panel principal / Dashboard — capa HTTP delgada."""

from fastapi import APIRouter

from app.nucleo.dependencias import CurrentUser, DbSession
from app.esquemas.negocio import DashboardOut
from app.servicios.servicio_dashboard import ServicioDashboard

router = APIRouter(tags=["Panel"])


@router.get("/dashboard", response_model=DashboardOut, summary="EP-08 Dashboard")
def panel_principal(db: DbSession, actor: CurrentUser):
    return ServicioDashboard(db).obtener_resumen()
