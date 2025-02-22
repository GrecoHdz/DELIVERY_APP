const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  getAllPedidos,
  getPedidoById,
  createPedido,
  updatePedido,
  deletePedido,
} = require("../controllers/pedidoController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todos los pedidos
router.get("/", getAllPedidos);

// Obtener un pedido por su ID
router.get("/:id", [param("id").isInt().withMessage("ID inválido")], validarErrores, getPedidoById);

// Crear un nuevo pedido
router.post(
  "/:id_cliente",
  [
    param("id_cliente").isInt().withMessage("ID de cliente inválido"),
    body("id_local").isInt().withMessage("ID de local inválido"),
    body("id_direccion_cliente").isInt().withMessage("ID de dirección de cliente inválido"),
    body("notas").optional(),
    body("id_direccion_local").isInt().withMessage("ID de dirección de local inválido"),
    body("fecha_pedido").isISO8601().withMessage("La fecha del pedido debe ser válida"),
  ],
  validarErrores,
  createPedido
);

// Actualizar un pedido
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("ID inválido"),
    body("id_driver")
      .optional()
      .isInt()
      .withMessage("ID de driver inválido"),
    body("tiempo_preparacion_estimado")
      .optional()
      .isInt()
      .withMessage("El tiempo de preparación debe ser un número entero"),
    body("tiempo_llegada_estimado")
      .optional()
      .isInt()
      .withMessage("El tiempo de llegada debe ser un número entero"),
    body("fecha_entrega")
      .optional()
      .isISO8601()
      .withMessage("La fecha de entrega debe ser válida"),
    body("estado_pedido")
      .optional()
      .isIn(["pendiente_local", "pendiente_deposito", "preparando_pedido", "en_camino", "entregado"])
      .withMessage("Estado no válido"),
  ],
  validarErrores,
  updatePedido
);

// Eliminar un pedido
router.delete("/:id", [param("id").isInt().withMessage("ID inválido")], validarErrores, deletePedido);

module.exports = router;