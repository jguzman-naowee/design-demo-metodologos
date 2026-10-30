# Reglas del layout de demos

Heredadas de la capa Demo de `design-demo-landing-web-jin`.

1. **La capa no toca el diseño.** El diseño vive en `apps/<nombre>/` y no sabe que lo guían.
2. **Casos como datos** (`casos.js`): `id`, `titulo`, `steps`, `falta`. Sin lógica de recorrido en el caso.
3. **Cada caso arranca desde el inicio** y usa la navegación real, no atajos de URL (`goto` solo para el primer paso).
4. **Nada hardcodeado**: lo que se pulsa se busca en pantalla por selector; si no existe, el paso falla con mensaje claro.
5. **Paso a paso por defecto**; «Automático» es opcional. «Reiniciar» siempre disponible.
6. **Cada caso declara lo que aún no hace** (`falta`, «Pendiente»). Se muestra al terminar.
7. **Accesible**: objetivos táctiles ≥ 44px, foco visible, `aria-live` en el texto del paso, `prefers-reduced-motion` respetado.
8. **Sin pantalla de inicio propia.** La entrada del repo es la portada; la app arranca en su primera pantalla útil.
9. **Estático**: sin servicios; los datos son una foto congelada.
