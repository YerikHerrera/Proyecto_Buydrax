from sqlalchemy.orm import Session
from app import models, schemas

def update_usuario(db: Session, usuario_id: int, usuario_update: schemas.UsuarioUpdate):
    db_usuario = db.query(models.Usuario).filter(models.Usuario.id_usuario == usuario_id).first()
    if not db_usuario:
        return None
    update_data = usuario_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_usuario, key, value)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario