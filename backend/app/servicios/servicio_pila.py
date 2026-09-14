"""Servicio de PILA — EP-78 … EP-81."""

from typing import Any
from sqlalchemy.orm import Session
from app.nucleo.excepciones import NotFoundError
from app.repositorios.repositorio_nominas import RepositorioNominas

class ServicioPila:
    def __init__(self, db: Session):
        self.repo = RepositorioNominas(db)

    def generar(self, id_nomina: int) -> dict[str, Any]:
        n = self.repo.get_nomina(id_nomina)
        if n is None:
            raise NotFoundError("Nómina no encontrada")
        return {
            "id_nomina": id_nomina,
            "message": "Generación PILA pendiente: formato/reglas no definidas en fuentes",
        }

    def consultar_por_nomina(self, id_nomina: int):
        if self.repo.get_nomina(id_nomina) is None:
            raise NotFoundError("Nómina no encontrada")
        p = self.repo.get_pila_por_nomina(id_nomina)
        if p is None:
            raise NotFoundError("PILA no encontrada para esta nómina")
        return p

    def aportes(self, id_pila: int):
        if self.repo.get_pila(id_pila) is None:
            raise NotFoundError("PILA no encontrada")
        return self.repo.listar_aportes(id_pila)

    def archivo(self, id_pila: int) -> dict[str, Any]:
        p = self.repo.get_pila(id_pila)
        if p is None:
            raise NotFoundError("PILA no encontrada")
        return {
            "id_pila": id_pila,
            "message": "Archivo PILA pendiente de definición en fuentes",
        }
