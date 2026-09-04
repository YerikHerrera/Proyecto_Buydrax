"""
Genera hash bcrypt y opcionalmente actualiza todas las contraseñas en BD.
Uso:
  cd backend
  source .venv/bin/activate   # o .venv\\Scripts\\activate en Windows
  python scripts/set_passwords.py
  python scripts/set_passwords.py --apply   # escribe en PostgreSQL vía DATABASE_URL
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

# Permitir importar app desde la raíz del backend
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.core.security import hash_password  # noqa: E402


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--password", default="Admin123!", help="Contraseña en claro")
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Actualizar todos los usuarios en la BD (requiere .env / DATABASE_URL)",
    )
    args = parser.parse_args()

    h = hash_password(args.password)
    print(f"Contraseña: {args.password}")
    print(f"Hash:       {h}")

    if not args.apply:
        print("\nPara aplicar en PostgreSQL:")
        print(f"  UPDATE usuarios SET password_hash = '{h}';")
        print("O ejecuta: python scripts/set_passwords.py --apply")
        return

    from sqlalchemy import text
    from app.db.session import SessionLocal

    db = SessionLocal()
    try:
        result = db.execute(
            text("UPDATE usuarios SET password_hash = :h"),
            {"h": h},
        )
        db.commit()
        print(f"Filas actualizadas: {result.rowcount}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
