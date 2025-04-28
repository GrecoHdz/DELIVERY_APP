const Recomendado = require("../models/Recomendado");

// Obtener todas las recomendaciones
const getRecomendaciones = async (req, res) => {
  try {
    const recomendaciones = await Recomendado.findAll();

    if (!recomendaciones || recomendaciones.length === 0) {
      return res.status(404).json({ message: "No se encontraron recomendaciones" });
    }

    res.json(recomendaciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las recomendaciones", error });
  }
};

// Obtener todas las recomendaciones de un local
const getRecomendacionesByLocal = async (req, res) => {
  const { id_local } = req.params;

  try {
    const recomendaciones = await Recomendado.findAll({
      where: { id_local }
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
  const { id_local } = req.params;
  const { id_producto, sucursales } = req.body;

  try {
    // Verificar si ya existe una recomendación para este producto y local
    const existingRecomendacion = await Recomendado.findOne({
      where: { id_producto, id_local }
    });

    if (existingRecomendacion) {
      // Si ya existe, actualizar las sucursales
      await existingRecomendacion.update({ sucursales: sucursales || [] });
      return res.status(200).json({ message: "Recomendación actualizada exitosamente" });
    }

    // Si no existe, crear una nueva
    const recomendacion = await Recomendado.create({
      id_producto,
      id_local,
      sucursales: sucursales || []
    });

    res.status(201).json({ message: "Recomendación creada exitosamente" });
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

// Actualizar o eliminar una recomendación
const updateRecomendacion = async (req, res) => {
  const { id_recomendacion } = req.params;
  const { sucursales } = req.body;

  try {
    const recomendacion = await Recomendado.findByPk(id_recomendacion);
    if (!recomendacion) {
      return res.status(404).json({ message: "Recomendación no encontrada" });
    }

    // Si sucursales es null, undefined, o un array vacío, eliminar la recomendación
    if (!sucursales || (Array.isArray(sucursales) && sucursales.length === 0)) {
      await recomendacion.destroy();
      return res.status(200).json({ message: "Recomendación eliminada correctamente" });
    }

    // Si hay sucursales, actualizar la recomendación
    await recomendacion.update({ sucursales });
    res.status(200).json({ message: "Recomendación actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la recomendación", error });
  }
};

// Eliminar una recomendación
const deleteRecomendacion = async (req, res) => {
  const { id_recomendacion } = req.params;

  try {
    const recomendacion = await Recomendado.findByPk(id_recomendacion);
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
  getRecomendaciones,
  getRecomendacionesByLocal,
  createRecomendacion,
  updateRecomendacion,
  deleteRecomendacion
};