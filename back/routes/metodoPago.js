const express = require("express");
const { body, param, validationResult } = require("express-validator");
const { getMetodosPago, getMetodoPagoById, createMetodoPago, updateMetodoPago, deleteMetodoPago } = require("../controllers/metodoPagoController");

const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

router.get("/", getMetodosPago);

router.get(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  getMetodoPagoById
);

router.post(
  "/",
  [
    body("tipo_pago")
      .notEmpty().withMessage("El tipo de pago es obligatorio")
      .isLength({ min: 3 }).withMessage("El tipo de pago debe tener al menos 3 caracteres"),
  ],
  validarErrores,
  createMetodoPago
);

router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser un número entero"),
    body("tipo_pago")
      .optional()
      .isLength({ min: 3 }).withMessage("El tipo de pago debe tener al menos 3 caracteres"),
  ],
  validarErrores,
  updateMetodoPago
);

router.delete(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  deleteMetodoPago
);

module.exports = router;