import type { AuthState } from '~/types/auth'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useState<AuthState>('auth')
  
  // Rutas públicas (solo rutas de autenticación)
  const publicRoutes = [
    '/login', 
    '/register', 
    '/forgot-password', 
    '/reset-password'
  ]

  // Rutas específicas por rol
  const roleRoutes: Record<number, string[]> = {
    1: ['/Dashboard_Cliente', '/Favoritos', '/Carrito', '/Pedidos', '/Perfil', '/productocliente', '/locales'], // Cliente
    2: ['/Dashboard_Local', '/productoslocal', '/Pedidoslocal'], // Local
    3: ['/Dashboard_Driver', '/PedidosDrivers'] // Driver
  }

  console.log('Estado de autenticación:', {
    loggedIn: auth.value?.loggedIn,
    user: auth.value?.user,
    path: to.path
  })

  // Si el usuario está autenticado
  if (auth.value?.loggedIn) {
    const userRole = auth.value.user?.role
    
    // Si intenta acceder a una ruta de autenticación, redirigir según su rol
    if (publicRoutes.includes(to.path)) {
      console.log('Usuario autenticado intentando acceder a ruta pública, redirigiendo...')
      if (userRole === 1) {
        return navigateTo('/Dashboard_Cliente')
      } else if (userRole === 2) {
        return navigateTo('/Dashboard_Local')
      } else if (userRole === 3) {
        return navigateTo('/Dashboard_Driver')
      }
    }

    // Verificar si el usuario tiene acceso a la ruta según su rol
    if (userRole && roleRoutes[userRole]) {
      const allowedRoutes = roleRoutes[userRole]
      if (!allowedRoutes.includes(to.path)) {
        console.log('Usuario intentando acceder a ruta no permitida para su rol')
        // Redirigir al dashboard correspondiente según el rol
        if (userRole === 1) {
          return navigateTo('/Dashboard_Cliente')
        } else if (userRole === 2) {
          return navigateTo('/Dashboard_Local')
        } else if (userRole === 3) {
          return navigateTo('/Dashboard_Driver')
        }
      }
    }

    // Si la ruta está permitida para el rol del usuario
    console.log('Usuario autenticado, permitiendo acceso a:', to.path)
    return
  }

  // Si el usuario no está autenticado, solo permitir acceso a rutas públicas
  if (!publicRoutes.includes(to.path)) {
    console.log('Usuario no autenticado, redirigiendo a login desde:', to.path)
    return navigateTo('/login')
  }
}) 