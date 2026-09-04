# Buydrax API — Backend completo

## Cobertura

- **EP-01 … EP-07**: Autenticación y usuarios (implementados)
- **EP-08**: Dashboard
- **EP-09 … EP-14**: Empleados (incluye retiro lógico EP-13)
- **EP-15 … EP-16**: Afiliación
- **EP-17**: Historial laboral (solo GET; se genera internamente)
- **EP-18 … EP-21**: Certificaciones
- **EP-22 … EP-25**: Supervisores
- **EP-26 … EP-28**: Asistencia
- **EP-29 … EP-33**: Turnos
- **EP-34 … EP-37**: Novedades
- **EP-38 … EP-41**: Horas extra
- **EP-42 … EP-46**: Proyectos
- **EP-47 … EP-51**: Asignaciones
- **EP-52 … EP-55**: Contratos
- **EP-56 … EP-59**: Préstamos
- **EP-60 … EP-63**: Viáticos
- **EP-64 … EP-67**: Liquidaciones (montos recibidos; fórmulas auto pendientes)
- **EP-68 … EP-77**: Nómina / desprendibles
- **EP-78 … EP-81**: PILA
- **EP-82 … EP-86**: Configuración + historial de cambios
- **EP-87 … EP-94**: Evaluaciones y observaciones
- **EP-95 … EP-99**: Solicitudes
- **EP-100 … EP-102**: Notificaciones

Prefijo: `/api/v1`

## Bloqueos deliberados (no inventar)

| Endpoint | Motivo |
|----------|--------|
| `POST /nominas/{id}/calcular` | Fórmulas de nómina PENDIENTES en reglas de negocio |
| `POST /nominas/{id}/pila` | Formato PILA y reglas de aportes no cerrados |
| Generación libre de desprendibles | Decisión cerrada: proceso interno tras validar nómina |

## Modelos ORM

Todas las tablas del SQL auditado están mapeadas en `app/models/`.

## Cómo ejecutar

Ver `README.md` en la raíz de `07_BACKEND`.
