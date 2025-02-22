const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllOfertas,
  getOfertaById,
  createOferta,
  updateOferta,
  deleteOferta,
} = require("../controllers/ofertaDriverController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todas las ofertas
router.get("/", getAllOfertas);

// Obtener una oferta por su ID
router.get("/:id", [param("id").isInt().withMessage("ID inválido")], validarErrores, getOfertaById);

// Crear una nueva oferta
router.post(
  "/:id_viaje",
  [
    param("id_viaje").isInt().withMessage("ID de viaje inválido"),
    body("id_pedido").isInt().withMessage("ID de pedido inválido"),
    body("id_driver").isInt().withMessage("ID de driver inválido"),
    body("id_vehiculo").isInt().withMessage("ID de vehículo inválido"),
    body("precio_oferta")
      .isDecimal()
      .withMessage("El precio de la oferta debe ser un número decimal válido"),
  ],
  validarErrores,
  createOferta
);

// Actualizar una oferta
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("ID inválido"),
    body("precio_oferta")
      .optional()
      .isDecimal()
      .withMessage("El precio de la oferta debe ser un número decimal válido"),
    body("estado_oferta")
      .optional()
      .isIn(["pendiente", "aceptada"])
      .withMessage("Estado no válido"),
  ],
  validarErrores,
  updateOferta
);

// Eliminar una oferta
router.delete("/:id", [param("id").isInt().withMessage("ID inválido")], validarErrores, deleteOferta);

module.exports = router;