const { validationResult } = require('express-validator');
const DriverVehiculo = require('../models/DriverVehiculo');

// Asociar un conductor con un vehículo
exports.createDriverVehiculo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_driver, id_vehiculo } = req.body;

    // Verificar si la relación ya existe
    const existingRelation = await DriverVehiculo.findOne({ where: { id_driver, id_vehiculo } });
    if (existingRelation) {
      return res.status(400).json({ error: 'La relación conductor-vehículo ya existe' });
    }

    const driverVehiculo = await DriverVehiculo.create({ id_driver, id_vehiculo });
    res.status(201).json(driverVehiculo);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la relación conductor-vehículo' });
  }
};

// Obtener todas las relaciones conductor-vehículo
exports.getAllDriverVehiculos = async (req, res) => {
  try {
    const driverVehiculos = await DriverVehiculo.findAll();
    res.status(200).json(driverVehiculos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las relaciones conductor-vehículo' });
  }
};

// Eliminar una relación conductor-vehículo
exports.deleteDriverVehiculo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_driver, id_vehiculo } = req.params;

    const driverVehiculo = await DriverVehiculo.findOne({ where: { id_driver, id_vehiculo } });
    if (!driverVehiculo) {
      return res.status(404).json({ error: 'Relación conductor-vehículo no encontrada' });
    }

    await driverVehiculo.destroy();
    res.status(200).json({ message: 'Relación conductor-vehículo eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la relación conductor-vehículo' });
  }
};