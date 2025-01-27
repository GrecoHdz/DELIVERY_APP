const jwt = require("jsonwebtoken");
const { getUser } = require("../database/database");

const login = async (req, res) => {
  const { username, password } = req.body;

  // Simulación de verificación de usuario
  const user = await getUser(username, password);
  if (!user) {
    return res.status(401).json({ error: "Usuario o contraseña incorrectos." });
  }

  // Generar token JWT
  const payload = { id: user.id, username: user.username };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ token });
};

module.exports = { login };
