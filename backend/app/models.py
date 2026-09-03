from sqlalchemy import Column, Integer, String, Date, DateTime, Time, ForeignKey, Text, Boolean, Numeric, Double
from sqlalchemy.orm import relationship
from app.database import Base

# ================== PROYECTO ==================
class Proyecto(Base):
    __tablename__ = "proyecto"

    id_proyecto = Column(Integer, primary_key=True, index=True)
    id_supervisor = Column(Integer, ForeignKey("supervisor.id_supervisor"), nullable=False)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=True)
    ubicacion_calle = Column(String(100), nullable=False)
    ubicacion_referencia = Column(String(100), nullable=True)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)
    estado_proyecto = Column(String(20), nullable=False)  # ENUM: 'ACTIVO','FINALIZADO','SUSPENDIDO'

# ================== USUARIO ==================
class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(Integer, primary_key=True, index=True)
    id_perfil = Column(Integer, ForeignKey("perfil.id_perfil"), nullable=True)  # Puede ser NULL según script
    nombres = Column(String(60), nullable=False)
    apellidos = Column(String(60), nullable=False)
    correo = Column(String(100), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    estado = Column(Boolean, default=True)
    ultimo_acceso = Column(DateTime, nullable=True)
    foto_perfil = Column(String(255), nullable=True)
    idioma = Column(String(5), default="ES")

# ================== ASISTENCIA ==================
class Asistencia(Base):
    __tablename__ = "asistencia"

    id_asistencia = Column(Integer, primary_key=True, index=True)
    id_empleado = Column(Integer, ForeignKey("empleado.id_empleado"), nullable=False)
    id_creado_por = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    fecha = Column(Date, nullable=False)
    hora_entrada = Column(Time, nullable=False)
    hora_salida = Column(Time, nullable=True)
    estado_asistencia = Column(String(20), nullable=False)  # ENUM: 'PRESENTE','RETARDO','INASISTENCIA'
    observacion = Column(String(255), nullable=True)
    fecha_creacion = Column(DateTime, nullable=False)

# ================== HORA EXTRA ==================
class HoraExtra(Base):
    __tablename__ = "hora_extra"

    id_hora_extra = Column(Integer, primary_key=True, index=True)
    id_empleado = Column(Integer, ForeignKey("empleado.id_empleado"), nullable=False)
    id_aprobador = Column(Integer, ForeignKey("supervisor.id_supervisor"), nullable=True)
    motivo = Column(String(255), nullable=False)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)
    cantidad_horas = Column(Double, nullable=False)
    tipo_hora = Column(String(20), nullable=False)  # ENUM: 'DIURNA','NOCTURNA',...
    archivo_soporte_url = Column(String(255), nullable=False)
    estado_he = Column(String(20), nullable=False)  # ENUM: 'PENDIENTE','APROBADA','RECHAZADA'

# ================== PERFIL ==================
class Perfil(Base):
    __tablename__ = "perfil"

    id_perfil = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(30), nullable=False, unique=True)
    descripcion = Column(String(150), nullable=True)

# ================== SUPERVISOR ==================
class Supervisor(Base):
    __tablename__ = "supervisor"

    id_supervisor = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False, unique=True)
    numero_tarjeta_profesional = Column(String(30), nullable=False)
    cuadrilla_asignada = Column(String(60), nullable=True)

# ================== EMPLEADO ==================
class Empleado(Base):
    __tablename__ = "empleado"

    id_empleado = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False, unique=True)
    id_supervisor = Column(Integer, ForeignKey("supervisor.id_supervisor"), nullable=True)
    tipo_documento = Column(String(10), nullable=False)
    numero_documento = Column(String(20), nullable=False, unique=True)
    fecha_nacimiento = Column(Date, nullable=False)
    calle = Column(String(100), nullable=False)
    barrio = Column(String(60), nullable=True)
    ciudad = Column(String(60), nullable=False)
    telefono = Column(String(15), nullable=False)
    correo_personal = Column(String(100), nullable=True)
    cargo = Column(String(60), nullable=False)
    fecha_ingreso = Column(Date, nullable=False)
    salario = Column(Numeric(12, 2), nullable=False)
    forma_pago = Column(String(20), nullable=False)
    banco = Column(String(60), nullable=True)
    numero_cuenta = Column(String(30), nullable=True)
    estado_laboral = Column(String(20), nullable=False, default="ACTIVO")  # ENUM: 'ACTIVO','INCAPACITADO','RETIRADO'