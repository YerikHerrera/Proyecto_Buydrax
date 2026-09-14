"""Tablas de roles especializados 1:1 con usuarios (SQL auditado)."""

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.base_datos.base_orm import Base


class Supervisor(Base):
    __tablename__ = "supervisor"

    id_supervisor: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_usuario: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("usuarios.id_usuario", ondelete="RESTRICT", onupdate="CASCADE"),
        nullable=False,
        unique=True,
    )
    numero_tarjeta_profesional: Mapped[str] = mapped_column(String(30), nullable=False)
    cuadrilla_asignada: Mapped[str | None] = mapped_column(String(60), nullable=True)

    usuario: Mapped["Usuario"] = relationship("Usuario", back_populates="supervisor")


class Contador(Base):
    __tablename__ = "contador"

    id_contador: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_usuario: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("usuarios.id_usuario", ondelete="RESTRICT", onupdate="CASCADE"),
        nullable=False,
        unique=True,
    )
    numero_tarjeta_profesional: Mapped[str] = mapped_column(String(30), nullable=False)
    area_nomina: Mapped[str] = mapped_column(String(30), nullable=False)

    usuario: Mapped["Usuario"] = relationship("Usuario", back_populates="contador")


class AdminRrhh(Base):
    __tablename__ = "admin_rrhh"

    id_admin_rrhh: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_usuario: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("usuarios.id_usuario", ondelete="RESTRICT", onupdate="CASCADE"),
        nullable=False,
        unique=True,
    )
    area_responsable: Mapped[str] = mapped_column(String(60), nullable=False)

    usuario: Mapped["Usuario"] = relationship("Usuario", back_populates="admin_rrhh")


from app.modelos.usuario import Usuario  # noqa: E402
