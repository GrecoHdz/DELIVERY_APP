const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllViajes,
  getViajeById,
  createViaje,
  updateViaje,
  deleteViaje,
} = require("../controllers/viajeController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los viajes
router.get("/", getAllViajes);

// Obtener un viaje por su ID
router.get("/:id", [param("id").isInt().withMessage("ID inválido")], validarErrores, getViajeById);

// Crear un nuevo viaje
router.post(
  "/:id_cliente",
  [
    param("id_cliente").isInt().withMessage("ID de cliente inválido"),
    body("direccion_recogida")
      .notEmpty()
      .withMessage("La dirección de recogida es obligatoria")
      .isLength({ max: 255 })
      .withMessage("La dirección de recogida no puede exceder los 255 caracteres"),
    body("direccion_destino")
      .notEmpty()
      .withMessage("La dirección de destino es obligatoria")
      .isLength({ max: 255 })
      .withMessage("La dirección de destino no puede exceder los 255 caracteres"),
  ],
  validarErrores,
  createViaje
);

// Actualizar un viaje
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("ID inválido"),
    body("id_driver")
      .optional()
      .isInt()
      .withMessage("ID de driver inválido"),
    body("id_vehiculo")
      .optional()
      .isInt()
      .withMessage("ID de vehículo inválido"),
    body("tiempo_llegada_estimado")
      .optional()
      .isInt()
      .withMessage("El tiempo de llegada debe ser un número entero"),
    body("fecha_inicio")
      .optional()
      .isISO8601()
      .withMessage("La fecha de inicio debe ser válida"),
    body("fecha_fin")
      .optional()
      .isISO8601()
      .withMessage("La fecha de finalización debe ser válida"),
    body("estado")
      .optional()
      .isIn(["pendiente", "aceptado", "en_camino", "finalizado"])
      .withMessage("Estado no válido"),
    body("precio")
      .optional()
      .isDecimal()
      .withMessage("El precio debe ser un número decimal válido"),
  ],
  validarErrores,
  updateViaje
);

// Eliminar un viaje
router.delete("/:id", [param("id").isInt().withMessage("ID inválido")], validarErrores, deleteViaje);

module.exports = router;