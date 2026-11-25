"""Gestión de dominios/empresas — solo rol EMPRESA."""

from sqlalchemy.orm import Session

from app.esquemas.empresa import (
    AdminParaDominioCreate,
    EmpresaCreate,
    EmpresaPublic,
    EmpresaUpdate,
)
from app.modelos import AdminRrhh, Usuario
from app.modelos.empresa import Empresa
from app.nucleo.dominio import extraer_dominio, normalizar_dominio
from app.nucleo.excepciones import (
    AuthorizationError,
    ConflictError,
    NotFoundError,
    ValidationAppError,
)
from app.nucleo.seguridad import hash_password
from app.repositorios.repositorio_empresas import RepositorioEmpresas
from app.repositorios.repositorio_usuarios import RepositorioUsuarios


def _rol(u: Usuario) -> str:
    return (u.perfil.nombre if u.perfil else "").upper()


def _require_empresa(actor: Usuario) -> None:
    if _rol(actor) != "EMPRESA":
        raise AuthorizationError("Solo el rol EMPRESA puede gestionar dominios y dar de alta Admins por dominio")


class ServicioEmpresas:
    def __init__(self, db: Session):
        self.db = db
        self.repo = RepositorioEmpresas(db)
        self.repo_u = RepositorioUsuarios(db)

    def listar(self, actor: Usuario) -> list[EmpresaPublic]:
        # EMPRESA ve todos; ADMIN_RRHH solo el suyo (si tiene id_empresa)
        rol = _rol(actor)
        if rol == "EMPRESA":
            rows = self.repo.listar()
        elif rol == "ADMIN_RRHH" and getattr(actor, "id_empresa", None):
            e = self.repo.get(actor.id_empresa)
            rows = [e] if e else []
        else:
            raise AuthorizationError("No autorizado a listar dominios")
        return [EmpresaPublic.model_validate(r) for r in rows]

    def crear(self, data: EmpresaCreate, actor: Usuario) -> EmpresaPublic:
        _require_empresa(actor)
        dom = normalizar_dominio(data.dominio)
        if self.repo.get_by_dominio(dom or ""):
            raise ConflictError(f"El dominio '{dom}' ya está registrado")
        emp = Empresa(
            nombre=data.nombre.strip(),
            dominio=dom,
            tipo=data.tipo,
            activo=True,
        )
        self.repo.add(emp)
        self.repo.commit()
        return EmpresaPublic.model_validate(emp)

    def actualizar(self, id_empresa: int, data: EmpresaUpdate, actor: Usuario) -> EmpresaPublic:
        _require_empresa(actor)
        emp = self.repo.get(id_empresa)
        if not emp:
            raise NotFoundError("Empresa/dominio no encontrado")
        if data.nombre is not None:
            emp.nombre = data.nombre.strip()
        if data.activo is not None:
            emp.activo = data.activo
        if data.tipo is not None:
            emp.tipo = data.tipo
        self.repo.commit()
        return EmpresaPublic.model_validate(emp)

    def crear_admin_para_dominio(self, data: AdminParaDominioCreate, actor: Usuario) -> dict:
        """Crea ADMIN_RRHH cuyo correo DEBE pertenecer al dominio de la empresa."""
        _require_empresa(actor)
        emp = self.repo.get(data.id_empresa)
        if not emp or not emp.activo:
            raise NotFoundError("Empresa/dominio no encontrado o inactivo")

        correo = data.correo.lower().strip()
        dom_correo = extraer_dominio(correo)
        if dom_correo != emp.dominio.lower():
            raise ValidationAppError(
                f"El correo del Admin debe usar el dominio @{emp.dominio} "
                f"(recibido: @{dom_correo or '—'}). "
                f"Así se evita que una empresa asuma un dominio ajeno."
            )

        if self.repo_u.get_by_correo(correo):
            raise ConflictError("El correo ya está registrado")

        perfil = self.repo_u.get_perfil_by_nombre("ADMIN_RRHH")
        if not perfil:
            raise ValidationAppError("Perfil ADMIN_RRHH no existe en la BD")

        usuario = Usuario(
            id_perfil=perfil.id_perfil,
            nombres=data.nombres.strip(),
            apellidos=data.apellidos.strip(),
            correo=correo,
            password_encriptado=hash_password(data.contrasena),
            estado=True,
            idioma="ES",
            id_empresa=emp.id_empresa,
        )
        self.repo_u.add(usuario)
        self.repo_u.add_admin_rrhh(
            AdminRrhh(
                id_usuario=usuario.id_usuario,
                area_responsable=(data.area_responsable or "Gestión humana").strip(),
            )
        )
        self.repo_u.commit()
        return {
            "id_usuario": usuario.id_usuario,
            "correo": usuario.correo,
            "rol": "ADMIN_RRHH",
            "id_empresa": emp.id_empresa,
            "dominio": emp.dominio,
            "mensaje": f"Admin RRHH creado para el dominio @{emp.dominio}",
        }
