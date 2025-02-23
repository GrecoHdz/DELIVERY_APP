const QuejaCliente = require("../models/QuejaCliente");

// Obtener todas las quejas
const getAllQuejasClientes = async (req, res) => {
  try {
    const quejas = await QuejaCliente.findAll();
    if (!quejas || quejas.length === 0) {
      return res.status(404).json({ message: "No se encontraron quejas" });
    }
    res.json(quejas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las quejas", error });
  }
};

// Obtener una queja por su ID
const getQuejaClienteById = async (req, res) => {
  const { id } = req.params;

  try {
    const queja = await QuejaCliente.findByPk(id);
    if (!queja) {
      return res.status(404).json({ message: "Queja no encontrada" });
    }
    res.json(queja);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la queja", error });
  }
};

// Crear una nueva queja
const createQuejaCliente = async (req, res) => {
  const { id_driver } = req.params;
  const { id_cliente, id_viaje, comentario, imagen_url } = req.body;

  try {
    const queja = await QuejaCliente.create({
      id_driver,
      id_cliente,
      id_viaje,
      comentario,
      imagen_url,
    });

    res.status(201).json({ message: "Queja creada exitosamente", data: queja });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_driver")) {
        return res.status(400).json({ message: "El driver no existe" });
      }
      if (error.fields.includes("id_cliente")) {
        return res.status(400).json({ message: "El cliente no existe" });
      }
      if (error.fields.includes("id_viaje")) {
        return res.status(400).json({ message: "El viaje no existe" });
      }
    }
    res.status(500).json({ message: "Error al crear la queja", error });
  }
};

// Actualizar una queja existente
const updateQuejaCliente = async (req, res) => {
  const { id } = req.params;
  const { comentario, imagen_url } = req.body;

  try {
    const queja = await QuejaCliente.findByPk(id);
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
const deleteQuejaCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const queja = await QuejaCliente.findByPk(id);
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
  getAllQuejasClientes,
  getQuejaClienteById,
  createQuejaCliente,
  updateQuejaCliente,
  deleteQuejaCliente,
};