"""Tokens de recuperación de contraseña."""

from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.base_datos.base_orm import Base


class RecuperacionPassword(Base):
    __tablename__ = "recuperacion_password"

    id_recuperacion: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_usuario: Mapped[int] = mapped_column(
        Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"), nullable=False
    )
    token: Mapped[str] = mapped_column(String(128), nullable=False, unique=True)
    expira_en: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    usado: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    creado_en: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
