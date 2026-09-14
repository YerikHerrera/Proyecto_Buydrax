"""Servicio de empleados — lógica de negocio EP-09 … EP-17."""

from typing import Any, Optional, Sequence

from sqlalchemy.orm import Session

from app.modelos import Afiliacion, Empleado
from app.nucleo.excepciones import ConflictError, NotFoundError
from app.repositorios.repositorio_empleados import RepositorioEmpleados
from app.esquemas.negocio import (
    AfiliacionUpsert,
    EmpleadoCreate,
    EmpleadoOut,
    EmpleadoUpdate,
)


class ServicioEmpleados:
    def __init__(self, db: Session):
        self.repo = RepositorioEmpleados(db)
        self.db = db

    def listar(
        self,
        *,
        documento: Optional[str] = None,
        estado: Optional[str] = None,
        supervisor: Optional[int] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> Sequence[Empleado]:
        return self.repo.listar(
            documento=documento,
            estado=estado,
            supervisor=supervisor,
            skip=skip,
            limit=limit,
        )

    def obtener(self, id_empleado: int) -> Empleado:
        emp = self.repo.get_by_id(id_empleado)
        if emp is None:
            raise NotFoundError("Empleado no encontrado")
        return emp

    def crear(self, body: EmpleadoCreate) -> Empleado:
        if self.repo.get_by_documento(body.numero_documento):
            raise ConflictError("Número de documento ya registrado")
        if self.repo.get_by_usuario(body.id_usuario):
            raise ConflictError("El usuario ya tiene empleado asociado")
        if self.repo.get_usuario(body.id_usuario) is None:
            raise NotFoundError("Usuario no encontrado")
        emp = Empleado(**body.model_dump())
        return self.repo.crear(emp)

    def actualizar(self, id_empleado: int, body: EmpleadoUpdate) -> Empleado:
        emp = self.obtener(id_empleado)
        data = body.model_dump(exclude_unset=True)
        if "numero_documento" in data and data["numero_documento"]:
            other = self.repo.get_by_documento(data["numero_documento"])
            if other and other.id_empleado != id_empleado:
                raise ConflictError("Número de documento ya registrado")
        for k, v in data.items():
            setattr(emp, k, v)
        if data.get("estado_laboral") == "RETIRADO":
            user = self.repo.get_usuario(emp.id_usuario)
            if user:
                user.estado = False
        return self.repo.actualizar(emp)

    def exportar(self, formato: str = "json") -> dict[str, Any]:
        rows = self.repo.listar_todos()
        data = [EmpleadoOut.model_validate(r).model_dump(mode="json") for r in rows]
        if formato.lower() == "csv":
            if not data:
                return {"message": "Sin datos"}
            headers = list(data[0].keys())
            lines = [",".join(headers)]
            for row in data:
                lines.append(",".join(str(row.get(h, "")) for h in headers))
            return {"csv": "\n".join(lines), "count": len(data)}
        return {"items": data, "count": len(data)}

    def obtener_afiliacion(self, id_empleado: int) -> Afiliacion:
        self.obtener(id_empleado)
        af = self.repo.get_afiliacion(id_empleado)
        if af is None:
            raise NotFoundError("Afiliación no encontrada")
        return af

    def upsert_afiliacion(self, id_empleado: int, body: AfiliacionUpsert) -> Afiliacion:
        self.obtener(id_empleado)
        af = self.repo.get_afiliacion(id_empleado)
        if af is None:
            af = Afiliacion(id_empleado=id_empleado, **body.model_dump())
            return self.repo.guardar_afiliacion(af)
        for k, v in body.model_dump().items():
            setattr(af, k, v)
        return self.repo.actualizar_afiliacion(af)

    def listar_historial(self, id_empleado: int):
        self.obtener(id_empleado)
        return self.repo.listar_historial(id_empleado)
