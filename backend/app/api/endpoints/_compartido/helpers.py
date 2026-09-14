"""Helpers compartidos entre endpoints de dominio."""

from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.nucleo.excepciones import AuthorizationError, NotFoundError
from app.modelos import AdminRrhh, Supervisor, Usuario


def get_or_404(db: Session, model, pk: int, label: str = "Recurso"):
    obj = db.get(model, pk)
    if obj is None:
        raise NotFoundError(f"{label} no encontrado")
    return obj


def require_admin(actor: Usuario):
    rol = actor.perfil.nombre if actor.perfil else None
    if rol != "ADMIN_RRHH":
        raise AuthorizationError("Se requiere rol ADMIN_RRHH")


def supervisor_id_of(db: Session, usuario: Usuario) -> Optional[int]:
    row = db.execute(select(Supervisor).where(Supervisor.id_usuario == usuario.id_usuario)).scalar_one_or_none()
    return row.id_supervisor if row else None


def admin_rrhh_id_of(db: Session, usuario: Usuario) -> Optional[int]:
    row = db.execute(select(AdminRrhh).where(AdminRrhh.id_usuario == usuario.id_usuario)).scalar_one_or_none()
    return row.id_admin_rrhh if row else None
