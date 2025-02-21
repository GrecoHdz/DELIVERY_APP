const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getEfectivosByPago,
  createEfectivo,
  updateEfectivo,
  deleteEfectivo,
} = require("../controllers/pagosEfectivoController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los pagos en efectivo de un pago
router.get("/:id_pago/efectivos", [param("id_pago").isInt().withMessage("ID inválido")], validarErrores, getEfectivosByPago);

// Crear un nuevo pago en efectivo
router.post(
  "/:id_pago",
  [
    param("id_pago").isInt().withMessage("El ID debe ser un número entero"),
    body("id_pago").isInt().withMessage("ID de pago inválido"),
    body("cambio")
      .optional()
      .isDecimal()
      .withMessage("El cambio debe ser un número decimal válido"),
  ],
  validarErrores,
  createEfectivo
);

// Actualizar un pago en efectivo
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("ID inválido"),
    body("cambio")
      .optional()
      .isDecimal()
      .withMessage("El cambio debe ser un número decimal válido"),
  ],
  validarErrores,
  updateEfectivo
);

// Eliminar un pago en efectivo
router.delete("/:id", [param("id").isInt().withMessage("ID inválido")], validarErrores, deleteEfectivo);

module.exports = router;