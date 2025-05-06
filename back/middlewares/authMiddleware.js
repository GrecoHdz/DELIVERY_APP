// Middleware de autenticación modificado para permitir siempre el acceso
// Este middleware ha sido desactivado temporalmente para eliminar la autenticación

const verifyToken = (req, res, next) => {
  // Comentario para desarrolladores: Este middleware ha sido modificado para permitir siempre el acceso
  // La autenticación será implementada más adelante
  console.log("Middleware de autenticación desactivado - acceso permitido");

  // Simular un usuario autenticado para evitar errores en el código que espera req.user
  req.user = {
    id: 1,
    usuario: 'usuario_temporal',
    role: 1
  };

  // Continuar con la petición
  next();
};

module.exports = verifyToken;

