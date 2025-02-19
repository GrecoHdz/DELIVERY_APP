const Vehiculo = require("../models/Vehiculo");

// Obtener todos los vehículos
const getAllVehiculos = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.findAll();
    if (!vehiculos || vehiculos.length === 0) {
      return res.status(404).json({ message: "No se encontraron vehículos" });
    }
    res.json(vehiculos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los vehículos", error });
  }
};

// Obtener un vehículo por su ID
const getVehiculoById = async (req, res) => {
  const { id } = req.params;

  try {
    const vehiculo = await Vehiculo.findByPk(id);
    if (!vehiculo) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }
    res.json(vehiculo);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el vehículo", error });
  }
};

// Crear un nuevo vehículo
const createVehiculo = async (req, res) => {
  const { tipo_vehiculo, capacidad, marca, modelo, anio, imagen_url, disponible_para_renta } = req.body;

  try {
    const vehiculo = await Vehiculo.create({
      tipo_vehiculo,
      capacidad,
      marca,
      modelo,
      anio,
      imagen_url,
      disponible_para_renta,
    });

    res.status(201).json({ message: "Vehículo creado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el vehículo", error });
  }
};

// Actualizar un vehículo
const updateVehiculo = async (req, res) => {
  const { id } = req.params;
  const { tipo_vehiculo, capacidad, marca, modelo, anio, imagen_url, disponible_para_renta } = req.body;

  try {
    const vehiculo = await Vehiculo.findByPk(id);
    if (!vehiculo) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }

    await vehiculo.update({
      tipo_vehiculo,
      capacidad,
      marca,
      modelo,
      anio,
      imagen_url,
      disponible_para_renta,
    });

    res.status(200).json({ message: "Vehículo actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el vehículo", error });
  }
};

// Eliminar un vehículo
const deleteVehiculo = async (req, res) => {
  const { id } = req.params;

  try {
    const vehiculo = await Vehiculo.findByPk(id);
    if (!vehiculo) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }

    await vehiculo.destroy();
    res.status(200).json({ message: "Vehículo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el vehículo", error });
  }
};

module.exports = {
  getAllVehiculos,
  getVehiculoById,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo,
};