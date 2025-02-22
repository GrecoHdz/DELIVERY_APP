const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllPagos,
  getPagoById,
  createPago,
  updatePago,
  deletePago,
} = require("../controllers/pagoMembresiaDriverController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los pagos de membresía
router.get("/", getAllPagos);

// Obtener un pago por su ID
router.get("/:id", [param("id").isInt().withMessage("ID inválido")], validarErrores, getPagoById);

// Crear un nuevo pago de membresía
router.post(
  "/:id_driver",
  [
    param("id_driver").isInt().withMessage("El ID debe ser un número entero"),
     body("id_membresia").isInt().withMessage("ID de membresía inválido"),
    body("monto").isDecimal().withMessage("El monto debe ser un número decimal válido"),
    body("deposito_url")
      .isURL()
      .withMessage("La URL de depósito debe ser válida"),
  ],
  validarErrores,
  createPago
);

// Actualizar un pago de membresía
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("ID inválido"),
    body("monto")
      .optional()
      .isDecimal()
      .withMessage("El monto debe ser un número decimal válido"),
    body("deposito_url")
      .optional()
      .isURL()
      .withMessage("La URL de depósito debe ser válida"),
    body("estado")
      .optional()
      .isIn(["pendiente", "aprobado", "denegado"])
      .withMessage("Estado no válido"),
  ],
  validarErrores,
  updatePago
);

// Eliminar un pago de membresía
router.delete("/:id", 
[param("id").isInt().withMessage("ID inválido")], 
validarErrores, 
deletePago
);

module.exports = router;