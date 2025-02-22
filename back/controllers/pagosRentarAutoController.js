const PagoRentarAuto = require("../models/PagoRentarAuto");

// Obtener todos los pagos de renta de autos
const getAllPagos = async (req, res) => {
  try {
    const pagos = await PagoRentarAuto.findAll();
    if (!pagos || pagos.length === 0) {
      return res.status(404).json({ message: "No se encontraron pagos de renta de autos" });
    }
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los pagos de renta de autos", error });
  }
};

// Obtener un pago por su ID de renta
const getPagoById = async (req, res) => {
  const { id } = req.params;

  try {
    const pago = await PagoRentarAuto.findByPk(id);
    if (!pago) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }
    res.json(pago);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el pago", error });
  }
};

// Crear un nuevo pago de renta de auto
const createPago = async (req, res) => {
    const { id_rentar_auto } = req.params;
    const { deposito_url, estado } = req.body;

  try {
    const pago = await PagoRentarAuto.create({
      id_rentar_auto,
      deposito_url,
      estado,
    });

    res.status(201).json({ message: "Pago creado exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ message: "La solicitud de renta no existe" });
    }
    res.status(500).json({ message: "Error al crear el pago", error });
  }
};

// Actualizar un pago de renta de auto
const updatePago = async (req, res) => {
  const { id } = req.params;
  const { deposito_url, estado } = req.body;

  try {
    const pago = await PagoRentarAuto.findByPk(id);
    if (!pago) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    await pago.update({
      deposito_url,
      estado,
    });

    res.status(200).json({ message: "Pago actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el pago", error });
  }
};

// Eliminar un pago de renta de auto
const deletePago = async (req, res) => {
  const { id } = req.params;

  try {
    const pago = await PagoRentarAuto.findByPk(id);
    if (!pago) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    await pago.destroy();
    res.status(200).json({ message: "Pago eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el pago", error });
  }
};

module.exports = {
  getAllPagos,
  getPagoById,
  createPago,
  updatePago,
  deletePago,
};