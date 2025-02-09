const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getMembresiasLocales,
  getMembresiaLocalById,
  createMembresiaLocal,
  updateMembresiaLocal,
  deleteMembresiaLocal,
} = require("../controllers/membresiaslocalesController");
const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todas las membresías locales
router.get("/", getMembresiasLocales);

// Obtener una membresía local por su ID
router.get(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  getMembresiaLocalById
);

// Crear una nueva membresía local
router.post(
  "/",
  [
    body("nombre_membresia")
      .notEmpty().withMessage("El nombre de la membresía es obligatorio")
      .isLength({ max: 255 }).withMessage("El nombre de la membresía no puede exceder los 255 caracteres"),
    body("precio")
      .notEmpty().withMessage("El precio es obligatorio")
      .isDecimal().withMessage("El precio debe ser un número decimal"),
    body("deliveries_gratuitos")
      .optional()
      .isInt().withMessage("Los deliveries gratuitos deben ser un número entero"),
    body("precio_delivery_extra")
      .optional()
      .isInt().withMessage("El precio del delivery extra debe ser un número entero"),
  ],
  validarErrores,
  createMembresiaLocal
);

// Actualizar una membresía local
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser un número entero"),
    body("nombre_membresia")
      .optional()
      .isLength({ max: 255 }).withMessage("El nombre de la membresía no puede exceder los 255 caracteres"),
    body("precio")
      .optional()
      .isDecimal().withMessage("El precio debe ser un número decimal"),
    body("deliveries_gratuitos")
      .optional()
      .isInt().withMessage("Los deliveries gratuitos deben ser un número entero"),
    body("precio_delivery_extra")
      .optional()
      .isInt().withMessage("El precio del delivery extra debe ser un número entero"),
  ],
  validarErrores,
  updateMembresiaLocal
);

// Eliminar una membresía local
router.delete(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  deleteMembresiaLocal
);

module.exports = router;