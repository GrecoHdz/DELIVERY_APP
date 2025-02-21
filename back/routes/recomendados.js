const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getRecomendaciones,
  getRecomendacionesByLocal,
  createRecomendacion,
  deactivateRecomendacion,
  reactivateRecomendacion,
} = require("../controllers/recomendadosController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todas las recomendaciones 
router.get(
  "/",
  validarErrores,
  getRecomendaciones
);
// Obtener todas las recomendaciones de un local
router.get(
  "/:id_local",
  [param("id_local").isInt().withMessage("El ID del local debe ser un número entero")],
  validarErrores,
  getRecomendacionesByLocal
);
// Crear una nueva recomendación
router.post(
  "/:id_local",
  [
    param("id_local").isInt().withMessage("El ID del local debe ser un número entero"),
    body("id_producto").isInt().withMessage("El ID del producto debe ser un número entero"),
  ],
  validarErrores,
  createRecomendacion
);
// Desactivar una recomendación
router.put(
  "/:id_recomendacion",
  [param("id_recomendacion").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  deactivateRecomendacion
);

// Reactivar una recomendación
router.put(
  "/:id_recomendacion",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  reactivateRecomendacion
);

module.exports = router;