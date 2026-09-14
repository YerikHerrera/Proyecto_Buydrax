"""Modelos de negocio: Empleado, Afiliacion, HistorialLaboral, Certificacion."""

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


class Empleado(Base):
    __tablename__ = "empleado"

    id_empleado: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_usuario: Mapped[int] = mapped_column(
        Integer, ForeignKey("usuarios.id_usuario", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False, unique=True
    )
    id_supervisor: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("supervisor.id_supervisor", ondelete="SET NULL", onupdate="CASCADE"), nullable=True
    )
    tipo_documento: Mapped[str] = mapped_column(String(10), nullable=False)
    numero_documento: Mapped[str] = mapped_column(String(20), nullable=False, unique=True)
    fecha_nacimiento: Mapped[date] = mapped_column(Date, nullable=False)
    calle: Mapped[str] = mapped_column(String(100), nullable=False)
    barrio: Mapped[str | None] = mapped_column(String(60), nullable=True)
    ciudad: Mapped[str] = mapped_column(String(60), nullable=False)
    telefono: Mapped[str] = mapped_column(String(15), nullable=False)
    correo_personal: Mapped[str | None] = mapped_column(String(100), nullable=True)
    cargo: Mapped[str] = mapped_column(String(60), nullable=False)
    fecha_ingreso: Mapped[date] = mapped_column(Date, nullable=False)
    salario: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    forma_pago: Mapped[str] = mapped_column(String(20), nullable=False)
    banco: Mapped[str | None] = mapped_column(String(60), nullable=True)
    numero_cuenta: Mapped[str | None] = mapped_column(String(30), nullable=True)
    estado_laboral: Mapped[str] = mapped_column(estado_laboral_enum, nullable=False, default="ACTIVO")



class Afiliacion(Base):
    __tablename__ = "afiliacion"

    id_afiliacion: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False, unique=True
    )
    eps: Mapped[str] = mapped_column(String(60), nullable=False)
    fondo_pension: Mapped[str] = mapped_column(String(60), nullable=False)
    arl: Mapped[str] = mapped_column(String(60), nullable=False)
    caja_compensacion: Mapped[str] = mapped_column(String(60), nullable=False)
    nivel_riesgo_arl: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    fecha_afiliacion: Mapped[date | None] = mapped_column(Date, nullable=True)
    estado_afiliacion: Mapped[str] = mapped_column(String(20), nullable=False, default="ACTIVO")



class HistorialLaboral(Base):
    __tablename__ = "historial_laboral"

    id_historial: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_responsable: Mapped[int] = mapped_column(
        Integer, ForeignKey("supervisor.id_supervisor", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False
    )
    tipo_movimiento: Mapped[str] = mapped_column(tipo_movimiento_enum, nullable=False)
    valor_anterior: Mapped[str | None] = mapped_column(String(100), nullable=True)
    valor_nuevo: Mapped[str] = mapped_column(String(100), nullable=False)
    fecha_movimiento: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    observacion: Mapped[str | None] = mapped_column(String(255), nullable=True)



class Certificacion(Base):
    __tablename__ = "certificacion"

    id_certificacion: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empleado: Mapped[int] = mapped_column(
        Integer, ForeignKey("empleado.id_empleado", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    fecha_emision: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_vencimiento: Mapped[date] = mapped_column(Date, nullable=False)
    archivo_url: Mapped[str] = mapped_column(String(255), nullable=False)
    tipo_archivo: Mapped[str] = mapped_column(String(10), nullable=False)
    estado_certificacion: Mapped[str] = mapped_column(
        estado_certificacion_enum, nullable=False, default="ACTIVO"
    )


