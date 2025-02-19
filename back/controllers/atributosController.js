const Atributo = require("../models/Atributo");

// Obtener todos los atributos
const getAtributos = async (req, res) => {
  try {
    const atributos = await Atributo.findAll();
    res.json(atributos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los atributos", error });
  }
};

// Obtener un atributo por su ID
const getAtributoById = async (req, res) => {
  try {
    const atributo = await Atributo.findByPk(req.params.id);
    if (!atributo) {
      return res.status(404).json({ message: "Atributo no encontrado" });
    }
    res.json(atributo);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el atributo", error });
  }
};

// Crear un nuevo atributo
const createAtributo = async (req, res) => {
  const { nombre_atributo } = req.body;

  try {
    const atributo = await Atributo.create({
      nombre_atributo,
    });

    res.status(201).json({ message: "Atributo creado exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "El nombre del atributo ya está registrado" });
    }
    res.status(500).json({ message: "Error al crear el atributo", error });
  }
};

// Actualizar un atributo
const updateAtributo = async (req, res) => {
  const { id } = req.params;
  const { nombre_atributo } = req.body;

  try {
    const atributo = await Atributo.findByPk(id);
    if (!atributo) {
      return res.status(404).json({ message: "Atributo no encontrado" });
    }

    await atributo.update({
      nombre_atributo,
    });

    res.status(200).json({ message: "Atributo actualizado correctamente" });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "El nombre del atributo ya está registrado" });
    }
    res.status(500).json({ message: "Error al actualizar el atributo", error });
  }
};

// Eliminar un atributo
const deleteAtributo = async (req, res) => {
  try {
    const atributo = await Atributo.findByPk(req.params.id);
    if (!atributo) {
      return res.status(404).json({ message: "Atributo no encontrado" });
    }

    await atributo.destroy();
    res.status(200).json({ message: "Atributo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el atributo", error });
  }
};

module.exports = {
  getAtributos,
  getAtributoById,
  createAtributo,
  updateAtributo,
  deleteAtributo,
};