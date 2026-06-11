from abc import ABC, abstractmethod


class Empleado(ABC):
    """Clase base abstracta que representa un empleado de Buydrax."""

    def __init__(self, nombre: str, documento: str, salario_base: float):
        self.__nombre = nombre
        self.__documento = documento
        self.__salario_base = salario_base

    # Getters
    def get_nombre(self) -> str:
        return self.__nombre

    def get_documento(self) -> str:
        return self.__documento

    def get_salario_base(self) -> float:
        return self.__salario_base

    # Setters
    def set_nombre(self, nombre: str):
        if not nombre.strip():
            raise ValueError("El nombre no puede estar vacío.")
        self.__nombre = nombre

    def set_salario_base(self, salario_base: float):
        if salario_base < 0:
            raise ValueError("El salario base no puede ser negativo.")
        self.__salario_base = salario_base

    @abstractmethod
    def calcular_salario(self) -> float:
        """Cada tipo de empleado calcula su salario de forma distinta."""
        pass

    @abstractmethod
    def describir(self) -> str:
        """Retorna una descripción del empleado según su rol."""
        pass