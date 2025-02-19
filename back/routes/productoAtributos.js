const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAtributosByProducto,
  associateAtributoToProducto,
  updateAtributoForProducto,
  deleteAtributoFromProducto,
} = require("../controllers/productoAtributosController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los atributos de un producto
router.get(
  "/productos/:id_producto/atributos",
  [param("id_producto").isInt().withMessage("El ID del producto debe ser un número entero")],
  validarErrores,
  getAtributosByProducto
);

// Asociar un atributo a un producto
router.post(
  "/productos/:id_producto/atributos",
  [
    param("id_producto").isInt().withMessage("El ID del producto debe ser un número entero"),
    body("id_valor_atributo")
      .isInt()
      .withMessage("El ID del valor de atributo debe ser un número entero"),
    body("precio_adicional")
      .optional()
      .isDecimal()
      .withMessage("El precio adicional debe ser un número decimal válido"),
  ],
  validarErrores,
  associateAtributoToProducto
);

// Actualizar un atributo de un producto
router.put(
  "/productos/:id_producto/atributos/:id",
  [
    param("id_producto").isInt().withMessage("El ID del producto debe ser un número entero"),
    param("id").isInt().withMessage("El ID debe ser un número entero"),
    body("precio_adicional")
      .optional()
      .isDecimal()
      .withMessage("El precio adicional debe ser un número decimal válido"),
  ],
  validarErrores,
  updateAtributoForProducto
);

// Eliminar un atributo de un producto
router.delete(
  "/productos/:id_producto/atributos/:id",
  [
    param("id_producto").isInt().withMessage("El ID del producto debe ser un número entero"),
    param("id").isInt().withMessage("El ID debe ser un número entero"),
  ],
  validarErrores,
  deleteAtributoFromProducto
);

module.exports = router;