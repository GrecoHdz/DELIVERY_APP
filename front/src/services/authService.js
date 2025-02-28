// src/services/authService.js
import axios from "axios";
import Cookies from "js-cookie";

// Configuración global de Axios
const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token a las solicitudes
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Función para iniciar sesión
export async function login(credentials) {
  try {
    const response = await api.post("/login", credentials);
    const { accessToken } = response.data;

    // Guarda el token en cookies
    Cookies.set("token", accessToken, { expires: 7 });

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

// Función para cerrar sesión
export function logout() {
  Cookies.remove("token");
}