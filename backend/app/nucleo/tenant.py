"""Aislamiento multi-tenant por dominio del correo (sin columna obligatoria)."""

from __future__ import annotations

from sqlalchemy import func

from app.modelos.usuario import Usuario
from app.nucleo.dominio import extraer_dominio


def dominio_de_usuario(usuario: Usuario | None) -> str | None:
    if usuario is None:
        return None
    return extraer_dominio(getattr(usuario, "correo", None))


def sql_dominio_correo(column_correo=Usuario.correo):
    """Expresión SQL: lower(split_part(correo, '@', 2))."""
    return func.lower(func.split_part(column_correo, "@", 2))
