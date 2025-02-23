const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllExtrasByProducto,
  createProductoExtra,
  updateProductoExtra,
  deleteProductoExtra,
} = require("../controllers/productoExtraController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los extras de un producto
router.get(
  "/:id_producto", 
  [
    param("id_producto")
    .isInt()
    .withMessage("ID inválido")
  ], 
  validarErrores, 
  getAllExtrasByProducto
  );

// Crear un nuevo extra para un producto
router.post(
  "/:id_producto",
  [
    param("id_producto")
    .isInt()
    .withMessage("ID inválido"),
    body("nombre")
      .notEmpty()
      .withMessage("El nombre es obligatorio")
      .isLength({ max: 55 })
      .withMessage("El nombre no puede exceder los 55 caracteres"),
    body("precio")
      .isDecimal()
      .withMessage("El precio debe ser un número decimal válido"), 
  ],
  validarErrores,
  createProductoExtra
);

// Actualizar un extra de un producto
router.put(
  "/:id_producto",
  [
    param("id_producto").isInt().withMessage("ID de producto inválido"),
    param("nombre")
      .notEmpty()
      .withMessage("El nombre es obligatorio")
      .isLength({ max: 55 })
      .withMessage("El nombre no puede exceder los 55 caracteres"),
    body("precio")
      .optional()
      .isDecimal()
      .withMessage("El precio debe ser un número decimal válido"),
    body("activo")
      .optional()
      .isBoolean()
      .withMessage("El campo 'activo' debe ser un valor booleano"),
  ],
  validarErrores,
  updateProductoExtra
);

// Eliminar un extra de un producto
router.delete("/:id_producto", [param("id_producto").isInt().withMessage("ID inválido"), param("nombre").notEmpty().withMessage("El nombre es obligatorio")], validarErrores, deleteProductoExtra);

module.exports = router;