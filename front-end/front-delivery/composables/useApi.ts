export const useApi = () => {
  const config = useRuntimeConfig()
  const router = useRouter()

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        throw new Error('No hay refresh token')
      }

      const response = await fetch(`${config.public.apiBase}/login/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      })

      if (!response.ok) {
        throw new Error('Error al refrescar el token')
      }

      const data = await response.json()
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      return data.accessToken
    } catch (error) {
      console.error('Error al refrescar el token:', error)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      router.push('/login')
      throw error
    }
  }

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    let accessToken = localStorage.getItem('accessToken')
    
    const headers = {
      'Content-Type': 'application/json',
      ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
      ...options.headers
    }

    console.log('Realizando petición a:', `${config.public.apiBase}${url}`)
    console.log('Headers:', headers)
    console.log('Options:', options)

    try {
      let response = await fetch(`${config.public.apiBase}${url}`, {
        ...options,
        headers,
        credentials: 'include'
      })

      console.log('Estado de la respuesta:', response.status)
      console.log('Headers de la respuesta:', Object.fromEntries(response.headers.entries()))

      // Si el token expiró, intentar refrescarlo
      if (response.status === 401) {
        try {
          accessToken = await refreshToken()
          headers['Authorization'] = `Bearer ${accessToken}`
          response = await fetch(`${config.public.apiBase}${url}`, {
            ...options,
            headers,
            credentials: 'include'
          })
        } catch (error) {
          throw error
        }
      }

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