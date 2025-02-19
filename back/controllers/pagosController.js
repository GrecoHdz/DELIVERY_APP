const Pago = require("../models/Pago");

// Obtener todos los pagos
const getAllPagos = async (req, res) => {
  try {
    const pagos = await Pago.findAll();
    if (!pagos || pagos.length === 0) {
      return res.status(404).json({ message: "No se encontraron pagos" });
    }
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los pagos", error });
  }
};

// Obtener un pago por su ID
const getPagoById = async (req, res) => {
  const { id } = req.params;

  try {
    const pago = await Pago.findByPk(id);
    if (!pago) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }
    res.json(pago);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el pago", error });
  }
};

// Crear un nuevo pago
const createPago = async (req, res) => {
  const {
    tipo_pago,
    id_referencia,
    id_metodo_pago,
    monto,
    total_local,
    total_app,
    total_driver,
    estado_pago,
  } = req.body;

  try {
    const pago = await Pago.create({
      tipo_pago,
      id_referencia,
      id_metodo_pago,
      monto,
      total_local,
      total_app,
      total_driver,
      estado_pago,
    });

    res.status(201).json({ message: "Pago creado exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ message: "El método de pago no existe" });
    }
    res.status(500).json({ message: "Error al crear el pago", error });
  }
};

// Actualizar un pago
const updatePago = async (req, res) => {
  const { id } = req.params;
  const {
    tipo_pago,
    id_referencia,
    id_metodo_pago,
    monto,
    total_local,
    total_app,
    total_driver,
    estado_pago,
    fecha_confirmacion,
  } = req.body;

  try {
    const pago = await Pago.findByPk(id);
    if (!pago) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    await pago.update({
      tipo_pago,
      id_referencia,
      id_metodo_pago,
      monto,
      total_local,
      total_app,
      total_driver,
      estado_pago,
      fecha_confirmacion,
    });

    res.status(200).json({ message: "Pago actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el pago", error });
  }
};

// Eliminar un pago
const deletePago = async (req, res) => {
  const { id } = req.params;

  try {
    const pago = await Pago.findByPk(id);
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