const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  createConfig,
  getConfig,
  updateConfig,
  deleteConfig,
} = require("../controllers/configController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Crear un nuevo registro de configuración
router.post(
  "/",
  [
    body("comision_productos")
      .isDecimal()
      .withMessage("La comisión de productos debe ser un número decimal válido"),
  ],
  validarErrores,
  createConfig
);

// Obtener la configuración
router.get("/", getConfig);

// Actualizar la configuración
router.put(
  "/:id_config",
  [
    param("id_config").isInt().withMessage("ID inválido"),
    body("comision_productos")
      .isDecimal()
      .withMessage("La comisión de productos debe ser un número decimal válido"),
  ],
  validarErrores,
  updateConfig
);

// Eliminar la configuración
router.delete(
  "/:id_config",
  [param("id_config").isInt().withMessage("ID inválido")],
  validarErrores,
  deleteConfig
);

module.exports = router;