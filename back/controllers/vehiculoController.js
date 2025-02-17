const { validationResult } = require('express-validator');
const Vehiculo = require('../models/Vehiculo');

// Crear un nuevo vehículo
exports.createVehiculo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { tipo_vehiculo, capacidad, marca, modelo, anio, imagen_url, disponible_para_renta } = req.body;

    const vehiculo = await Vehiculo.create({
      tipo_vehiculo,
      capacidad,
      marca,
      modelo,
      anio,
      imagen_url,
      disponible_para_renta,
    });

    res.status(201).json(vehiculo);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el vehículo' });
  }
};

// Obtener todos los vehículos
exports.getAllVehiculos = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.findAll();
    res.status(200).json(vehiculos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los vehículos' });
  }
};

// Actualizar un vehículo
exports.updateVehiculo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_vehiculo } = req.params;
    const { tipo_vehiculo, capacidad, marca, modelo, anio, imagen_url, disponible_para_renta } = req.body;

    const vehiculo = await Vehiculo.findByPk(id_vehiculo);
    if (!vehiculo) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    if (tipo_vehiculo !== undefined) vehiculo.tipo_vehiculo = tipo_vehiculo;
    if (capacidad !== undefined) vehiculo.capacidad = capacidad;
    if (marca !== undefined) vehiculo.marca = marca;
    if (modelo !== undefined) vehiculo.modelo = modelo;
    if (anio !== undefined) vehiculo.anio = anio;
    if (imagen_url !== undefined) vehiculo.imagen_url = imagen_url;
    if (disponible_para_renta !== undefined) vehiculo.disponible_para_renta = disponible_para_renta;

    await vehiculo.save();
    res.status(200).json(vehiculo);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el vehículo' });
  }
};

// Eliminar un vehículo
exports.deleteVehiculo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_vehiculo } = req.params;

    const vehiculo = await Vehiculo.findByPk(id_vehiculo);
    if (!vehiculo) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    await vehiculo.destroy();
    res.status(200).json({ message: 'Vehículo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el vehículo' });
  }
};