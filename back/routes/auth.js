const express = require("express");
const { login, generateTokens, forgotPassword, resetPassword } = require("../controllers/authController");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Login route
router.post(
  "/",
  [
    body("usuario").notEmpty().withMessage("El usuario es obligatorio"),
    body("clave").notEmpty().withMessage("La contraseña es obligatoria"),
  ],
  async (req, res) => {
    // Capturar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Errores de validación:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      return await login(req, res); // Call the login function to handle authentication
    } catch (error) {
      console.error("Error en la ruta de login:", error);
      res.status(500).json({ message: "Error en el proceso de login" });
    }
  }
);

// Session management route
router.post("/session", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "No se proporcionó el refresh token" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const newTokens = generateTokens(decoded);

    res.json({
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
    });
  } catch (error) {
    console.error("Error al renovar el token:", error);
    res.status(401).json({ message: "Refresh token inválido o expirado" });
  }
});

// Ruta para solicitar recuperación de contraseña
router.post('/forgot-password', forgotPassword);

// Ruta para restablecer la contraseña
router.post('/reset-password', resetPassword);

module.exports = router;
