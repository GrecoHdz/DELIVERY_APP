import { useAuth } from '../composables/useAuth'

export default defineNuxtPlugin(async (nuxtApp) => {
  // Esperar a que el plugin se ejecute en el cliente para evitar errores de SSR
  if (process.client) {
    // Importar el composable de autenticación
    const auth = useAuth()

    // Inicializar el estado de autenticación al cargar la aplicación
    if (auth && typeof auth.initAuth === 'function') {
      await auth.initAuth()
    }
  }
})
