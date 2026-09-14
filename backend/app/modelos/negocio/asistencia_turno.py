"""Modelos de negocio: Asistencia, Turno."""

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


class Asistencia(Base):
    __tablename__ = "asistencia"

    id_asistencia: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_creado_por: Mapped[int] = mapped_column(
        Integer, ForeignKey("usuarios.id_usuario", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False
    )
    fecha: Mapped[date] = mapped_column(Date, nullable=False)
    hora_entrada: Mapped[time] = mapped_column(Time, nullable=False)
    hora_salida: Mapped[time | None] = mapped_column(Time, nullable=True)
    estado_asistencia: Mapped[str] = mapped_column(estado_asistencia_enum, nullable=False)
    observacion: Mapped[str | None] = mapped_column(String(255), nullable=True)
    fecha_creacion: Mapped[datetime] = mapped_column(DateTime, nullable=False)



class Turno(Base):
    __tablename__ = "turno"

    id_turno: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_proyecto: Mapped[int] = mapped_column(
        Integer, ForeignKey("proyecto.id_proyecto", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_asignado_por: Mapped[int] = mapped_column(
        Integer, ForeignKey("usuarios.id_usuario", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False
    )
    tipo_turno: Mapped[str] = mapped_column(String(20), nullable=False)
    hora_inicio: Mapped[time] = mapped_column(Time, nullable=False)
    hora_fin: Mapped[time] = mapped_column(Time, nullable=False)
    fecha: Mapped[date] = mapped_column(Date, nullable=False)


