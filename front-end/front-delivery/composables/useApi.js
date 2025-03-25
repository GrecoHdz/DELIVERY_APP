export const useApi = () => {
  const config = useRuntimeConfig()

  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token')
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${config.public.apiBase}${url}`, {
      ...options,
      headers
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error en la petición')
    }

    return response.json()
  }

  return {
    get: (url) => fetchWithAuth(url, { method: 'GET' }),
    post: (url, data) => fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    put: (url, data) => fetchWithAuth(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (url) => fetchWithAuth(url, { method: 'DELETE' })
  }
} 