const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const vehiculoController = require('../controllers/vehiculoController');

// Ruta para crear un nuevo vehículo
router.post(
  '/',
  [
    body('tipo_vehiculo')
      .isIn(['auto', 'moto', 'bicicleta', 'camion'])
      .withMessage('El tipo de vehículo debe ser uno de los siguientes: auto, moto, bicicleta, camion'),
    body('capacidad').optional().isInt({ min: 1 }).withMessage('La capacidad debe ser un número entero positivo'),
    body('marca').notEmpty().withMessage('La marca es obligatoria'),
    body('modelo').notEmpty().withMessage('El modelo es obligatorio'),
    body('anio').isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage(`El año debe ser un número entre 1900 y ${new Date().getFullYear()}`),
    body('imagen_url').optional().isURL().withMessage('La URL de la imagen debe ser válida'),
    body('disponible_para_renta').optional().isBoolean().withMessage('El campo disponible_para_renta debe ser un booleano'),
  ],
  vehiculoController.createVehiculo
);

// Ruta para obtener todos los vehículos
router.get('/', vehiculoController.getAllVehiculos);

// Ruta para actualizar un vehículo
router.put(
  '/:id_vehiculo',
  [
    param('id_vehiculo').isInt().withMessage('El ID del vehículo debe ser un número entero'),
    body('tipo_vehiculo')
      .optional()
      .isIn(['auto', 'moto', 'bicicleta', 'camion'])
      .withMessage('El tipo de vehículo debe ser uno de los siguientes: auto, moto, bicicleta, camion'),
    body('capacidad').optional().isInt({ min: 1 }).withMessage('La capacidad debe ser un número entero positivo'),
    body('marca').optional().notEmpty().withMessage('La marca es obligatoria'),
    body('modelo').optional().notEmpty().withMessage('El modelo es obligatorio'),
    body('anio').optional().isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage(`El año debe ser un número entre 1900 y ${new Date().getFullYear()}`),
    body('imagen_url').optional().isURL().withMessage('La URL de la imagen debe ser válida'),
    body('disponible_para_renta').optional().isBoolean().withMessage('El campo disponible_para_renta debe ser un booleano'),
  ],
  vehiculoController.updateVehiculo
);

// Ruta para eliminar un vehículo
router.delete(
  '/:id_vehiculo',
  [param('id_vehiculo').isInt().withMessage('El ID del vehículo debe ser un número entero')],
  vehiculoController.deleteVehiculo
);

module.exports = router;