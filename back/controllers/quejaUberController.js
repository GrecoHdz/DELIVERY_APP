const QuejaUber = require("../models/QuejaUber");

// Obtener todas las quejas
const getAllQuejasUber = async (req, res) => {
  try {
    const quejas = await QuejaUber.findAll();
    if (!quejas || quejas.length === 0) {
      return res.status(404).json({ message: "No se encontraron quejas" });
    }
    res.json(quejas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las quejas", error });
  }
};

// Obtener una queja por su ID
const getQuejaUberById = async (req, res) => {
  const { id } = req.params;

  try {
    const queja = await QuejaUber.findByPk(id);
    if (!queja) {
      return res.status(404).json({ message: "Queja no encontrada" });
    }
    res.json(queja);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la queja", error });
  }
};

// Crear una nueva queja
const createQuejaUber = async (req, res) => {
    const { id_cliente } = req.params;
    const { id_driver, id_viaje, comentario, imagen_url } = req.body;

  try {
    const queja = await QuejaUber.create({
      id_cliente,
      id_driver,
      id_viaje,
      comentario,
      imagen_url,
    });

    res.status(201).json({ message: "Queja creada exitosamente", data: queja });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_cliente")) {
        return res.status(400).json({ message: "El cliente no existe" });
      }
      if (error.fields.includes("id_driver")) {
        return res.status(400).json({ message: "El driver no existe" });
      }
      if (error.fields.includes("id_viaje")) {
        return res.status(400).json({ message: "El viaje no existe" });
      }
    }
    res.status(500).json({ message: "Error al crear la queja", error });
  }
};

// Actualizar una queja existente
const updateQuejaUber = async (req, res) => {
  const { id } = req.params;
  const { comentario, imagen_url } = req.body;

  try {
    const queja = await QuejaUber.findByPk(id);
    if (!queja) {
      return res.status(404).json({ message: "Queja no encontrada" });
    }

    await queja.update({
      comentario,
      imagen_url,
    });

    res.status(200).json({ message: "Queja actualizada correctamente", data: queja });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la queja", error });
  }
};

// Eliminar una queja
const deleteQuejaUber = async (req, res) => {
  const { id } = req.params;

  try {
    const queja = await QuejaUber.findByPk(id);
    if (!queja) {
      return res.status(404).json({ message: "Queja no encontrada" });
    }

    await queja.destroy();
    res.status(200).json({ message: "Queja eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la queja", error });
  }
};

module.exports = {
  getAllQuejasUber,
  getQuejaUberById,
  createQuejaUber,
  updateQuejaUber,
  deleteQuejaUber,
};