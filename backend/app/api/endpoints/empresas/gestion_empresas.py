from fastapi import APIRouter, Depends

from app.esquemas.empresa import AdminParaDominioCreate, EmpresaCreate, EmpresaUpdate
from app.modelos.usuario import Usuario
from app.nucleo.dependencias import CurrentUser, DbSession
from app.servicios.servicio_empresas import ServicioEmpresas

router = APIRouter(prefix="/empresas", tags=["empresas"])


@router.get("")
def listar_empresas(db: DbSession, actor: CurrentUser):
    return ServicioEmpresas(db).listar(actor)


@router.post("")
def crear_empresa(body: EmpresaCreate, db: DbSession, actor: CurrentUser):
    return ServicioEmpresas(db).crear(body, actor)


@router.patch("/{id_empresa}")
def actualizar_empresa(id_empresa: int, body: EmpresaUpdate, db: DbSession, actor: CurrentUser):
    return ServicioEmpresas(db).actualizar(id_empresa, body, actor)


@router.post("/admin")
def crear_admin_dominio(body: AdminParaDominioCreate, db: DbSession, actor: CurrentUser):
    return ServicioEmpresas(db).crear_admin_para_dominio(body, actor)
