const MetodoPago = require("../models/MetodoPago");

const getMetodosPago = async (req, res) => {
  try {
    const metodos = await MetodoPago.findAll();
    res.json(metodos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los métodos de pago", error });
  }
};

const getMetodoPagoById = async (req, res) => {
  try {
    const metodo = await MetodoPago.findByPk(req.params.id);
    if (!metodo) return res.status(404).json({ message: "Método de pago no encontrado" });
    res.json(metodo);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el método de pago", error });
  }
};

const createMetodoPago = async (req, res) => {
  const { tipo_pago } = req.body;
  try {
    const nuevoMetodo = await MetodoPago.create({ tipo_pago });
    res.status(201).json(nuevoMetodo);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el método de pago", error });
  }
};

const updateMetodoPago = async (req, res) => {
  const { id } = req.params;
  const { tipo_pago } = req.body;

  try {
    const metodo = await MetodoPago.findByPk(id);
    if (!metodo) return res.status(404).json({ message: "Método de pago no encontrado" });

    await metodo.update({ tipo_pago });
    res.json({ message: "Método de pago actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el método de pago", error });
  }
};

const deleteMetodoPago = async (req, res) => {
  try {
    const metodo = await MetodoPago.findByPk(req.params.id);
    if (!metodo) return res.status(404).json({ message: "Método de pago no encontrado" });

    await metodo.destroy();
    res.json({ message: "Método de pago eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el método de pago", error });
  }
};

module.exports = { 
  getMetodosPago,
  getMetodoPagoById,
  createMetodoPago,
  updateMetodoPago,
  deleteMetodoPago
};