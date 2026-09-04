"""
Endpoints de dominio Buydrax — EP-08 … EP-102
Implementación sobre SQL auditado. Fórmulas de nómina/PILA pendientes no se inventan.
"""

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.dependencies import AdminRrhhUser, CurrentUser, DbSession
from app.core.exceptions import (
    AuthorizationError,
    ConflictError,
    InvalidStateError,
    NotFoundError,
    ValidationAppError,
)
from app.models import (
    Afiliacion,
    AsignacionProyecto,
    Asistencia,
    Certificacion,
    Configuracion,
    Contrato,
    Desprendible,
    DetalleNomina,
    Empleado,
    EvaluacionDesempeno,
    HistorialLaboral,
    HoraExtra,
    Liquidacion,
    Nomina,
    Notificacion,
    Novedad,
    Observacion,
    Pila,
    Prestamo,
    Proyecto,
    Solicitud,
    Supervisor,
    Turno,
    Usuario,
    Viatico,
    AdminRrhh,
    CambioConfiguracion,
    AporteEmpleado,
)
from app.schemas.domain import (
    AfiliacionOut,
    AfiliacionUpsert,
    AsignacionCreate,
    AsignacionOut,
    AsistenciaCreate,
    AsistenciaOut,
    CertificacionCreate,
    CertificacionOut,
    CertificacionUpdate,
    ConfiguracionCreate,
    ConfiguracionOut,
    ConfiguracionUpdate,
    ContratoCreate,
    ContratoOut,
    ContratoUpdate,
    DashboardOut,
    DesprendibleOut,
    DetalleNominaOut,
    EmpleadoCreate,
    EmpleadoOut,
    EmpleadoUpdate,
    EvaluacionCreate,
    EvaluacionOut,
    EvaluacionUpdate,
    HistorialOut,
    HoraExtraCreate,
    HoraExtraOut,
    HoraExtraUpdate,
    LiquidacionCreate,
    LiquidacionOut,
    MessageOut,
    NominaCreate,
    NominaOut,
    NominaUpdate,
    NotificacionOut,
    NotificacionUpdate,
    NovedadCreate,
    NovedadOut,
    NovedadUpdate,
    ObservacionCreate,
    ObservacionOut,
    ObservacionUpdate,
    PilaOut,
    PrestamoCreate,
    PrestamoOut,
    PrestamoUpdate,
    ProyectoCreate,
    ProyectoOut,
    ProyectoUpdate,
    RetiroBody,
    SolicitudCreate,
    SolicitudOut,
    SolicitudUpdate,
    SupervisorOut,
    TurnoCreate,
    TurnoOut,
    TurnoUpdate,
    ViaticoCreate,
    ViaticoOut,
    ViaticoUpdate,
)

router = APIRouter(tags=["Dominio"])


def _get_or_404(db: Session, model, pk: int, label: str = "Recurso"):
    obj = db.get(model, pk)
    if obj is None:
        raise NotFoundError(f"{label} no encontrado")
    return obj


def _require_admin(actor: Usuario):
    rol = actor.perfil.nombre if actor.perfil else None
    if rol != "ADMIN_RRHH":
        raise AuthorizationError("Se requiere rol ADMIN_RRHH")


def _supervisor_id_of(db: Session, usuario: Usuario) -> Optional[int]:
    row = db.execute(select(Supervisor).where(Supervisor.id_usuario == usuario.id_usuario)).scalar_one_or_none()
    return row.id_supervisor if row else None


def _admin_rrhh_id_of(db: Session, usuario: Usuario) -> Optional[int]:
    row = db.execute(select(AdminRrhh).where(AdminRrhh.id_usuario == usuario.id_usuario)).scalar_one_or_none()
    return row.id_admin_rrhh if row else None


# =============================================================================
# EP-08 Dashboard
# =============================================================================
@router.get("/dashboard", response_model=DashboardOut, summary="EP-08 Dashboard")
def dashboard(db: DbSession, actor: CurrentUser):
    return DashboardOut(
        empleados_activos=db.scalar(select(func.count()).select_from(Empleado).where(Empleado.estado_laboral == "ACTIVO")) or 0,
        proyectos_activos=db.scalar(select(func.count()).select_from(Proyecto).where(Proyecto.estado_proyecto == "ACTIVO")) or 0,
        horas_extra_pendientes=db.scalar(select(func.count()).select_from(HoraExtra).where(HoraExtra.estado_he == "PENDIENTE")) or 0,
        novedades_pendientes=db.scalar(select(func.count()).select_from(Novedad).where(Novedad.estado_novedad == "PENDIENTE")) or 0,
        nominas_borrador=db.scalar(select(func.count()).select_from(Nomina).where(Nomina.estado_nomina == "BORRADOR")) or 0,
        solicitudes_pendientes=db.scalar(select(func.count()).select_from(Solicitud).where(Solicitud.estado_solicitud == "PENDIENTE")) or 0,
    )


# =============================================================================
# EP-09 … EP-14 Empleados
# =============================================================================
@router.get("/empleados", response_model=list[EmpleadoOut], summary="EP-09 Listar empleados")
def listar_empleados(
    db: DbSession,
    actor: CurrentUser,
    nombre: Optional[str] = None,
    documento: Optional[str] = None,
    estado: Optional[str] = None,
    supervisor: Optional[int] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
):
    q = select(Empleado)
    if documento:
        q = q.where(Empleado.numero_documento.ilike(f"%{documento}%"))
    if estado:
        q = q.where(Empleado.estado_laboral == estado.upper())
    if supervisor is not None:
        q = q.where(Empleado.id_supervisor == supervisor)
    rows = db.execute(q.order_by(Empleado.id_empleado).offset(skip).limit(limit)).scalars().all()
    return rows


@router.post("/empleados", response_model=EmpleadoOut, status_code=201, summary="EP-10 Registrar empleado")
def crear_empleado(body: EmpleadoCreate, db: DbSession, actor: AdminRrhhUser):
    if db.execute(select(Empleado).where(Empleado.numero_documento == body.numero_documento)).scalar_one_or_none():
        raise ConflictError("Número de documento ya registrado")
    if db.execute(select(Empleado).where(Empleado.id_usuario == body.id_usuario)).scalar_one_or_none():
        raise ConflictError("El usuario ya tiene empleado asociado")
    if db.get(Usuario, body.id_usuario) is None:
        raise NotFoundError("Usuario no encontrado")
    emp = Empleado(**body.model_dump())
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return emp


