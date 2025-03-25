export default defineNuxtRouteMiddleware((to) => {
  const store = useState('auth')
  const user = store.value?.user

  if (!user) {
    return navigateTo('/login')
  }

  // Mapeo de rutas a roles permitidos
  const roleRoutes = {
    '/Dashboard_Cliente': [1], // Solo clientes
    '/Dashboard_Superadmin': [2, 3] // Admin y SuperAdmin
  }

  const allowedRoles = roleRoutes[to.path]
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Si el usuario no tiene el rol adecuado, redirigir según su rol
    if (user.role === 1) {
      return navigateTo('/Dashboard_Cliente')
    } else if (user.role === 2 || user.role === 3) {
      return navigateTo('/Dashboard_Superadmin')
    }
  }
}) 