"""Tabla usuarios (SQL auditado)."""

from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_perfil: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("perfil.id_perfil", ondelete="RESTRICT", onupdate="CASCADE"),
        nullable=True,
    )
    nombres: Mapped[str] = mapped_column(String(60), nullable=False)
    apellidos: Mapped[str] = mapped_column(String(60), nullable=False)
    correo: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    estado: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    ultimo_acceso: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    foto_perfil: Mapped[str | None] = mapped_column(String(255), nullable=True)
    idioma: Mapped[str] = mapped_column(String(5), nullable=False, default="ES")

    perfil: Mapped["Perfil | None"] = relationship("Perfil", back_populates="usuarios")
    supervisor: Mapped["Supervisor | None"] = relationship(
        "Supervisor", back_populates="usuario", uselist=False
    )
    contador: Mapped["Contador | None"] = relationship(
        "Contador", back_populates="usuario", uselist=False
    )
    admin_rrhh: Mapped["AdminRrhh | None"] = relationship(
        "AdminRrhh", back_populates="usuario", uselist=False
    )


from app.models.perfil import Perfil  # noqa: E402
from app.models.roles_especializados import Supervisor, Contador, AdminRrhh  # noqa: E402
