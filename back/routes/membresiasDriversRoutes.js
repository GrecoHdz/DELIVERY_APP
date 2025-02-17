const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const membresiaDriverController = require('../controllers/membresiaDriverController');

// Ruta para crear una nueva membresía para un conductor
router.post(
  '/',
  [
    body('id_driver').isInt().withMessage('El ID del conductor debe ser un número entero'),
    body('saldo_solicitado')
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('El saldo solicitado debe ser un número decimal válido (hasta 2 decimales)'),
    body('comprobante').isURL().withMessage('El comprobante debe ser una URL válida'),
  ],
  membresiaDriverController.createMembresiaDriver
);

// Ruta para obtener todas las membresías de conductores
router.get('/', membresiaDriverController.getAllMembresiasDrivers);

// Ruta para actualizar una membresía de conductor
router.put(
  '/:id_membresia',
  [
    param('id_membresia').isInt().withMessage('El ID de la membresía debe ser un número entero'),
    body('saldo_solicitado')
      .optional()
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('El saldo solicitado debe ser un número decimal válido (hasta 2 decimales)'),
    body('comprobante').optional().isURL().withMessage('El comprobante debe ser una URL válida'),
  ],
  membresiaDriverController.updateMembresiaDriver
);

// Ruta para eliminar una membresía de conductor
router.delete(
  '/:id_membresia',
  [param('id_membresia').isInt().withMessage('El ID de la membresía debe ser un número entero')],
  membresiaDriverController.deleteMembresiaDriver
);

module.exports = router;