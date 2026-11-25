"""Servicio de asignaciones — EP-47 … EP-51.

Reglas de negocio (cuadrillas / multi-proyecto):
1. Un empleado solo puede tener **una asignación activa por proyecto**.
2. Puede estar en **varios proyectos a la vez** (obras distintas), cada uno con su cuadrilla.
3. La cuadrilla es del vínculo empleado–proyecto (no es un recurso global exclusivo).
4. Dos cuadrillas en el mismo proyecto es normal (distintos grupos de personal).
5. Para cambiar de cuadrilla en el **mismo** proyecto: primero Retirar, luego reasignar.
6. Los turnos/horarios no se mezclan entre proyectos: la validación de cruce de horarios
   se aplica en el servicio de turnos (mismo día, gap mínimo, etc.).
7. Retirar pone activo=false (el historial se conserva).
"""

from datetime import date
from typing import Sequence

from sqlalchemy.orm import Session

from app.modelos import AsignacionProyecto
from app.nucleo.excepciones import ConflictError, NotFoundError, ValidationAppError
from app.repositorios.repositorio_proyectos import RepositorioProyectos
from app.repositorios.repositorio_cuadrillas import RepositorioCuadrillas
from app.repositorios.repositorio_empleados import RepositorioEmpleados
from app.esquemas.negocio import AsignacionCreate


def _norm(s: str) -> str:
    return " ".join((s or "").strip().lower().split())


