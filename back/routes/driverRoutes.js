const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const driverController = require('../controllers/driverController');

// Ruta para crear un nuevo conductor
router.post(
  '/',
  [
    body('id_cliente').isInt().withMessage('El ID del cliente debe ser un número entero'),
    body('activo')
      .optional()
      .isBoolean()
      .withMessage('El campo activo debe ser un booleano (true/false)'),
    body('membresia_driver')
      .optional()
      .isDecimal()
      .withMessage('La membresía debe ser un número decimal válido'),
  ],
  driverController.createDriver
);

// Ruta para obtener todos los conductores
router.get('/', driverController.getAllDrivers);

// Ruta para actualizar un conductor
router.put(
  '/:id_driver',
  [
    param('id_driver').isInt().withMessage('El ID del conductor debe ser un número entero'),
    body('activo')
      .optional()
      .isBoolean()
      .withMessage('El campo activo debe ser un booleano (true/false)'),
    body('membresia_driver')
      .optional()
      .isDecimal()
      .withMessage('La membresía debe ser un número decimal válido'),
  ],
  driverController.updateDriver
);

// Ruta para eliminar un conductor
router.delete(
  '/:id_driver',
  [param('id_driver').isInt().withMessage('El ID del conductor debe ser un número entero')],
  driverController.deleteDriver
);

module.exports = router;