const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const productoExtraController = require('../controllers/productoExtraController');

// Ruta para crear una nueva relación Producto-Extra
router.post(
  '/',
  [
    body('id_producto').isInt().withMessage('El ID del producto debe ser un número entero'),
    body('id_extra').isInt().withMessage('El ID del extra debe ser un número entero'),
    body('activo')
      .optional()
      .isBoolean()
      .withMessage('El campo activo debe ser un booleano (true/false)'),
  ],
  productoExtraController.createProductoExtra
);

// Ruta para obtener todas las relaciones Producto-Extra
router.get('/', productoExtraController.getAllProductoExtras);

// Ruta para actualizar una relación Producto-Extra
router.put(
  '/:id_producto/:id_extra',
  [
    param('id_producto').isInt().withMessage('El ID del producto debe ser un número entero'),
    param('id_extra').isInt().withMessage('El ID del extra debe ser un número entero'),
    body('activo')
      .optional()
      .isBoolean()
      .withMessage('El campo activo debe ser un booleano (true/false)'),
  ],
  productoExtraController.updateProductoExtra
);

// Ruta para eliminar una relación Producto-Extra
router.delete(
  '/:id_producto/:id_extra',
  [
    param('id_producto').isInt().withMessage('El ID del producto debe ser un número entero'),
    param('id_extra').isInt().withMessage('El ID del extra debe ser un número entero'),
  ],
  productoExtraController.deleteProductoExtra
);

module.exports = router;