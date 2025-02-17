const { validationResult } = require('express-validator');
const MembresiaDriver = require('../models/MembresiaDriver');

// Crear una nueva membresía para un conductor
exports.createMembresiaDriver = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_driver, saldo_solicitado, comprobante } = req.body;

    const membresiaDriver = await MembresiaDriver.create({
      id_driver,
      saldo_solicitado,
      comprobante,
    });

    res.status(201).json(membresiaDriver);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la membresía del conductor' });
  }
};

// Obtener todas las membresías de conductores
exports.getAllMembresiasDrivers = async (req, res) => {
  try {
    const membresiasDrivers = await MembresiaDriver.findAll();
    res.status(200).json(membresiasDrivers);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las membresías de los conductores' });
  }
};

// Actualizar una membresía de conductor
exports.updateMembresiaDriver = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_membresia } = req.params;
    const { saldo_solicitado, comprobante } = req.body;

    const membresiaDriver = await MembresiaDriver.findByPk(id_membresia);
    if (!membresiaDriver) {
      return res.status(404).json({ error: 'Membresía del conductor no encontrada' });
    }

    if (saldo_solicitado !== undefined) membresiaDriver.saldo_solicitado = saldo_solicitado;
    if (comprobante !== undefined) membresiaDriver.comprobante = comprobante;

    await membresiaDriver.save();
    res.status(200).json(membresiaDriver);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la membresía del conductor' });
  }
};

// Eliminar una membresía de conductor
exports.deleteMembresiaDriver = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_membresia } = req.params;

    const membresiaDriver = await MembresiaDriver.findByPk(id_membresia);
    if (!membresiaDriver) {
      return res.status(404).json({ error: 'Membresía del conductor no encontrada' });
    }

    await membresiaDriver.destroy();
    res.status(200).json({ message: 'Membresía del conductor eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la membresía del conductor' });
  }
};