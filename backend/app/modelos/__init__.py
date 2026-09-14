"""Modelos ORM fieles al SQL auditado Buydrax."""

from app.modelos.perfil_y_permisos import Perfil, Modulo, Accion, Permiso
from app.modelos.usuario import Usuario
from app.modelos.roles_especiales import Supervisor, Contador, AdminRrhh
from app.modelos.negocio import (
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
