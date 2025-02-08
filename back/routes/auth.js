const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");
const { getUserByUsername } = require("../controllers/usuariosController");
const { body, validationResult } = require("express-validator"); // Importar express-validator
const router = express.Router();

// Ruta de autenticación (login)
router.post(
    "/login",
    [
        body("usuario").notEmpty().withMessage("El usuario es obligatorio"),
        body("clave").notEmpty().withMessage("La contraseña es obligatoria"),
    ],
    async (req, res) => {
        // Capturar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { usuario, clave } = req.body;

        try {
            const user = await getUserByUsername(usuario);

            if (!user) {
                return res.status(401).json({ message: "Usuario no encontrado" });
            }

            const isMatch = await bcrypt.compare(clave, user.clave);

            if (!isMatch) {
                return res.status(400).json({ message: "Usuario o contraseña incorrectos." });
            }

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
    }
);

module.exports = router;
