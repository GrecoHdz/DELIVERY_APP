const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Usuario.findOne({ where: { usuario: username } });

    if (!user || user.clave !== password) {
      return res.status(400).json({ message: 'Usuario o contraseña incorrectos.' });
    }

    const token = jwt.sign({ id: user.id, username: user.usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión.' });
  }
};

module.exports = { login };