@router.get("/empleados/{id_empleado}", response_model=EmpleadoOut, summary="EP-11 Consultar empleado")
def obtener_empleado(id_empleado: int, db: DbSession, actor: CurrentUser):
    return _get_or_404(db, Empleado, id_empleado, "Empleado")


@router.patch("/empleados/{id_empleado}", response_model=EmpleadoOut, summary="EP-12/13 Actualizar o retirar empleado")
def actualizar_empleado(id_empleado: int, body: EmpleadoUpdate, db: DbSession, actor: AdminRrhhUser):
    emp = _get_or_404(db, Empleado, id_empleado, "Empleado")
    data = body.model_dump(exclude_unset=True)
    if "numero_documento" in data and data["numero_documento"]:
        other = db.execute(
            select(Empleado).where(
                Empleado.numero_documento == data["numero_documento"],
                Empleado.id_empleado != id_empleado,
            )
        ).scalar_one_or_none()
        if other:
            raise ConflictError("Número de documento ya registrado")
    for k, v in data.items():
        setattr(emp, k, v)
    # Si se retira, desactivar acceso del usuario
    if data.get("estado_laboral") == "RETIRADO":
        user = db.get(Usuario, emp.id_usuario)
        if user:
            user.estado = False
    db.commit()
    db.refresh(emp)
    return emp


@router.get("/empleados/export", summary="EP-14 Exportar empleados")
def exportar_empleados(db: DbSession, actor: CurrentUser, formato: str = Query("json")):
    rows = db.execute(select(Empleado).order_by(Empleado.id_empleado)).scalars().all()
    data = [EmpleadoOut.model_validate(r).model_dump(mode="json") for r in rows]
    if formato.lower() == "csv":
        # CSV simple
        if not data:
            return JSONResponse(content={"message": "Sin datos"}, media_type="application/json")
        headers = list(data[0].keys())
        lines = [",".join(headers)]
        for row in data:
            lines.append(",".join(str(row.get(h, "")) for h in headers))
        return JSONResponse(content={"csv": "\n".join(lines), "count": len(data)})
    return {"items": data, "count": len(data)}


# =============================================================================
# EP-15 … EP-16 Afiliación
# =============================================================================
@router.get("/empleados/{id_empleado}/afiliacion", response_model=AfiliacionOut, summary="EP-15 Consultar afiliación")
def get_afiliacion(id_empleado: int, db: DbSession, actor: CurrentUser):
    _get_or_404(db, Empleado, id_empleado, "Empleado")
    af = db.execute(select(Afiliacion).where(Afiliacion.id_empleado == id_empleado)).scalar_one_or_none()
    if af is None:
        raise NotFoundError("Afiliación no encontrada")
    return af


@router.put("/empleados/{id_empleado}/afiliacion", response_model=AfiliacionOut, summary="EP-16 Crear/actualizar afiliación")
def upsert_afiliacion(id_empleado: int, body: AfiliacionUpsert, db: DbSession, actor: AdminRrhhUser):
    _get_or_404(db, Empleado, id_empleado, "Empleado")
    af = db.execute(select(Afiliacion).where(Afiliacion.id_empleado == id_empleado)).scalar_one_or_none()
    if af is None:
        af = Afiliacion(id_empleado=id_empleado, **body.model_dump())
        db.add(af)
    else:
        for k, v in body.model_dump().items():
            setattr(af, k, v)
    db.commit()
    db.refresh(af)
    return af


# =============================================================================
# EP-17 Historial laboral (solo consulta; se genera internamente)
# =============================================================================
@router.get("/empleados/{id_empleado}/historial-laboral", response_model=list[HistorialOut], summary="EP-17 Historial laboral")
def historial_laboral(id_empleado: int, db: DbSession, actor: CurrentUser):
    _get_or_404(db, Empleado, id_empleado, "Empleado")
    return db.execute(
        select(HistorialLaboral).where(HistorialLaboral.id_empleado == id_empleado).order_by(HistorialLaboral.fecha_movimiento.desc())
    ).scalars().all()


# =============================================================================
# EP-18 … EP-21 Certificaciones
# =============================================================================
@router.get("/empleados/{id_empleado}/certificaciones", response_model=list[CertificacionOut], summary="EP-18 Listar certificaciones")
def list_certs(id_empleado: int, db: DbSession, actor: CurrentUser):
    _get_or_404(db, Empleado, id_empleado, "Empleado")
    return db.execute(select(Certificacion).where(Certificacion.id_empleado == id_empleado)).scalars().all()


@router.post("/empleados/{id_empleado}/certificaciones", response_model=CertificacionOut, status_code=201, summary="EP-19 Registrar certificación")
def create_cert(id_empleado: int, body: CertificacionCreate, db: DbSession, actor: AdminRrhhUser):
    _get_or_404(db, Empleado, id_empleado, "Empleado")
    c = Certificacion(id_empleado=id_empleado, **body.model_dump())
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


@router.patch("/certificaciones/{id_certificacion}", response_model=CertificacionOut, summary="EP-20 Actualizar certificación")
def update_cert(id_certificacion: int, body: CertificacionUpdate, db: DbSession, actor: CurrentUser):
    c = _get_or_404(db, Certificacion, id_certificacion, "Certificación")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(c, k, v)
    db.commit()
    db.refresh(c)
    return c


@router.get("/certificaciones/{id_certificacion}/archivo", summary="EP-21 Descargar archivo certificación")
def download_cert(id_certificacion: int, db: DbSession, actor: CurrentUser):
    c = _get_or_404(db, Certificacion, id_certificacion, "Certificación")
    return {"archivo_url": c.archivo_url, "tipo_archivo": c.tipo_archivo, "nombre": c.nombre}


# =============================================================================
# EP-22 … EP-25 Supervisores
# =============================================================================
@router.get("/supervisores", response_model=list[SupervisorOut], summary="EP-22 Listar supervisores")
def list_supervisores(db: DbSession, actor: CurrentUser):
    return db.execute(select(Supervisor).order_by(Supervisor.id_supervisor)).scalars().all()


@router.patch("/empleados/{id_empleado}/supervisor", response_model=EmpleadoOut, summary="EP-23 Asignar supervisor")
def asignar_supervisor(id_empleado: int, body: dict, db: DbSession, actor: AdminRrhhUser):
    emp = _get_or_404(db, Empleado, id_empleado, "Empleado")
    id_sup = body.get("id_supervisor") or body.get("idSupervisor")
    if id_sup is None:
        raise ValidationAppError("id_supervisor es obligatorio")
    if db.get(Supervisor, int(id_sup)) is None:
        raise NotFoundError("Supervisor no encontrado")
    emp.id_supervisor = int(id_sup)
    db.commit()
    db.refresh(emp)
    return emp


