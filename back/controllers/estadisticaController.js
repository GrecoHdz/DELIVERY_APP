const Estadistica = require("../models/Estadistica");

const getEstadisticas = async (req, res) => {
  const { id_cliente } = req.params;
  try {
    const estadisticas = await Estadistica.findAll({
      where: { id_cliente }  
    });

    if (estadisticas.length === 0) {
      return res.status(404).json({ message: "No se encontraron estadísticas para este usuario." });
    }

    res.json(estadisticas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener estadísticas", error });
  }
};

const createEstadistica = async (req, res) => {
  const { pedidos, ubers, mandaditos } = req.body;
  try {
    const nuevaEstadistica = await Estadistica.create({ pedidos, ubers, mandaditos });
    res.status(201).json(nuevaEstadistica);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la estadística", error });
  }
};

const updateEstadistica = async (req, res) => {
  const { id } = req.params;
  const { pedidos, ubers, mandaditos } = req.body;

  try {
    const estadistica = await Estadistica.findByPk(id);
    if (!estadistica) return res.status(404).json({ message: "Estadística no encontrada" });

    await estadistica.update({ pedidos, ubers, mandaditos });
    res.json({ message: "Estadística actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la estadística", error });
  }
};

module.exports = { 
  getEstadisticas,
  createEstadistica,
  updateEstadistica
};