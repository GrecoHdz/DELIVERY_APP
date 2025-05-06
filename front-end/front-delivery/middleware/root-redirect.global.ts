// Middleware modificado para redirigir a la página principal en lugar de login
// La autenticación será implementada más adelante

export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/') {
    // Redirigir a la página principal en lugar de login
    return navigateTo('/Dashboard_Cliente')
  }
})