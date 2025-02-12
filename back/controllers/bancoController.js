const Banco = require("../models/Banco");

const getBancos = async (req, res) => {
  try {
    const bancos = await Banco.findAll();
    res.json(bancos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener bancos", error });
  }
};

const getBancoById = async (req, res) => {
  try {
    const banco = await Banco.findByPk(req.params.id);
    if (!banco) return res.status(404).json({ message: "Banco no encontrado" });
    res.json(banco);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el banco", error });
  }
};

const createBanco = async (req, res) => {
  const { nombre_banco } = req.body;
  try {
    const nuevoBanco = await Banco.create({ nombre_banco });
    res.status(201).json(nuevoBanco);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el banco", error });
  }
};

const updateBanco = async (req, res) => {
  const { id } = req.params;
  const { nombre_banco } = req.body;

  try {
    const banco = await Banco.findByPk(id);
    if (!banco) return res.status(404).json({ message: "Banco no encontrado" });

    await banco.update({ nombre_banco });
    res.json({ message: "Banco actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el banco", error });
  }
};

const deleteBanco = async (req, res) => {
  try {
    const banco = await Banco.findByPk(req.params.id);
    if (!banco) return res.status(404).json({ message: "Banco no encontrado" });

    await banco.destroy();
    res.json({ message: "Banco eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el banco", error });
  }
};

module.exports = { 
  getBancos,
  getBancoById,
  createBanco,
  updateBanco,
  deleteBanco
};