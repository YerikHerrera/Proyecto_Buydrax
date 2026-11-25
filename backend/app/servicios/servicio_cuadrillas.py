"""Servicio de cuadrillas — vínculo a proyectos y retiro de personal."""

from datetime import date, datetime

from sqlalchemy.orm import Session

from app.esquemas.negocio.cuadrilla import (
    CuadrillaCreate,
    CuadrillaProyectoLink,
    CuadrillaUpdate,
)
from app.modelos.negocio.cuadrilla import Cuadrilla, CuadrillaProyecto
from app.nucleo.excepciones import ConflictError, NotFoundError, ValidationAppError
from app.repositorios.repositorio_cuadrillas import RepositorioCuadrillas
from app.repositorios.repositorio_proyectos import RepositorioProyectos


class ServicioCuadrillas:
    def __init__(self, db: Session):
        self.db = db
        self.repo = RepositorioCuadrillas(db)
        self.repo_proy = RepositorioProyectos(db)

    # ---- CRUD cuadrilla ----
    def listar(self, solo_activas: bool = True):
        # Asegura que nombres históricos (Cuadrilla A/B, etc.) existan en el catálogo
        try:
            self.repo.sincronizar_nombres_desde_asignaciones()
        except Exception:
            self.db.rollback()
        return self.repo.listar(solo_activas=solo_activas)

    def obtener(self, id_cuadrilla: int) -> Cuadrilla:
        c = self.repo.get(id_cuadrilla)
        if not c:
            raise NotFoundError("Cuadrilla no encontrada")
        return c

    def crear(self, body: CuadrillaCreate) -> Cuadrilla:
        nombre = body.nombre.strip()
        if not nombre:
            raise ValidationAppError("El nombre de la cuadrilla es obligatorio")
        if self.repo.get_by_nombre(nombre):
            raise ConflictError(f"Ya existe una cuadrilla llamada «{nombre}»")
        obj = Cuadrilla(
            nombre=nombre,
            descripcion=(body.descripcion or None),
            id_supervisor=body.id_supervisor,
            activo=True,
            creado_en=datetime.now(),
        )
        return self.repo.crear(obj)

    def actualizar(self, id_cuadrilla: int, body: CuadrillaUpdate) -> Cuadrilla:
        c = self.obtener(id_cuadrilla)
        data = body.model_dump(exclude_unset=True)
        if "nombre" in data and data["nombre"]:
            data["nombre"] = data["nombre"].strip()
            otro = self.repo.get_by_nombre(data["nombre"])
            if otro and otro.id_cuadrilla != id_cuadrilla:
                raise ConflictError(f"Ya existe una cuadrilla llamada «{data['nombre']}»")
        for k, v in data.items():
            setattr(c, k, v)
        return self.repo.actualizar(c)

    # ---- Vínculos proyecto ----
    def listar_vinculos(
        self,
        *,
        id_cuadrilla: int | None = None,
        id_proyecto: int | None = None,
        solo_activos: bool = True,
    ):
        rows = self.repo.listar_vinculos(
            id_cuadrilla=id_cuadrilla, id_proyecto=id_proyecto, solo_activos=solo_activos
        )
        out = []
        for v in rows:
            c = self.repo.get(v.id_cuadrilla)
            p = self.repo.get_proyecto(v.id_proyecto)
            n_emp = self.repo.contar_empleados_activos(v.id_cuadrilla, v.id_proyecto) if v.activo else 0
            out.append(
                {
                    "id_cuadrilla_proyecto": v.id_cuadrilla_proyecto,
                    "id_cuadrilla": v.id_cuadrilla,
                    "id_proyecto": v.id_proyecto,
                    "activo": v.activo,
                    "fecha_inicio": v.fecha_inicio,
                    "fecha_fin": v.fecha_fin,
                    "nombre_cuadrilla": c.nombre if c else None,
                    "nombre_proyecto": p.nombre if p else f"Proyecto #{v.id_proyecto}",
                    "empleados_activos": n_emp,
                }
            )
        return out

    def vincular_a_proyecto(self, id_cuadrilla: int, body: CuadrillaProyectoLink):
        c = self.obtener(id_cuadrilla)
        if not c.activo:
            raise ValidationAppError("La cuadrilla está inactiva")
        p = self.repo.get_proyecto(body.id_proyecto)
        if not p:
            raise NotFoundError("Proyecto no encontrado")

        existente = self.repo.get_vinculo(id_cuadrilla, body.id_proyecto)
        if existente:
            if existente.activo:
                raise ConflictError(
                    f"La cuadrilla '{c.nombre}' ya está asignada al proyecto '{p.nombre}'"
                )
            # reactivar
            existente.activo = True
            existente.fecha_fin = None
            existente.fecha_inicio = body.fecha_inicio or date.today()
            return self._vinculo_out(self.repo.actualizar_vinculo(existente))

        obj = CuadrillaProyecto(
            id_cuadrilla=id_cuadrilla,
            id_proyecto=body.id_proyecto,
            activo=True,
            fecha_inicio=body.fecha_inicio or date.today(),
            fecha_fin=None,
        )
        return self._vinculo_out(self.repo.crear_vinculo(obj))

    def desvincular_de_proyecto(self, id_cuadrilla: int, id_proyecto: int, *, forzar: bool = False):
        """
        Quita la cuadrilla de UN proyecto (en otros puede seguir).
        - Sin forzar: error si hay empleados activos.
        - Con forzar: retira asignaciones activas y desvincula.
        """
        c = self.obtener(id_cuadrilla)
        vinculo = self.repo.get_vinculo(id_cuadrilla, id_proyecto)
        if not vinculo or not vinculo.activo:
            raise NotFoundError("Esta cuadrilla no está vinculada (activa) a ese proyecto")

        activos = self.repo.listar_asignaciones_activas_cuadrilla_proyecto(id_cuadrilla, id_proyecto)
        if activos and not forzar:
            raise ConflictError(
                f"No se puede quitar «{c.nombre}» del proyecto: tiene {len(activos)} empleado(s) activo(s). "
                "Retíralos antes o usa la opción «Retirar a todos y desvincular»."
            )

        if activos and forzar:
            for a in activos:
                a.activo = False
            self.db.commit()

        vinculo.activo = False
        vinculo.fecha_fin = date.today()
        self.repo.actualizar_vinculo(vinculo)
        return {
            "ok": True,
            "mensaje": f"Cuadrilla «{c.nombre}» desvinculada del proyecto",
            "empleados_retirados": len(activos) if forzar else 0,
        }

    def _vinculo_out(self, v: CuadrillaProyecto) -> dict:
        c = self.repo.get(v.id_cuadrilla)
        p = self.repo.get_proyecto(v.id_proyecto)
        return {
            "id_cuadrilla_proyecto": v.id_cuadrilla_proyecto,
            "id_cuadrilla": v.id_cuadrilla,
            "id_proyecto": v.id_proyecto,
            "activo": v.activo,
            "fecha_inicio": v.fecha_inicio,
            "fecha_fin": v.fecha_fin,
            "nombre_cuadrilla": c.nombre if c else None,
            "nombre_proyecto": p.nombre if p else f"Proyecto #{v.id_proyecto}",
            "empleados_activos": self.repo.contar_empleados_activos(v.id_cuadrilla, v.id_proyecto)
            if v.activo
            else 0,
        }
