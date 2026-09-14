"""Casos de uso de usuarios y roles (EP-03 … EP-07)."""

from typing import Optional

from sqlalchemy.orm import Session

from app.nucleo.excepciones import (
    AuthorizationError,
    ConflictError,
    NotFoundError,
    ValidationAppError,
)
from app.nucleo.seguridad import hash_password
from app.modelos import AdminRrhh, Contador, Supervisor, Usuario
from app.repositorios.repositorio_usuarios import RepositorioUsuarios
from app.esquemas.comunes import PaginatedMeta, PaginatedResponse
from app.esquemas.usuario import (
    PERFILES_VALIDOS,
    RolPublic,
    UsuarioCreate,
    UsuarioListFilters,
    UsuarioPublic,
    UsuarioUpdate,
)


def to_usuario_public(usuario: Usuario) -> UsuarioPublic:
    rol = usuario.perfil.nombre if usuario.perfil else None
    return UsuarioPublic(
        id_usuario=usuario.id_usuario,
        id_perfil=usuario.id_perfil,
        nombres=usuario.nombres,
        apellidos=usuario.apellidos,
        correo=usuario.correo,
        estado=usuario.estado,
        ultimo_acceso=usuario.ultimo_acceso,
        foto_perfil=usuario.foto_perfil,
        idioma=usuario.idioma,
        perfil=usuario.perfil,
        rol=rol,
    )


