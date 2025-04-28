const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
 // getAllProductosBySucursal,
  getSucursalesByProducto,
  getAllProductosBySucursal,
  createProductoSucursal,
  updateProductoSucursal,
  deleteProductoSucursal,
} = require("../controllers/productoSucursalController");

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};
// Obtener todas las sucursales de un producto
router.get("/:id_producto", [param("id_producto").isInt().withMessage("ID de producto inválido")], validarErrores, getSucursalesByProducto);

// Obtener todos los productos de una sucursal
router.get("/sucursal/:id_direccion_local", [param("id_direccion_local").isInt().withMessage("ID inválido")], validarErrores, getAllProductosBySucursal);

// Crear un nuevo producto en una sucursal
router.post(
  "/:id_producto",
  [
    param("id_producto").isInt().withMessage("ID de producto inválido"),
    body("id_direccion_local").isInt().withMessage("ID de dirección de local inválido"),
    body("precio")
      .optional()
      .isDecimal()
      .withMessage("El precio debe ser un número decimal válido"),
  ],
  validarErrores,
  createProductoSucursal
);

// Actualizar un producto en una sucursal
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("ID inválido"),
    body("id_producto")
      .optional()
      .isInt()
      .withMessage("ID de producto inválido"),
    body("id_direccion_local")
      .optional()
      .isInt()
      .withMessage("ID de dirección de local inválido"),
    body("precio")
      .optional()
      .isDecimal()
      .withMessage("El precio debe ser un número decimal válido"),
    body("preciooferta")
      .optional()
      .custom((value) => {
        // Permitir null, cadena vacía o un número decimal válido
        if (value === null || value === '') {
          return true;
        }
        const num = parseFloat(value);
        if (isNaN(num)) {
          throw new Error('El precio de oferta debe ser un número decimal válido');
        }
        return true;
      }),
    body("activo")
      .optional()
      .isBoolean()
      .withMessage("El campo 'activo' debe ser un valor booleano"),
  ],
  validarErrores,
  updateProductoSucursal
);

// Eliminar un producto de una sucursal
router.delete("/:id", [param("id").isInt().withMessage("ID inválido")], validarErrores, deleteProductoSucursal);

module.exports = router;