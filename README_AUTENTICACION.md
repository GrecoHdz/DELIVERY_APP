# Información sobre la Autenticación

## Estado Actual

La autenticación ha sido temporalmente desactivada en todo el proyecto para facilitar el desarrollo. Esto incluye:

1. El middleware de autenticación en el backend ha sido modificado para permitir siempre el acceso
2. Se han eliminado las referencias al middleware `verifyToken` en las rutas del backend
3. Los componentes frontend relacionados con la autenticación han sido modificados para permitir el acceso sin autenticación
4. Las solicitudes API ya no envían tokens de autenticación

## Archivos Modificados

### Backend

- `back\middlewares\authMiddleware.js` - Modificado para permitir siempre el acceso
- `back\routes\usuarios.js` - Eliminadas referencias a verifyToken
- `back\routes\banco.js` - Eliminadas referencias a verifyToken
- `back\routes\estadisticas.js` - Eliminadas referencias a verifyToken

### Frontend

- `front-end\front-delivery\middleware\local-access.global.js` - Desactivado completamente
- `front-end\front-delivery\middleware\root-redirect.global.ts` - Modificado para redirigir a Dashboard_Cliente
- `front-end\front-delivery\composables\useApi.js` - Modificado para no enviar tokens
- `front-end\front-delivery\plugins\auth.js` - Desactivado completamente
- `front-end\front-delivery\pages\login.vue` - Modificado para redirigir automáticamente

## Implementación Futura

La autenticación será implementada más adelante. Cuando se implemente, se deberán revertir los cambios realizados en estos archivos.

## Notas Importantes

- Todos los cambios están marcados con comentarios que indican que la autenticación ha sido desactivada temporalmente
- El middleware de autenticación simula un usuario autenticado para evitar errores en el código que espera `req.user`
- La página de login redirige automáticamente a la página principal
