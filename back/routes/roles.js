const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getRoles,
  getRolById,
  createRol,
  updateRol,
  deleteRol,
} = require("../controllers/rolesController");
const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los roles
router.get("/", getRoles);

// Obtener un rol por su ID
router.get(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  getRolById
);

// Crear un nuevo rol
router.post(
  "/",
  [
    body("nombre_rol")
      .notEmpty().withMessage("El nombre del rol es obligatorio")
      .isIn(["cliente", "admin", "superadmin"]).withMessage("El nombre del rol no es válido"),
  ],
  validarErrores,
  createRol
);

// Actualizar un rol
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser un número entero"),
    body("nombre_rol")
      .notEmpty().withMessage("El nombre del rol es obligatorio")
      .isIn(["cliente", "admin", "superadmin"]).withMessage("El nombre del rol no es válido"),
  ],
  validarErrores,
  updateRol
);

// Eliminar un rol
router.delete(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  deleteRol
);

module.exports = router;