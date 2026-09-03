from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import schemas

# Importar todas las funciones CRUD
from app.crud.proyectos.LeerProyectos import get_proyectos, get_proyecto
from app.crud.proyectos.AgregarProyectos import create_proyecto
from app.crud.proyectos.EditarProyectos import update_proyecto
from app.crud.proyectos.EliminarProyectos import delete_proyecto

from app.crud.usuarios.LeerUsuarios import get_usuarios, get_usuario
from app.crud.usuarios.AgregarUsuarios import create_usuario
from app.crud.usuarios.EditarUsuarios import update_usuario
from app.crud.usuarios.EliminarUsuarios import delete_usuario

from app.crud.asistencia.LeerAsistencia import get_asistencias, get_asistencia
from app.crud.asistencia.AgregarAsistencia import create_asistencia
from app.crud.asistencia.EditarAsistencia import update_asistencia
from app.crud.asistencia.EliminarAsistencia import delete_asistencia

from app.crud.horas_extra.LeerHoras_Extra import get_horas_extra, get_hora_extra
from app.crud.horas_extra.AgregarHoras_Extra import create_hora_extra
from app.crud.horas_extra.EditarHoras_Extra import update_hora_extra
from app.crud.horas_extra.EliminarHoras_Extra import delete_hora_extra

app = FastAPI(title="API Buydrax", version="1.0", description="API para gestión de proyectos, usuarios, asistencia y horas extra")

# ================== PROYECTOS ==================
@app.get("/proyectos", response_model=List[schemas.Proyecto])
def listar_proyectos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_proyectos(db, skip=skip, limit=limit)

@app.get("/proyectos/{proyecto_id}", response_model=schemas.Proyecto)
def obtener_proyecto(proyecto_id: int, db: Session = Depends(get_db)):
    proyecto = get_proyecto(db, proyecto_id)
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return proyecto

@app.post("/proyectos", response_model=schemas.Proyecto, status_code=status.HTTP_201_CREATED)
def crear_proyecto(proyecto: schemas.ProyectoCreate, db: Session = Depends(get_db)):
    return create_proyecto(db, proyecto)

@app.put("/proyectos/{proyecto_id}", response_model=schemas.Proyecto)
def actualizar_proyecto(proyecto_id: int, proyecto_update: schemas.ProyectoUpdate, db: Session = Depends(get_db)):
    proyecto = update_proyecto(db, proyecto_id, proyecto_update)
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return proyecto

@app.delete("/proyectos/{proyecto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_proyecto(proyecto_id: int, db: Session = Depends(get_db)):
    eliminado = delete_proyecto(db, proyecto_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return None

# ================== USUARIOS ==================
@app.get("/usuarios", response_model=List[schemas.Usuario])
def listar_usuarios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_usuarios(db, skip=skip, limit=limit)

@app.get("/usuarios/{usuario_id}", response_model=schemas.Usuario)
def obtener_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = get_usuario(db, usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

@app.post("/usuarios", response_model=schemas.Usuario, status_code=status.HTTP_201_CREATED)
def crear_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    # Validar que el correo no esté duplicado (opcional, pero SQLAlchemy lanzará excepción)
    return create_usuario(db, usuario)

@app.put("/usuarios/{usuario_id}", response_model=schemas.Usuario)
def actualizar_usuario(usuario_id: int, usuario_update: schemas.UsuarioUpdate, db: Session = Depends(get_db)):
    usuario = update_usuario(db, usuario_id, usuario_update)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

@app.delete("/usuarios/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_usuario(usuario_id: int, db: Session = Depends(get_db)):
    eliminado = delete_usuario(db, usuario_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return None

# ================== ASISTENCIA ==================
@app.get("/asistencia", response_model=List[schemas.Asistencia])
def listar_asistencias(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_asistencias(db, skip=skip, limit=limit)

@app.get("/asistencia/{asistencia_id}", response_model=schemas.Asistencia)
def obtener_asistencia(asistencia_id: int, db: Session = Depends(get_db)):
    asistencia = get_asistencia(db, asistencia_id)
    if not asistencia:
        raise HTTPException(status_code=404, detail="Asistencia no encontrada")
    return asistencia

@app.post("/asistencia", response_model=schemas.Asistencia, status_code=status.HTTP_201_CREATED)
def crear_asistencia(asistencia: schemas.AsistenciaCreate, db: Session = Depends(get_db)):
    return create_asistencia(db, asistencia)

@app.put("/asistencia/{asistencia_id}", response_model=schemas.Asistencia)
def actualizar_asistencia(asistencia_id: int, asistencia_update: schemas.AsistenciaUpdate, db: Session = Depends(get_db)):
    asistencia = update_asistencia(db, asistencia_id, asistencia_update)
    if not asistencia:
        raise HTTPException(status_code=404, detail="Asistencia no encontrada")
    return asistencia

@app.delete("/asistencia/{asistencia_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_asistencia(asistencia_id: int, db: Session = Depends(get_db)):
    eliminado = delete_asistencia(db, asistencia_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Asistencia no encontrada")
    return None

# ================== HORAS EXTRA ==================
@app.get("/horas-extra", response_model=List[schemas.HoraExtra])
def listar_horas_extra(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_horas_extra(db, skip=skip, limit=limit)

@app.get("/horas-extra/{hora_extra_id}", response_model=schemas.HoraExtra)
def obtener_hora_extra(hora_extra_id: int, db: Session = Depends(get_db)):
    hora_extra = get_hora_extra(db, hora_extra_id)
    if not hora_extra:
        raise HTTPException(status_code=404, detail="Hora extra no encontrada")
    return hora_extra

@app.post("/horas-extra", response_model=schemas.HoraExtra, status_code=status.HTTP_201_CREATED)
def crear_hora_extra(hora_extra: schemas.HoraExtraCreate, db: Session = Depends(get_db)):
    return create_hora_extra(db, hora_extra)

@app.put("/horas-extra/{hora_extra_id}", response_model=schemas.HoraExtra)
def actualizar_hora_extra(hora_extra_id: int, hora_extra_update: schemas.HoraExtraUpdate, db: Session = Depends(get_db)):
    hora_extra = update_hora_extra(db, hora_extra_id, hora_extra_update)
    if not hora_extra:
        raise HTTPException(status_code=404, detail="Hora extra no encontrada")
    return hora_extra

@app.delete("/horas-extra/{hora_extra_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_hora_extra(hora_extra_id: int, db: Session = Depends(get_db)):
    eliminado = delete_hora_extra(db, hora_extra_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Hora extra no encontrada")
    return None