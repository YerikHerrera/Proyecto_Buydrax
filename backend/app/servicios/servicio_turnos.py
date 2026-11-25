"""Servicio de turnos — EP-29 … EP-33.
Incluye id_asignado_por, cruces de horario, gap mínimo 2h y asignación al proyecto.
"""

from datetime import date, datetime, time, timedelta
from typing import Sequence

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modelos import Turno
from app.nucleo.excepciones import NotFoundError, ValidationAppError
from app.repositorios.repositorio_asistencias import RepositorioAsistencias
from app.repositorios.repositorio_proyectos import RepositorioProyectos
from app.esquemas.negocio import TurnoCreate, TurnoUpdate

GAP_MINIMO_MINUTOS = 120


def _to_minutes(t: time) -> int:
    return t.hour * 60 + t.minute


def _intervalos_se_solapan(a0: time, a1: time, b0: time, b1: time) -> bool:
    """Solape simple (no cruza medianoche)."""
    return a0 < b1 and b0 < a1


def _gap_minutos(a0: time, a1: time, b0: time, b1: time) -> int:
    """Minutos entre dos intervalos no solapados (el menor hueco)."""
    if a1 <= b0:
        return _to_minutes(b0) - _to_minutes(a1)
    if b1 <= a0:
        return _to_minutes(a0) - _to_minutes(b1)
    return 0


class ServicioTurnos:
    def __init__(self, db: Session):
        self.repo = RepositorioAsistencias(db)
        self.repo_proy = RepositorioProyectos(db)

    def validar_disponibilidad(
        self,
        id_empleado: int,
        fecha: date,
        hora_inicio: time,
        hora_fin: time,
        id_turno_excluir: int | None = None,
    ) -> None:
        if hora_inicio == hora_fin:
            raise HTTPException(
                status_code=422,
                detail="La hora de inicio y fin no pueden ser iguales.",
            )

        # Turnos que no cruzan medianoche: inicio < fin
        cruza_medianoche = hora_inicio > hora_fin
        if not cruza_medianoche and hora_inicio >= hora_fin:
            raise HTTPException(
                status_code=422,
                detail="La hora de inicio debe ser anterior a la hora de fin.",
            )

        consulta = select(Turno).where(
            Turno.id_empleado == id_empleado,
            Turno.fecha == fecha,
        )
        if id_turno_excluir is not None:
            consulta = consulta.where(Turno.id_turno != id_turno_excluir)

        existentes = list(self.repo.db.execute(consulta).scalars().all())

        for t in existentes:
            # Mismo horario exacto (aunque sea otro proyecto)
            if t.hora_inicio == hora_inicio and t.hora_fin == hora_fin:
                raise HTTPException(
                    status_code=409,
                    detail=(
                        "El empleado ya tiene un turno con las mismas horas ese día "
                        f"(proyecto id {t.id_proyecto}). No se puede duplicar el horario."
                    ),
                )

            # Solape de intervalos (mismo día)
            if not cruza_medianoche and t.hora_inicio < t.hora_fin:
                if _intervalos_se_solapan(hora_inicio, hora_fin, t.hora_inicio, t.hora_fin):
                    raise HTTPException(
                        status_code=409,
                        detail=(
                            "El empleado ya tiene un turno que se cruza con ese horario "
                            f"({t.hora_inicio.strftime('%H:%M')}–{t.hora_fin.strftime('%H:%M')}, "
                            f"proyecto id {t.id_proyecto})."
                        ),
                    )
                gap = _gap_minutos(hora_inicio, hora_fin, t.hora_inicio, t.hora_fin)
                if 0 < gap < GAP_MINIMO_MINUTOS:
                    raise HTTPException(
                        status_code=409,
                        detail=(
                            "Si hay dos turnos el mismo día, deben tener al menos "
                            f"2 horas de diferencia. Gap actual: {gap} min "
                            f"(otro turno {t.hora_inicio.strftime('%H:%M')}–"
                            f"{t.hora_fin.strftime('%H:%M')})."
                        ),
                    )

    def _exigir_asignacion_activa(self, id_empleado: int, id_proyecto: int) -> None:
        asigs = self.repo_proy.listar_asignaciones_empleado(id_empleado)
        activa = next(
            (
                a
                for a in asigs
                if a.id_proyecto == id_proyecto and getattr(a, "activo", True)
            ),
            None,
        )
        if activa is None:
            raise ValidationAppError(
                "El empleado no tiene una asignación activa en ese proyecto. "
                "Asígnalo al proyecto antes de programar el turno."
            )

    def listar(self) -> Sequence[Turno]:
        return self.repo.listar_turnos()

    def obtener(self, id_turno: int) -> Turno:
        t = self.repo.get_turno(id_turno)
        if t is None:
            raise NotFoundError("Turno no encontrado")
        return t

    def crear(self, body: TurnoCreate, id_asignado_por: int) -> Turno:
        if self.repo.get_empleado(body.id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")
        if self.repo_proy.get_by_id(body.id_proyecto) is None:
            raise NotFoundError("Proyecto no encontrado")

        self._exigir_asignacion_activa(body.id_empleado, body.id_proyecto)
        self.validar_disponibilidad(
            id_empleado=body.id_empleado,
            fecha=body.fecha,
            hora_inicio=body.hora_inicio,
            hora_fin=body.hora_fin,
        )

        datos = body.model_dump()
        datos["id_asignado_por"] = id_asignado_por
        turno = Turno(**datos)
        return self.repo.crear_turno(turno)

    def actualizar(self, id_turno: int, body: TurnoUpdate) -> Turno:
        t = self.obtener(id_turno)
        data = body.model_dump(exclude_unset=True)

        fecha = data.get("fecha", t.fecha)
        id_proyecto = data.get("id_proyecto", t.id_proyecto)
        hora_inicio = data.get("hora_inicio", t.hora_inicio)
        hora_fin = data.get("hora_fin", t.hora_fin)

        if id_proyecto != t.id_proyecto:
            self._exigir_asignacion_activa(t.id_empleado, id_proyecto)

        self.validar_disponibilidad(
            id_empleado=t.id_empleado,
            fecha=fecha,
            hora_inicio=hora_inicio,
            hora_fin=hora_fin,
            id_turno_excluir=t.id_turno,
        )

        for k, v in data.items():
            setattr(t, k, v)
        return self.repo.actualizar_turno(t)

    def eliminar(self, id_turno: int) -> None:
        t = self.obtener(id_turno)
        self.repo.eliminar_turno(t)
