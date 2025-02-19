const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
} = require("../controllers/productoController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los productos
router.get("/", getProductos);

// Obtener un producto por su ID
router.get(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  getProductoById
);

// Crear un nuevo producto
router.post(
  "/",
  [
    body("id_local")
      .isInt()
      .withMessage("El ID del local debe ser un número entero"),
    body("nombre_producto")
      .notEmpty()
      .withMessage("El nombre del producto es obligatorio")
      .isLength({ max: 255 })
      .withMessage("El nombre del producto no puede exceder los 255 caracteres"),
    body("precio")
      .isDecimal()
      .withMessage("El precio debe ser un número decimal válido"),
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
  createProducto
);

// Actualizar un producto
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser un número entero"),
    body("id_local")
      .optional()
      .isInt()
      .withMessage("El ID del local debe ser un número entero"),
    body("nombre_producto")
      .optional()
      .isLength({ max: 255 })
      .withMessage("El nombre del producto no puede exceder los 255 caracteres"),
    body("precio")
      .optional()
      .isDecimal()
      .withMessage("El precio debe ser un número decimal válido"),
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
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  validarErrores,
  deleteProducto
);

module.exports = router;