const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const driverVehiculoController = require('../controllers/driverVehiculoController');

// Ruta para asociar un conductor con un vehículo
router.post(
  '/',
  [
    body('id_driver').isInt().withMessage('El ID del conductor debe ser un número entero'),
    body('id_vehiculo').isInt().withMessage('El ID del vehículo debe ser un número entero'),
  ],
  driverVehiculoController.createDriverVehiculo
);

// Ruta para obtener todas las relaciones conductor-vehículo
router.get('/', driverVehiculoController.getAllDriverVehiculos);

// Ruta para eliminar una relación conductor-vehículo
router.delete(
  '/:id_driver/:id_vehiculo',
  [
    param('id_driver').isInt().withMessage('El ID del conductor debe ser un número entero'),
    param('id_vehiculo').isInt().withMessage('El ID del vehículo debe ser un número entero'),
  ],
  driverVehiculoController.deleteDriverVehiculo
);

module.exports = router;