const PagoTransferencia = require("../models/PagoTransferencia");

// Obtener todas las transferencias de un pago
const getTransferenciasByPago = async (req, res) => {
  const { id_pago } = req.params;

  try {
    const transferencias = await PagoTransferencia.findAll({
      where: { id_pago },
    });

    if (!transferencias || transferencias.length === 0) {
      return res.status(404).json({ message: "No se encontraron transferencias para este pago" });
    }

    res.json(transferencias);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las transferencias del pago", error });
  }
};

// Crear una nueva transferencia
const createTransferencia = async (req, res) => {
  const { id_pago, id_cuenta, num_comprobante } = req.body;

  try {
    const transferencia = await PagoTransferencia.create({
      id_pago,
      id_cuenta,
      num_comprobante,
    });

    res.status(201).json({ message: "Transferencia creada exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_pago")) {
        return res.status(400).json({ message: "El pago no existe" });
      }
      if (error.fields.includes("id_cuenta")) {
        return res.status(400).json({ message: "La cuenta bancaria no existe" });
      }
    }
    res.status(500).json({ message: "Error al crear la transferencia", error });
  }
};

// Actualizar una transferencia
const updateTransferencia = async (req, res) => {
  const { id } = req.params;
  const { id_cuenta, num_comprobante } = req.body;

  try {
    const transferencia = await PagoTransferencia.findByPk(id);
    if (!transferencia) {
      return res.status(404).json({ message: "Transferencia no encontrada" });
    }

    await transferencia.update({
      id_cuenta,
      num_comprobante,
    });

    res.status(200).json({ message: "Transferencia actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la transferencia", error });
  }
};

// Eliminar una transferencia
const deleteTransferencia = async (req, res) => {
  const { id } = req.params;

  try {
    const transferencia = await PagoTransferencia.findByPk(id);
    if (!transferencia) {
      return res.status(404).json({ message: "Transferencia no encontrada" });
    }

    await transferencia.destroy();
    res.status(200).json({ message: "Transferencia eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la transferencia", error });
  }
};

module.exports = {
  getTransferenciasByPago,
  createTransferencia,
  updateTransferencia,
  deleteTransferencia,
};