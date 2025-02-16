const ProductoRecomendado = require("../models/ProductoRecomendado");

// Obtener todas las recomendaciones de un local
const getRecomendacionesByLocal = async (req, res) => {
  const { id_local } = req.params;

  try {
    const recomendaciones = await ProductoRecomendado.findAll({
      where: { id_local, activo: true }, // Solo recomendaciones activas
    });

    if (!recomendaciones || recomendaciones.length === 0) {
      return res.status(404).json({ message: "No se encontraron recomendaciones para este local" });
    }

    res.json(recomendaciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las recomendaciones del local", error });
  }
};

// Crear una nueva recomendación
const createRecomendacion = async (req, res) => {
  const { id_producto, id_local } = req.body;

  try {
    const nuevaRecomendacion = await ProductoRecomendado.create({
      id_producto,
      id_local,
    });

    res.status(201).json({ message: "Recomendación creada exitosamente", recomendacion: nuevaRecomendacion });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_producto")) {
        return res.status(400).json({ message: "El producto no existe" });
      }
      if (error.fields.includes("id_local")) {
        return res.status(400).json({ message: "El local no existe" });
      }
    }
    res.status(500).json({ message: "Error al crear la recomendación", error });
  }
};

// Actualizar una recomendación
const updateRecomendacion = async (req, res) => {
  const { id } = req.params;
  const { id_producto, id_local, activo } = req.body;

  try {
    const recomendacion = await ProductoRecomendado.findByPk(id);
    if (!recomendacion) {
      return res.status(404).json({ message: "Recomendación no encontrada" });
    }

    await recomendacion.update({
      id_producto,
      id_local,
      activo,
    });

    res.status(200).json({ message: "Recomendación actualizada correctamente", recomendacion });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_producto")) {
        return res.status(400).json({ message: "El producto no existe" });
      }
      if (error.fields.includes("id_local")) {
        return res.status(400).json({ message: "El local no existe" });
      }
    }
    res.status(500).json({ message: "Error al actualizar la recomendación", error });
  }
};

// Eliminar una recomendación
const deleteRecomendacion = async (req, res) => {
  try {
    const recomendacion = await ProductoRecomendado.findByPk(req.params.id);
    if (!recomendacion) {
      return res.status(404).json({ message: "Recomendación no encontrada" });
    }

    await recomendacion.destroy();
    res.status(200).json({ message: "Recomendación eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la recomendación", error });
  }
};

module.exports = {
  getRecomendacionesByLocal,
  createRecomendacion,
  updateRecomendacion,
  deleteRecomendacion,
};