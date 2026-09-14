"""Modelos de negocio: EvaluacionDesempeno, Observacion."""

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


class EvaluacionDesempeno(Base):
    __tablename__ = "evaluacion_desempeno"

    id_evaluacion: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_evaluador: Mapped[int] = mapped_column(
        Integer, ForeignKey("supervisor.id_supervisor", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False
    )
    periodo: Mapped[str] = mapped_column(String(20), nullable=False)
    puntaje_productividad: Mapped[float] = mapped_column(Float, nullable=False)
    puntaje_asistencia: Mapped[float] = mapped_column(Float, nullable=False)
    puntaje_calidad: Mapped[float] = mapped_column(Float, nullable=False)
    puntaje_general: Mapped[float] = mapped_column(Float, nullable=False)
    recomendacion: Mapped[str | None] = mapped_column(Text, nullable=True)
    solicita_capacitacion: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    fecha_evaluacion: Mapped[datetime] = mapped_column(DateTime, nullable=False)



class Observacion(Base):
    __tablename__ = "observacion"

    id_observacion: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_supervisor: Mapped[int] = mapped_column(
        Integer, ForeignKey("supervisor.id_supervisor", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False
    )
    tipo_observacion: Mapped[str] = mapped_column(tipo_observacion_enum, nullable=False)
    descripcion: Mapped[str] = mapped_column(Text, nullable=False)
    fecha: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    escalada: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    estado_observacion: Mapped[str] = mapped_column(
        estado_observacion_enum, nullable=False, default="REGISTRADA"
    )


