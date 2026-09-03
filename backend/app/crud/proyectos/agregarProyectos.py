from sqlalchemy.orm import Session
from app import models, schemas

def create_proyecto(db: Session, proyecto: schemas.ProyectoCreate):
    db_proyecto = models.Proyecto(**proyecto.model_dump())
    db.add(db_proyecto)
    db.commit()
    db.refresh(db_proyecto)
    return db_proyecto