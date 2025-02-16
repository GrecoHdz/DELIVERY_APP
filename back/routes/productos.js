const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getProductosByLocal,
  createProducto,
  updateProducto,
  deleteProducto,
} = require("../controllers/productosController");

const router = express.Router();

// Middleware para validar errores
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los productos de un local
router.get(
  "/local/:id_local",
  [param("id_local").isInt().withMessage("El ID del local debe ser un número entero")],
  validarErrores,
  getProductosByLocal
);

// Crear un nuevo producto
router.post(
  "/",
  [
    body("id_local")
      .isInt()
      .withMessage("El ID del local debe ser un número entero"),
    body("id_subcategoria")
      .optional()
      .isInt()
      .withMessage("El ID de la subcategoría debe ser un número entero"),
    body("nombre_producto")
      .notEmpty()
      .withMessage("El nombre del producto es obligatorio")
      .isLength({ max: 255 })
      .withMessage("El nombre del producto no puede exceder los 255 caracteres"),
    body("descripcion_producto")
      .optional()
      .isLength({ max: 1000 })
      .withMessage("La descripción del producto no puede exceder los 1000 caracteres"),
    body("precio")
      .isDecimal()
      .withMessage("El precio debe ser un número decimal"),
    body("imagen_url")
      .optional()
      .isURL()
      .withMessage("La URL de la imagen debe ser válida"),
  ],
  validarErrores,
  createProducto
);

// Actualizar un producto
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID del producto debe ser un número entero"),
    body("id_subcategoria")
      .optional()
      .isInt()
      .withMessage("El ID de la subcategoría debe ser un número entero"),
    body("nombre_producto")
      .optional()
      .isLength({ max: 255 })
      .withMessage("El nombre del producto no puede exceder los 255 caracteres"),
    body("descripcion_producto")
      .optional()
      .isLength({ max: 1000 })
      .withMessage("La descripción del producto no puede exceder los 1000 caracteres"),
    body("precio")
      .optional()
      .isDecimal()
      .withMessage("El precio debe ser un número decimal"),
    body("imagen_url")
      .optional()
      .isURL()
      .withMessage("La URL de la imagen debe ser válida"),
    body("activo")
      .optional()
      .isBoolean()
      .withMessage("El campo 'activo' debe ser un valor booleano"),
  ],
  validarErrores,
  updateProducto
);

// Eliminar un producto
router.delete(
  "/:id",
  [param("id").isInt().withMessage("El ID del producto debe ser un número entero")],
  validarErrores,
  deleteProducto
);

module.exports = router;