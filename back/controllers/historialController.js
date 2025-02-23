const Historial = require("../models/Historial");

// Obtener todos los registros de historial
const getAllHistorial = async (req, res) => {
  try {
    const historial = await Historial.findAll();
    if (!historial || historial.length === 0) {
      return res.status(404).json({ message: "No se encontraron registros de historial" });
    }
    res.json(historial);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los registros de historial", error });
  }
};

// Obtener un registro de historial por su ID
const getHistorialById = async (req, res) => {
  const { id } = req.params;

  try {
    const registro = await Historial.findByPk(id);
    if (!registro) {
      return res.status(404).json({ message: "Registro de historial no encontrado" });
    }
    res.json(registro);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el registro de historial", error });
  }
};

// Crear un nuevo registro de historial
const createHistorial = async (req, res) => {
    const { id_cliente } = req.params;
    const {
    tipo_historial,
    id_referencia,
    id_driver,
    id_vehiculo,
    id_local,
    direccion_recogida,
    direccion_destino,
    fecha_inicio,
    fecha_fin,
    precio,
  } = req.body;

  try {
    const registro = await Historial.create({
      tipo_historial,
      id_referencia,
      id_cliente,
      id_driver,
      id_vehiculo,
      id_local,
      direccion_recogida,
      direccion_destino,
      fecha_inicio,
      fecha_fin,
      precio,
    });

    res.status(201).json({ message: "Registro de historial creado exitosamente", data: registro });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_cliente")) {
        return res.status(400).json({ message: "El cliente no existe" });
      }
      if (error.fields.includes("id_driver")) {
        return res.status(400).json({ message: "El driver no existe" });
      }
      if (error.fields.includes("id_vehiculo")) {
        return res.status(400).json({ message: "El vehículo no existe" });
      }
      if (error.fields.includes("id_local")) {
        return res.status(400).json({ message: "El local no existe" });
      }
    }
    res.status(500).json({ message: "Error al crear el registro de historial", error });
  }
};

// Actualizar un registro de historial existente
const updateHistorial = async (req, res) => {
  const { id } = req.params;
  const {
    tipo_historial,
    id_referencia,
    id_driver,
    id_vehiculo,
    id_local,
    direccion_recogida,
    direccion_destino,
    fecha_inicio,
    fecha_fin,
    precio,
  } = req.body;

  try {
    const registro = await Historial.findByPk(id);
    if (!registro) {
      return res.status(404).json({ message: "Registro de historial no encontrado" });
    }

    await registro.update({
      tipo_historial,
      id_referencia,
      id_driver,
      id_vehiculo,
      id_local,
      direccion_recogida,
      direccion_destino,
      fecha_inicio,
      fecha_fin,
      precio,
    });

    res.status(200).json({ message: "Registro de historial actualizado correctamente", data: registro });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el registro de historial", error });
  }
};

// Eliminar un registro de historial
const deleteHistorial = async (req, res) => {
  const { id } = req.params;

  try {
    const registro = await Historial.findByPk(id);
    if (!registro) {
      return res.status(404).json({ message: "Registro de historial no encontrado" });
    }

    await registro.destroy();
    res.status(200).json({ message: "Registro de historial eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el registro de historial", error });
  }
};

module.exports = {
  getAllHistorial,
  getHistorialById,
  createHistorial,
  updateHistorial,
  deleteHistorial,
};