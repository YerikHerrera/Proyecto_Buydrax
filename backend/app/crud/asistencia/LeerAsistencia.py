from sqlalchemy.orm import Session
from app import models

def get_asistencias(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Asistencia).offset(skip).limit(limit).all()

def get_asistencia(db: Session, asistencia_id: int):
    return db.query(models.Asistencia).filter(models.Asistencia.id_asistencia == asistencia_id).first()

def get_asistencias_by_empleado(db: Session, empleado_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Asistencia).filter(models.Asistencia.id_empleado == empleado_id).offset(skip).limit(limit).all()