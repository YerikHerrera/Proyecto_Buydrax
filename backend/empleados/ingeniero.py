from empleados.base import Empleado


class Ingeniero(Empleado):
    """Ingeniero de obra con salario base más porcentaje por proyecto."""

    def __init__(self, nombre: str, documento: str, salario_base: float, porcentaje_proyecto: float):
        super().__init__(nombre, documento, salario_base)
        self.__porcentaje_proyecto = porcentaje_proyecto

    def get_porcentaje_proyecto(self) -> float:
        return self.__porcentaje_proyecto

    def set_porcentaje_proyecto(self, porcentaje: float):
        if porcentaje < 0 or porcentaje > 100:
            raise ValueError("El porcentaje debe estar entre 0 y 100.")
        self.__porcentaje_proyecto = porcentaje

    def calcular_salario(self) -> float:
        return self.get_salario_base() * (1 + self.__porcentaje_proyecto / 100)

    def describir(self) -> str:
        return f"Ingeniero: {self.get_nombre()} | Doc: {self.get_documento()} | Porcentaje proyecto: {self.__porcentaje_proyecto}%"