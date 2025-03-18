const { Config } = require('../models/Config'); 
// Crear un nuevo registro de configuración
const createConfig = async (req, res) => {
  const { comision_productos } = req.body;

  try {
    const config = await Config.create({ comision_productos });
    res.status(201).json({ message: "Configuración creada exitosamente", config });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "La configuración ya existe" });
    }
    res.status(500).json({ message: "Error al crear la configuración", error });
  }
};

// Leer configuración
const getConfig = async (req, res) => {
  try {
    const config = await Config.findOne(); // Suponiendo que solo hay una fila
    if (!config) {
      return res.status(404).json({ message: "Configuración no encontrada" });
    }
    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la configuración", error });
  }
};

// Actualizar configuración
const updateConfig = async (req, res) => {
  const { id_config } = req.params; // Suponiendo que solo hay un ID para la configuración
  const { comision_productos } = req.body;

  try {
    const config = await Config.findByPk(id_config);
    if (!config) {
      return res.status(404).json({ message: "Configuración no encontrada" });
    }

    config.comision_productos = comision_productos;
    await config.save();

    res.status(200).json({ message: "Configuración actualizada exitosamente", config });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la configuración", error });
  }
};

// Eliminar configuración
const deleteConfig = async (req, res) => {
  const { id_config } = req.params;

  try {
    const config = await Config.findByPk(id_config);
    if (!config) {
      return res.status(404).json({ message: "Configuración no encontrada" });
    }

    await config.destroy();
    res.status(200).json({ message: "Configuración eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la configuración", error });
  }
};

// Exportar las funciones
module.exports = {
  createConfig,
  getConfig,
  updateConfig,
  deleteConfig,
};