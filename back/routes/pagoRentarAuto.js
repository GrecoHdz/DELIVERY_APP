const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllPagos,
  getPagoById,
  createPago,
  updatePago,
  deletePago,
} = require("../controllers/pagosRentarAutoController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los pagos de renta de autos
router.get("/", getAllPagos);

// Obtener un pago por su ID de renta
router.get("/:id", [param("id").isInt().withMessage("ID inválido")], validarErrores, getPagoById);

// Crear un nuevo pago de renta de auto
router.post(
  "/:id_rentar_auto",
  [
    param("id_rentar_auto").isInt().withMessage("ID de solicitud de renta inválido"),
    body("deposito_url").isURL().withMessage("La URL del depósito debe ser válida"),
    body("estado")
      .optional()
      .isIn(["pendiente", "aprobado", "rechazado"])
      .withMessage("Estado no válido"),
  ],
  validarErrores,
  createPago
);

// Actualizar un pago de renta de auto
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("ID inválido"),
    body("deposito_url")
      .optional()
      .isURL()
      .withMessage("La URL del depósito debe ser válida"),
    body("estado")
      .optional()
      .isIn(["pendiente", "aprobado", "rechazado"])
      .withMessage("Estado no válido"),
  ],
  validarErrores,
  updatePago
);

// Eliminar un pago de renta de auto
router.delete("/:id", [param("id").isInt().withMessage("ID inválido")], validarErrores, deletePago);

module.exports = router;