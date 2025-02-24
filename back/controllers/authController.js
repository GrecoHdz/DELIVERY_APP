const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");

const generateTokens = (user) => {
  // Crear el Access Token con vida corta (por ejemplo, 1 hora)
  const accessToken = jwt.sign(
    { id: user.id, usuario: user.usuario },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Crear el Refresh Token con vida larga (por ejemplo, 1000 días)
  const refreshToken = jwt.sign(
    { id: user.id, usuario: user.usuario },
    process.env.JWT_SECRET,
    { expiresIn: "1000d" } // Refresh Token dura 1000 días
  );

  return { accessToken, refreshToken };
};

const login = async (req, res) => {
  const { usuario, clave } = req.body;

  try {
    // Buscar el usuario en la base de datos
    const user = await Usuario.findOne({
      where: { usuario },
      attributes: ["usuario", "clave_hash"]
    });

    if (!user) {
      return res.status(400).json({ message: "Usuario o contraseña incorrectos." });
    }

    // Comparar la clave ingresada con la clave hasheada en la base de datos
    const isMatch = await bcrypt.compare(clave, user.clave_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Usuario o contraseña incorrectos." });
    }

    // Generar los tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Guardar el refresh token en la base de datos (opcional)
    // await user.update({ refresh_token: refreshToken });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
module.exports = { login, generateTokens };
