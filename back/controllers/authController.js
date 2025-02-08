const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Usuario } = require("../models");

const login = async (req, res) => {
  const { usuario, clave } = req.body;

  try {
    // Buscar el usuario en la base de datos
    const user = await Usuario.findOne({ where: { usuario } });

    if (!user) {
      return res.status(400).json({ message: "Usuario o contraseña incorrectos." });
    }

    // Comparar la clave ingresada con la clave hasheada en la base de datos
    const isMatch = await bcrypt.compare(clave, user.clave);

    if (!isMatch) {
      return res.status(400).json({ message: "Usuario o contraseña incorrectos." });
    }

    // Generar un token JWT
    const token = jwt.sign(
      { id: user.id, usuario: user.usuario },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { login };
