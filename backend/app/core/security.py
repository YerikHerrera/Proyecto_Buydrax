"""Utilidades de seguridad: hash de contraseñas y JWT."""

from datetime import datetime, timedelta, timezone
from typing import Any, Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings

# bcrypt es el algoritmo usado en el SQL de semillas ($2y$ / $2b$)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    """
    Verifica contraseña.
    Los hashes del SQL auditado usan prefijo $2y$ (PHP).
    passlib/bcrypt acepta $2b$; normalizamos $2y$ -> $2b$ para compatibilidad.
    """
    normalized = password_hash
    if password_hash.startswith("$2y$"):
        normalized = "$2b$" + password_hash[4:]
    try:
        return pwd_context.verify(plain_password, normalized)
    except Exception:
        return False


def create_access_token(
    subject: str | int,
    extra_claims: Optional[dict[str, Any]] = None,
    expires_delta: Optional[timedelta] = None,
) -> str:
    settings = get_settings()
    expire = datetime.now(timezone.utc) + (
        expires_delta
        if expires_delta is not None
        else timedelta(minutes=settings.access_token_expire_minutes)
    )
    payload: dict[str, Any] = {
        "sub": str(subject),
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    if extra_claims:
        payload.update(extra_claims)
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def decode_access_token(token: str) -> dict[str, Any]:
    settings = get_settings()
    try:
        return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError as exc:
        raise ValueError("Token inválido o expirado") from exc
