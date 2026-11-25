"""Servicio de asistencias — EP-26 … EP-28."""

from datetime import datetime, time
from typing import Sequence

from sqlalchemy.orm import Session

from app.modelos import Asistencia, Usuario
from app.nucleo.excepciones import NotFoundError, ValidationAppError
from app.repositorios.repositorio_asistencias import RepositorioAsistencias
from app.repositorios.repositorio_proyectos import RepositorioProyectos
from app.esquemas.negocio import AsistenciaCreate

# Hora límite para considerar RETARDO cuando no hay turno del día (HH:MM)
HORA_LIMITE_RETARDO = time(8, 0, 0)


class ServicioAsistencias:
    def __init__(self, db: Session):
        self.repo = RepositorioAsistencias(db)
        self.repo_proy = RepositorioProyectos(db)

    def _resolver_estado_automatico(
        self, estado: str, hora_entrada: time | None, fecha
    ) -> str:
        """Presente/Retardo se calculan por hora de llegada; Inasistencia/Excusa quedan manuales."""
        e = (estado or "").upper().strip()
        if e in ("INASISTENCIA", "EXCUSA"):
            # EXCUSA se normaliza a INASISTENCIA + observación en el front
            return "INASISTENCIA" if e == "EXCUSA" else e
        if e not in ("PRESENTE", "RETARDO", "AUTO", ""):
            return e or "PRESENTE"
        if hora_entrada is None:
            return "PRESENTE"
        # Si hay turno del día, el límite es la hora de inicio del turno
        limite = HORA_LIMITE_RETARDO
        try:
            from app.modelos import Turno
            from sqlalchemy import select

            # repo db session
            db = self.repo.db
            t = db.execute(
                select(Turno).where(
                    Turno.fecha == fecha,
                    Turno.hora_inicio != None,  # noqa: E711
                ).limit(50)
            ).scalars().all()
            # filtrar por empleado se hace en registrar con id
        except Exception:
            t = []
        if hora_entrada > limite:
            return "RETARDO"
        return "PRESENTE"

    def registrar(
        self,
        id_empleado: int,
        body: AsistenciaCreate,
        actor: Usuario | None = None,
        id_creado_por: int | None = None,
    ) -> Asistencia:
        if self.repo.get_empleado(id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")

        uid = id_creado_por
        if uid is None and actor is not None:
            uid = int(actor.id_usuario)
        if uid is None:
            raise ValidationAppError(
                "No se pudo determinar el usuario que registra la asistencia (id_creado_por)."
            )

        data = body.model_dump(exclude={"id_creado_por", "fecha_creacion"}, exclude_none=False)
        data["id_creado_por"] = uid
        data["fecha_creacion"] = datetime.now()

        estado_in = (data.get("estado_asistencia") or "").upper().strip()
        he = data.get("hora_entrada")

        # Estado automático para jornada normal
        if estado_in in ("PRESENTE", "RETARDO", "AUTO", ""):
            limite = HORA_LIMITE_RETARDO
            # Preferir hora de inicio del turno del empleado ese día
            try:
                from sqlalchemy import select
                from app.modelos import Turno

                turnos = (
                    self.repo.db.execute(
                        select(Turno).where(
                            Turno.id_empleado == id_empleado,
                            Turno.fecha == data.get("fecha"),
                        )
                    )
                    .scalars()
                    .all()
                )
                if turnos:
                    limite = min(t.hora_inicio for t in turnos)
            except Exception:
                pass
            if he and he > limite:
                data["estado_asistencia"] = "RETARDO"
            else:
                data["estado_asistencia"] = "PRESENTE"
        else:
            data["estado_asistencia"] = "INASISTENCIA" if estado_in == "EXCUSA" else estado_in

        estado = data["estado_asistencia"]

        # Proyecto: obligatorio si el empleado tiene asignaciones activas
        id_proyecto = data.get("id_proyecto")
        try:
            asigs = self.repo_proy.listar_asignaciones_empleado(id_empleado)
        except Exception:
            asigs = []
        activas = [a for a in (asigs or []) if getattr(a, "activo", True)]
        if activas:
            ids_ok = {int(a.id_proyecto) for a in activas}
            if id_proyecto is None:
                if len(ids_ok) == 1:
                    data["id_proyecto"] = next(iter(ids_ok))
                else:
                    raise ValidationAppError(
                        "Selecciona el proyecto del empleado para esta asistencia."
                    )
            elif int(id_proyecto) not in ids_ok:
                raise ValidationAppError(
                    "El empleado no tiene asignación activa en ese proyecto."
                )
        elif id_proyecto is not None:
            # Sin asignación: no inventar proyecto
            data["id_proyecto"] = None

        # Inasistencia: no suma horas de jornada
        if estado == "INASISTENCIA":
            data["hora_entrada"] = time(0, 0, 0)
            data["hora_salida"] = None
        else:
            hs = data.get("hora_salida")
            if he and hs and hs < he:
                raise ValidationAppError(
                    "La hora de salida no puede ser anterior a la de entrada."
                )

        # Quitar id_proyecto del kwargs si la columna aún no existe en BD
        try:
            a = Asistencia(id_empleado=id_empleado, **data)
            return self.repo.crear_asistencia(a)
        except Exception as ex:
            msg = str(ex).lower()
            if "id_proyecto" in msg or "undefinedcolumn" in msg.replace(" ", ""):
                data.pop("id_proyecto", None)
                a = Asistencia(id_empleado=id_empleado, **data)
                return self.repo.crear_asistencia(a)
            raise

    def listar_empleado(self, id_empleado: int) -> Sequence[Asistencia]:
        if self.repo.get_empleado(id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")
        return self.repo.listar_asistencias_empleado(id_empleado)

    def obtener(self, id_asistencia: int) -> Asistencia:
        a = self.repo.get_asistencia(id_asistencia)
        if a is None:
            raise NotFoundError("Asistencia no encontrada")
        return a
