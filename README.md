# 🐘 Sistema de Gestión de Clientes Avanzado - Parte II

Esta aplicación evoluciona el CRUD básico hacia un sistema de consultas dinámicas y operaciones por criterios. Permite filtrar la base de datos de PostgreSQL mediante múltiples parámetros y realizar borrados masivos basados en lógica de negocio (edad y rangos).

## 🚀 Nuevas Funcionalidades
* **Búsqueda Multicriterio (GET):** Filtros dinámicos por RUT, Nombre (prefijo), Edad exacta o Rango de edades.
* **Búsqueda Flexible:** Implementación de `ILIKE` para que las búsquedas por nombre no distingan entre mayúsculas y minúsculas.
* **Borrados Masivos por Criterio (DELETE):** Eliminación de múltiples registros simultáneamente por edad o rango, retornando los nombres de los clientes afectados.
* **Interfaz Inteligente:** Formularios con limpieza automática de campos (reset) tras operaciones exitosas y manejo dinámico de la tabla de resultados.

---

## 🛠️ Aspectos Técnicos Destacados

### 1. Gestión de Query Params
Se utiliza la interfaz `URLSearchParams` en el frontend para construir URLs dinámicas. El backend procesa estos parámetros para construir consultas SQL condicionales, manteniendo la seguridad mediante **consultas parametrizadas**.

### 2. Lógica de Borrado con Retorno
Se utiliza la cláusula `RETURNING nombre` en las sentencias `DELETE`. Esto permite que el backend informe al usuario exactamente a quiénes se eliminó, mejorando la transparencia del sistema.

### 3. Experiencia de Usuario (UX)
* **Validación de Datos:** Control de tipos (edad numérica) y manejo de llaves duplicadas (RUT).
* **Feedback Dinámico:** Mensajes claros cuando una búsqueda no arroja resultados o cuando una eliminación masiva se completa.

---

## ⚙️ Configuración del Entorno
1.  **Dependencias:** Ejecutar `npm install` (requiere `express` y `pg`).
2.  **Base de Datos:** Asegurarse de que la tabla `clientes` tenga los campos `rut` (PK), `nombre` y `edad`.
3.  **Servidor:** Configurar las credenciales de acceso a Postgres en `server.js`.
4.  **Ejecución:** Iniciar con `node server.js` y acceder a `http://localhost:3000`.

---

## 👩🏻‍💻 Autora
Jenoveva Quijada

---

*"Desarrollado con enfoque en escalabilidad y lógica de filtros avanzada."*
