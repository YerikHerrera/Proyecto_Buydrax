from empleados.base import Empleado

class Operario(Empleado):
    """Empleado de obra con horas trabajadas y tarifa por hora."""

    def __init__(self, nombre: str, documento: str, salario_base: float, horas_extra: int):
        super().__init__(nombre, documento, salario_base)
        self.__horas_extra = horas_extra

    def get_horas_extra(self) -> int:
        return self.__horas_extra

    def set_horas_extra(self, horas_extra: int):
        if horas_extra < 0:
            raise ValueError("Las horas extra no pueden ser negativas.")
        self.__horas_extra = horas_extra

    def calcular_salario(self) -> float:
        return self.get_salario_base() + (self.__horas_extra * 15000)

    def describir(self) -> str:
        return f"Operario: {self.get_nombre()} | Doc: {self.get_documento()} | Horas extra: {self.__horas_extra}"

