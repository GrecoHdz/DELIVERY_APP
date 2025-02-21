const MembresiaDriver = require("../models/MembresiaDriver");

// Obtener todas las membresías de drivers
const getAllMembresias = async (req, res) => {
  try {
    const membresias = await MembresiaDriver.findAll();
    if (!membresias || membresias.length === 0) {
      return res.status(404).json({ message: "No se encontraron membresías de drivers" });
    }
    res.json(membresias);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las membresías de drivers", error });
  }
};

// Obtener una membresía por su ID
const getMembresiaById = async (req, res) => {
  const { id } = req.params;

  try {
    const membresia = await MembresiaDriver.findByPk(id);
    if (!membresia) {
      return res.status(404).json({ message: "Membresía no encontrada" });
    }
    res.json(membresia);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la membresía", error });
  }
};

// Crear una nueva membresía
const createMembresia = async (req, res) => {
  const { id_driver } = req.params;
  const { saldo_solicitado, comprobante } = req.body;

  try {
    const membresia = await MembresiaDriver.create({
      id_driver,
      saldo_solicitado,
      comprobante,
    });

    res.status(201).json({ message: "Membresía creada exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ message: "El driver no existe" });
    }
    res.status(500).json({ message: "Error al crear la membresía", error });
  }
};

// Actualizar una membresía
const updateMembresia = async (req, res) => {
  const { id } = req.params;
  const { saldo_solicitado, comprobante } = req.body;

  try {
    const membresia = await MembresiaDriver.findByPk(id);
    if (!membresia) {
      return res.status(404).json({ message: "Membresía no encontrada" });
    }

    await membresia.update({
      saldo_solicitado,
      comprobante,
    });

    res.status(200).json({ message: "Membresía actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la membresía", error });
  }
};

// Eliminar una membresía
const deleteMembresia = async (req, res) => {
  const { id } = req.params;

  try {
    const membresia = await MembresiaDriver.findByPk(id);
    if (!membresia) {
      return res.status(404).json({ message: "Membresía no encontrada" });
    }

    await membresia.destroy();
    res.status(200).json({ message: "Membresía eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la membresía", error });
  }
};

module.exports = {
  getAllMembresias,
  getMembresiaById,
  createMembresia,
  updateMembresia,
  deleteMembresia,
};