@router.get("/supervisores/{id_supervisor}/empleados", response_model=list[EmpleadoOut], summary="EP-24 Empleados del supervisor")
def empleados_supervisor(id_supervisor: int, db: DbSession, actor: CurrentUser):
    _get_or_404(db, Supervisor, id_supervisor, "Supervisor")
    return db.execute(select(Empleado).where(Empleado.id_supervisor == id_supervisor)).scalars().all()


@router.get("/supervisores/{id_supervisor}/proyectos", response_model=list[ProyectoOut], summary="EP-25 Proyectos del supervisor")
def proyectos_supervisor(id_supervisor: int, db: DbSession, actor: CurrentUser):
    _get_or_404(db, Supervisor, id_supervisor, "Supervisor")
    return db.execute(select(Proyecto).where(Proyecto.id_supervisor == id_supervisor)).scalars().all()


# =============================================================================
# EP-26 … EP-28 Asistencia
# =============================================================================
@router.post("/empleados/{id_empleado}/asistencias", response_model=AsistenciaOut, status_code=201, summary="EP-26 Registrar asistencia")
def create_asistencia(id_empleado: int, body: AsistenciaCreate, db: DbSession, actor: CurrentUser):
    _get_or_404(db, Empleado, id_empleado, "Empleado")
    a = Asistencia(
        id_empleado=id_empleado,
        id_creado_por=actor.id_usuario,
        fecha_creacion=datetime.utcnow(),
        **body.model_dump(),
    )
    db.add(a)
    db.commit()
    db.refresh(a)
    return a


@router.get("/empleados/{id_empleado}/asistencias", response_model=list[AsistenciaOut], summary="EP-27 Listar asistencias")
def list_asistencias(id_empleado: int, db: DbSession, actor: CurrentUser):
    _get_or_404(db, Empleado, id_empleado, "Empleado")
    return db.execute(select(Asistencia).where(Asistencia.id_empleado == id_empleado).order_by(Asistencia.fecha.desc())).scalars().all()


@router.get("/asistencias", response_model=list[AsistenciaOut], summary="Listar asistencias (control)")
def list_all_asistencias(
    db: DbSession,
    actor: CurrentUser,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
):
    """Listado global para supervisores/admin (control operativo)."""
    return db.execute(
        select(Asistencia).order_by(Asistencia.fecha.desc()).offset(skip).limit(limit)
    ).scalars().all()


@router.get("/asistencias/{id_asistencia}", response_model=AsistenciaOut, summary="EP-28 Consultar asistencia")
def get_asistencia(id_asistencia: int, db: DbSession, actor: CurrentUser):
    return _get_or_404(db, Asistencia, id_asistencia, "Asistencia")


# =============================================================================
# EP-29 … EP-33 Turnos
# =============================================================================
@router.get("/turnos", response_model=list[TurnoOut], summary="EP-29 Listar turnos")
def list_turnos(db: DbSession, actor: CurrentUser, id_empleado: Optional[int] = None, id_proyecto: Optional[int] = None):
    q = select(Turno)
    if id_empleado:
        q = q.where(Turno.id_empleado == id_empleado)
    if id_proyecto:
        q = q.where(Turno.id_proyecto == id_proyecto)
    return db.execute(q.order_by(Turno.fecha.desc())).scalars().all()


@router.post("/turnos", response_model=TurnoOut, status_code=201, summary="EP-30 Registrar turno")
def create_turno(body: TurnoCreate, db: DbSession, actor: CurrentUser):
    _get_or_404(db, Empleado, body.id_empleado, "Empleado")
    _get_or_404(db, Proyecto, body.id_proyecto, "Proyecto")
    t = Turno(id_asignado_por=actor.id_usuario, **body.model_dump())
    db.add(t)
    db.commit()
    db.refresh(t)
    return t


@router.get("/turnos/{id_turno}", response_model=TurnoOut, summary="EP-31 Consultar turno")
def get_turno(id_turno: int, db: DbSession, actor: CurrentUser):
    return _get_or_404(db, Turno, id_turno, "Turno")


@router.patch("/turnos/{id_turno}", response_model=TurnoOut, summary="EP-32 Actualizar turno")
def update_turno(id_turno: int, body: TurnoUpdate, db: DbSession, actor: CurrentUser):
    t = _get_or_404(db, Turno, id_turno, "Turno")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(t, k, v)
    db.commit()
    db.refresh(t)
    return t


@router.delete("/turnos/{id_turno}", response_model=MessageOut, summary="EP-33 Eliminar turno")
def delete_turno(id_turno: int, db: DbSession, actor: CurrentUser):
    t = _get_or_404(db, Turno, id_turno, "Turno")
    db.delete(t)
    db.commit()
    return MessageOut(message="Turno eliminado")


# =============================================================================
# EP-34 … EP-37 Novedades
# =============================================================================
@router.get("/empleados/{id_empleado}/novedades", response_model=list[NovedadOut], summary="EP-34 Listar novedades")
def list_novedades(id_empleado: int, db: DbSession, actor: CurrentUser):
    _get_or_404(db, Empleado, id_empleado, "Empleado")
    return db.execute(select(Novedad).where(Novedad.id_empleado == id_empleado)).scalars().all()


@router.post("/empleados/{id_empleado}/novedades", response_model=NovedadOut, status_code=201, summary="EP-35 Registrar novedad")
def create_novedad(id_empleado: int, body: NovedadCreate, db: DbSession, actor: CurrentUser):
    _get_or_404(db, Empleado, id_empleado, "Empleado")
    n = Novedad(id_empleado=id_empleado, **body.model_dump())
    db.add(n)
    db.commit()
    db.refresh(n)
    return n


@router.get("/novedades/{id_novedad}", response_model=NovedadOut, summary="EP-36 Consultar novedad")
def get_novedad(id_novedad: int, db: DbSession, actor: CurrentUser):
    return _get_or_404(db, Novedad, id_novedad, "Novedad")


