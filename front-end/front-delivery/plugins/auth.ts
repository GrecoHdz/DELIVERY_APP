export default defineNuxtPlugin(async () => {
  const { restoreSession } = useAuth()
  
  // Restaurar la sesión al inicio
  if (process.client) {
    console.log('Plugin de autenticación: intentando restaurar sesión')
    const restored = await restoreSession()
    console.log('Resultado de restauración de sesión:', restored)
  }
}) 