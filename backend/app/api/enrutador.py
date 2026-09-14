"""Enrutador principal de la API — todos los endpoints de la matriz."""

from fastapi import APIRouter

from app.api.endpoints.autenticacion import router as autenticacion_router
from app.api.endpoints.usuarios import router as usuarios_router
from app.api.endpoints.roles import router as roles_router
from app.api.endpoints.panel import router as panel_router
from app.api.endpoints.empleados import router as empleados_router
from app.api.endpoints.certificaciones import router as certificaciones_router
from app.api.endpoints.supervisores import router as supervisores_router
from app.api.endpoints.asistencias import router as asistencias_router
from app.api.endpoints.turnos import router as turnos_router
from app.api.endpoints.novedades import router as novedades_router
from app.api.endpoints.horas_extra import router as horas_extra_router
from app.api.endpoints.proyectos import router as proyectos_router
from app.api.endpoints.asignaciones import router as asignaciones_router
from app.api.endpoints.contratos import router as contratos_router
from app.api.endpoints.prestamos import router as prestamos_router
from app.api.endpoints.viaticos import router as viaticos_router
from app.api.endpoints.liquidaciones import router as liquidaciones_router
from app.api.endpoints.nominas import router as nominas_router
from app.api.endpoints.pila import router as pila_router
from app.api.endpoints.configuracion import router as configuracion_router
from app.api.endpoints.evaluaciones import router as evaluaciones_router
from app.api.endpoints.solicitudes import router as solicitudes_router
from app.api.endpoints.notificaciones import router as notificaciones_router

api_router = APIRouter()

api_router.include_router(autenticacion_router)
api_router.include_router(usuarios_router)
api_router.include_router(roles_router)
api_router.include_router(panel_router)
api_router.include_router(empleados_router)
api_router.include_router(certificaciones_router)
api_router.include_router(supervisores_router)
api_router.include_router(asistencias_router)
api_router.include_router(turnos_router)
api_router.include_router(novedades_router)
api_router.include_router(horas_extra_router)
api_router.include_router(proyectos_router)
api_router.include_router(asignaciones_router)
api_router.include_router(contratos_router)
api_router.include_router(prestamos_router)
api_router.include_router(viaticos_router)
api_router.include_router(liquidaciones_router)
api_router.include_router(nominas_router)
api_router.include_router(pila_router)
api_router.include_router(configuracion_router)
api_router.include_router(evaluaciones_router)
api_router.include_router(solicitudes_router)
api_router.include_router(notificaciones_router)