@router.patch("/novedades/{id_novedad}", response_model=NovedadOut, summary="EP-37 Gestionar novedad")
def update_novedad(id_novedad: int, body: NovedadUpdate, db: DbSession, actor: CurrentUser):
    n = _get_or_404(db, Novedad, id_novedad, "Novedad")
    data = body.model_dump(exclude_unset=True)
    if "estado_novedad" in data and data["estado_novedad"] in ("APROBADA", "RECHAZADA"):
        n.id_aprobado_por = actor.id_usuario
    for k, v in data.items():
        setattr(n, k, v)
    db.commit()
    db.refresh(n)
    return n


# =============================================================================
# EP-38 … EP-41 Horas extra
# =============================================================================
@router.get("/horas-extra", response_model=list[HoraExtraOut], summary="EP-38 Listar horas extra")
def list_he(db: DbSession, actor: CurrentUser, id_empleado: Optional[int] = None, estado: Optional[str] = None):
    q = select(HoraExtra)
    if id_empleado:
        q = q.where(HoraExtra.id_empleado == id_empleado)
    if estado:
        q = q.where(HoraExtra.estado_he == estado.upper())
    return db.execute(q.order_by(HoraExtra.id_hora_extra.desc())).scalars().all()


@router.post("/empleados/{id_empleado}/horas-extra", response_model=HoraExtraOut, status_code=201, summary="EP-39 Registrar hora extra")
def create_he(id_empleado: int, body: HoraExtraCreate, db: DbSession, actor: CurrentUser):
    _get_or_404(db, Empleado, id_empleado, "Empleado")
    h = HoraExtra(id_empleado=id_empleado, **body.model_dump())
    db.add(h)
    db.commit()
    db.refresh(h)
    return h


@router.get("/horas-extra/{id_hora_extra}", response_model=HoraExtraOut, summary="EP-40 Consultar hora extra")
def get_he(id_hora_extra: int, db: DbSession, actor: CurrentUser):
    return _get_or_404(db, HoraExtra, id_hora_extra, "Hora extra")


@router.patch("/horas-extra/{id_hora_extra}", response_model=HoraExtraOut, summary="EP-41 Gestionar hora extra")
def update_he(id_hora_extra: int, body: HoraExtraUpdate, db: DbSession, actor: CurrentUser):
    h = _get_or_404(db, HoraExtra, id_hora_extra, "Hora extra")
    data = body.model_dump(exclude_unset=True)
    if "estado_he" in data and data["estado_he"] in ("APROBADA", "RECHAZADA"):
        sid = _supervisor_id_of(db, actor)
        if sid:
            h.id_aprobador = sid
    for k, v in data.items():
        setattr(h, k, v)
    db.commit()
    db.refresh(h)
    return h


# =============================================================================
# EP-42 … EP-46 Proyectos
# =============================================================================
@router.get("/proyectos", response_model=list[ProyectoOut], summary="EP-42 Listar proyectos")
def list_proyectos(db: DbSession, actor: CurrentUser, estado: Optional[str] = None):
    q = select(Proyecto)
    if estado:
        q = q.where(Proyecto.estado_proyecto == estado.upper())
    return db.execute(q.order_by(Proyecto.id_proyecto)).scalars().all()


@router.post("/proyectos", response_model=ProyectoOut, status_code=201, summary="EP-43 Crear proyecto")
def create_proyecto(body: ProyectoCreate, db: DbSession, actor: AdminRrhhUser):
    if body.fecha_inicio >= body.fecha_fin:
        raise ValidationAppError("fecha_inicio debe ser menor que fecha_fin")
    if db.get(Supervisor, body.id_supervisor) is None:
        raise NotFoundError("Supervisor no encontrado")
    p = Proyecto(**body.model_dump())
    db.add(p)
    db.commit()
    db.refresh(p)
    return p


@router.get("/proyectos/{id_proyecto}", response_model=ProyectoOut, summary="EP-44 Consultar proyecto")
def get_proyecto(id_proyecto: int, db: DbSession, actor: CurrentUser):
    return _get_or_404(db, Proyecto, id_proyecto, "Proyecto")


@router.patch("/proyectos/{id_proyecto}", response_model=ProyectoOut, summary="EP-45 Actualizar proyecto")
def update_proyecto(id_proyecto: int, body: ProyectoUpdate, db: DbSession, actor: AdminRrhhUser):
    p = _get_or_404(db, Proyecto, id_proyecto, "Proyecto")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(p, k, v)
    db.commit()
    db.refresh(p)
    return p


@router.delete("/proyectos/{id_proyecto}", response_model=MessageOut, summary="EP-46 Eliminar/suspender proyecto")
def delete_proyecto(id_proyecto: int, db: DbSession, actor: AdminRrhhUser):
    p = _get_or_404(db, Proyecto, id_proyecto, "Proyecto")
    # Baja lógica preferible
    p.estado_proyecto = "SUSPENDIDO"
    db.commit()
    return MessageOut(message="Proyecto suspendido")


# =============================================================================
# EP-47 … EP-51 Asignaciones
# =============================================================================
@router.get("/asignaciones-proyecto", response_model=list[AsignacionOut], summary="EP-47 Listar asignaciones")
def list_asignaciones(db: DbSession, actor: CurrentUser):
    return db.execute(select(AsignacionProyecto).order_by(AsignacionProyecto.id_asignacion)).scalars().all()


@router.get("/proyectos/{id_proyecto}/asignaciones", response_model=list[AsignacionOut], summary="EP-48 Asignaciones de proyecto")
def asignaciones_proyecto(id_proyecto: int, db: DbSession, actor: CurrentUser):
    _get_or_404(db, Proyecto, id_proyecto, "Proyecto")
    return db.execute(select(AsignacionProyecto).where(AsignacionProyecto.id_proyecto == id_proyecto)).scalars().all()


@router.get("/empleados/{id_empleado}/asignaciones-proyecto", response_model=list[AsignacionOut], summary="EP-49 Asignaciones de empleado")
def asignaciones_empleado(id_empleado: int, db: DbSession, actor: CurrentUser):
    _get_or_404(db, Empleado, id_empleado, "Empleado")
    return db.execute(select(AsignacionProyecto).where(AsignacionProyecto.id_empleado == id_empleado)).scalars().all()


@router.post("/proyectos/{id_proyecto}/asignaciones", response_model=AsignacionOut, status_code=201, summary="EP-50 Crear asignación")
def create_asignacion(id_proyecto: int, body: AsignacionCreate, db: DbSession, actor: AdminRrhhUser):
    _get_or_404(db, Proyecto, id_proyecto, "Proyecto")
    _get_or_404(db, Empleado, body.id_empleado, "Empleado")
    exists = db.execute(
        select(AsignacionProyecto).where(
            AsignacionProyecto.id_proyecto == id_proyecto,
            AsignacionProyecto.id_empleado == body.id_empleado,
        )
    ).scalar_one_or_none()
    if exists:
        raise ConflictError("Asignación ya existe")
    a = AsignacionProyecto(id_proyecto=id_proyecto, **body.model_dump())
    db.add(a)
    db.commit()
    db.refresh(a)
    return a


