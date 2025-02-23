const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllAtributosByProducto,
  createAtributo,
  updateAtributo,
  deleteAtributo,
} = require("../controllers/atributoController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los atributos de un producto
router.get("/:id_producto", 
[
  param("id_producto")
  .isInt()
  .withMessage("ID inválido")
], 
validarErrores, 
getAllAtributosByProducto
);

// Crear un nuevo atributo para un producto
router.post(
  "/:id_producto",
  [
    param("id_producto").isInt().withMessage("ID de producto inválido"),
    body("nombre_atributo")
      .notEmpty()
      .withMessage("El nombre del atributo es obligatorio")
      .isLength({ max: 255 })
      .withMessage("El nombre del atributo no puede exceder los 255 caracteres"),
    body("valor")
      .notEmpty()
      .withMessage("El valor es obligatorio")
      .isLength({ max: 255 })
      .withMessage("El valor no puede exceder los 255 caracteres"),
    body("precio_adicional")
      .optional()
      .isDecimal()
      .withMessage("El precio adicional debe ser un número decimal válido"),
  ],
  validarErrores,
  createAtributo
);

// Actualizar un atributo
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("ID inválido"),
    body("nombre_atributo")
      .notEmpty()
      .withMessage("El nombre del atributo es obligatorio")
      .isLength({ max: 255 })
      .withMessage("El nombre del atributo no puede exceder los 255 caracteres"),
    body("valor")
      .optional()
      .notEmpty()
      .withMessage("El valor es obligatorio")
      .isLength({ max: 255 })
      .withMessage("El valor no puede exceder los 255 caracteres"),
    body("precio_adicional")
      .optional()
      .isDecimal()
      .withMessage("El precio adicional debe ser un número decimal válido"),
  ],
  validarErrores,
  updateAtributo
);

// Eliminar un atributo
router.delete("/:id", [param("id").isInt().withMessage("ID inválido")], validarErrores, deleteAtributo);

module.exports = router;