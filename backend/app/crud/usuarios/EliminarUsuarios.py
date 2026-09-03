from sqlalchemy.orm import Session
from app import models

def delete_usuario(db: Session, usuario_id: int):
    db_usuario = db.query(models.Usuario).filter(models.Usuario.id_usuario == usuario_id).first()
    if not db_usuario:
        return False
    db.delete(db_usuario)
    db.commit()
    return True