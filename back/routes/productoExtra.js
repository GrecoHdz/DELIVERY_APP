const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getExtrasByProducto,
  associateExtraToProducto,
  deactivateExtraForProducto,
  reactivateExtraForProducto,
} = require("../controllers/productoExtraController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los extras asociados a un producto
router.get(
  "/:id_producto",
  [param("id_producto").isInt().withMessage("El ID del producto debe ser un número entero")],
  validarErrores,
  getExtrasByProducto
);

// Asociar un extra a un producto
router.post(
  "/:id_producto",
  [
    body("id_extra").isInt().withMessage("El ID del producto debe ser un número entero"), 
  ],
  validarErrores,
  associateExtraToProducto
);

// Desactivar un extra para un producto
router.put(
  "/:id_producto",
  [
    param("id_extra").isInt().withMessage("El ID del extra debe ser un número entero"),
  ],
  validarErrores,
  deactivateExtraForProducto
);

// Reactivar un extra para un producto
router.put(
  "/:id_producto",
  [
   param("id_extra").isInt().withMessage("El ID del extra debe ser un número entero"),
  ],
  validarErrores,
  reactivateExtraForProducto
);

module.exports = router;