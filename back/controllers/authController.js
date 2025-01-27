const db = require('../database/database'); // Importa el archivo de base de datos
const jwt = require('jsonwebtoken'); // Importa la librería JWT

// Controlador de login
const login = async (req, res) => {
  const { username, password } = req.body;
  console.log('Datos recibidos:', { username, password });

  try {
    // Obtener el usuario desde la base de datos
    const user = await db.getUser(username);

    // Verificar si el usuario existe
    if (!user) {
      return res.status(400).json({ message: 'Usuario o contraseña incorrectos.' });
    }

    // Comparar la contraseña de la base de datos con la proporcionada
    if (user.clave !== password) {
      return res.status(400).json({ message: 'Usuario o contraseña incorrectos.' });
    }

    // Generar el token JWT si la autenticación es exitosa
    const token = jwt.sign(
      { id: user.id, username: user.usuario },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Responder con el token
    res.json({ token });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión.' });
  }
};


module.exports = { login };