@router.patch("/asignaciones-proyecto/{id_asignacion}", response_model=AsignacionOut, summary="EP-51 Retirar asignación")
def retirar_asignacion(id_asignacion: int, db: DbSession, actor: AdminRrhhUser):
    a = _get_or_404(db, AsignacionProyecto, id_asignacion, "Asignación")
    a.activo = False
    db.commit()
    db.refresh(a)
    return a


# =============================================================================
# EP-52 … EP-55 Contratos
# =============================================================================
@router.get("/empleados/{id_empleado}/contratos", response_model=list[ContratoOut], summary="EP-52 Listar contratos")
def list_contratos(id_empleado: int, db: DbSession, actor: CurrentUser):
    _get_or_404(db, Empleado, id_empleado, "Empleado")
    return db.execute(select(Contrato).where(Contrato.id_empleado == id_empleado)).scalars().all()


@router.post("/empleados/{id_empleado}/contratos", response_model=ContratoOut, status_code=201, summary="EP-53 Crear contrato")
def create_contrato(id_empleado: int, body: ContratoCreate, db: DbSession, actor: AdminRrhhUser):
    _get_or_404(db, Empleado, id_empleado, "Empleado")
    c = Contrato(id_empleado=id_empleado, **body.model_dump())
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


@router.get("/contratos/{id_contrato}", response_model=ContratoOut, summary="EP-54 Consultar contrato")
def get_contrato(id_contrato: int, db: DbSession, actor: CurrentUser):
    return _get_or_404(db, Contrato, id_contrato, "Contrato")


@router.patch("/contratos/{id_contrato}", response_model=ContratoOut, summary="EP-55 Actualizar contrato")
def update_contrato(id_contrato: int, body: ContratoUpdate, db: DbSession, actor: AdminRrhhUser):
    c = _get_or_404(db, Contrato, id_contrato, "Contrato")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(c, k, v)
    db.commit()
    db.refresh(c)
    return c


# =============================================================================
# EP-56 … EP-59 Préstamos
# =============================================================================
@router.get("/empleados/{id_empleado}/prestamos", response_model=list[PrestamoOut], summary="EP-56 Listar préstamos")
def list_prestamos(id_empleado: int, db: DbSession, actor: CurrentUser):
    _get_or_404(db, Empleado, id_empleado, "Empleado")
    return db.execute(select(Prestamo).where(Prestamo.id_empleado == id_empleado)).scalars().all()


@router.post("/empleados/{id_empleado}/prestamos", response_model=PrestamoOut, status_code=201, summary="EP-57 Crear préstamo")
def create_prestamo(id_empleado: int, body: PrestamoCreate, db: DbSession, actor: AdminRrhhUser):
    _get_or_404(db, Empleado, id_empleado, "Empleado")
    p = Prestamo(id_empleado=id_empleado, **body.model_dump())
    db.add(p)
    db.commit()
    db.refresh(p)
    return p


@router.get("/prestamos/{id_prestamo}", response_model=PrestamoOut, summary="EP-58 Consultar préstamo")
def get_prestamo(id_prestamo: int, db: DbSession, actor: CurrentUser):
    return _get_or_404(db, Prestamo, id_prestamo, "Préstamo")


@router.patch("/prestamos/{id_prestamo}", response_model=PrestamoOut, summary="EP-59 Actualizar préstamo")
def update_prestamo(id_prestamo: int, body: PrestamoUpdate, db: DbSession, actor: AdminRrhhUser):
    p = _get_or_404(db, Prestamo, id_prestamo, "Préstamo")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(p, k, v)
    db.commit()
    db.refresh(p)
    return p


# =============================================================================
# EP-60 … EP-63 Viáticos
# =============================================================================
@router.get("/viaticos", response_model=list[ViaticoOut], summary="EP-60 Listar viáticos")
def list_viaticos(db: DbSession, actor: CurrentUser, id_empleado: Optional[int] = None):
    q = select(Viatico)
    if id_empleado:
        q = q.where(Viatico.id_empleado == id_empleado)
    return db.execute(q.order_by(Viatico.id_viatico.desc())).scalars().all()


@router.post("/empleados/{id_empleado}/viaticos", response_model=ViaticoOut, status_code=201, summary="EP-61 Registrar viático")
def create_viatico(id_empleado: int, body: ViaticoCreate, db: DbSession, actor: CurrentUser):
    _get_or_404(db, Empleado, id_empleado, "Empleado")
    _get_or_404(db, Proyecto, body.id_proyecto, "Proyecto")
    v = Viatico(id_empleado=id_empleado, **body.model_dump())
    db.add(v)
    db.commit()
    db.refresh(v)
    return v


@router.get("/viaticos/{id_viatico}", response_model=ViaticoOut, summary="EP-62 Consultar viático")
def get_viatico(id_viatico: int, db: DbSession, actor: CurrentUser):
    return _get_or_404(db, Viatico, id_viatico, "Viático")


@router.patch("/viaticos/{id_viatico}", response_model=ViaticoOut, summary="EP-63 Gestionar viático")
def update_viatico(id_viatico: int, body: ViaticoUpdate, db: DbSession, actor: CurrentUser):
    v = _get_or_404(db, Viatico, id_viatico, "Viático")
    data = body.model_dump(exclude_unset=True)
    if "estado_viatico" in data and data["estado_viatico"] in ("APROBADO", "RECHAZADO"):
        v.id_aprobado_por = actor.id_usuario
    for k, val in data.items():
        setattr(v, k, val)
    db.commit()
    db.refresh(v)
    return v


# =============================================================================
# EP-64 … EP-67 Liquidaciones
# =============================================================================
@router.get("/liquidaciones", response_model=list[LiquidacionOut], summary="EP-64 Listar liquidaciones")
def list_liquidaciones(db: DbSession, actor: CurrentUser):
    return db.execute(select(Liquidacion).order_by(Liquidacion.id_liquidacion.desc())).scalars().all()


@router.get("/liquidaciones/{id_liquidacion}", response_model=LiquidacionOut, summary="EP-65 Consultar liquidación")
def get_liquidacion(id_liquidacion: int, db: DbSession, actor: CurrentUser):
    return _get_or_404(db, Liquidacion, id_liquidacion, "Liquidación")