class ServicioUsuarios:
    def __init__(self, db: Session):
        self.repo = RepositorioUsuarios(db)
        self.db = db

    def crear(self, data: UsuarioCreate, actor: Usuario) -> UsuarioPublic:
        self._require_admin_rrhh(actor)

        if self.repo.get_by_correo(data.correo):
            raise ConflictError("El correo ya está registrado")

        perfil = self.repo.get_perfil_by_nombre(data.rol)
        if perfil is None:
            raise ValidationAppError(
                f"Rol '{data.rol}' no existe en la tabla perfil"
            )

        self._validar_campos_especializados(data.rol, data)

        usuario = Usuario(
            id_perfil=perfil.id_perfil,
            nombres=data.nombres.strip(),
            apellidos=data.apellidos.strip(),
            correo=data.correo.lower().strip(),
            password_hash=hash_password(data.contrasena),
            estado=data.estado,
            foto_perfil=data.foto_perfil,
            idioma=data.idioma or "ES",
        )
        self.repo.add(usuario)

        # Crear fila del rol especializado cuando corresponde (1:1)
        if data.rol == "SUPERVISOR":
            self.repo.add_supervisor(
                Supervisor(
                    id_usuario=usuario.id_usuario,
                    numero_tarjeta_profesional=data.numero_tarjeta_profesional,  # type: ignore
                    cuadrilla_asignada=data.cuadrilla_asignada,
                )
            )
        elif data.rol == "CONTADOR":
            self.repo.add_contador(
                Contador(
                    id_usuario=usuario.id_usuario,
                    numero_tarjeta_profesional=data.numero_tarjeta_profesional,  # type: ignore
                    area_nomina=data.area_nomina,  # type: ignore
                )
            )
        elif data.rol == "ADMIN_RRHH":
            self.repo.add_admin_rrhh(
                AdminRrhh(
                    id_usuario=usuario.id_usuario,
                    area_responsable=data.area_responsable,  # type: ignore
                )
            )

        self.repo.commit()
        creado = self.repo.get_by_id(usuario.id_usuario)
        assert creado is not None
        return to_usuario_public(creado)

    def listar(self, filters: UsuarioListFilters, actor: Usuario) -> PaginatedResponse[UsuarioPublic]:
        # Cualquier usuario autenticado puede listar (matriz: "Usuario autorizado")
        if filters.rol and filters.rol.upper() not in PERFILES_VALIDOS:
            raise ValidationAppError("Filtro de rol inválido")

        rows, total = self.repo.list(
            nombre=filters.nombre,
            correo=filters.correo,
            rol=filters.rol.upper() if filters.rol else None,
            estado=filters.estado,
            skip=filters.skip,
            limit=filters.limit,
        )
        items = [to_usuario_public(u) for u in rows]
        return PaginatedResponse(
            items=items,
            meta=PaginatedMeta(total=total, skip=filters.skip, limit=filters.limit),
        )

    def obtener(self, id_usuario: int, actor: Usuario) -> UsuarioPublic:
        usuario = self.repo.get_by_id(id_usuario)
        if usuario is None:
            raise NotFoundError("Usuario no encontrado")
        return to_usuario_public(usuario)

    def actualizar(
        self, id_usuario: int, data: UsuarioUpdate, actor: Usuario
    ) -> UsuarioPublic:
        self._require_admin_rrhh(actor)

        usuario = self.repo.get_by_id(id_usuario)
        if usuario is None:
            raise NotFoundError("Usuario no encontrado")

        payload = data.model_dump(exclude_unset=True)

        if "correo" in payload and payload["correo"]:
            nuevo_correo = payload["correo"].lower().strip()
            existente = self.repo.get_by_correo(nuevo_correo)
            if existente and existente.id_usuario != id_usuario:
                raise ConflictError("El correo ya está registrado")
            usuario.correo = nuevo_correo

        if "nombres" in payload and payload["nombres"] is not None:
            usuario.nombres = payload["nombres"].strip()
        if "apellidos" in payload and payload["apellidos"] is not None:
            usuario.apellidos = payload["apellidos"].strip()
        if "idioma" in payload and payload["idioma"] is not None:
            usuario.idioma = payload["idioma"]
        if "foto_perfil" in payload:
            usuario.foto_perfil = payload["foto_perfil"]
        if "estado" in payload and payload["estado"] is not None:
            usuario.estado = payload["estado"]
        if "contrasena" in payload and payload["contrasena"]:
            usuario.password_hash = hash_password(payload["contrasena"])

        if "rol" in payload and payload["rol"]:
            nuevo_rol = payload["rol"]
            perfil = self.repo.get_perfil_by_nombre(nuevo_rol)
            if perfil is None:
                raise ValidationAppError(f"Rol '{nuevo_rol}' no existe")
            # Cambio de rol: solo se actualiza id_perfil.
            # Crear/eliminar filas especializadas en un cambio de rol
            # requiere reglas de negocio adicionales (pendiente de definición fina).
            usuario.id_perfil = perfil.id_perfil

        # Actualizar atributos de rol especializado si ya existe la fila
        if usuario.supervisor is not None:
            if "numero_tarjeta_profesional" in payload and payload["numero_tarjeta_profesional"]:
                usuario.supervisor.numero_tarjeta_profesional = payload[
                    "numero_tarjeta_profesional"
                ]
            if "cuadrilla_asignada" in payload:
                usuario.supervisor.cuadrilla_asignada = payload["cuadrilla_asignada"]
        if usuario.contador is not None:
            if "numero_tarjeta_profesional" in payload and payload["numero_tarjeta_profesional"]:
                usuario.contador.numero_tarjeta_profesional = payload[
                    "numero_tarjeta_profesional"
                ]
            if "area_nomina" in payload and payload["area_nomina"]:
                usuario.contador.area_nomina = payload["area_nomina"]
        if usuario.admin_rrhh is not None:
            if "area_responsable" in payload and payload["area_responsable"]:
                usuario.admin_rrhh.area_responsable = payload["area_responsable"]

        self.repo.commit()
        actualizado = self.repo.get_by_id(id_usuario)
        assert actualizado is not None
        return to_usuario_public(actualizado)

    def listar_roles(self, actor: Usuario) -> list[RolPublic]:
        perfiles = self.repo.list_perfiles()
        return [RolPublic.model_validate(p) for p in perfiles]

    # --- helpers ---

    def _require_admin_rrhh(self, actor: Usuario) -> None:
        rol = actor.perfil.nombre if actor.perfil else None
        if rol != "ADMIN_RRHH":
            raise AuthorizationError("Se requiere rol ADMIN_RRHH")

    def _validar_campos_especializados(self, rol: str, data: UsuarioCreate) -> None:
        if rol == "SUPERVISOR":
            if not data.numero_tarjeta_profesional:
                raise ValidationAppError(
                    "numero_tarjeta_profesional es obligatorio para SUPERVISOR"
                )
        elif rol == "CONTADOR":
            if not data.numero_tarjeta_profesional:
                raise ValidationAppError(
                    "numero_tarjeta_profesional es obligatorio para CONTADOR"
                )
            if not data.area_nomina:
                raise ValidationAppError("area_nomina es obligatorio para CONTADOR")
        elif rol == "ADMIN_RRHH":
            if not data.area_responsable:
                raise ValidationAppError(
                    "area_responsable es obligatorio para ADMIN_RRHH"
                )
