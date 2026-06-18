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


def crear_empleados():
    """Crea los empleados con manejo de excepciones."""

    empleados = []

    datos = [
        ("Operario",    "Carlos Ruiz",   "1024511530", 1_300_000, 20),
        ("Supervisor",  "Rosa Melano",   "1022251350", 2_500_000, 800_000),
        ("Ingeniero",   "Devora Melo",   "1023374580", 4_000_000, 15),
        ("Operario",    "",              "1025701606", 1_300_000, 10),   # nombre vacío — error
        ("Supervisor",  "Juan Pérez",    "1031445512", -500_000,  0),    # salario negativo — error
        ("Ingeniero",   "Luisa Díaz",    "1020034512", 3_000_000, 120),  # porcentaje inválido — error
    ]

    for dato in datos:
        try:
            tipo = dato[0]
            if tipo == "Operario":
                emp = Operario(dato[1], dato[2], dato[3], dato[4])
            elif tipo == "Supervisor":
                emp = Supervisor(dato[1], dato[2], dato[3], dato[4])
            elif tipo == "Ingeniero":
                emp = Ingeniero(dato[1], dato[2], dato[3], dato[4])
            empleados.append(emp)

        except ValueError as e:
            print(f"⚠️  Error al crear empleado '{dato[1]}': {e}")

    return empleados


if __name__ == "__main__":


    print("\n===== LIQUIDACIÓN DE EMPLEADOS — BUYDRAX =====\n")

    empleados = crear_empleados()

    print("\n--- Empleados registrados correctamente ---\n")

    for emp in empleados:
        mostrar_liquidacion(emp)