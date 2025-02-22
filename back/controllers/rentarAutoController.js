const RentarAuto = require("../models/RentarAuto");

// Obtener todas las solicitudes de renta
const getAllRentas = async (req, res) => {
  try {
    const rentas = await RentarAuto.findAll();
    if (!rentas || rentas.length === 0) {
      return res.status(404).json({ message: "No se encontraron solicitudes de renta" });
    }
    res.json(rentas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las solicitudes de renta", error });
  }
};

// Obtener una solicitud de renta por su ID
const getRentaById = async (req, res) => {
  const { id } = req.params;

  try {
    const renta = await RentarAuto.findByPk(id);
    if (!renta) {
      return res.status(404).json({ message: "Solicitud de renta no encontrada" });
    }
    res.json(renta);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la solicitud de renta", error });
  }
};

// Crear una nueva solicitud de renta
const createRenta = async (req, res) => {
    const { id_auto_en_renta } = req.params;
    const {
    id_cliente,
    fecha_inicio,
    fecha_fin,
    con_conductor,
    direccion_entrega,
    imagen_licencia,
    id_metodo_pago,
    total,
  } = req.body;

  try {
    const renta = await RentarAuto.create({
      id_auto_en_renta,
      id_cliente,
      fecha_inicio,
      fecha_fin,
      con_conductor,
      direccion_entrega,
      imagen_licencia,
      id_metodo_pago,
      total,
    });

    res.status(201).json({ message: "Solicitud de renta creada exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_auto_en_renta")) {
        return res.status(400).json({ message: "El auto en renta no existe" });
      }
      if (error.fields.includes("id_cliente")) {
        return res.status(400).json({ message: "El cliente no existe" });
      }
      if (error.fields.includes("id_metodo_pago")) {
        return res.status(400).json({ message: "El método de pago no existe" });
      }
    }
    res.status(500).json({ message: "Error al crear la solicitud de renta", error });
  }
};

// Actualizar una solicitud de renta
const updateRenta = async (req, res) => {
  const { id } = req.params;
  const {
    fecha_inicio,
    fecha_fin,
    con_conductor,
    direccion_entrega,
    imagen_licencia,
    id_metodo_pago,
    total,
    estado,
  } = req.body;

  try {
    const renta = await RentarAuto.findByPk(id);
    if (!renta) {
      return res.status(404).json({ message: "Solicitud de renta no encontrada" });
    }

    await renta.update({
      fecha_inicio,
      fecha_fin,
      con_conductor,
      direccion_entrega,
      imagen_licencia,
      id_metodo_pago,
      total,
      estado,
    });

    res.status(200).json({ message: "Solicitud de renta actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la solicitud de renta", error });
  }
};

// Eliminar una solicitud de renta
const deleteRenta = async (req, res) => {
  const { id } = req.params;

  try {
    const renta = await RentarAuto.findByPk(id);
    if (!renta) {
      return res.status(404).json({ message: "Solicitud de renta no encontrada" });
    }

    await renta.destroy();
    res.status(200).json({ message: "Solicitud de renta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la solicitud de renta", error });
  }
};

module.exports = {
  getAllRentas,
  getRentaById,
  createRenta,
  updateRenta,
  deleteRenta,
};