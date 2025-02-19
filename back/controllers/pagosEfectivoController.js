const PagoEfectivo = require("../models/PagoEfectivo");

// Obtener todos los pagos en efectivo de un pago
const getEfectivosByPago = async (req, res) => {
  const { id_pago } = req.params;

  try {
    const efectivos = await PagoEfectivo.findAll({
      where: { id_pago },
    });

    if (!efectivos || efectivos.length === 0) {
      return res.status(404).json({ message: "No se encontraron pagos en efectivo para este pago" });
    }

    res.json(efectivos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los pagos en efectivo del pago", error });
  }
};

// Crear un nuevo pago en efectivo
const createEfectivo = async (req, res) => {
  const { id_pago, cambio } = req.body;

  try {
    const efectivo = await PagoEfectivo.create({
      id_pago,
      cambio,
    });

    res.status(201).json({ message: "Pago en efectivo creado exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ message: "El pago no existe" });
    }
    res.status(500).json({ message: "Error al crear el pago en efectivo", error });
  }
};

// Actualizar un pago en efectivo
const updateEfectivo = async (req, res) => {
  const { id } = req.params;
  const { cambio } = req.body;

  try {
    const efectivo = await PagoEfectivo.findByPk(id);
    if (!efectivo) {
      return res.status(404).json({ message: "Pago en efectivo no encontrado" });
    }

    await efectivo.update({
      cambio,
    });

    res.status(200).json({ message: "Pago en efectivo actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el pago en efectivo", error });
  }
};

// Eliminar un pago en efectivo
const deleteEfectivo = async (req, res) => {
  const { id } = req.params;

  try {
    const efectivo = await PagoEfectivo.findByPk(id);
    if (!efectivo) {
      return res.status(404).json({ message: "Pago en efectivo no encontrado" });
    }

    await efectivo.destroy();
    res.status(200).json({ message: "Pago en efectivo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el pago en efectivo", error });
  }
};

module.exports = {
  getEfectivosByPago,
  createEfectivo,
  updateEfectivo,
  deleteEfectivo,
};