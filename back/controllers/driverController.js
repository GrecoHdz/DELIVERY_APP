const { validationResult } = require('express-validator');
const Driver = require('../models/Driver');

// Crear un nuevo conductor
exports.createDriver = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_cliente, activo, membresia_driver } = req.body;

    // Verificar si el cliente ya está registrado como conductor
    const existingDriver = await Driver.findOne({ where: { id_cliente } });
    if (existingDriver) {
      return res.status(400).json({ error: 'El cliente ya está registrado como conductor' });
    }

    const driver = await Driver.create({ id_cliente, activo, membresia_driver });
    res.status(201).json(driver);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el conductor' });
  }
};

// Obtener todos los conductores
exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.findAll();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los conductores' });
  }
};

// Actualizar un conductor
exports.updateDriver = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_driver } = req.params;
    const { activo, membresia_driver } = req.body;

    const driver = await Driver.findByPk(id_driver);
    if (!driver) {
      return res.status(404).json({ error: 'Conductor no encontrado' });
    }

    if (activo !== undefined) driver.activo = activo;
    if (membresia_driver !== undefined) driver.membresia_driver = membresia_driver;

    await driver.save();
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el conductor' });
  }
};

// Eliminar un conductor
exports.deleteDriver = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_driver } = req.params;

    const driver = await Driver.findByPk(id_driver);
    if (!driver) {
      return res.status(404).json({ error: 'Conductor no encontrado' });
    }

    await driver.destroy();
    res.status(200).json({ message: 'Conductor eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el conductor' });
  }
};