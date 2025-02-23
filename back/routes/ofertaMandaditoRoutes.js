const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllOfertas,
  getOfertaById,
  createOferta,
  updateOferta,
  deleteOferta,
} = require("../controllers/ofertaMandaditoController");

const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todas las ofertas
router.get("/", getAllOfertas);

// Obtener una oferta por ID
router.get(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID de la oferta debe ser un número entero"),
  ],
  validarErrores,
  getOfertaById
);

// Crear una nueva oferta
router.post(
  "/:id_mandadito",
  [
    param("id_mandadito")
      .isInt()
      .withMessage("El ID del mandadito debe ser un número entero"),
    body("id_driver")
      .isInt()
      .withMessage("El ID del driver debe ser un número entero"),
    body("monto_ofrecido")
      .isDecimal()
      .withMessage("El monto ofrecido debe ser un número decimal válido"),
  ],
  validarErrores,
  createOferta
);

// Actualizar una oferta
router.put(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID de la oferta debe ser un número entero"),
    body("monto_ofrecido")
      .optional()
      .isDecimal()
      .withMessage("El monto ofrecido debe ser un número decimal válido"),
    body("estado")
      .optional()
      .isIn(["pendiente", "aceptada"])
      .withMessage("El estado debe ser 'pendiente' o 'aceptada'"),
  ],
  validarErrores,
  updateOferta
);

// Eliminar una oferta
router.delete(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("El ID de la oferta debe ser un número entero"),
  ],
  validarErrores,
  deleteOferta
);

module.exports = router;