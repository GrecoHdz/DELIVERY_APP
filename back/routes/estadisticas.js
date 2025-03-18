const express = require("express");
const { body, validationResult } = require("express-validator");

const verifyToken = require("../middlewares/authMiddleware");
const { getEstadisticas, createEstadistica, updateEstadistica } = require("../controllers/estadisticaController");

const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener estadísticas
router.get("/:id_cliente", getEstadisticas);

// Crear estadística
router.post(
  "/",
  [
    body("pedidos").isInt({ min: 0 }).withMessage("El número de pedidos debe ser un entero no negativo"),
    body("ubers").isInt({ min: 0 }).withMessage("El número de ubers debe ser un entero no negativo"),
    body("mandaditos").isInt({ min: 0 }).withMessage("El número de mandaditos debe ser un entero no negativo"),
  ],
  validarErrores,
  createEstadistica
);

// Actualizar estadística
router.put(
  "/:id",
  [
    body("pedidos").optional().isInt({ min: 0 }).withMessage("El número de pedidos debe ser un entero no negativo"),
    body("ubers").optional().isInt({ min: 0 }).withMessage("El número de ubers debe ser un entero no negativo"),
    body("mandaditos").optional().isInt({ min: 0 }).withMessage("El número de mandaditos debe ser un entero no negativo"),
  ],
  validarErrores,
  updateEstadistica
);

module.exports = router;