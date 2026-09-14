"""Pruebas unitarias de seguridad (sin BD)."""

from app.nucleo.seguridad import create_access_token, decode_access_token, hash_password, verify_password


def test_hash_and_verify():
    plain = "Secreta123!"
    hashed = hash_password(plain)
    assert hashed != plain
    assert verify_password(plain, hashed) is True
    assert verify_password("otra", hashed) is False


def test_verify_php_style_hash_prefix():
    """Los hashes del SQL usan $2y$; el backend debe aceptarlos."""
    plain = "test-password"
    # Generamos un hash $2b$ y lo convertimos a $2y$ para simular el SQL
    hashed_b = hash_password(plain)
    assert hashed_b.startswith("$2b$")
    hashed_y = "$2y$" + hashed_b[4:]
    assert verify_password(plain, hashed_y) is True


def test_jwt_roundtrip():
    token = create_access_token(subject=42, extra_claims={"rol": "ADMIN_RRHH"})
    payload = decode_access_token(token)
    assert payload["sub"] == "42"
    assert payload["rol"] == "ADMIN_RRHH"
