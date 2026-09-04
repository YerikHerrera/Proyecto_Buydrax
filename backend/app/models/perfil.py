"""Tablas de perfil, módulo, acción y permiso (SQL auditado)."""

from sqlalchemy import ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Perfil(Base):
    __tablename__ = "perfil"

    id_perfil: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(String(30), nullable=False, unique=True)
    descripcion: Mapped[str | None] = mapped_column(String(150), nullable=True)

    permisos: Mapped[list["Permiso"]] = relationship("Permiso", back_populates="perfil")
    usuarios: Mapped[list["Usuario"]] = relationship("Usuario", back_populates="perfil")


class Modulo(Base):
    __tablename__ = "modulo"

    id_modulo: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    descripcion: Mapped[str | None] = mapped_column(String(150), nullable=True)


class Accion(Base):
    __tablename__ = "accion"

    id_accion: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(String(30), nullable=False, unique=True)
    descripcion: Mapped[str | None] = mapped_column(String(150), nullable=True)


class Permiso(Base):
    __tablename__ = "permiso"
    __table_args__ = (
        UniqueConstraint(
            "id_perfil",
            "id_modulo",
            "id_accion",
            name="uq_permiso_perfil_modulo_accion",
        ),
    )

    id_permiso: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_perfil: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("perfil.id_perfil", ondelete="RESTRICT", onupdate="CASCADE"),
        nullable=False,
    )
    id_modulo: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("modulo.id_modulo", ondelete="RESTRICT", onupdate="CASCADE"),
        nullable=False,
    )
    id_accion: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("accion.id_accion", ondelete="RESTRICT", onupdate="CASCADE"),
        nullable=False,
    )

    perfil: Mapped["Perfil"] = relationship("Perfil", back_populates="permisos")


# Evitar import circular en type hints
from app.models.usuario import Usuario  # noqa: E402
