"""Utilidades multi-tenant por dominio de correo."""

from __future__ import annotations

import re


def extraer_dominio(correo: str | None) -> str | None:
    if not correo or "@" not in correo:
        return None
    dom = correo.split("@", 1)[1].strip().lower()
    return dom or None


def normalizar_dominio(valor: str | None) -> str | None:
    if not valor:
        return None
    v = valor.strip().lower()
    v = re.sub(r"^@+", "", v)
    return v or None


# Roles de sistema (perfil). Cualquier otro texto en "cargo" es sub-rol laboral.
ROLES_PRINCIPALES = frozenset({"EMPRESA", "ADMIN_RRHH", "CONTADOR", "SUPERVISOR", "EMPLEADO"})


def es_rol_principal(texto: str | None) -> bool:
    if not texto:
        return False
    return texto.strip().upper().replace(" ", "_") in ROLES_PRINCIPALES


def normalizar_rol_principal(texto: str | None) -> str | None:
    if not texto:
        return None
    t = texto.strip().upper().replace(" ", "_")
    # alias comunes
    aliases = {
        "EMPRESA": "EMPRESA",
        "PLATFORM": "EMPRESA",
        "PLATAFORMA": "EMPRESA",
        "ADMIN": "ADMIN_RRHH",
        "ADMINISTRADOR": "ADMIN_RRHH",
        "ADMINISTRADOR_DE_RRHH": "ADMIN_RRHH",
        "RRHH": "ADMIN_RRHH",
        "SUPERVISOR_DE_OBRA": "SUPERVISOR",
    }
    t = aliases.get(t, t)
    return t if t in ROLES_PRINCIPALES else None
