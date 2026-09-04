"""Excepciones de dominio y mapeo a respuestas HTTP consistentes."""

from typing import Any, Optional

from fastapi import Request, status
from fastapi.responses import JSONResponse


class AppError(Exception):
    """Error base de la aplicación."""

    def __init__(
        self,
        message: str,
        code: str = "app_error",
        status_code: int = status.HTTP_400_BAD_REQUEST,
        details: Optional[Any] = None,
    ):
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details
        super().__init__(message)


class AuthenticationError(AppError):
    def __init__(self, message: str = "No autenticado", details: Optional[Any] = None):
        super().__init__(
            message=message,
            code="authentication_error",
            status_code=status.HTTP_401_UNAUTHORIZED,
            details=details,
        )


class AuthorizationError(AppError):
    def __init__(self, message: str = "No autorizado", details: Optional[Any] = None):
        super().__init__(
            message=message,
            code="authorization_error",
            status_code=status.HTTP_403_FORBIDDEN,
            details=details,
        )


class NotFoundError(AppError):
    def __init__(self, message: str = "Recurso no encontrado", details: Optional[Any] = None):
        super().__init__(
            message=message,
            code="not_found",
            status_code=status.HTTP_404_NOT_FOUND,
            details=details,
        )


class ValidationAppError(AppError):
    def __init__(self, message: str = "Datos inválidos", details: Optional[Any] = None):
        super().__init__(
            message=message,
            code="validation_error",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            details=details,
        )


class ConflictError(AppError):
    def __init__(self, message: str = "Conflicto / duplicidad", details: Optional[Any] = None):
        super().__init__(
            message=message,
            code="conflict",
            status_code=status.HTTP_409_CONFLICT,
            details=details,
        )


class InvalidStateError(AppError):
    def __init__(self, message: str = "Estado inválido para la operación", details: Optional[Any] = None):
        super().__init__(
            message=message,
            code="invalid_state",
            status_code=status.HTTP_409_CONFLICT,
            details=details,
        )


async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
    body: dict[str, Any] = {
        "error": {
            "code": exc.code,
            "message": exc.message,
        }
    }
    if exc.details is not None:
        body["error"]["details"] = exc.details
    return JSONResponse(status_code=exc.status_code, content=body)
