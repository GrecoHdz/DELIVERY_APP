const MembresiaLocal = require("../models/MembresiaLocales");

// Obtener todas las membresías locales
const getMembresiasLocales = async (req, res) => {
  try {
    const membresias = await MembresiaLocal.findAll();
    res.json(membresias);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las membresías locales", error });
  }
};

// Obtener una membresía local por su ID
const getMembresiaLocalById = async (req, res) => {
  try {
    const membresia = await MembresiaLocal.findByPk(req.params.id);
    if (!membresia) {
      return res.status(404).json({ message: "Membresía local no encontrada" });
    }
    res.json(membresia);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la membresía local", error });
  }
};

// Crear una nueva membresía local
const createMembresiaLocal = async (req, res) => {
  const { nombre_membresia, precio, deliveries_gratuitos, precio_delivery_extra } = req.body;

  try {
    await MembresiaLocal.create({ nombre_membresia, precio, deliveries_gratuitos, precio_delivery_extra });
    res.status(201).json({ message: "Membresía local creada exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "El nombre de la membresía ya existe" });
    }
    res.status(500).json({ message: "Error al crear la membresía local", error });
  }
};

// Actualizar una membresía local
const updateMembresiaLocal = async (req, res) => {
  const { id } = req.params;
  const { nombre_membresia, precio, deliveries_gratuitos, precio_delivery_extra } = req.body;

  try {
    const membresia = await MembresiaLocal.findByPk(id);
    if (!membresia) {
      return res.status(404).json({ message: "Membresía local no encontrada" });
    }

    await membresia.update({ nombre_membresia, precio, deliveries_gratuitos, precio_delivery_extra });
    res.status(200).json({ message: "Membresía local actualizada correctamente" });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "El nombre de la membresía ya existe" });
    }
    res.status(500).json({ message: "Error al actualizar la membresía local", error });
  }
};

// Eliminar una membresía local
const deleteMembresiaLocal = async (req, res) => {
  try {
    const membresia = await MembresiaLocal.findByPk(req.params.id);
    if (!membresia) {
      return res.status(404).json({ message: "Membresía local no encontrada" });
    }

    await membresia.destroy();
    res.status(200).json({ message: "Membresía local eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la membresía local", error });
  }
};

module.exports = {
  getMembresiasLocales,
  getMembresiaLocalById,
  createMembresiaLocal,
  updateMembresiaLocal,
  deleteMembresiaLocal,
};