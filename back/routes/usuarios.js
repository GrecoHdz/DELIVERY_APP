const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {createUsuarioRol,}= require("../controllers/usuarioRolesController");
const {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} = require("../controllers/usuariosController");
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

// Obtener un usuario por su ID
router.get(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  getUsuarioById
);

// Crear un nuevo usuario
router.post(
  "/",
  [
    body("usuario")
      .notEmpty().withMessage("El nombre de usuario es obligatorio")
      .isLength({ min: 3, max: 50 }).withMessage("El nombre de usuario debe tener entre 3 y 50 caracteres"),
    body("clave")
      .notEmpty().withMessage("La contraseña es obligatoria")
      .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    body("email")
      .notEmpty().withMessage("El email es obligatorio")
      .isEmail().withMessage("El email debe ser válido"),
  ],
  validarErrores,
  createUsuario,
  createUsuarioRol,
);

// Actualizar un usuario
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser un número entero"),
    body("usuario")
      .optional()
      .isLength({ min: 3, max: 50 }).withMessage("El nombre de usuario debe tener entre 3 y 50 caracteres"),
    body("clave")
      .optional()
      .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    body("email")
      .optional()
      .isEmail().withMessage("El email debe ser válido"),
    body("imagen_perfil_url")
      .optional()
      .isURL().withMessage("La URL de la imagen de perfil debe ser válida"),
  ],
  validarErrores,
  updateUsuario
);

// Eliminar un usuario
router.delete(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  deleteUsuario
);

module.exports = router;