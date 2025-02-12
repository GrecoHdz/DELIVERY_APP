const Ciudad = require("../models/Ciudad");

const getCiudades = async (req, res) => {
  try {
    const ciudades = await Ciudad.findAll();
    res.json(ciudades);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener ciudades", error });
  }
};

const getCiudadById = async (req, res) => {
  try {
    const ciudad = await Ciudad.findByPk(req.params.id);
    if (!ciudad) return res.status(404).json({ message: "Ciudad no encontrada" });
    res.json(ciudad);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la ciudad", error });
  }
};

const createCiudad = async (req, res) => {
  const { nombre_ciudad } = req.body;
  try {
    const nuevaCiudad = await Ciudad.create({ nombre_ciudad });
    res.status(201).json(nuevaCiudad);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la ciudad", error });
  }
};

const updateCiudad = async (req, res) => {
  const { id } = req.params;
  const { nombre_ciudad } = req.body;

  try {
    const ciudad = await Ciudad.findByPk(id);
    if (!ciudad) return res.status(404).json({ message: "Ciudad no encontrada" });

    await ciudad.update({ nombre_ciudad });
    res.json({ message: "Ciudad actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la ciudad", error });
  }
};

const deleteCiudad = async (req, res) => {
  try {
    const ciudad = await Ciudad.findByPk(req.params.id);
    if (!ciudad) return res.status(404).json({ message: "Ciudad no encontrada" });

    await ciudad.destroy();
    res.json({ message: "Ciudad eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la ciudad", error });
  }
};

module.exports = { 
  getCiudades,
  getCiudadById,
  createCiudad,
  updateCiudad,
  deleteCiudad
};