"""Endpoints de préstamos — capa HTTP delgada."""

from fastapi import APIRouter
from app.nucleo.dependencias import AdminRrhhUser, CurrentUser, DbSession
from app.esquemas.negocio import PrestamoCreate, PrestamoOut, PrestamoUpdate
from app.servicios.servicio_prestamos import ServicioPrestamos

router = APIRouter(tags=["Préstamos"])

@router.get("/empleados/{id_empleado}/prestamos", response_model=list[PrestamoOut], summary="EP-56 Listar préstamos")
def listar_prestamos(id_empleado: int, db: DbSession, actor: CurrentUser):
    return ServicioPrestamos(db).listar_empleado(id_empleado)

@router.post("/empleados/{id_empleado}/prestamos", response_model=PrestamoOut, status_code=201, summary="EP-57 Crear préstamo")
def crear_prestamo(id_empleado: int, body: PrestamoCreate, db: DbSession, actor: AdminRrhhUser):
    return ServicioPrestamos(db).crear(id_empleado, body)

@router.get("/prestamos/{id_prestamo}", response_model=PrestamoOut, summary="EP-58 Consultar préstamo")
def consultar_prestamo(id_prestamo: int, db: DbSession, actor: CurrentUser):
    return ServicioPrestamos(db).obtener(id_prestamo)

@router.patch("/prestamos/{id_prestamo}", response_model=PrestamoOut, summary="EP-59 Actualizar préstamo")
def actualizar_prestamo(id_prestamo: int, body: PrestamoUpdate, db: DbSession, actor: AdminRrhhUser):
    return ServicioPrestamos(db).actualizar(id_prestamo, body)
