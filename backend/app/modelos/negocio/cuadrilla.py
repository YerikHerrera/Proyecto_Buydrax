"""Modelos: Cuadrilla y vínculo Cuadrilla–Proyecto."""

from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.base_datos.base_orm import Base


class Cuadrilla(Base):
    __tablename__ = "cuadrilla"

    id_cuadrilla: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(String(80), nullable=False, unique=True)
    descripcion: Mapped[str | None] = mapped_column(String(200), nullable=True)
    id_supervisor: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("supervisor.id_supervisor", ondelete="SET NULL", onupdate="CASCADE"),
        nullable=True,
    )
    activo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    creado_en: Mapped[datetime | None] = mapped_column(DateTime, nullable=True, default=datetime.now)


class CuadrillaProyecto(Base):
    """Una cuadrilla puede estar en varios proyectos."""

    __tablename__ = "cuadrilla_proyecto"
    __table_args__ = (UniqueConstraint("id_cuadrilla", "id_proyecto", name="uq_cuadrilla_proyecto"),)

    id_cuadrilla_proyecto: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_cuadrilla: Mapped[int] = mapped_column(
        Integer, ForeignKey("cuadrilla.id_cuadrilla", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_proyecto: Mapped[int] = mapped_column(
        Integer, ForeignKey("proyecto.id_proyecto", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    activo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    fecha_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_fin: Mapped[date | None] = mapped_column(Date, nullable=True)
