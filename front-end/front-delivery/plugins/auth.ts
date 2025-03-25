export default defineNuxtPlugin(() => {
  const { restoreSession } = useAuth()
  
  // Restaurar la sesión al inicio
  if (process.client) {
    console.log('Plugin de autenticación: intentando restaurar sesión')
    restoreSession()
  }
}) 