@router.post("/empleados/{id_empleado}/liquidacion", response_model=LiquidacionOut, status_code=201, summary="EP-66 Crear liquidación")
def create_liquidacion(id_empleado: int, body: LiquidacionCreate, db: DbSession, actor: AdminRrhhUser):
    """
    Registra liquidación con montos provistos.
    Las fórmulas automáticas de cesantías/prima/etc. están PENDIENTES en las fuentes;
    no se inventan. Se persisten los valores recibidos (validados >= 0 por schema/SQL).
    """
    emp = _get_or_404(db, Empleado, id_empleado, "Empleado")
    _get_or_404(db, Configuracion, body.id_configuracion, "Configuración")
    liq = Liquidacion(id_empleado=id_empleado, **body.model_dump())
    db.add(liq)
    emp.estado_laboral = "RETIRADO"
    user = db.get(Usuario, emp.id_usuario)
    if user:
        user.estado = False
    db.commit()
    db.refresh(liq)
    return liq


@router.get("/liquidaciones/{id_liquidacion}/documento", summary="EP-67 Documento liquidación")
def doc_liquidacion(id_liquidacion: int, db: DbSession, actor: CurrentUser):
    liq = _get_or_404(db, Liquidacion, id_liquidacion, "Liquidación")
    return {
        "id_liquidacion": liq.id_liquidacion,
        "message": "Documento generado a partir de datos registrados",
        "data": LiquidacionOut.model_validate(liq).model_dump(mode="json"),
        "nota": "Formato de archivo oficial pendiente de definición en fuentes",
    }


# =============================================================================
# EP-68 … EP-77 Nómina / Desprendibles
# =============================================================================
@router.post("/nominas", response_model=NominaOut, status_code=201, summary="EP-68 Crear nómina")
def create_nomina(body: NominaCreate, db: DbSession, actor: AdminRrhhUser):
    admin_id = _admin_rrhh_id_of(db, actor)
    if admin_id is None:
        raise AuthorizationError("El actor no tiene registro en admin_rrhh")
    _get_or_404(db, Configuracion, body.id_configuracion, "Configuración")
    n = Nomina(
        id_admin_rrhh=admin_id,
        fecha_generacion=datetime.utcnow(),
        estado_nomina="BORRADOR",
        total_pagado=0,
        cantidad_empleados=0,
        **body.model_dump(),
    )
    db.add(n)
    db.commit()
    db.refresh(n)
    return n


@router.get("/nominas", response_model=list[NominaOut], summary="EP-69 Listar nóminas")
def list_nominas(db: DbSession, actor: CurrentUser):
    return db.execute(select(Nomina).order_by(Nomina.id_nomina.desc())).scalars().all()


@router.get("/nominas/{id_nomina}", response_model=NominaOut, summary="EP-70 Consultar nómina")
def get_nomina(id_nomina: int, db: DbSession, actor: CurrentUser):
    return _get_or_404(db, Nomina, id_nomina, "Nómina")


@router.post("/nominas/{id_nomina}/calcular", summary="EP-71 Calcular nómina")
def calcular_nomina(id_nomina: int, db: DbSession, actor: AdminRrhhUser):
    """
    BLOQUEADO: las fórmulas de cálculo de nómina están marcadas como PENDIENTES
    en las reglas de negocio. No se inventan.
    """
    n = _get_or_404(db, Nomina, id_nomina, "Nómina")
    if n.estado_nomina not in ("BORRADOR",):
        raise InvalidStateError("Solo se calcula nómina en estado BORRADOR")
    raise InvalidStateError(
        "Cálculo de nómina bloqueado: fórmulas no definidas en fuentes del proyecto. "
        "Pendiente decisión de reglas de negocio (recargos, aportes, descuentos)."
    )


@router.get("/nominas/{id_nomina}/detalles", response_model=list[DetalleNominaOut], summary="EP-72 Detalles de nómina")
def detalles_nomina(id_nomina: int, db: DbSession, actor: CurrentUser):
    _get_or_404(db, Nomina, id_nomina, "Nómina")
    return db.execute(select(DetalleNomina).where(DetalleNomina.id_nomina == id_nomina)).scalars().all()


@router.get("/nominas/{id_nomina}/detalles/{id_detalle}", response_model=DetalleNominaOut, summary="EP-73 Detalle nómina")
def detalle_nomina(id_nomina: int, id_detalle: int, db: DbSession, actor: CurrentUser):
    d = _get_or_404(db, DetalleNomina, id_detalle, "Detalle nómina")
    if d.id_nomina != id_nomina:
        raise NotFoundError("Detalle no pertenece a la nómina")
    return d


@router.patch("/nominas/{id_nomina}", response_model=NominaOut, summary="EP-74 Actualizar estado nómina")
def update_nomina(id_nomina: int, body: NominaUpdate, db: DbSession, actor: AdminRrhhUser):
    n = _get_or_404(db, Nomina, id_nomina, "Nómina")
    data = body.model_dump(exclude_unset=True)
    if "estado_nomina" in data:
        # Transiciones básicas; desprendibles se generan internamente al aprobar si hubiera cálculo
        n.estado_nomina = data["estado_nomina"]
    db.commit()
    db.refresh(n)
    return n


@router.get("/empleados/{id_empleado}/desprendibles", response_model=list[DesprendibleOut], summary="EP-75 Desprendibles empleado")
def list_desprendibles(id_empleado: int, db: DbSession, actor: CurrentUser):
    _get_or_404(db, Empleado, id_empleado, "Empleado")
    return db.execute(select(Desprendible).where(Desprendible.id_empleado == id_empleado)).scalars().all()


@router.get("/desprendibles/{id_desprendible}", response_model=DesprendibleOut, summary="EP-76 Consultar desprendible")
def get_desprendible(id_desprendible: int, db: DbSession, actor: CurrentUser):
    return _get_or_404(db, Desprendible, id_desprendible, "Desprendible")


@router.get("/desprendibles/{id_desprendible}/archivo", summary="EP-77 Archivo desprendible")
def archivo_desprendible(id_desprendible: int, db: DbSession, actor: CurrentUser):
    d = _get_or_404(db, Desprendible, id_desprendible, "Desprendible")
    d.estado_descarga = "DESCARGADO"
    db.commit()
    return {"archivo_url": d.archivo_url, "firma_digital": d.firma_digital}


