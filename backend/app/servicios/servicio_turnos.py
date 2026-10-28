"""Servicio de turnos — EP-29 … EP-33."""

from typing import Sequence
from sqlalchemy.orm import Session
from app.modelos import Turno
from app.nucleo.excepciones import NotFoundError
from app.repositorios.repositorio_asistencias import RepositorioAsistencias
from app.esquemas.negocio import TurnoCreate, TurnoUpdate
from fastapi import HTTPException
from sqlalchemy import select
from datetime import date, time


class ServicioTurnos:
    
    def validar_disponibilidad(
        self,
        id_empleado: int,
        fecha: date,
        hora_inicio: time,
        hora_fin: time,
        id_turno_excluir: int | None = None,
    ) -> None:
        if hora_inicio >= hora_fin:
            raise HTTPException(
                status_code=422,
                detail="La hora de inicio debe ser anterior a la hora de fin.",
            )

        consulta = select(Turno).where(
            Turno.id_empleado == id_empleado,
            Turno.fecha == fecha,
            Turno.hora_inicio < hora_fin,
            Turno.hora_fin > hora_inicio,
        )

        if id_turno_excluir is not None:
            consulta = consulta.where(
                Turno.id_turno != id_turno_excluir
            )

        turno_existente = self.repo.db.execute(
            consulta
        ).scalars().first()

        if turno_existente is not None:
            raise HTTPException(
                status_code=409,
                detail=(
                    "El empleado ya tiene un turno en ese horario "
                    "para la fecha seleccionada, posiblemente en otro proyecto."
                ),
            )

    def __init__(self, db: Session):
        self.repo = RepositorioAsistencias(db)

    def listar(self) -> Sequence[Turno]:
        return self.repo.listar_turnos()

    def obtener(self, id_turno: int) -> Turno:
        t = self.repo.get_turno(id_turno)
        if t is None:
            raise NotFoundError("Turno no encontrado")
        return t

    
    
    def crear(
        self,
        body: TurnoCreate,
        id_asignado_por: int,
    ) -> Turno:
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
        for k, v in body.model_dump(exclude_unset=True).items():
            setattr(t, k, v)
        return self.repo.actualizar_turno(t)

    def eliminar(self, id_turno: int) -> None:
        t = self.obtener(id_turno)
        self.repo.eliminar_turno(t)
