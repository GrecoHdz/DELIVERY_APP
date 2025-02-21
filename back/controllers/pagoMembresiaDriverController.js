const PagoMembresiaDriver = require("../models/PagoMembresiaDriver");

// Obtener todos los pagos de membresía
const getAllPagos = async (req, res) => {
  try {
    const pagos = await PagoMembresiaDriver.findAll();
    if (!pagos || pagos.length === 0) {
      return res.status(404).json({ message: "No se encontraron pagos de membresía" });
    }
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los pagos de membresía", error });
  }
};

// Obtener un pago por su ID
const getPagoById = async (req, res) => {
  const { id } = req.params;

  try {
    const pago = await PagoMembresiaDriver.findByPk(id);
    if (!pago) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }
    res.json(pago);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el pago", error });
  }
};

// Crear un nuevo pago de membresía
const createPago = async (req, res) => {
  const { id_driver } = req.params;
  const { id_membresia, monto, deposito_url, estado } = req.body;

  try {
    const pago = await PagoMembresiaDriver.create({
      id_driver,
      id_membresia,
      monto,
      deposito_url,
      estado,
    });

    res.status(201).json({ message: "Pago de membresía creado exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_driver")) {
        return res.status(400).json({ message: "El driver no existe" });
      }
      if (error.fields.includes("id_membresia")) {
        return res.status(400).json({ message: "La membresía no existe" });
      }
    }
    res.status(500).json({ message: "Error al crear el pago de membresía", error });
  }
};

// Actualizar un pago de membresía
const updatePago = async (req, res) => {
  const { id } = req.params;
  const { monto, deposito_url, estado } = req.body;

  try {
    const pago = await PagoMembresiaDriver.findByPk(id);
    if (!pago) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    await pago.update({
      monto,
      deposito_url,
      estado,
    });

    res.status(200).json({ message: "Pago actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el pago", error });
  }
};

// Eliminar un pago de membresía
const deletePago = async (req, res) => {
  const { id } = req.params;

  try {
    const pago = await PagoMembresiaDriver.findByPk(id);
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