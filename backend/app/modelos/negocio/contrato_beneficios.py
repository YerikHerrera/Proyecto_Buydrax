"""Modelos de negocio: Contrato, Prestamo, Viatico."""

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


class Contrato(Base):
    __tablename__ = "contrato"

    id_contrato: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_supervisor: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("supervisor.id_supervisor", ondelete="SET NULL", onupdate="CASCADE"), nullable=True
    )
    id_proyecto: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("proyecto.id_proyecto", ondelete="SET NULL", onupdate="CASCADE"), nullable=True
    )
    tipo_contrato: Mapped[str] = mapped_column(String(30), nullable=False)
    salario: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    fecha_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_fin: Mapped[date | None] = mapped_column(Date, nullable=True)
    obra_asignada: Mapped[str | None] = mapped_column(String(100), nullable=True)
    arl: Mapped[str] = mapped_column(String(60), nullable=False)
    archivo_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    estado_contrato: Mapped[str] = mapped_column(estado_contrato_enum, nullable=False, default="VIGENTE")



class Prestamo(Base):
    __tablename__ = "prestamo"

    id_prestamo: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    tipo_obligacion: Mapped[str] = mapped_column(tipo_obligacion_enum, nullable=False)
    valor_total: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    numero_cuotas: Mapped[int] = mapped_column(Integer, nullable=False)
    valor_cuota: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    cuotas_pagadas: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    saldo_pendiente: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    fecha_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    observacion: Mapped[str | None] = mapped_column(String(255), nullable=True)
    estado_prestamo: Mapped[str] = mapped_column(estado_prestamo_enum, nullable=False, default="ACTIVO")



class Viatico(Base):
    __tablename__ = "viatico"

    id_viatico: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_proyecto: Mapped[int] = mapped_column(
        Integer, ForeignKey("proyecto.id_proyecto", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False
    )
    id_aprobado_por: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("usuarios.id_usuario", ondelete="SET NULL", onupdate="CASCADE"), nullable=True
    )
    concepto: Mapped[str] = mapped_column(String(60), nullable=False)
    valor: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    fecha: Mapped[date] = mapped_column(Date, nullable=False)
    soporte_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    estado_viatico: Mapped[str] = mapped_column(estado_viatico_enum, nullable=False, default="PENDIENTE")


