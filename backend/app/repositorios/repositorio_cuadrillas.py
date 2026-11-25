"""Repositorio de cuadrillas y vínculos a proyectos."""

from datetime import date
from typing import Optional, Sequence

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.modelos.negocio.cuadrilla import Cuadrilla, CuadrillaProyecto
from app.modelos.negocio.proyecto_asignacion import AsignacionProyecto, Proyecto


class RepositorioCuadrillas:
    def __init__(self, db: Session):
        self.db = db

    # ---- Cuadrilla ----
    def get(self, id_cuadrilla: int) -> Optional[Cuadrilla]:
        return self.db.get(Cuadrilla, id_cuadrilla)

    def get_by_nombre(self, nombre: str) -> Optional[Cuadrilla]:
        return self.db.execute(
            select(Cuadrilla).where(func.lower(Cuadrilla.nombre) == nombre.strip().lower())
        ).scalar_one_or_none()

    def listar(self, *, solo_activas: bool = True) -> Sequence[Cuadrilla]:
        q = select(Cuadrilla)
        if solo_activas:
            q = q.where(Cuadrilla.activo.is_(True))
        return self.db.execute(q.order_by(Cuadrilla.nombre)).scalars().all()

    def crear(self, obj: Cuadrilla) -> Cuadrilla:
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def actualizar(self, obj: Cuadrilla) -> Cuadrilla:
        self.db.commit()
        self.db.refresh(obj)
        return obj

    # ---- Vínculo proyecto ----
    def get_vinculo(self, id_cuadrilla: int, id_proyecto: int) -> Optional[CuadrillaProyecto]:
        return self.db.execute(
            select(CuadrillaProyecto).where(
                CuadrillaProyecto.id_cuadrilla == id_cuadrilla,
                CuadrillaProyecto.id_proyecto == id_proyecto,
            )
        ).scalar_one_or_none()

    def get_vinculo_by_id(self, id_cp: int) -> Optional[CuadrillaProyecto]:
        return self.db.get(CuadrillaProyecto, id_cp)

    def listar_vinculos(
        self,
        *,
        id_cuadrilla: Optional[int] = None,
        id_proyecto: Optional[int] = None,
        solo_activos: bool = True,
    ) -> Sequence[CuadrillaProyecto]:
        q = select(CuadrillaProyecto)
        if id_cuadrilla is not None:
            q = q.where(CuadrillaProyecto.id_cuadrilla == id_cuadrilla)
        if id_proyecto is not None:
            q = q.where(CuadrillaProyecto.id_proyecto == id_proyecto)
        if solo_activos:
            q = q.where(CuadrillaProyecto.activo.is_(True))
        return self.db.execute(q.order_by(CuadrillaProyecto.id_cuadrilla_proyecto.desc())).scalars().all()

    def crear_vinculo(self, obj: CuadrillaProyecto) -> CuadrillaProyecto:
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def actualizar_vinculo(self, obj: CuadrillaProyecto) -> CuadrillaProyecto:
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def contar_empleados_activos(self, id_cuadrilla: int, id_proyecto: int) -> int:
        q = select(func.count()).select_from(AsignacionProyecto).where(
            AsignacionProyecto.id_proyecto == id_proyecto,
            AsignacionProyecto.activo.is_(True),
            (
                (AsignacionProyecto.id_cuadrilla == id_cuadrilla)
                | (
                    (AsignacionProyecto.id_cuadrilla.is_(None))
                    & (AsignacionProyecto.cuadrilla.in_(
                        select(Cuadrilla.nombre).where(Cuadrilla.id_cuadrilla == id_cuadrilla)
                    ))
                )
            ),
        )
        return int(self.db.execute(q).scalar() or 0)

    def listar_asignaciones_activas_cuadrilla_proyecto(
        self, id_cuadrilla: int, id_proyecto: int
    ) -> Sequence[AsignacionProyecto]:
        c = self.get(id_cuadrilla)
        nombre = c.nombre if c else None
        q = select(AsignacionProyecto).where(
            AsignacionProyecto.id_proyecto == id_proyecto,
            AsignacionProyecto.activo.is_(True),
        )
        rows = self.db.execute(q).scalars().all()
        out = []
        for a in rows:
            if a.id_cuadrilla == id_cuadrilla:
                out.append(a)
            elif a.id_cuadrilla is None and nombre and (a.cuadrilla or "").strip().lower() == nombre.lower():
                out.append(a)
        return out

    def get_proyecto(self, id_proyecto: int) -> Optional[Proyecto]:
        return self.db.get(Proyecto, id_proyecto)

    def sincronizar_nombres_desde_asignaciones(self) -> int:
        """Crea en catálogo las cuadrillas que solo existen como texto en asignaciones."""
        from datetime import datetime
        from sqlalchemy import text
        rows = self.db.execute(
            text(
                """
                SELECT DISTINCT trim(cuadrilla) AS nombre
                FROM asignacion_proyecto
                WHERE cuadrilla IS NOT NULL AND trim(cuadrilla) <> ''
                """
            )
        ).fetchall()
        creadas = 0
        for (nombre,) in rows:
            if not nombre:
                continue
            existe = self.get_by_nombre(nombre)
            if existe is None:
                self.db.add(
                    Cuadrilla(
                        nombre=nombre[:80],
                        activo=True,
                        creado_en=datetime.now(),
                    )
                )
                creadas += 1
        if creadas:
            self.db.commit()
        return creadas
