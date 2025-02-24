const express = require("express");
const { login, generateTokens } = require("../controllers/authController"); // Asegúrate de importar generateTokens
const { body, validationResult } = require("express-validator");
const router = express.Router();
const jwt = require("jsonwebtoken");

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

    return login(req, res);
  }
);
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "No se proporcionó el refresh token" });
  }

  try {
    // Verificar el refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // Generar nuevos tokens
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



module.exports = router;
