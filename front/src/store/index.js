// src/store/index.js
import { createStore } from "vuex";
import Cookies from "js-cookie";

export default createStore({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    login({ commit }, { user, token }) {
      Cookies.set("token", token, { expires: 7 }); // Guarda el token en cookies
      commit("setUser", user); // Actualiza el estado del usuario
    },
    logout({ commit }) {
      Cookies.remove("token"); // Elimina el token de las cookies
      commit("setUser", null); // Limpia el estado del usuario
    },
  },
  getters: {
    getUser: (state) => state.user,
  },
});