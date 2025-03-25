export default function ({ store, redirect, route }) {
  const user = store.state.auth.user;
  
  if (!user) {
    return redirect('/login');
  }

  const userRole = user.role;
  const routeName = route.name;

  // Mapeo de roles a rutas permitidas
  const roleRoutes = {
    1: ['dashboard-cliente'], // Cliente
    2: ['dashboard-superadmin'], // Admin
    3: ['dashboard-superadmin'] // SuperAdmin
  };

  // Verificar si el usuario tiene acceso a la ruta
  if (!roleRoutes[userRole]?.includes(routeName)) {
    return redirect('/login');
  }
}
  