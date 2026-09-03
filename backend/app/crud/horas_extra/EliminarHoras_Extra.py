from sqlalchemy.orm import Session
from app import models

def delete_hora_extra(db: Session, hora_extra_id: int):
    db_hora_extra = db.query(models.HoraExtra).filter(models.HoraExtra.id_hora_extra == hora_extra_id).first()
    if not db_hora_extra:
        return False
    db.delete(db_hora_extra)
    db.commit()
    return True