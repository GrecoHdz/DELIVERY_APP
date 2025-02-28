import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:3000", // Cambia esto según tu backend
  headers: {
    "Content-Type": "application/json",
  },
});


api.get('/login') // Cambia '/ruta' por la ruta que estás intentando acceder
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error en la petición:', error);
  });
// Interceptor para agregar el token a las cabeceras
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Agrega el token a las cabeceras
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
