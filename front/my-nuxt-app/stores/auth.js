export const state = () => ({
  token: null,
  user: null,
});

export const mutations = {
  setToken(state, token) {
    state.token = token;
    localStorage.setItem('token', token); // Guardar token en localStorage
  },
  setUser(state, user) {
    state.user = user;
  },
  logout(state) {
    state.token = null;
    state.user = null;
    localStorage.removeItem('token');
  }
};

export const actions = {
  async login({ commit }, { username, password }) {
    try {
      console.log('Attempting login...');
      const response = await this.$axios.post('/auth/login', { 
        usuario: username, 
        clave: password 
      });
      
      if (!response.data?.token) {
        throw new Error('No token received');
      }
      
      const token = response.data.token;
      commit('setToken', token);
      console.log('Login successful, token stored');

      // Get user profile
      const userResponse = await this.$axios.get('/user/profile');
      if (!userResponse.data) {
        throw new Error('No user data received');
      }
      commit('setUser', userResponse.data);
      console.log('User profile loaded');

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      commit('logout');
      throw error;
    }
  },

  logout({ commit }) {
    console.log('Logging out...');
    commit('logout');
    console.log('Logout successful');
    return true;
  }

};

export const getters = {
  isAuthenticated(state) {
    return state.token !== null;
  },
  getUser(state) {
    return state.user;
  }
};
