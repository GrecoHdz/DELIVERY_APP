import Cookies from "js-cookie";

export default function authMiddleware(to, from, next) {
  const token = Cookies.get("token");

  if (!token) {
    next("/login"); // Redirigir al login si no hay token
  } else {
    next(); // Continuar con la navegación si hay token
  }
}
