export default function ({ store, redirect }) {
  // Restaurar la sesión si existe
  store.dispatch('auth/restoreSession')
  
  if (!store.state.auth.loggedIn) {
    return redirect('/login')
  }
}
