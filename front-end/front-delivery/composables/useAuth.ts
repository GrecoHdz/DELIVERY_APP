import type { User, AuthState } from '~/types/auth'

export const useAuth = () => {
  const auth = useState<AuthState>('auth', () => {
    // Valor inicial por defecto
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      loggedIn: false
    }
  })

  const api = useApi()

  // Función para restaurar la sesión
  const restoreSession = () => {
    if (process.client) {
      try {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')
        const userStr = localStorage.getItem('user')
        
        console.log('Intentando restaurar sesión:', { accessToken: !!accessToken, refreshToken: !!refreshToken, userStr: !!userStr })
        
        if (accessToken && refreshToken && userStr) {
          const user = JSON.parse(userStr) as User
          auth.value = {
            user,
            accessToken,
            refreshToken,
            loggedIn: true
          }
          console.log('Sesión restaurada exitosamente:', auth.value)
          return true
        }
      } catch (error) {
        console.error('Error al restaurar sesión:', error)
        logout()
      }
    }
    return false
  }

  const login = async (credentials: { usuario: string; clave: string }) => {
    try {
      const response = await api.post('/login', credentials)
      
      if (response.accessToken && response.refreshToken && response.user) {
        auth.value = {
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          loggedIn: true
        }
        
        // Guardar en localStorage
        localStorage.setItem('accessToken', response.accessToken)
        localStorage.setItem('refreshToken', response.refreshToken)
        localStorage.setItem('user', JSON.stringify(response.user))
        
        console.log('Login exitoso:', auth.value)
        return response.user
      }
      
      throw new Error('Respuesta inválida del servidor')
    } catch (error) {
      console.error('Error en login:', error)
      throw error
    }
  }

  const logout = () => {
    auth.value = {
      user: null,
      accessToken: null,
      refreshToken: null,
      loggedIn: false
    }
    if (process.client) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
    console.log('Logout completado')
  }

  const forgotPassword = async (email: string) => {
    try {
      const response = await api.post('/login/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Error en forgotPassword:', error);
      throw error;
    }
  }

  const resetPassword = async (data: { token: string; password: string }) => {
    try {
      const response = await api.post('/login/reset-password', data);
      return response.data;
    } catch (error) {
      console.error('Error en resetPassword:', error);
      throw error;
    }
  }

  // Intentar restaurar la sesión al inicializar el composable
  if (process.client) {
    restoreSession()
  }

  return {
    auth,
    login,
    logout,
    forgotPassword,
    resetPassword,
    restoreSession
  }
} 