# =============================================================================
# EP-78 … EP-81 PILA
# =============================================================================
@router.post("/nominas/{id_nomina}/pila", summary="EP-78 Generar PILA")
def generar_pila(id_nomina: int, db: DbSession, actor: AdminRrhhUser):
    """
    BLOQUEADO: generación PILA requiere nómina calculada y formato definido.
    Fórmulas/formato pendientes en fuentes.
    """
    n = _get_or_404(db, Nomina, id_nomina, "Nómina")
    if n.estado_nomina not in ("APROBADA", "PAGADA"):
        raise InvalidStateError("PILA solo sobre nómina APROBADA o PAGADA")
    existing = db.execute(select(Pila).where(Pila.id_nomina == id_nomina)).scalar_one_or_none()
    if existing:
        raise ConflictError("Ya existe PILA para esta nómina")
    raise InvalidStateError(
        "Generación PILA bloqueada: formato de archivo y reglas de aportes no definidos completamente en fuentes."
    )


@router.get("/nominas/{id_nomina}/pila", response_model=PilaOut, summary="EP-79 Consultar PILA de nómina")
def get_pila_nomina(id_nomina: int, db: DbSession, actor: CurrentUser):
    p = db.execute(select(Pila).where(Pila.id_nomina == id_nomina)).scalar_one_or_none()
    if p is None:
        raise NotFoundError("PILA no encontrada")
    return p


@router.get("/pila/{id_pila}/aportes", summary="EP-80 Aportes PILA")
def aportes_pila(id_pila: int, db: DbSession, actor: CurrentUser):
    _get_or_404(db, Pila, id_pila, "PILA")
    rows = db.execute(select(AporteEmpleado).where(AporteEmpleado.id_pila == id_pila)).scalars().all()
    return [
        {
            "id_aporte": r.id_aporte,
            "id_empleado": r.id_empleado,
            "ibc": float(r.ibc),
            "dias_cotizados": r.dias_cotizados,
            "tarifa_arl": r.tarifa_arl,
            "aportes_salud": float(r.aportes_salud),
            "aportes_pension": float(r.aportes_pension),
            "aportes_arl": float(r.aportes_arl),
            "aportes_paraestatales": float(r.aportes_paraestatales),
        }
        for r in rows
    ]


@router.get("/pila/{id_pila}/archivo", summary="EP-81 Archivo PILA")
def archivo_pila(id_pila: int, db: DbSession, actor: CurrentUser):
    p = _get_or_404(db, Pila, id_pila, "PILA")
    if not p.archivo_txt:
        raise NotFoundError("Archivo PILA no generado")
    return {"archivo_txt": p.archivo_txt}


# =============================================================================
# EP-82 … EP-86 Configuración
# =============================================================================
@router.get("/configuraciones", response_model=list[ConfiguracionOut], summary="EP-82 Listar configuraciones")
def list_config(db: DbSession, actor: CurrentUser):
    return db.execute(select(Configuracion).order_by(Configuracion.anio_vigencia.desc())).scalars().all()


@router.get("/configuraciones/{id_configuracion}", response_model=ConfiguracionOut, summary="EP-83 Consultar configuración")
def get_config(id_configuracion: int, db: DbSession, actor: CurrentUser):
    return _get_or_404(db, Configuracion, id_configuracion, "Configuración")


@router.post("/configuraciones", response_model=ConfiguracionOut, status_code=201, summary="EP-84 Crear configuración")
def create_config(body: ConfiguracionCreate, db: DbSession, actor: AdminRrhhUser):
    if db.execute(select(Configuracion).where(Configuracion.anio_vigencia == body.anio_vigencia)).scalar_one_or_none():
        raise ConflictError("Ya existe configuración para ese año")
    c = Configuracion(**body.model_dump())
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


@router.patch("/configuraciones/{id_configuracion}", response_model=ConfiguracionOut, summary="EP-85 Actualizar configuración")
def update_config(id_configuracion: int, body: ConfiguracionUpdate, db: DbSession, actor: AdminRrhhUser):
    c = _get_or_404(db, Configuracion, id_configuracion, "Configuración")
    data = body.model_dump(exclude_unset=True)
    for k, v in data.items():
        old = getattr(c, k)
        setattr(c, k, v)
        db.add(
            CambioConfiguracion(
                id_configuracion=c.id_configuracion,
                id_modificado_por=actor.id_usuario,
                campo=k,
                valor_anterior=str(old),
                valor_nuevo=str(v),
                fecha_cambio=datetime.utcnow(),
            )
        )
    db.commit()
    db.refresh(c)
    return c


@router.get("/configuraciones/{id_configuracion}/historial", summary="EP-86 Historial configuración")
def historial_config(id_configuracion: int, db: DbSession, actor: CurrentUser):
    _get_or_404(db, Configuracion, id_configuracion, "Configuración")
    rows = db.execute(
        select(CambioConfiguracion)
        .where(CambioConfiguracion.id_configuracion == id_configuracion)
        .order_by(CambioConfiguracion.fecha_cambio.desc())
    ).scalars().all()
    return [
        {
            "id_cambio": r.id_cambio,
            "campo": r.campo,
            "valor_anterior": r.valor_anterior,
            "valor_nuevo": r.valor_nuevo,
            "id_modificado_por": r.id_modificado_por,
            "fecha_cambio": r.fecha_cambio.isoformat(),
        }
        for r in rows
    ]


# =============================================================================
# EP-87 … EP-94 Evaluaciones y observaciones
# =============================================================================
@router.get("/empleados/{id_empleado}/evaluaciones", response_model=list[EvaluacionOut], summary="EP-87 Listar evaluaciones")
def list_eval(id_empleado: int, db: DbSession, actor: CurrentUser):
    _get_or_404(db, Empleado, id_empleado, "Empleado")
    return db.execute(select(EvaluacionDesempeno).where(EvaluacionDesempeno.id_empleado == id_empleado)).scalars().all()


@router.get("/evaluaciones/{id_evaluacion}", response_model=EvaluacionOut, summary="EP-88 Consultar evaluación")
def get_eval(id_evaluacion: int, db: DbSession, actor: CurrentUser):
    return _get_or_404(db, EvaluacionDesempeno, id_evaluacion, "Evaluación")


