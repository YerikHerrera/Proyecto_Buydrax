from pydantic import BaseModel, Field, EmailStr
from datetime import date, datetime, time
from typing import Optional, Literal
from pydantic import model_validator

class ProyectoBase(BaseModel):
    id_supervisor: int
    nombre: str = Field(..., max_length=100)
    descripcion: Optional[str] = None
    ubicacion_calle: str = Field(..., max_length=100)
    ubicacion_referencia: Optional[str] = Field(None, max_length=100)
    fecha_inicio: date
    fecha_fin: date
    estado_proyecto: Literal["ACTIVO", "FINALIZADO", "SUSPENDIDO"] = "ACTIVO"

    @model_validator(mode="after")
    def validar_fechas(self):
        if self.fecha_inicio >= self.fecha_fin:
            raise ValueError("fecha_inicio debe ser anterior a fecha_fin")
        return self

# ========== PROYECTO ==========
class ProyectoBase(BaseModel):
    id_supervisor: int
    nombre: str = Field(..., max_length=100)
    descripcion: Optional[str] = None
    ubicacion_calle: str = Field(..., max_length=100)
    ubicacion_referencia: Optional[str] = Field(None, max_length=100)
    fecha_inicio: date
    fecha_fin: date
    estado_proyecto: Literal["ACTIVO", "FINALIZADO", "SUSPENDIDO"] = "ACTIVO"

class ProyectoCreate(ProyectoBase):
    pass

class ProyectoUpdate(BaseModel):
    id_supervisor: Optional[int] = None
    nombre: Optional[str] = Field(None, max_length=100)
    descripcion: Optional[str] = None
    ubicacion_calle: Optional[str] = Field(None, max_length=100)
    ubicacion_referencia: Optional[str] = Field(None, max_length=100)
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None
    estado_proyecto: Optional[Literal["ACTIVO", "FINALIZADO", "SUSPENDIDO"]] = None

class Proyecto(ProyectoBase):
    id_proyecto: int

    class Config:
        from_attributes = True

# ========== USUARIO ==========
class UsuarioBase(BaseModel):
    id_perfil: Optional[int] = None
    nombres: str = Field(..., max_length=60)
    apellidos: str = Field(..., max_length=60)
    correo: EmailStr = Field(..., max_length=100)
    password_hash: str = Field(..., min_length=8)
    estado: bool = True
    idioma: str = Field("ES", max_length=5)

class UsuarioCreate(UsuarioBase):
    pass

class UsuarioUpdate(BaseModel):
    id_perfil: Optional[int] = None
    nombres: Optional[str] = Field(None, max_length=60)
    apellidos: Optional[str] = Field(None, max_length=60)
    correo: Optional[EmailStr] = Field(None, max_length=100)
    password_hash: Optional[str] = Field(None, min_length=8)
    estado: Optional[bool] = None
    ultimo_acceso: Optional[datetime] = None
    foto_perfil: Optional[str] = Field(None, max_length=255)
    idioma: Optional[str] = Field(None, max_length=5)

class Usuario(UsuarioBase):
    id_usuario: int
    ultimo_acceso: Optional[datetime] = None
    foto_perfil: Optional[str] = None

    class Config:
        from_attributes = True

# ========== ASISTENCIA ==========
class AsistenciaBase(BaseModel):
    id_empleado: int
    id_creado_por: int
    fecha: date
    hora_entrada: time
    hora_salida: Optional[time] = None
    estado_asistencia: Literal["PRESENTE", "RETARDO", "INASISTENCIA"]
    observacion: Optional[str] = Field(None, max_length=255)
    fecha_creacion: datetime

class AsistenciaCreate(AsistenciaBase):
    pass

class AsistenciaUpdate(BaseModel):
    id_empleado: Optional[int] = None
    id_creado_por: Optional[int] = None
    fecha: Optional[date] = None
    hora_entrada: Optional[time] = None
    hora_salida: Optional[time] = None
    estado_asistencia: Optional[Literal["PRESENTE", "RETARDO", "INASISTENCIA"]] = None
    observacion: Optional[str] = Field(None, max_length=255)
    fecha_creacion: Optional[datetime] = None

class Asistencia(AsistenciaBase):
    id_asistencia: int

    class Config:
        from_attributes = True

# ========== HORA EXTRA ==========
class HoraExtraBase(BaseModel):
    id_empleado: int
    id_aprobador: Optional[int] = None
    motivo: str = Field(..., max_length=255)
    fecha_inicio: date
    fecha_fin: date
    cantidad_horas: float = Field(..., gt=0)
    tipo_hora: Literal["DIURNA", "NOCTURNA", "DOMINICAL", "FESTIVA", "DIURNA_DOMINICAL"]
    archivo_soporte_url: str = Field(..., max_length=255)
    estado_he: Literal["PENDIENTE", "APROBADA", "RECHAZADA"] = "PENDIENTE"

class HoraExtraCreate(HoraExtraBase):
    pass

class HoraExtraUpdate(BaseModel):
    id_empleado: Optional[int] = None
    id_aprobador: Optional[int] = None
    motivo: Optional[str] = Field(None, max_length=255)
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None
    cantidad_horas: Optional[float] = Field(None, gt=0)
    tipo_hora: Optional[Literal["DIURNA", "NOCTURNA", "DOMINICAL", "FESTIVA", "DIURNA_DOMINICAL"]] = None
    archivo_soporte_url: Optional[str] = Field(None, max_length=255)
    estado_he: Optional[Literal["PENDIENTE", "APROBADA", "RECHAZADA"]] = None

class HoraExtra(HoraExtraBase):
    id_hora_extra: int

    class Config:
        from_attributes = True