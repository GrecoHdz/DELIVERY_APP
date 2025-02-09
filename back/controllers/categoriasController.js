const Categoria = require("../models/Categoria");

// Obtener todas las categorías
const getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las categorías", error });
  }
};

// Obtener una categoría por su ID
const getCategoriaById = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la categoría", error });
  }
};

// Crear una nueva categoría
const createCategoria = async (req, res) => {
  const { nombre_categoria } = req.body;

  try {
    const nuevaCategoria = await Categoria.create({ nombre_categoria });
    res.status(201).json({ message: "Categoría creada correctamente" });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "El nombre de la categoría ya existe" });
    }
    res.status(500).json({ message: "Error al crear la categoría", error });
  }
};

// Actualizar una categoría
const updateCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre_categoria } = req.body;

  try {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    await categoria.update({ nombre_categoria });
    res.json({ message: "Categoría actualizada correctamente" });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "El nombre de la categoría ya existe" });
    }
    res.status(500).json({ message: "Error al actualizar la categoría", error });
  }
};

// Eliminar una categoría
const deleteCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    await categoria.destroy();
    res.json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la categoría", error });
  }
};

module.exports = {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
};