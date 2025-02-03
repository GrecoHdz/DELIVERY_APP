const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {getUsuarios,getUsuarioById,createUsuario,updateUsuario,deleteUsuario} = require("../controllers/usuariosController");

const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }
    next();
};

// Obtener todos los usuarios
router.get("/", getUsuarios);

// Obtener usuario por ID con validación
router.get(
    "/:id",
    [param("id").isInt().withMessage("El ID debe ser un número entero")],
    validarErrores,
    getUsuarioById
);

// Crear un nuevo usuario con validaciones
router.post(
    "/",
    [
        body("usuario")
            .notEmpty().withMessage("El usuario es obligatorio")
            .isLength({ min: 3 }).withMessage("El usuario debe tener al menos 3 caracteres"),
        body("clave")
            .notEmpty().withMessage("La clave es obligatoria")
            .isLength({ min: 6 }).withMessage("La clave debe tener al menos 6 caracteres"),
    ],
    validarErrores,
    createUsuario
);

// Actualizar un usuario con validaciones
router.put(
    "/:id",
    [
        param("id").isInt().withMessage("El ID debe ser un número entero"),
        body("usuario")
            .optional()
            .isLength({ min: 3 }).withMessage("El usuario debe tener al menos 3 caracteres"),
        body("clave")
            .optional()
            .isLength({ min: 6 }).withMessage("La clave debe tener al menos 6 caracteres"),
    ],
    validarErrores,
    updateUsuario
);

// Eliminar usuario con validación
router.delete(
    "/:id",
    [param("id").isInt().withMessage("El ID debe ser un número entero")],
    validarErrores,
    deleteUsuario
);

module.exports = router;
