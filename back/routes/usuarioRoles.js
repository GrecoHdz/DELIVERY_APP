const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getUsuarioRoles,
  getUsuarioRolById,
  updateUsuarioRol,
  deleteUsuarioRol,
  createUsuarioRol, 
} = require("../controllers/usuarioRolesController");

const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todas las relaciones usuario-rol
router.get("/", getUsuarioRoles);

// Obtener una relación usuario-rol por su ID de usuario y ID de rol
router.get(
  "/:id_usuario/:id_rol",
  [
    param("id_usuario").isInt().withMessage("El ID de usuario debe ser un número entero"),
    param("id_rol").isInt().withMessage("El ID de rol debe ser un número entero"),
  ],
  validarErrores,
  getUsuarioRolById
);
// Crear el rol de un usuario
router.post(
  "/",
  [
    body("id_usuario")
      .notEmpty().withMessage("El ID de usuario es obligatorio")
      .isInt().withMessage("El ID de usuario debe ser un número entero"),
    body("id_rol")
      .notEmpty().withMessage("El ID de rol es obligatorio")
      .isInt().withMessage("El ID de rol debe ser un número entero"),
  ],
  validarErrores,
  createUsuarioRol
);
// Actualizar el rol de un usuario
router.put(
  "/:id_usuario",
  [
    param("id_usuario").isInt().withMessage("El ID de usuario debe ser un número entero"),
    body("nuevo_id_rol")
      .notEmpty().withMessage("El nuevo ID de rol es obligatorio")
      .isInt().withMessage("El nuevo ID de rol debe ser un número entero"),
  ],
  validarErrores,
  updateUsuarioRol
);

// Eliminar el rol del usuario (reiniciarlo a cliente)
router.delete(
  "/:id_usuario",
  [
    param("id_usuario").isInt().withMessage("El ID de usuario debe ser un número entero"),
  ],
  validarErrores,
  deleteUsuarioRol
);

module.exports = router;
