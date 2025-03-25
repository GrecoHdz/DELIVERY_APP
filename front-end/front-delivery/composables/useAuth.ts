interface User {
  id: number;
  usuario: string;
  role: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loggedIn: boolean;
}

export const useAuth = () => {
  const auth = useState<AuthState>('auth', () => ({
    user: null,
    token: null,
    loggedIn: false
  }))

  const api = useApi()

  const login = async (credentials: { usuario: string; clave: string }) => {
    try {
      const response = await api.post('/login', credentials)
      
      if (response.accessToken && response.user) {
        auth.value = {
          user: response.user,
          token: response.accessToken,
          loggedIn: true
        }
        
        // Guardar en localStorage
        localStorage.setItem('token', response.accessToken)
        localStorage.setItem('user', JSON.stringify(response.user))
        
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
      token: null,
      loggedIn: false
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
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

  const restoreSession = () => {
    try {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user') || 'null')
      
      if (token && user) {
        auth.value = {
          user,
          token,
          loggedIn: true
        }
      }
    } catch (error) {
      console.error('Error al restaurar sesión:', error)
      logout()
    }
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