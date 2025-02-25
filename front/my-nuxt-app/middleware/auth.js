export default function ({ store, redirect }) {
  // Verifica si hay un token en el store
  const token = store.state.auth.token || localStorage.getItem('token');

  if (!token) {
    // Si no hay token, redirige al login
    return redirect('/login');
  }
}