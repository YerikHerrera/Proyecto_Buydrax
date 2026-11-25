from fastapi import APIRouter

from app.nucleo.dependencias import DbSession
from app.esquemas.autenticacion import GoogleLoginRequest, TokenResponse
from app.servicios.servicio_autenticacion import ServicioAutenticacion

router = APIRouter(prefix="/auth", tags=["Autenticación"])


@router.post("/google", response_model=TokenResponse)
def login_google(body: GoogleLoginRequest, db: DbSession):
    """Inicio de sesión con Google Identity Services (id_token + correo)."""
    return ServicioAutenticacion(db).login_google(
        correo=str(body.correo),
        nombres=body.nombres,
        apellidos=body.apellidos,
        id_token=body.id_token,
    )
