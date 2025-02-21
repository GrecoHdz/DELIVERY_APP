const Recomendado = require("../models/Recomendado");

// Obtener todas las recomendaciones de un local
const getRecomendaciones = async (req, res) => {  
  try {
    const recomendaciones = await Recomendado.findAll({
      where: { activo: true }, // Solo las recomendaciones activas
    });

    if (!recomendaciones || recomendaciones.length === 0) {
      return res.status(404).json({ message: "No se encontraron recomendaciones para este local" });
    }

    res.json(recomendaciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las recomendaciones del local", error });
  }
};

// Obtener todas las recomendaciones de un local
const getRecomendacionesByLocal = async (req, res) => {
  const { id_local } = req.params;

  try {
    const recomendaciones = await Recomendado.findAll({
      where: { id_local, activo: true }, // Solo las recomendaciones activas por local
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
  const { id_producto } = req.body;

  try {
    const recomendacion = await Recomendado.create({
      id_producto,
      id_local,
      activo: true,
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

// Desactivar una recomendación
const deactivateRecomendacion = async (req, res) => {
  const { id } = req.params;

  try {
    const recomendacion = await Recomendado.findByPk(id);
    if (!recomendacion) {
      return res.status(404).json({ message: "Recomendación no encontrada" });
    }

    await recomendacion.update({ activo: false });

    res.status(200).json({ message: "Recomendación desactivada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al desactivar la recomendación", error });
  }
};

// Reactivar una recomendación
const reactivateRecomendacion = async (req, res) => {
  const { id } = req.params;

  try {
    const recomendacion = await Recomendado.findByPk(id);
    if (!recomendacion) {
      return res.status(404).json({ message: "Recomendación no encontrada" });
    }

    await recomendacion.update({ activo: true });

    res.status(200).json({ message: "Recomendación reactivada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al reactivar la recomendación", error });
  }
};

module.exports = {
  getRecomendaciones,
  getRecomendacionesByLocal,
  createRecomendacion,
  deactivateRecomendacion,
  reactivateRecomendacion,
};