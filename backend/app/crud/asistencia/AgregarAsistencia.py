from sqlalchemy.orm import Session
from app import models, schemas

def create_asistencia(db: Session, asistencia: schemas.AsistenciaCreate):
    db_asistencia = models.Asistencia(**asistencia.model_dump())
    db.add(db_asistencia)
    db.commit()
    db.refresh(db_asistencia)
    return db_asistencia