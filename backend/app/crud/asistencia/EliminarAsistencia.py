from sqlalchemy.orm import Session
from app import models

def delete_asistencia(db: Session, asistencia_id: int):
    db_asistencia = db.query(models.Asistencia).filter(models.Asistencia.id_asistencia == asistencia_id).first()
    if not db_asistencia:
        return False
    db.delete(db_asistencia)
    db.commit()
    return True