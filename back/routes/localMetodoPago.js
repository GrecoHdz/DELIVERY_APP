const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getMetodosPagoByLocal,
  associateMetodoPagoToLocal,
  deleteMetodoPagoFromLocal,
} = require("../controllers/localMetodoPagoController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los métodos de pago de un local
router.get("/:id_local/metodos-pago", [param("id_local").isInt().withMessage("ID inválido")], validarErrores, getMetodosPagoByLocal);

// Asociar un método de pago a un local
router.post(
"/:id_local",
    [
    param("id_local").isInt().withMessage("ID de local inválido"),
    body("id_metodo_pago").isInt().withMessage("ID de método de pago inválido"),
  ],
  validarErrores,
  associateMetodoPagoToLocal
);

// Eliminar la asociación entre un local y un método de pago
router.delete(
  "/:id_local/:id_metodo_pago",
  [
    param("id_local").isInt().withMessage("ID de local inválido"),
    param("id_metodo_pago").isInt().withMessage("ID de método de pago inválido"),
  ],
  validarErrores,
  deleteMetodoPagoFromLocal
);

module.exports = router;