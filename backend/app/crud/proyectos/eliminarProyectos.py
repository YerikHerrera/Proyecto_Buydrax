from sqlalchemy.orm import Session
from app import models

def delete_proyecto(db: Session, proyecto_id: int):
    db_proyecto = db.query(models.Proyecto).filter(models.Proyecto.id_proyecto == proyecto_id).first()
    if not db_proyecto:
        return False
    db.delete(db_proyecto)
    db.commit()
    return True