import { ref } from 'vue'
import { useApi } from './useApi'

export const useAuth = () => {
  const api = useApi()
  const user = ref(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref(null)

  // Estado para almacenar información del local
  const local = ref(null)
  
  // Inicializar el estado de autenticación desde localStorage
  const initAuth = async () => {
    isLoading.value = true
    error.value = null
    
    // Solo ejecutar en el cliente
    if (process.client) {
      try {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')
        
        if (token && userData) {
          user.value = JSON.parse(userData)
          isAuthenticated.value = true
          
          // Si el usuario es un local, cargar sus datos
          if (user.value.role === 'local') {
            await fetchLocalData()
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err)
        error.value = 'Error al inicializar la autenticación'
        logout()
      }
    }
    
    isLoading.value = false
  }
  
  // Iniciar sesión
  const login = async (credentials) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.post('/auth/login', credentials)
      
      if (response.token) {
        // Guardar en localStorage solo si estamos en el cliente
        if (process.client) {
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
        }
        
        user.value = response.user
        isAuthenticated.value = true
        
        // Si el usuario es un local, cargar sus datos
        if (user.value.role === 'local') {
          await fetchLocalData()
        }
        
        return true
      }
      
      return false
    } catch (err) {
      console.error('Login error:', err)
      error.value = err.message || 'Error al iniciar sesión'
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  // Cerrar sesión
  const logout = () => {
    // Eliminar del localStorage solo si estamos en el cliente
    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('local')
    }
    
    user.value = null
    local.value = null
    isAuthenticated.value = false
  }
  
  // Registrar un nuevo usuario
  const register = async (userData) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.post('/auth/register', userData)
      return response
    } catch (err) {
      console.error('Register error:', err)
      error.value = err.message || 'Error al registrar usuario'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Obtener datos del local (solo para usuarios con rol 'local')
  const fetchLocalData = async () => {
    if (!user.value || user.value.role !== 'local') return
    
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.get('/locales/mi-local')
      local.value = response
      
      // Guardar en localStorage solo si estamos en el cliente
      if (process.client) {
        localStorage.setItem('local', JSON.stringify(response))
      }
      
      return response
    } catch (err) {
      console.error('Error fetching local data:', err)
      error.value = err.message || 'Error al obtener datos del local'
    } finally {
      isLoading.value = false
    }
  }
  
  // Actualizar datos del usuario
  const updateUserProfile = async (userData) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.put('/users/profile', userData)
      
      if (response) {
        user.value = { ...user.value, ...response }
        
        // Guardar en localStorage solo si estamos en el cliente
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(user.value))
        }
      }
      
      return response
    } catch (err) {
      console.error('Update profile error:', err)
      error.value = err.message || 'Error al actualizar perfil'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    return user.value && user.value.role === role
  }
  
  return {
    user,
    local,
    isAuthenticated,
    isLoading,
    error,
    initAuth,
    login,
    logout,
    register,
    fetchLocalData,
    updateUserProfile,
    hasRole
  }
}
