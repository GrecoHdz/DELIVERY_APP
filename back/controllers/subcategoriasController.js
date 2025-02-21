const Subcategoria = require("../models/Subcategoria");

// Obtener todas las subcategorías
const getSubcategorias = async (req, res) => {
  try {
    const subcategorias = await Subcategoria.findAll();
    res.json(subcategorias);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las subcategorías", error });
  }
};

// Obtener una subcategoría por su ID
const getSubcategoriaById = async (req, res) => {
  try {
    const subcategoria = await Subcategoria.findByPk(req.params.id);
    if (!subcategoria) {
      return res.status(404).json({ message: "Subcategoría no encontrada" });
    }
    res.json(subcategoria);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la subcategoría", error });
  }
};

// Crear una nueva subcategoría
const createSubcategoria = async (req, res) => {
  const { id_categoria } = req.params;
  const { nombre_subcategoria } = req.body;

  try {
    const nuevaSubcategoria = await Subcategoria.create({ nombre_subcategoria, id_categoria });
    res.status(201).json({ 
      message: "Subcategoría creada exitosamente"
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "El nombre de la subcategoría ya existe" });
    }
    res.status(500).json({ message: "Error al crear la subcategoría", error });
  }
};

// Actualizar una subcategoría
const updateSubcategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre_subcategoria, id_categoria } = req.body;

  try {
    const subcategoria = await Subcategoria.findByPk(id);
    if (!subcategoria) {
      return res.status(404).json({ message: "Subcategoría no encontrada" });
    }

    await subcategoria.update({ nombre_subcategoria, id_categoria });
    res.status(200).json({ 
      message: "Subcategoría actualizada correctamente"
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "El nombre de la subcategoría ya existe" });
    }
    res.status(500).json({ message: "Error al actualizar la subcategoría", error });
  }
};

// Eliminar una subcategoría
const deleteSubcategoria = async (req, res) => {
  try {
    const subcategoria = await Subcategoria.findByPk(req.params.id);
    if (!subcategoria) {
      return res.status(404).json({ message: "Subcategoría no encontrada" });
    }

    await subcategoria.destroy();
    res.status(200).json({ message: "Subcategoría eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la subcategoría", error });
  }
};

module.exports = {
  getSubcategorias,
  getSubcategoriaById,
  createSubcategoria,
  updateSubcategoria,
  deleteSubcategoria,
};