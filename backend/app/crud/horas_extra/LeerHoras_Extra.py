from sqlalchemy.orm import Session
from app import models

def get_horas_extra(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.HoraExtra).offset(skip).limit(limit).all()

def get_hora_extra(db: Session, hora_extra_id: int):
    return db.query(models.HoraExtra).filter(models.HoraExtra.id_hora_extra == hora_extra_id).first()

def get_horas_extra_by_empleado(db: Session, empleado_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.HoraExtra).filter(models.HoraExtra.id_empleado == empleado_id).offset(skip).limit(limit).all()