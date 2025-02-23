const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllDetalles,
  getDetalleById,
  createDetalle,
  updateDetalle,
  deleteDetalle,
} = require("../controllers/pedidoDetalleController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los detalles de pedidos
router.get("/", getAllDetalles);

// Obtener un detalle de pedido por su ID
router.get("/:id", [param("id").isInt().withMessage("ID inválido")], validarErrores, getDetalleById);

// Crear un nuevo detalle de pedido
router.post(
  "/:id_pedido",
  [
    param("id_pedido").isInt().withMessage("ID de pedido inválido"),
    body("id_producto").isInt().withMessage("ID de producto inválido"),
    body("nombre_producto")
      .notEmpty()
      .withMessage("El nombre del producto es obligatorio")
      .isLength({ max: 255 })
      .withMessage("El nombre del producto no puede exceder los 255 caracteres"),
    body("precio_unitario")
      .isDecimal()
      .withMessage("El precio unitario debe ser un número decimal válido"),
      body("descuento")
       .optional()
       .isDecimal()
      .withMessage("El descuento debe ser un número decimal válido"),
      body("cantidad")
      .isInt({ min: 1 })
      .withMessage("La cantidad debe ser un número entero positivo"),
    body("subtotal")
      .isDecimal()
      .withMessage("El subtotal debe ser un número decimal válido"),
    body("atributos")
      .isObject()
      .withMessage("Los atributos deben ser un objeto JSON válido"),
      body("notas")
      .optional(),
  ],
  validarErrores,
  createDetalle
);

// Actualizar un detalle de pedido
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("ID inválido"),
    body("nombre_producto")
      .optional()
      .notEmpty()
      .withMessage("El nombre del producto es obligatorio")
      .isLength({ max: 255 })
      .withMessage("El nombre del producto no puede exceder los 255 caracteres"),
    body("precio_unitario")
      .optional()
      .isDecimal()
      .withMessage("El precio unitario debe ser un número decimal válido"),
      body("descuento")
      .optional()
      .isDecimal()
     .withMessage("El descuento debe ser un número decimal válido"),
     body("cambiode")
      .optional()
      .isDecimal()
     .withMessage("El descuento debe ser un número decimal válido"),
     body("cantidad")
      .optional()
      .isInt({ min: 1 })
      .withMessage("La cantidad debe ser un número entero positivo"),
    body("subtotal")
      .optional()
      .isDecimal()
      .withMessage("El subtotal debe ser un número decimal válido"),
    body("atributos")
      .optional()
      .isObject()
      .withMessage("Los atributos deben ser un objeto JSON válido"),
      body("notas")
      .optional(),
  ],
  validarErrores,
  updateDetalle
);

// Eliminar un detalle de pedido
router.delete("/:id", [param("id").isInt().withMessage("ID inválido")], validarErrores, deleteDetalle);

module.exports = router;