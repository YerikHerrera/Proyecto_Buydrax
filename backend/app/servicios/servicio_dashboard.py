"""Servicio de dashboard / panel principal — EP-08."""

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.modelos import Empleado, HoraExtra, Nomina, Novedad, Proyecto, Solicitud
from app.esquemas.negocio import DashboardOut


class ServicioDashboard:
    def __init__(self, db: Session):
        self.db = db

    def obtener_resumen(self) -> DashboardOut:
        return DashboardOut(
            empleados_activos=self.db.scalar(
                select(func.count()).select_from(Empleado).where(Empleado.estado_laboral == "ACTIVO")
            ) or 0,
            proyectos_activos=self.db.scalar(
                select(func.count()).select_from(Proyecto).where(Proyecto.estado_proyecto == "ACTIVO")
            ) or 0,
            horas_extra_pendientes=self.db.scalar(
                select(func.count()).select_from(HoraExtra).where(HoraExtra.estado_he == "PENDIENTE")
            ) or 0,
            novedades_pendientes=self.db.scalar(
                select(func.count()).select_from(Novedad).where(Novedad.estado_novedad == "PENDIENTE")
            ) or 0,
            nominas_borrador=self.db.scalar(
                select(func.count()).select_from(Nomina).where(Nomina.estado_nomina == "BORRADOR")
            ) or 0,
            solicitudes_pendientes=self.db.scalar(
                select(func.count()).select_from(Solicitud).where(Solicitud.estado_solicitud == "PENDIENTE")
            ) or 0,
        )
