export default defineNuxtRouteMiddleware((to) => {
  const { auth } = useAuth()
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password']

  // Si la ruta es pública, permitir el acceso
  if (publicRoutes.includes(to.path)) {
    return
  }

  // Si no hay usuario autenticado, redirigir al login
  if (!auth.value.loggedIn) {
    return navigateTo('/login')
  }

  // Si hay usuario autenticado y está intentando acceder al login, redirigir al dashboard
  if (auth.value.loggedIn && to.path === '/login') {
    if (auth.value.user?.role === 1) {
      return navigateTo('/Dashboard_Cliente')
    } else if (auth.value.user?.role === 2 || auth.value.user?.role === 3) {
      return navigateTo('/Dashboard_Superadmin')
    }
  }
}) 