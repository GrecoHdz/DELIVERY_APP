export default defineNuxtRouteMiddleware((to) => {
  const store = useState('auth')
  
  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/login', '/register', '/forgot-password']
  
  if (!store.value?.loggedIn && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }
}) 