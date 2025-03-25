// store/index.js
export const state = () => ({
    auth: {
      loggedIn: false,
      user: null
    }
  });
  
  export const mutations = {
    SET_USER(state, user) {
      state.auth.user = user;
      state.auth.loggedIn = true;
    },
    LOGOUT(state) {
      state.auth.user = null;
      state.auth.loggedIn = false;
    }
  };
  
  export const actions = {
    async login({ commit }, { username, password }) {
      try {
        const response = await this.$axios.post('/login', { username, password });
        commit('SET_USER', response.data.user);
      } catch (error) {
        console.error('Login failed', error);
      }
    },
    logout({ commit }) {
      commit('LOGOUT');
    }
  };
  