"""Modelos de negocio: Novedad, HoraExtra."""

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


class Novedad(Base):
    __tablename__ = "novedad"

    id_novedad: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_aprobado_por: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("usuarios.id_usuario", ondelete="SET NULL", onupdate="CASCADE"), nullable=True
    )
    tipo_novedad: Mapped[str] = mapped_column(tipo_novedad_enum, nullable=False)
    fecha_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_fin: Mapped[date] = mapped_column(Date, nullable=False)
    total_dias: Mapped[float] = mapped_column(Float, nullable=False)
    soporte_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    estado_novedad: Mapped[str] = mapped_column(estado_novedad_enum, nullable=False, default="PENDIENTE")



class HoraExtra(Base):
    __tablename__ = "hora_extra"

    id_hora_extra: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_aprobador: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("supervisor.id_supervisor", ondelete="SET NULL", onupdate="CASCADE"), nullable=True
    )
    motivo: Mapped[str] = mapped_column(String(255), nullable=False)
    fecha_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_fin: Mapped[date] = mapped_column(Date, nullable=False)
    cantidad_horas: Mapped[float] = mapped_column(Float, nullable=False)
    tipo_hora: Mapped[str] = mapped_column(tipo_hora_enum, nullable=False)
    archivo_soporte_url: Mapped[str] = mapped_column(String(255), nullable=False)
    estado_he: Mapped[str] = mapped_column(estado_he_enum, nullable=False, default="PENDIENTE")


