const Extra = require("../models/Extra");

// Obtener todos los extras
const getExtras = async (req, res) => {
  try {
    const extras = await Extra.findAll();
    res.json(extras);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los extras", error });
  }
};

// Obtener un extra por su ID
const getExtraById = async (req, res) => {
  try {
    const extra = await Extra.findByPk(req.params.id);
    if (!extra) {
      return res.status(404).json({ message: "Extra no encontrado" });
    }
    res.json(extra);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el extra", error });
  }
};

// Crear un nuevo extra
const createExtra = async (req, res) => {
  const { nombre, precio } = req.body;

  try {
    await Extra.create({ nombre, precio });
    res.status(201).json({ message: "Extra creado exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "El nombre del extra ya existe" });
    }
    res.status(500).json({ message: "Error al crear el extra", error });
  }
};

// Actualizar un extra
const updateExtra = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio } = req.body;

  try {
    const extra = await Extra.findByPk(id);
    if (!extra) {
      return res.status(404).json({ message: "Extra no encontrado" });
    }

    await extra.update({ nombre, precio });
    res.status(200).json({ message: "Extra actualizado correctamente" });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "El nombre del extra ya existe" });
    }
    res.status(500).json({ message: "Error al actualizar el extra", error });
  }
};

// Eliminar un extra
const deleteExtra = async (req, res) => {
  try {
    const extra = await Extra.findByPk(req.params.id);
    if (!extra) {
      return res.status(404).json({ message: "Extra no encontrado" });
    }

    await extra.destroy();
    res.status(200).json({ message: "Extra eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el extra", error });
  }
};

module.exports = {
  getExtras,
  getExtraById,
  createExtra,
  updateExtra,
  deleteExtra,
};