class ServicioAsignaciones:
    def __init__(self, db: Session):
        self.repo = RepositorioProyectos(db)
        self.repo_cuad = RepositorioCuadrillas(db)
        self.repo_emp = RepositorioEmpleados(db)

    def listar(self, dominio=None) -> Sequence[AsignacionProyecto]:
        return self.repo.listar_asignaciones(dominio=dominio)

    def listar_por_proyecto(self, id_proyecto: int) -> Sequence[AsignacionProyecto]:
        if self.repo.get_by_id(id_proyecto) is None:
            raise NotFoundError("Proyecto no encontrado")
        return self.repo.listar_asignaciones_proyecto(id_proyecto)

    def listar_por_empleado(self, id_empleado: int) -> Sequence[AsignacionProyecto]:
        if self.repo_emp.get_by_id(id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")
        return self.repo.listar_asignaciones_empleado(id_empleado)

    def crear(self, id_proyecto: int, body: AsignacionCreate) -> AsignacionProyecto:
        if self.repo.get_by_id(id_proyecto) is None:
            raise NotFoundError("Proyecto no encontrado")

        emp = self.repo_emp.get_by_id(body.id_empleado)
        if emp is None:
            raise NotFoundError("Empleado no encontrado")

        estado = (getattr(emp, "estado_laboral", None) or "").upper()
        if estado and estado not in ("ACTIVO", "ACTIVE"):
            raise ValidationAppError(f"El empleado no está activo (estado: {estado})")

        cargo = (getattr(emp, "cargo", None) or "").strip()
        if not cargo:
            raise ValidationAppError(
                "El empleado no tiene cargo registrado; no se puede asignar."
            )

        rol_enviado = (getattr(body, "rol_en_proyecto", None) or "").strip()
        if rol_enviado and _norm(rol_enviado) != _norm(cargo):
            raise ValidationAppError(
                f"La función debe ser el cargo del empleado («{cargo}»). "
                f"Se recibió «{rol_enviado}»."
            )

        fecha = getattr(body, "fecha_asignacion", None)
        if fecha and fecha > date.today():
            raise ValidationAppError("La fecha de asignación no puede ser futura.")

        id_cuad = getattr(body, "id_cuadrilla", None)
        cuadrilla = (getattr(body, "cuadrilla", None) or "").strip()

        if id_cuad:
            c = self.repo_cuad.get(id_cuad)
            if not c or not c.activo:
                raise ValidationAppError("Cuadrilla no encontrada o inactiva")
            vinculo = self.repo_cuad.get_vinculo(id_cuad, id_proyecto)
            if not vinculo or not vinculo.activo:
                raise ValidationAppError(
                    f"La cuadrilla '{c.nombre}' no está asignada a este proyecto. "
                    "Vincúlala primero en Gestión de cuadrillas."
                )
            cuadrilla = c.nombre
        elif not cuadrilla:
            raise ValidationAppError("Debes indicar la cuadrilla del empleado en este proyecto.")
        else:
            # texto libre: crear/obtener cuadrilla y asegurar vínculo al proyecto
            c = self.repo_cuad.get_by_nombre(cuadrilla)
            if not c:
                from app.modelos.negocio.cuadrilla import Cuadrilla
                from datetime import datetime as _dt
                c = self.repo_cuad.crear(Cuadrilla(nombre=cuadrilla.strip(), activo=True, creado_en=_dt.now()))
            vinculo = self.repo_cuad.get_vinculo(c.id_cuadrilla, id_proyecto)
            if not vinculo:
                from app.modelos.negocio.cuadrilla import CuadrillaProyecto
                from datetime import date as date_cls
                self.repo_cuad.crear_vinculo(
                    CuadrillaProyecto(
                        id_cuadrilla=c.id_cuadrilla,
                        id_proyecto=id_proyecto,
                        activo=True,
                        fecha_inicio=getattr(body, "fecha_asignacion", None) or date_cls.today(),
                    )
                )
            elif not vinculo.activo:
                vinculo.activo = True
                vinculo.fecha_fin = None
                self.repo_cuad.actualizar_vinculo(vinculo)
            id_cuad = c.id_cuadrilla
            cuadrilla = c.nombre

        # 1) Una sola asignación activa por proyecto
        existentes_proy = self.repo.listar_asignaciones_proyecto(id_proyecto)
        for a in existentes_proy:
            if a.id_empleado == body.id_empleado and getattr(a, "activo", True):
                raise ConflictError(
                    "Este empleado ya está asignado a este proyecto. "
                    "Para cambiar de cuadrilla, usa Retirar en «Asignaciones activas» "
                    "y luego vuelve a asignarlo."
                )

        data = body.model_dump()
        data["rol_en_proyecto"] = cargo
        data["cuadrilla"] = cuadrilla
        data["id_cuadrilla"] = id_cuad
        a = AsignacionProyecto(id_proyecto=id_proyecto, **data)
        return self.repo.crear_asignacion(a)

    def retirar(self, id_asignacion: int) -> AsignacionProyecto:
        a = self.repo.get_asignacion(id_asignacion)
        if a is None:
            raise NotFoundError("Asignación no encontrada")
        if getattr(a, "activo", True) is False:
            raise ValidationAppError("Esta asignación ya estaba retirada.")
        a.activo = False
        return self.repo.actualizar_asignacion(a)

    def cambiar_cuadrilla(self, id_asignacion: int, cuadrilla: str, id_cuadrilla: int | None = None) -> AsignacionProyecto:
        """Cambia solo la cuadrilla, manteniendo el mismo proyecto y empleado."""
        a = self.repo.get_asignacion(id_asignacion)
        if a is None:
            raise NotFoundError("Asignación no encontrada")
        if not getattr(a, "activo", True):
            raise ValidationAppError("La asignación no está activa")

        nombre = (cuadrilla or "").strip()
        id_cuad = id_cuadrilla

        if id_cuad:
            c = self.repo_cuad.get(id_cuad)
            if not c or not c.activo:
                raise ValidationAppError("Cuadrilla no encontrada o inactiva")
            vinculo = self.repo_cuad.get_vinculo(id_cuad, a.id_proyecto)
            if not vinculo:
                from app.modelos.negocio.cuadrilla import CuadrillaProyecto
                from datetime import date as date_cls
                self.repo_cuad.crear_vinculo(
                    CuadrillaProyecto(
                        id_cuadrilla=id_cuad,
                        id_proyecto=a.id_proyecto,
                        activo=True,
                        fecha_inicio=date_cls.today(),
                    )
                )
            elif not vinculo.activo:
                vinculo.activo = True
                vinculo.fecha_fin = None
                self.repo_cuad.actualizar_vinculo(vinculo)
            nombre = c.nombre
        elif nombre:
            c = self.repo_cuad.get_by_nombre(nombre)
            if not c:
                from app.modelos.negocio.cuadrilla import Cuadrilla
                from datetime import datetime as dt
                c = self.repo_cuad.crear(Cuadrilla(nombre=nombre, activo=True, creado_en=dt.now()))
            vinculo = self.repo_cuad.get_vinculo(c.id_cuadrilla, a.id_proyecto)
            if not vinculo:
                from app.modelos.negocio.cuadrilla import CuadrillaProyecto
                from datetime import date as date_cls
                self.repo_cuad.crear_vinculo(
                    CuadrillaProyecto(
                        id_cuadrilla=c.id_cuadrilla,
                        id_proyecto=a.id_proyecto,
                        activo=True,
                        fecha_inicio=date_cls.today(),
                    )
                )
            elif not vinculo.activo:
                vinculo.activo = True
                vinculo.fecha_fin = None
                self.repo_cuad.actualizar_vinculo(vinculo)
            id_cuad = c.id_cuadrilla
            nombre = c.nombre
        else:
            raise ValidationAppError("Indica la nueva cuadrilla")

        a.cuadrilla = nombre
        a.id_cuadrilla = id_cuad
        return self.repo.actualizar_asignacion(a)

