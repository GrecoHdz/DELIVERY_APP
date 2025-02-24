import axios from 'axios';

export default defineNuxtPlugin(nuxtApp => {
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000', // URL donde esta corriendo el back
  });

  // Si el cliente tiene el accessToken en localStorage, lo agregamos a las cabeceras
  if (process.client) {
    const token = localStorage.getItem('accessToken');
    const refreshToken = getCookie('refreshToken'); // Función para obtener la cookie del refreshToken

    if (token) {
      axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
    }

    // Si no tienes token, pero tienes refreshToken, intenta obtener un nuevo accessToken
    if (!token && refreshToken) {
      refreshAccessToken(refreshToken);
    }
  }

  // Función para obtener el valor de una cookie
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // Función para obtener un nuevo accessToken usando el refreshToken
  async function refreshAccessToken(refreshToken) {
    try {
      const response = await axiosInstance.post('/auth/refresh', { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data;

      // Guardar los nuevos tokens
      localStorage.setItem('accessToken', accessToken);
      document.cookie = `refreshToken=${newRefreshToken}; Secure; HttpOnly; Path=/; Max-Age=1000d;`;

      // Agregar el nuevo accessToken a las cabeceras de Axios
      axiosInstance.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
    } catch (error) {
      console.error('Error al refrescar el token:', error);
      // Aquí podrías redirigir al usuario a la página de login si el refreshToken es inválido
    }
  }

  // Exponer axios en el contexto global de Nuxt
  nuxtApp.provide('axios', axiosInstance);
});
