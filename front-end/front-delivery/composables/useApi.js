import { useRuntimeConfig } from 'nuxt/app'

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  // Función para realizar peticiones HTTP
  const fetchApi = async (endpoint, options = {}) => {
    // Configuración por defecto
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }

    // Combinar opciones
    const fetchOptions = {
      ...defaultOptions,
      ...options
    }

    // Autenticación desactivada temporalmente
    // La autenticación será implementada más adelante
    console.log('Autenticación desactivada en solicitud API:', endpoint)

    try {
      const response = await fetch(`${baseURL}${endpoint}`, fetchOptions)

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
      }

      // Intentar parsear la respuesta como JSON
      const data = await response.json().catch(() => ({}))
      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Métodos para diferentes tipos de peticiones
  return {
    get: (endpoint, options = {}) => fetchApi(endpoint, { method: 'GET', ...options }),
    post: (endpoint, data, options = {}) => fetchApi(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    }),
    put: (endpoint, data, options = {}) => fetchApi(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    }),
    patch: (endpoint, data, options = {}) => fetchApi(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options
    }),
    delete: (endpoint, options = {}) => fetchApi(endpoint, { method: 'DELETE', ...options }),

    // Método para subir archivos
    upload: async (endpoint, formData, options = {}) => {
      const headers = {
        ...options.headers
      }

      // Autenticación desactivada temporalmente
      // La autenticación será implementada más adelante
      console.log('Autenticación desactivada en solicitud de carga de archivos:', endpoint)

      try {
        const response = await fetch(`${baseURL}${endpoint}`, {
          method: 'POST',
          body: formData,
          headers,
          ...options
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
        }

        return await response.json()
      } catch (error) {
        console.error('Upload Error:', error)
        throw error
      }
    }
  }
}
