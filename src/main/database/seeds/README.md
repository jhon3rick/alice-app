# Database Seeds

Este directorio contiene archivos de datos semilla (seed data) que se importan cuando se inicializa o resetea la base de datos.

## Propósito

Los archivos seed proporcionan datos iniciales para:
- Configuraciones por defecto
- Datos de ejemplo para desarrollo
- Registros base necesarios para el funcionamiento de la aplicación

## Estructura

Cada archivo de seed debe exportar los datos en un formato que pueda ser importado y procesado por el sistema de gestión de base de datos.

## Uso

Los seeds se cargarán automáticamente cuando:
- Se inicializa la base de datos por primera vez
- Se ejecuta la funcionalidad de reset de base de datos

## Notas

- Los archivos en este directorio serán procesados en orden alfabético
- Asegúrate de que los datos no contengan información sensible
