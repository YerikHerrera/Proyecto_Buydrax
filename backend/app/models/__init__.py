"""Modelos ORM fieles al SQL auditado Buydrax."""

from app.models.perfil import Perfil, Modulo, Accion, Permiso
from app.models.usuario import Usuario
from app.models.roles_especializados import Supervisor, Contador, AdminRrhh
from app.models.enums_and_domain import (
    Proyecto,
    Empleado,
    Afiliacion,
    HistorialLaboral,
    Certificacion,
    Asistencia,
    Turno,
    Novedad,
    HoraExtra,
    Observacion,
    EvaluacionDesempeno,
    AsignacionProyecto,
    Configuracion,
    Contrato,
    Prestamo,
    Viatico,
    Liquidacion,
    Nomina,
    DetalleNomina,
    Desprendible,
    Pila,
    AporteEmpleado,
    Solicitud,
    Notificacion,
    CambioConfiguracion,
)

__all__ = [
    "Perfil", "Modulo", "Accion", "Permiso", "Usuario",
    "Supervisor", "Contador", "AdminRrhh", "Proyecto", "Empleado",
    "Afiliacion", "HistorialLaboral", "Certificacion", "Asistencia",
    "Turno", "Novedad", "HoraExtra", "Observacion", "EvaluacionDesempeno",
    "AsignacionProyecto", "Configuracion", "Contrato", "Prestamo", "Viatico",
    "Liquidacion", "Nomina", "DetalleNomina", "Desprendible", "Pila",
    "AporteEmpleado", "Solicitud", "Notificacion", "CambioConfiguracion",
]
