const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getRecomendacionesByLocal,
  createRecomendacion,
  deactivateRecomendacion,
  reactivateRecomendacion,
} = require("../controllers/productosRecomendadosController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todas las recomendaciones de un local
router.get(
  "/locales/:id_local/recomendaciones",
  [param("id_local").isInt().withMessage("El ID del local debe ser un número entero")],
  validarErrores,
  getRecomendacionesByLocal
);

// Crear una nueva recomendación
router.post(
  "/locales/:id_local/recomendaciones",
  [
    param("id_local").isInt().withMessage("El ID del local debe ser un número entero"),
    body("id_producto").isInt().withMessage("El ID del producto debe ser un número entero"),
  ],
  validarErrores,
  createRecomendacion
);

// Desactivar una recomendación
router.put(
  "/recomendaciones/:id/desactivar",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  deactivateRecomendacion
);

// Reactivar una recomendación
router.put(
  "/recomendaciones/:id/reactivar",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  reactivateRecomendacion
);

module.exports = router;