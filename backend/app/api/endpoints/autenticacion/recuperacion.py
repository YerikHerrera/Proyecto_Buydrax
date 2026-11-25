from fastapi import APIRouter

from app.nucleo.dependencias import DbSession
from app.esquemas.autenticacion import (
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
)
from app.servicios.servicio_autenticacion import ServicioAutenticacion

router = APIRouter(prefix="/auth", tags=["Autenticación"])


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(body: ForgotPasswordRequest, db: DbSession):
    return ServicioAutenticacion(db).solicitar_recuperacion(body.correo)


@router.post("/reset-password")
def reset_password(body: ResetPasswordRequest, db: DbSession):
    return ServicioAutenticacion(db).restablecer_password(body.token, body.nueva_contrasena)
