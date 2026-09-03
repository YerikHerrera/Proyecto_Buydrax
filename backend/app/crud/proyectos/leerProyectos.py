from sqlalchemy.orm import Session
from app import models

def get_proyectos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Proyecto).offset(skip).limit(limit).all()

def get_proyecto(db: Session, proyecto_id: int):
    return db.query(models.Proyecto).filter(models.Proyecto.id_proyecto == proyecto_id).first()