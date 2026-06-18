from empleados.base import Empleado
from empleados.operario import Operario
from empleados.supervisor import Supervisor
from empleados.ingeniero import Ingeniero


def mostrar_liquidacion(empleado: Empleado):
    """
    Recibe cualquier tipo de empleado y llama al mismo método.
    Cada clase lo ejecuta de forma distinta — eso es polimorfismo.
    """
    print("-" * 50)
    print(empleado.describir())
    print(f"Salario total a pagar: ${empleado.calcular_salario():,.0f}")
    print("-" * 50)


if __name__ == "__main__":

    empleados = [
        Operario("Carlos Ruiz",      "1024511530", 1_300_000, 20),
        Supervisor("Rosa Melano",    "1022251350", 2_500_000, 800_000),
        Ingeniero("Devora Melo",     "1023374580", 4_000_000, 15),
    ]

    print("\n===== LIQUIDACIÓN DE EMPLEADOS — BUYDRAX =====\n")

    for emp in empleados:
        mostrar_liquidacion(emp)