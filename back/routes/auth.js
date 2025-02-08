const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");
const { getUserByUsername } = require("../controllers/usuariosController");
const { body, validationResult } = require("express-validator");
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
            // Buscar el usuario por su nombre de usuario
            const user = await getUserByUsername(usuario);

            if (!user) {
                return res.status(401).json({ message: "Usuario no encontrado" });
            }

            // Comparar la contraseña proporcionada con el hash almacenado
            const isMatch = await bcrypt.compare(clave, user.clave_hash);

            if (!isMatch) {
                return res.status(400).json({ message: "Usuario o contraseña incorrectos." });
            }

            // Crear el token JWT con información del usuario
            const token = jwt.sign(
                { 
                    id_usuario: user.id_usuario, 
                    usuario: user.usuario, 
                    id_rol: user.id_rol, 
                    email: user.email 
                },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            // Actualizar la fecha del último login (opcional)
            await user.update({ fecha_ultimo_login: new Date() });

            // Devolver el token y cualquier otra información relevante
            res.json({ 
                token
            });
        } catch (error) {
            console.error("Error en el login:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
);

module.exports = router;