from sqlalchemy.orm import Session
from app import models, schemas

def update_asistencia(db: Session, asistencia_id: int, asistencia_update: schemas.AsistenciaUpdate):
    db_asistencia = db.query(models.Asistencia).filter(models.Asistencia.id_asistencia == asistencia_id).first()
    if not db_asistencia:
        return None
    update_data = asistencia_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_asistencia, key, value)
    db.commit()
    db.refresh(db_asistencia)
    return db_asistencia