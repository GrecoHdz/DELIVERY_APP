export const useApi = () => {
  const config = useRuntimeConfig()

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token')
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    }

    console.log('Realizando petición a:', `${config.public.apiBase}${url}`)
    console.log('Headers:', headers)
    console.log('Options:', options)

    try {
      const response = await fetch(`${config.public.apiBase}${url}`, {
        ...options,
        headers,
        credentials: 'include'
      })

      console.log('Estado de la respuesta:', response.status)
      console.log('Headers de la respuesta:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch (e) {
          errorData = { message: 'Error al procesar la respuesta del servidor' }
        }
        console.error('Error en la respuesta:', errorData)
        throw new Error(errorData.message || 'Error en la petición')
      }

      const data = await response.json()
      console.log('Datos de la respuesta:', data)
      return data
    } catch (error) {
      console.error('Error en fetchWithAuth:', error)
      throw error
    }
  }

  return {
    get: (url: string) => fetchWithAuth(url, { method: 'GET' }),
    post: (url: string, data?: any) => fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    put: (url: string, data?: any) => fetchWithAuth(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (url: string) => fetchWithAuth(url, { method: 'DELETE' })
  }
} 