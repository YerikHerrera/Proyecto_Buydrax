"""Modelos de negocio: Proyecto, AsignacionProyecto."""

from datetime import date, datetime, time
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    Time,
    UniqueConstraint,
    CheckConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.base_datos.base_orm import Base
from app.modelos.negocio.enums import *


class Proyecto(Base):
    __tablename__ = "proyecto"

    id_proyecto: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_supervisor: Mapped[int] = mapped_column(
        Integer, ForeignKey("supervisor.id_supervisor", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False
    )
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    descripcion: Mapped[str | None] = mapped_column(Text, nullable=True)
    ubicacion_calle: Mapped[str] = mapped_column(String(100), nullable=False)
    ubicacion_referencia: Mapped[str | None] = mapped_column(String(100), nullable=True)
    fecha_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_fin: Mapped[date] = mapped_column(Date, nullable=False)
    estado_proyecto: Mapped[str] = mapped_column(estado_proyecto_enum, nullable=False, default="ACTIVO")



class AsignacionProyecto(Base):
    __tablename__ = "asignacion_proyecto"
    __table_args__ = (UniqueConstraint("id_proyecto", "id_empleado", name="uq_asignacion"),)

    id_asignacion: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_proyecto: Mapped[int] = mapped_column(
        Integer, ForeignKey("proyecto.id_proyecto", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    cuadrilla: Mapped[str] = mapped_column(String(60), nullable=False)
    rol_en_proyecto: Mapped[str] = mapped_column(String(60), nullable=False)
    fecha_asignacion: Mapped[date] = mapped_column(Date, nullable=False)
    activo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)


