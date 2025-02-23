const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getExtras,
  getExtraById,
  createExtra,
  updateExtra,
  deleteExtra,
} = require("../controllers/extrasController");
const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los extras
router.get("/", getExtras);

// Obtener un extra por su ID
router.get(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  getExtraById
);

// Crear un nuevo extra
router.post(
  "/",
  [
    body("nombre")
      .notEmpty().withMessage("El nombre del extra es obligatorio")
      .isLength({ max: 255 }).withMessage("El nombre del extra no puede exceder los 255 caracteres"),
    body("precio")
      .optional()
      .isDecimal().withMessage("El precio debe ser un número decimal"),
  ],
  validarErrores,
  createExtra
);

// Actualizar un extra
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser un número entero"),
    body("nombre")
      .optional()
      .isLength({ max: 255 }).withMessage("El nombre del extra no puede exceder los 255 caracteres"),
    body("precio")
      .optional()
      .isDecimal().withMessage("El precio debe ser un número decimal"),
  ],
  validarErrores,
  updateExtra
);

// Eliminar un extra
router.delete(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  deleteExtra
);

module.exports = router;