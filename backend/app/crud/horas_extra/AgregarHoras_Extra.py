from sqlalchemy.orm import Session
from app import models, schemas

def create_hora_extra(db: Session, hora_extra: schemas.HoraExtraCreate):
    db_hora_extra = models.HoraExtra(**hora_extra.model_dump())
    db.add(db_hora_extra)
    db.commit()
    db.refresh(db_hora_extra)
    return db_hora_extra