@router.post("/empleados/{id_empleado}/evaluaciones", response_model=EvaluacionOut, status_code=201, summary="EP-89 Registrar evaluación")
def create_eval(id_empleado: int, body: EvaluacionCreate, db: DbSession, actor: CurrentUser):
    _get_or_404(db, Empleado, id_empleado, "Empleado")
    sid = _supervisor_id_of(db, actor)
    if sid is None:
        raise AuthorizationError("Se requiere ser supervisor para evaluar")
    e = EvaluacionDesempeno(
        id_empleado=id_empleado,
        id_evaluador=sid,
        fecha_evaluacion=datetime.utcnow(),
        **body.model_dump(),
    )
    db.add(e)
    db.commit()
    db.refresh(e)
    return e


@router.patch("/evaluaciones/{id_evaluacion}", response_model=EvaluacionOut, summary="EP-90 Actualizar evaluación")
def update_eval(id_evaluacion: int, body: EvaluacionUpdate, db: DbSession, actor: CurrentUser):
    e = _get_or_404(db, EvaluacionDesempeno, id_evaluacion, "Evaluación")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(e, k, v)
    db.commit()
    db.refresh(e)
    return e


@router.get("/empleados/{id_empleado}/observaciones", response_model=list[ObservacionOut], summary="EP-91 Listar observaciones")
def list_obs(id_empleado: int, db: DbSession, actor: CurrentUser):
    _get_or_404(db, Empleado, id_empleado, "Empleado")
    return db.execute(select(Observacion).where(Observacion.id_empleado == id_empleado)).scalars().all()


@router.post("/empleados/{id_empleado}/observaciones", response_model=ObservacionOut, status_code=201, summary="EP-92 Registrar observación")
def create_obs(id_empleado: int, body: ObservacionCreate, db: DbSession, actor: CurrentUser):
    _get_or_404(db, Empleado, id_empleado, "Empleado")
    sid = _supervisor_id_of(db, actor)
    if sid is None:
        raise AuthorizationError("Se requiere ser supervisor")
    o = Observacion(
        id_empleado=id_empleado,
        id_supervisor=sid,
        fecha=datetime.utcnow(),
        **body.model_dump(),
    )
    db.add(o)
    db.commit()
    db.refresh(o)
    return o


@router.get("/observaciones/{id_observacion}", response_model=ObservacionOut, summary="EP-93 Consultar observación")
def get_obs(id_observacion: int, db: DbSession, actor: CurrentUser):
    return _get_or_404(db, Observacion, id_observacion, "Observación")


@router.patch("/observaciones/{id_observacion}", response_model=ObservacionOut, summary="EP-94 Actualizar observación")
def update_obs(id_observacion: int, body: ObservacionUpdate, db: DbSession, actor: CurrentUser):
    o = _get_or_404(db, Observacion, id_observacion, "Observación")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(o, k, v)
    db.commit()
    db.refresh(o)
    return o


# =============================================================================
# EP-95 … EP-99 Solicitudes
# =============================================================================
@router.get("/solicitudes", response_model=list[SolicitudOut], summary="EP-95 Listar solicitudes")
def list_solicitudes(db: DbSession, actor: CurrentUser, estado: Optional[str] = None):
    q = select(Solicitud)
    if estado:
        q = q.where(Solicitud.estado_solicitud == estado.upper())
    return db.execute(q.order_by(Solicitud.id_solicitud.desc())).scalars().all()


@router.get("/mis-solicitudes", response_model=list[SolicitudOut], summary="EP-96 Mis solicitudes")
def mis_solicitudes(db: DbSession, actor: CurrentUser):
    return db.execute(
        select(Solicitud).where(Solicitud.id_solicitante == actor.id_usuario).order_by(Solicitud.id_solicitud.desc())
    ).scalars().all()


@router.post("/solicitudes", response_model=SolicitudOut, status_code=201, summary="EP-97 Crear solicitud")
def create_solicitud(body: SolicitudCreate, db: DbSession, actor: CurrentUser):
    s = Solicitud(
        id_solicitante=actor.id_usuario,
        tipo_solicitud=body.tipo_solicitud,
        descripcion=body.descripcion,
        fecha_creacion=datetime.utcnow(),
        estado_solicitud="PENDIENTE",
    )
    db.add(s)
    db.commit()
    db.refresh(s)
    return s


@router.get("/solicitudes/{id_solicitud}", response_model=SolicitudOut, summary="EP-98 Consultar solicitud")
def get_solicitud(id_solicitud: int, db: DbSession, actor: CurrentUser):
    return _get_or_404(db, Solicitud, id_solicitud, "Solicitud")


@router.patch("/solicitudes/{id_solicitud}", response_model=SolicitudOut, summary="EP-99 Gestionar solicitud")
def update_solicitud(id_solicitud: int, body: SolicitudUpdate, db: DbSession, actor: CurrentUser):
    s = _get_or_404(db, Solicitud, id_solicitud, "Solicitud")
    data = body.model_dump(exclude_unset=True)
    if "estado_solicitud" in data:
        s.id_gestor_por = actor.id_usuario
        s.fecha_respuesta = datetime.utcnow()
    for k, v in data.items():
        setattr(s, k, v)
    db.commit()
    db.refresh(s)
    return s


# =============================================================================
# EP-100 … EP-102 Notificaciones
# =============================================================================
@router.get("/notificaciones", response_model=list[NotificacionOut], summary="EP-100 Listar notificaciones")
def list_notif(db: DbSession, actor: CurrentUser, leida: Optional[bool] = None):
    q = select(Notificacion).where(Notificacion.id_destinatario == actor.id_usuario)
    if leida is not None:
        q = q.where(Notificacion.leida == leida)
    return db.execute(q.order_by(Notificacion.fecha_envio.desc())).scalars().all()


@router.get("/notificaciones/{id_notificacion}", response_model=NotificacionOut, summary="EP-101 Consultar notificación")
def get_notif(id_notificacion: int, db: DbSession, actor: CurrentUser):
    n = _get_or_404(db, Notificacion, id_notificacion, "Notificación")
    if n.id_destinatario != actor.id_usuario:
        raise AuthorizationError("Solo el destinatario puede consultar esta notificación")
    return n


@router.patch("/notificaciones/{id_notificacion}", response_model=NotificacionOut, summary="EP-102 Marcar leída")
def update_notif(id_notificacion: int, body: NotificacionUpdate, db: DbSession, actor: CurrentUser):
    n = _get_or_404(db, Notificacion, id_notificacion, "Notificación")
    if n.id_destinatario != actor.id_usuario:
        raise AuthorizationError("Solo el destinatario puede modificar esta notificación")
    n.leida = body.leida
    db.commit()
    db.refresh(n)
    return n
