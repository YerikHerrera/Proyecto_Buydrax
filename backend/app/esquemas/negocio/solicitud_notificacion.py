"""Esquemas de negocio."""

from datetime import date, datetime, time
from decimal import Decimal
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.esquemas.comunes import ORMModel as ORM


class SolicitudCreate(BaseModel):
    tipo_solicitud: str
    descripcion: str



class SolicitudUpdate(BaseModel):
    estado_solicitud: Optional[str] = None
    respuesta: Optional[str] = None



class SolicitudOut(ORM):
    id_solicitud: int
    id_solicitante: int
    id_gestor_por: Optional[int] = None
    tipo_solicitud: str
    descripcion: str
    fecha_creacion: datetime
    estado_solicitud: str
    respuesta: Optional[str] = None
    fecha_respuesta: Optional[datetime] = None



class NotificacionOut(ORM):
    id_notificacion: int
    id_destinatario: int
    tipo: str
    mensaje: str
    fecha_envio: datetime
    leida: bool



class NotificacionUpdate(BaseModel):
    leida: bool = True


# ---- Configuración ----
