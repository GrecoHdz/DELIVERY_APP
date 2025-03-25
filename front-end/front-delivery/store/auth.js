export const state = () => ({
  user: null,
  token: null,
  loggedIn: false
})

export const mutations = {
  SET_USER(state, user) {
    state.user = user
    state.loggedIn = !!user
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  CLEAR_AUTH(state) {
    state.user = null
    state.token = null
    state.loggedIn = false
  }
}

export const actions = {
  async login({ commit }, credentials) {
    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error en el inicio de sesión')
      }

      const data = await response.json()
      
      if (data.accessToken && data.user) {
        commit('SET_TOKEN', data.accessToken)
        commit('SET_USER', data.user)
        
        // Guardar token en localStorage
        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        return data.user
      } else {
        throw new Error('Respuesta inválida del servidor')
      }
    } catch (error) {
      console.error('Error en login:', error)
      throw error
    }
  },
  
  logout({ commit }) {
    commit('CLEAR_AUTH')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
  
  // Restaurar sesión al cargar la página
  restoreSession({ commit }) {
    try {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user'))
      
      if (token && user) {
        commit('SET_TOKEN', token)
        commit('SET_USER', user)
      }
    } catch (error) {
      console.error('Error al restaurar sesión:', error)
      commit('CLEAR_AUTH')
    }
  }
} 