"""Modelos de negocio: Configuracion, CambioConfiguracion."""

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


class Configuracion(Base):
    __tablename__ = "configuracion"

    id_configuracion: Mapped[int] = mapped_column(Integer, primary_key=True)
    smlmv: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    auxilio_transporte: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    tope_exoneracion: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    pct_hora_extra_diurna: Mapped[float] = mapped_column(Float, nullable=False, default=0.25)
    pct_hora_extra_nocturna: Mapped[float] = mapped_column(Float, nullable=False, default=0.75)
    pct_recargo_nocturno_ordinario: Mapped[float] = mapped_column(Float, nullable=False, default=0.35)
    pct_recargo_dominical: Mapped[float] = mapped_column(Float, nullable=False, default=0.75)
    pct_hora_extra_diurna_dominical: Mapped[float] = mapped_column(Float, nullable=False, default=1.00)
    pct_salud_empleado: Mapped[float] = mapped_column(Float, nullable=False)
    pct_pension_empleado: Mapped[float] = mapped_column(Float, nullable=False)
    nivel_arl_1: Mapped[float] = mapped_column(Float, nullable=False)
    nivel_arl_2: Mapped[float] = mapped_column(Float, nullable=False)
    nivel_arl_3: Mapped[float] = mapped_column(Float, nullable=False)
    nivel_arl_4: Mapped[float] = mapped_column(Float, nullable=False)
    nivel_arl_5: Mapped[float] = mapped_column(Float, nullable=False)
    anio_vigencia: Mapped[int] = mapped_column(Integer, nullable=False, unique=True)



class CambioConfiguracion(Base):
    __tablename__ = "cambio_configuracion"

    id_cambio: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_configuracion: Mapped[int] = mapped_column(
        Integer, ForeignKey("configuracion.id_configuracion", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_modificado_por: Mapped[int] = mapped_column(
        Integer, ForeignKey("usuarios.id_usuario", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False
    )
    campo: Mapped[str] = mapped_column(String(60), nullable=False)
    valor_anterior: Mapped[str] = mapped_column(String(100), nullable=False)
    valor_nuevo: Mapped[str] = mapped_column(String(100), nullable=False)
    fecha_cambio: Mapped[datetime] = mapped_column(DateTime, nullable=False)
