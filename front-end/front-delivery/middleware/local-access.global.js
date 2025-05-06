// Middleware de autenticación completamente desactivado
// La autenticación será implementada más adelante

export default defineNuxtRouteMiddleware((_) => {
  // Permitir acceso a todas las rutas sin autenticación
  console.log('Middleware de autenticación desactivado - acceso permitido a todas las rutas');
})
