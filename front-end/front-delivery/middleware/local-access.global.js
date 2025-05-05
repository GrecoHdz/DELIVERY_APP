import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  // Temporalmente desactivado para permitir acceso sin autenticación
  // Verificar si la ruta requiere acceso de local
  /*
  if (to.path.startsWith('/dashboard-local')) {
    const auth = useAuth()

    // Si no está autenticado, redirigir al login
    if (!auth.isAuthenticated.value) {
      return navigateTo('/login')
    }

    // Si no tiene rol de local, redirigir a la página principal
    if (!auth.hasRole('local')) {
      return navigateTo('/')
    }
  }
  */

  // Permitir acceso a todas las rutas sin autenticación
  console.log('Middleware de autenticación desactivado temporalmente');
})
