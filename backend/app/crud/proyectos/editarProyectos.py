from sqlalchemy.orm import Session
from app import models, schemas

def update_proyecto(db: Session, proyecto_id: int, proyecto_update: schemas.ProyectoUpdate):
    db_proyecto = db.query(models.Proyecto).filter(models.Proyecto.id_proyecto == proyecto_id).first()
    if not db_proyecto:
        return None
    update_data = proyecto_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_proyecto, key, value)
    db.commit()
    db.refresh(db_proyecto)
    return db_proyecto