const express = require("express");
const { param, validationResult } = require("express-validator");
const { getEstadisticasByLocalId, updateEstadisticasLocal } = require("../controllers/estadisticaLocalController");

const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener estadísticas de un local por su ID
router.get(
  "/:id_local",
  [param("id_local").isInt().withMessage("El ID del local debe ser un número entero")],
  validarErrores,
  getEstadisticasByLocalId
);

// Actualizar estadísticas manualmente
router.put(
  "/:id_local",
  [param("id_local").isInt().withMessage("El ID del local debe ser un número entero")],
  validarErrores,
  updateEstadisticasLocal
);

module.exports = router;
