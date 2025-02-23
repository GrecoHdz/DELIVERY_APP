const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllHistorial,
  getHistorialById,
  createHistorial,
  updateHistorial,
  deleteHistorial,
} = require("../controllers/historialController");

const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los registros de historial
router.get("/", getAllHistorial);

// Obtener un registro de historial por ID
router.get(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID del registro de historial debe ser un número entero"),
  ],
  validarErrores,
  getHistorialById
);

// Crear un nuevo registro de historial
router.post(
  "/:id_cliente",
  [
    body("tipo_historial")
      .isIn(["pedido", "viaje", "renta", "mandadito"])
      .withMessage("El tipo de historial debe ser 'pedido', 'viaje', 'renta' o 'mandadito'"),
    body("id_referencia")
      .isInt()
      .withMessage("El ID de referencia debe ser un número entero"),
    param("id_cliente")
      .isInt()
      .withMessage("El ID del cliente debe ser un número entero"),
    body("id_driver").optional().isInt().withMessage("El ID del driver debe ser un número entero"),
    body("id_vehiculo").optional().isInt().withMessage("El ID del vehículo debe ser un número entero"),
    body("id_local").optional().isInt().withMessage("El ID del local debe ser un número entero"),
    body("direccion_recogida").optional(),
    body("direccion_destino").optional(),
    body("fecha_inicio")
      .notEmpty()
      .withMessage("La fecha de inicio es obligatoria")
      .isISO8601()
      .toDate()
      .withMessage("La fecha de inicio debe ser una fecha válida"),
    body("fecha_fin").optional().isISO8601().toDate().withMessage("La fecha de fin debe ser una fecha válida"),
    body("precio")
      .isDecimal()
      .withMessage("El precio debe ser un número decimal válido"),
  ],
  validarErrores,
  createHistorial
);

// Actualizar un registro de historial
router.put(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID del registro de historial debe ser un número entero"),
    body("tipo_historial")
      .optional()
      .isIn(["pedido", "viaje", "renta", "mandadito"])
      .withMessage("El tipo de historial debe ser 'pedido', 'viaje', 'renta' o 'mandadito'"),
    body("id_referencia").optional().isInt().withMessage("El ID de referencia debe ser un número entero"),
    body("id_driver").optional().isInt().withMessage("El ID del driver debe ser un número entero"),
    body("id_vehiculo").optional().isInt().withMessage("El ID del vehículo debe ser un número entero"),
    body("id_local").optional().isInt().withMessage("El ID del local debe ser un número entero"),
    body("direccion_recogida").optional(),
    body("direccion_destino").optional(),
    body("fecha_inicio")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("La fecha de inicio debe ser una fecha válida"),
    body("fecha_fin").optional().isISO8601().toDate().withMessage("La fecha de fin debe ser una fecha válida"),
    body("precio")
      .optional()
      .isDecimal()
      .withMessage("El precio debe ser un número decimal válido"),
  ],
  validarErrores,
  updateHistorial
);

// Eliminar un registro de historial
router.delete(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID del registro de historial debe ser un número entero"),
  ],
  validarErrores,
  deleteHistorial
);

module.exports = router;