const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, usuario: user.usuario },
    process.env.JWT_SECRET,
    { expiresIn: "1m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, usuario: user.usuario },
    process.env.JWT_SECRET,
    { expiresIn: "1m" }
  );

  return { accessToken, refreshToken };
};

const login = async (req, res) => {
  const { usuario, clave } = req.body;

  try {
    const user = await Usuario.findOne({
      where: { usuario },
      attributes: ["usuario", "clave_hash"]
    });

    if (!user) {
      return res.status(400).json({ message: "Usuario o contraseña incorrectos." });
    }

    const isMatch = await bcrypt.compare(clave, user.clave_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Usuario o contraseña incorrectos." });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    console.log("Login successful, accessToken:", accessToken);
    res.json({ accessToken, refreshToken });

  } catch (error) {
    console.error("Error en el login:", error);
    console.error("Error details:", error);

    // Log the entire error object for debugging
    console.error("Error details:", error);
    if (error.response) {
        return res.status(error.response.status).json({ message: error.response.data.message });
    }
    // Handle cases where error.response is not defined

    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { login, generateTokens };
