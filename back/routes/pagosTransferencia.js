const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getTransferenciasByPago,
  createTransferencia,
  updateTransferencia,
  deleteTransferencia,
} = require("../controllers/pagosTransferenciaController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todas las transferencias de un pago
router.get("/:id_pago/transferencias", [param("id_pago").isInt().withMessage("ID inválido")], validarErrores, getTransferenciasByPago);

// Crear una nueva transferencia
router.post(
  "/:id_pago",
  [
    param("id_pago").isInt().withMessage("El ID debe ser un número entero"),
    body("id_pago").isInt().withMessage("ID de pago inválido"),
    body("num_comprobante")
      .notEmpty()
      .withMessage("El número de comprobante es obligatorio")
      .isLength({ max: 255 })
      .withMessage("El número de comprobante no puede exceder los 255 caracteres"),
    body("id_cuenta")
      .optional()
      .isInt()
      .withMessage("ID de cuenta inválido"),
  ],
  validarErrores,
  createTransferencia
);

// Actualizar una transferencia
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("ID inválido"),
    body("id_cuenta")
      .optional()
      .isInt()
      .withMessage("ID de cuenta inválido"),
    body("num_comprobante")
      .optional()
      .isLength({ max: 255 })
      .withMessage("El número de comprobante no puede exceder los 255 caracteres"),
  ],
  validarErrores,
  updateTransferencia
);

// Eliminar una transferencia
router.delete("/:id", 
[param("id").isInt().withMessage("ID inválido")], 
validarErrores, 
deleteTransferencia
);

module.exports = router;