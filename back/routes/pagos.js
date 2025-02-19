const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllPagos,
  getPagoById,
  createPago,
  updatePago,
  deletePago,
} = require("../controllers/pagosController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los pagos
router.get("/", getAllPagos);

// Obtener un pago por su ID
router.get("/:id", [param("id").isInt().withMessage("ID inválido")], validarErrores, getPagoById);

// Crear un nuevo pago
router.post(
  "/",
  [
    body("tipo_pago")
      .notEmpty()
      .withMessage("El tipo de pago es obligatorio")
      .isIn(["pedido", "mandadito", "renta_auto"])
      .withMessage("Tipo de pago no válido"),
    body("id_referencia").isInt().withMessage("ID de referencia inválido"),
    body("id_metodo_pago").isInt().withMessage("ID de método de pago inválido"),
    body("monto").isDecimal().withMessage("El monto debe ser un número decimal válido"),
    body("estado_pago")
      .optional()
      .isIn(["pendiente", "retenido", "confirmado", "finalizado"])
      .withMessage("Estado de pago no válido"),
  ],
  validarErrores,
  createPago
);

// Actualizar un pago
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("ID inválido"),
    body("tipo_pago")
      .optional()
      .isIn(["pedido", "mandadito", "renta_auto"])
      .withMessage("Tipo de pago no válido"),
    body("id_referencia")
      .optional()
      .isInt()
      .withMessage("ID de referencia inválido"),
    body("id_metodo_pago")
      .optional()
      .isInt()
      .withMessage("ID de método de pago inválido"),
    body("monto")
      .optional()
      .isDecimal()
      .withMessage("El monto debe ser un número decimal válido"),
    body("estado_pago")
      .optional()
      .isIn(["pendiente", "retenido", "confirmado", "finalizado"])
      .withMessage("Estado de pago no válido"),
  ],
  validarErrores,
  updatePago
);

// Eliminar un pago
router.delete("/:id", [param("id").isInt().withMessage("ID inválido")], validarErrores, deletePago);

module.exports = router;