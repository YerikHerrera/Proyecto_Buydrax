"""Verifica que todos los mapeadores ORM de Buydrax se configuren."""

from sqlalchemy.orm import configure_mappers

# Importar el paquete registra todos los modelos en la Base canónica.
import app.modelos  # noqa: F401

configure_mappers()
print("MODELOS ORM CORRECTAMENTE CONFIGURADOS")
