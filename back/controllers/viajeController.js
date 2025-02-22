const Viaje = require("../models/Viaje");

// Obtener todos los viajes
const getAllViajes = async (req, res) => {
  try {
    const viajes = await Viaje.findAll();
    if (!viajes || viajes.length === 0) {
      return res.status(404).json({ message: "No se encontraron viajes" });
    }
    res.json(viajes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los viajes", error });
  }
};

// Obtener un viaje por su ID
const getViajeById = async (req, res) => {
  const { id } = req.params;

  try {
    const viaje = await Viaje.findByPk(id);
    if (!viaje) {
      return res.status(404).json({ message: "Viaje no encontrado" });
    }
    res.json(viaje);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el viaje", error });
  }
};

// Crear un nuevo viaje
const createViaje = async (req, res) => {
    const { id_cliente } = req.params;
    const {
    direccion_recogida,
    direccion_destino, 
  } = req.body;

  try {
    const viaje = await Viaje.create({
      id_cliente,
      direccion_recogida,
      direccion_destino, 
    });

    res.status(201).json({ message: "Viaje creado exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ message: "El cliente no existe" });
    }
    res.status(500).json({ message: "Error al crear el viaje", error });
  }
};

// Actualizar un viaje
const updateViaje = async (req, res) => {
  const { id } = req.params;
  const {
    id_driver,
    id_vehiculo,
    tiempo_llegada_estimado,
    fecha_inicio,
    fecha_fin,
    estado,
    precio,
  } = req.body;

  try {
    const viaje = await Viaje.findByPk(id);
    if (!viaje) {
      return res.status(404).json({ message: "Viaje no encontrado" });
    }

    await viaje.update({
      id_driver,
      id_vehiculo,
      tiempo_llegada_estimado,
      fecha_inicio,
      fecha_fin,
      estado,
      precio,
    });

    res.status(200).json({ message: "Viaje actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el viaje", error });
  }
};

// Eliminar un viaje
const deleteViaje = async (req, res) => {
  const { id } = req.params;

  try {
    const viaje = await Viaje.findByPk(id);
    if (!viaje) {
      return res.status(404).json({ message: "Viaje no encontrado" });
    }

    await viaje.destroy();
    res.status(200).json({ message: "Viaje eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el viaje", error });
  }
};

module.exports = {
  getAllViajes,
  getViajeById,
  createViaje,
  updateViaje,
  deleteViaje,
};