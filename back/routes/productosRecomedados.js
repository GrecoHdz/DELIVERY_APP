const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getRecomendacionesByLocal,
  createRecomendacion,
  updateRecomendacion,
  deleteRecomendacion,
} = require("../controllers/productosRecomendadosController");

const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todas las recomendaciones de un local
router.get(
  "/local/:id_local",
  [param("id_local").isInt().withMessage("El ID del local debe ser un número entero")],
  validarErrores,
  getRecomendacionesByLocal
);

// Crear una nueva recomendación
router.post(
  "/",
  [
    body("id_producto")
      .isInt()
      .withMessage("El ID del producto debe ser un número entero"),
    body("id_local")
      .isInt()
      .withMessage("El ID del local debe ser un número entero"),
  ],
  validarErrores,
  createRecomendacion
);

// Actualizar una recomendación
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID de la recomendación debe ser un número entero"),
    body("id_producto")
      .optional()
      .isInt()
      .withMessage("El ID del producto debe ser un número entero"),
    body("id_local")
      .optional()
      .isInt()
      .withMessage("El ID del local debe ser un número entero"),
    body("activo")
      .optional()
      .isBoolean()
      .withMessage("El campo 'activo' debe ser un valor booleano"),
  ],
  validarErrores,
  updateRecomendacion
);

// Eliminar una recomendación
router.delete(
  "/:id",
  [param("id").isInt().withMessage("El ID de la recomendación debe ser un número entero")],
  validarErrores,
  deleteRecomendacion
);

module.exports = router;