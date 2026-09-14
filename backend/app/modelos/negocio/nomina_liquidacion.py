"""Modelos de negocio: Nomina, DetalleNomina, Desprendible, Pila, AporteEmpleado, Liquidacion."""

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


class Nomina(Base):
    __tablename__ = "nomina"

    id_nomina: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_obra: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("proyecto.id_proyecto", ondelete="SET NULL", onupdate="CASCADE"), nullable=True
    )
    id_configuracion: Mapped[int] = mapped_column(
        Integer, ForeignKey("configuracion.id_configuracion", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False
    )
    id_admin_rrhh: Mapped[int] = mapped_column(
        Integer, ForeignKey("admin_rrhh.id_admin_rrhh", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False
    )
    periodo_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    periodo_fin: Mapped[date] = mapped_column(Date, nullable=False)
    tipo_nomina: Mapped[str] = mapped_column(tipo_nomina_enum, nullable=False)
    fecha_generacion: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    estado_nomina: Mapped[str] = mapped_column(estado_nomina_enum, nullable=False, default="BORRADOR")
    total_pagado: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False, default=0)
    cantidad_empleados: Mapped[int] = mapped_column(Integer, nullable=False, default=0)



class DetalleNomina(Base):
    __tablename__ = "detalle_nomina"
    __table_args__ = (UniqueConstraint("id_nomina", "id_empleado", name="uq_detalle_nomina"),)

    id_detalle_nomina: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_nomina: Mapped[int] = mapped_column(
        Integer, ForeignKey("nomina.id_nomina", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    horas_ordinarias: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    horas_extra: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    dominicales_festivos: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    viaticos: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=0)
    incapacidades: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=0)
    descuentos_prestamos: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=0)
    neto_pagar: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)



class Desprendible(Base):
    __tablename__ = "desprendible"

    id_desprendible: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_detalle_nomina: Mapped[int] = mapped_column(
        Integer, ForeignKey("detalle_nomina.id_detalle_nomina", ondelete="CASCADE", onupdate="CASCADE"), nullable=False, unique=True
    )
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    periodo_pago: Mapped[str] = mapped_column(String(30), nullable=False)
    dias_liquidados: Mapped[int] = mapped_column(Integer, nullable=False)
    fecha_pago: Mapped[date] = mapped_column(Date, nullable=False)
    neto_recibido: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    archivo_url: Mapped[str] = mapped_column(String(255), nullable=False)
    firma_digital: Mapped[str] = mapped_column(String(255), nullable=False)
    estado_descarga: Mapped[str] = mapped_column(estado_descarga_enum, nullable=False, default="GENERADO")



class Pila(Base):
    __tablename__ = "pila"

    id_pila: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_nomina: Mapped[int] = mapped_column(
        Integer, ForeignKey("nomina.id_nomina", ondelete="CASCADE", onupdate="CASCADE"), nullable=False, unique=True
    )
    periodo_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    periodo_fin: Mapped[date] = mapped_column(Date, nullable=False)
    total_salud: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    total_pension: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    total_arl: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    total_paraestatales: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    archivo_txt: Mapped[str | None] = mapped_column(String(255), nullable=True)
    estado_validacion: Mapped[str] = mapped_column(estado_validacion_enum, nullable=False, default="PENDIENTE")



class AporteEmpleado(Base):
    __tablename__ = "aporte_empleado"
    __table_args__ = (UniqueConstraint("id_pila", "id_empleado", name="uq_aporte_pila_empleado"),)

    id_aporte: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_pila: Mapped[int] = mapped_column(
        Integer, ForeignKey("pila.id_pila", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    ibc: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    dias_cotizados: Mapped[int] = mapped_column(Integer, nullable=False)
    tarifa_arl: Mapped[float] = mapped_column(Float, nullable=False)
    aportes_salud: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    aportes_pension: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    aportes_arl: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    aportes_paraestatales: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)



class Liquidacion(Base):
    __tablename__ = "liquidacion"

    id_liquidacion: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_configuracion: Mapped[int] = mapped_column(
        Integer, ForeignKey("configuracion.id_configuracion", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False
    )
    fecha_retiro: Mapped[date] = mapped_column(Date, nullable=False)
    motivo_retiro: Mapped[str] = mapped_column(motivo_retiro_enum, nullable=False)
    salario_promedio: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    dias_trabajados: Mapped[int] = mapped_column(Integer, nullable=False)
    cesantias: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    intereses_cesantias: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    prima: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    vacaciones: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    indemnizacion: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    dotacion_pendiente: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=0)
    total_neto_pagar: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    notas_adicionales: Mapped[str | None] = mapped_column(String(200), nullable=True)


