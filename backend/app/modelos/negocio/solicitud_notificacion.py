"""Modelos de negocio: Solicitud, Notificacion."""

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


class Solicitud(Base):
    __tablename__ = "solicitud"

    id_solicitud: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_solicitante: Mapped[int] = mapped_column(
        Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    id_gestor_por: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("usuarios.id_usuario", ondelete="SET NULL", onupdate="CASCADE"), nullable=True
    )
    tipo_solicitud: Mapped[str] = mapped_column(tipo_solicitud_enum, nullable=False)
    descripcion: Mapped[str] = mapped_column(Text, nullable=False)
    fecha_creacion: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    estado_solicitud: Mapped[str] = mapped_column(estado_solicitud_enum, nullable=False, default="PENDIENTE")
    respuesta: Mapped[str | None] = mapped_column(Text, nullable=True)
    fecha_respuesta: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)



class Notificacion(Base):
    __tablename__ = "notificacion"

    id_notificacion: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_destinatario: Mapped[int] = mapped_column(
        Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE", onupdate="CASCADE"), nullable=False
    )
    tipo: Mapped[str] = mapped_column(tipo_notificacion_enum, nullable=False)
    mensaje: Mapped[str] = mapped_column(Text, nullable=False)
    fecha_envio: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    leida: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)


