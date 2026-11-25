"""Servicio de nóminas — EP-68 … EP-77."""

from datetime import datetime
from decimal import Decimal
from typing import Any, Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modelos import (
    AsignacionProyecto,
    Asistencia,
    Configuracion,
    DetalleNomina,
    Desprendible,
    Empleado,
    Nomina,
)
from app.nucleo.excepciones import NotFoundError, InvalidStateError, ValidationAppError
from app.repositorios.repositorio_nominas import RepositorioNominas
from app.esquemas.negocio import NominaCreate, NominaUpdate
from app.api.endpoints._compartido.helpers import admin_rrhh_id_of


class ServicioNominas:
    def __init__(self, db: Session):
        self.repo = RepositorioNominas(db)
        self.db = db

    def _config_vigente(self, id_configuracion: int | None = None) -> Configuracion:
        if id_configuracion:
            c = self.repo.get_configuracion(id_configuracion)
            if c is None:
                raise NotFoundError("Configuración no encontrada")
            return c
        row = self.db.execute(
            select(Configuracion).order_by(Configuracion.anio_vigencia.desc()).limit(1)
        ).scalar_one_or_none()
        if row is None:
            raise ValidationAppError(
                "No hay configuración salarial cargada. Crea una en Configuración."
            )
        return row

    def crear(self, body: NominaCreate, actor) -> Nomina:
        admin_id = admin_rrhh_id_of(self.db, actor)
        if not admin_id:
            raise ValidationAppError(
                "El usuario no está registrado como Admin RRHH; no puede generar nómina."
            )

        config = self._config_vigente(getattr(body, "id_configuracion", None))

        if body.periodo_fin < body.periodo_inicio:
            raise ValidationAppError("El fin del periodo debe ser posterior al inicio.")

        data = body.model_dump()
        data["id_configuracion"] = config.id_configuracion
        data["id_admin_rrhh"] = admin_id
        data["fecha_generacion"] = datetime.now()
        data.setdefault("estado_nomina", "BORRADOR")
        data.setdefault("total_pagado", Decimal("0"))
        data.setdefault("cantidad_empleados", 0)

        n = Nomina(**data)
        return self.repo.crear_nomina(n)

    def listar(self) -> Sequence[Nomina]:
        return self.repo.listar_nominas()

    def obtener(self, id_nomina: int) -> Nomina:
        n = self.repo.get_nomina(id_nomina)
        if n is None:
            raise NotFoundError("Nómina no encontrada")
        return n

    def _empleados_objetivo(self, n: Nomina) -> list[Empleado]:
        if n.id_obra:
            asigs = (
                self.db.execute(
                    select(AsignacionProyecto).where(
                        AsignacionProyecto.id_proyecto == n.id_obra,
                        AsignacionProyecto.activo.is_(True),
                    )
                )
                .scalars()
                .all()
            )
            ids = {a.id_empleado for a in asigs}
            if not ids:
                return []
            return list(
                self.db.execute(
                    select(Empleado).where(
                        Empleado.id_empleado.in_(ids),
                        Empleado.estado_laboral == "ACTIVO",
                    )
                )
                .scalars()
                .all()
            )
        return list(
            self.db.execute(select(Empleado).where(Empleado.estado_laboral == "ACTIVO"))
            .scalars()
            .all()
        )

    def calcular(self, id_nomina: int) -> dict[str, Any]:
        """Calcula detalles con prorrateo por salario + descuentos salud/pensión."""
        n = self.obtener(id_nomina)
        if n.estado_nomina not in ("BORRADOR", "APROBADA"):
            raise InvalidStateError(
                f"No se puede recalcular una nómina en estado {n.estado_nomina}."
            )

        config = self._config_vigente(n.id_configuracion)
        empleados = self._empleados_objetivo(n)
        if not empleados:
            raise ValidationAppError(
                "No hay empleados activos para liquidar "
                + ("en esa obra." if n.id_obra else "en el sistema.")
            )

        dias = max((n.periodo_fin - n.periodo_inicio).days + 1, 1)
        factor = Decimal(str(min(dias, 30))) / Decimal("30")

        prev = self.repo.listar_detalles(id_nomina)
        for d in prev:
            # borrar desprendible ligado si existe
            desp = self.db.execute(
                select(Desprendible).where(
                    Desprendible.id_detalle_nomina == d.id_detalle_nomina
                )
            ).scalar_one_or_none()
            if desp is not None:
                self.db.delete(desp)
            self.db.delete(d)
        self.db.flush()

        total = Decimal("0")
        creados = 0
        for emp in empleados:
            # Días con inasistencia en el periodo → no suman jornada
            inasistencias = 0
            try:
                regs = (
                    self.db.execute(
                        select(Asistencia).where(
                            Asistencia.id_empleado == emp.id_empleado,
                            Asistencia.fecha >= n.periodo_inicio,
                            Asistencia.fecha <= n.periodo_fin,
                            Asistencia.estado_asistencia == "INASISTENCIA",
                        )
                    )
                    .scalars()
                    .all()
                )
                inasistencias = len(regs)
            except Exception:
                inasistencias = 0

            dias_emp = max(dias - inasistencias, 0)
            factor_emp = Decimal(str(min(dias_emp, 30))) / Decimal("30")

            salario = Decimal(str(emp.salario or 0))
            bruto = (salario * factor_emp).quantize(Decimal("0.01"))
            pct_salud = Decimal(str(getattr(config, "pct_salud_empleado", 0) or 0))
            pct_pension = Decimal(str(getattr(config, "pct_pension_empleado", 0) or 0))
            if pct_salud > 1:
                pct_salud = pct_salud / Decimal("100")
            if pct_pension > 1:
                pct_pension = pct_pension / Decimal("100")
            desc_salud = (bruto * pct_salud).quantize(Decimal("0.01"))
            desc_pension = (bruto * pct_pension).quantize(Decimal("0.01"))
            neto = bruto - desc_salud - desc_pension
            if neto < 0:
                neto = Decimal("0")

            horas_ord = float(min(dias_emp * 8, 240))
            det = DetalleNomina(
                id_nomina=n.id_nomina,
                id_empleado=emp.id_empleado,
                horas_ordinarias=horas_ord,
                horas_extra=0.0,
                dominicales_festivos=0.0,
                viaticos=Decimal("0"),
                incapacidades=Decimal("0"),
                descuentos_prestamos=Decimal("0"),
                neto_pagar=neto,
            )
            self.db.add(det)
            self.db.flush()

            periodo_txt = f"{n.periodo_inicio.isoformat()} / {n.periodo_fin.isoformat()}"
            desp = Desprendible(
                id_detalle_nomina=det.id_detalle_nomina,
                id_empleado=emp.id_empleado,
                periodo_pago=periodo_txt[:30],
                dias_liquidados=min(dias_emp, 30),
                fecha_pago=n.periodo_fin,
                neto_recibido=neto,
                archivo_url=f"/desprendibles/{det.id_detalle_nomina}.pdf",
                firma_digital="PENDIENTE",
                estado_descarga="GENERADO",
            )
            self.db.add(desp)
            total += neto
            creados += 1

        n.total_pagado = total
        n.cantidad_empleados = creados
        self.db.commit()
        self.db.refresh(n)

        return {
            "id_nomina": n.id_nomina,
            "cantidad_empleados": creados,
            "total_pagado": float(total),
            "dias_periodo": dias,
            "estado": n.estado_nomina,
            "message": "Nómina calculada con prorrateo por salario y descuentos de ley (salud/pensión).",
        }

    def listar_detalles(self, id_nomina: int):
        self.obtener(id_nomina)
        return self.repo.listar_detalles(id_nomina)

    def obtener_detalle(self, id_nomina: int, id_detalle: int):
        self.obtener(id_nomina)
        d = self.repo.get_detalle(id_detalle)
        if d is None:
            raise NotFoundError("Detalle de nómina no encontrado")
        return d

    def actualizar(self, id_nomina: int, body: NominaUpdate) -> Nomina:
        n = self.obtener(id_nomina)
        for k, v in body.model_dump(exclude_unset=True).items():
            setattr(n, k, v)
        return self.repo.actualizar_nomina(n)

    def desprendibles_empleado(self, id_empleado: int):
        if self.repo.get_empleado(id_empleado) is None:
            raise NotFoundError("Empleado no encontrado")
        return self.repo.listar_desprendibles_empleado(id_empleado)

    def obtener_desprendible(self, id_desprendible: int):
        d = self.repo.get_desprendible(id_desprendible)
        if d is None:
            raise NotFoundError("Desprendible no encontrado")
        return d
