# Mapear la app de Metodólogos

Objetivo: dejar la app montada en el teléfono con sus flujos principales como casos. Sigue `MONTAR-DEMO-MOBILE.md` para la mecánica; esto es el orden de trabajo.

## 1. Inventario (antes de tocar código)

Haz una lista en `docs/inventario.md` con:

- **Pantallas:** nombre, ruta o cómo se llega, y si cambia según el rol.
- **Flujos:** qué quiere lograr el usuario, de principio a fin (cada uno será un caso).
- **Datos:** qué consulta a un servicio y qué datos fijos lo reemplazan en la demo.
- **Inicio propio:** si hay splash, portada, onboarding o selector de plataforma (se quita, ver la guía).

## 2. Montar la app

`npm run nueva-app -- metodologos --desde <build> --nombre "Metodólogos"` y los ajustes de la sección 2 de la guía.

## 3. Casos

Un caso por flujo del inventario, con `falta` para lo que el diseño aún no resuelve. Usa el modo dev (`?dev=1`) para capturar selectores.

## 4. Cierre

Lista de revisión de la sección 5 de la guía. Marca en `inventario.md` qué pantallas quedaron sin cubrir.
