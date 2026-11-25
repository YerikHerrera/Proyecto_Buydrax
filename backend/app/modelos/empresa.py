"""Empresas / dominios autorizados (multi-tenant explícito)."""

from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.base_datos.base_orm import Base


class Empresa(Base):
    __tablename__ = "empresa"

    id_empresa: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    dominio: Mapped[str] = mapped_column(String(120), nullable=False, unique=True)
    tipo: Mapped[str] = mapped_column(String(20), nullable=False, default="EMPRESA")
    activo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    creado_en: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)

    usuarios: Mapped[list["Usuario"]] = relationship("Usuario", back_populates="empresa")


from app.modelos.usuario import Usuario  # noqa: E402
