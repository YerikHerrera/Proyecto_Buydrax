from empleados.base import Empleado


class Supervisor(Empleado):
    """Supervisor de obra con bonificación por proyecto a cargo."""

    def __init__(self, nombre: str, documento: str, salario_base: float, bonificacion: float):
        super().__init__(nombre, documento, salario_base)
        self.__bonificacion = bonificacion

    def get_bonificacion(self) -> float:
        return self.__bonificacion

    def set_bonificacion(self, bonificacion: float):
        if bonificacion < 0:
            raise ValueError("La bonificación no puede ser negativa.")
        self.__bonificacion = bonificacion

    def calcular_salario(self) -> float:
        return self.get_salario_base() + self.__bonificacion

    def describir(self) -> str:
        return f"Supervisor: {self.get_nombre()} | Doc: {self.get_documento()} | Bonificación: ${self.__bonificacion:,.0f}"
