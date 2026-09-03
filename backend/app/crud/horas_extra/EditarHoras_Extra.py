from sqlalchemy.orm import Session
from app import models, schemas

def update_hora_extra(db: Session, hora_extra_id: int, hora_extra_update: schemas.HoraExtraUpdate):
    db_hora_extra = db.query(models.HoraExtra).filter(models.HoraExtra.id_hora_extra == hora_extra_id).first()
    if not db_hora_extra:
        return None
    update_data = hora_extra_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_hora_extra, key, value)
    db.commit()
    db.refresh(db_hora_extra)
    return db_hora_extra