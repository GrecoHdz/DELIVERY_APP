const OfertaDriver = require("../models/OfertaDriver");

// Obtener todas las ofertas
const getAllOfertas = async (req, res) => {
  try {
    const ofertas = await OfertaDriver.findAll();
    if (!ofertas || ofertas.length === 0) {
      return res.status(404).json({ message: "No se encontraron ofertas" });
    }
    res.json(ofertas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las ofertas", error });
  }
};

// Obtener una oferta por su ID
const getOfertaById = async (req, res) => {
  const { id } = req.params;

  try {
    const oferta = await OfertaDriver.findByPk(id);
    if (!oferta) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }
    res.json(oferta);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la oferta", error });
  }
};

// Crear una nueva oferta
const createOferta = async (req, res) => {
    const { id_driver } = req.params;
    const {
    id_viaje,
    id_pedido, 
    id_vehiculo,
    precio_oferta, 
  } = req.body;

  try {
    const oferta = await OfertaDriver.create({
      id_viaje,
      id_pedido,
      id_driver,
      id_vehiculo,
      precio_oferta, 
    });

    res.status(201).json({ message: "Oferta creada exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_viaje")) {
        return res.status(400).json({ message: "El viaje no existe" });
      }
      if (error.fields.includes("id_pedido")) {
        return res.status(400).json({ message: "El pedido no existe" });
      }
      if (error.fields.includes("id_driver")) {
        return res.status(400).json({ message: "El driver no existe" });
      }
      if (error.fields.includes("id_vehiculo")) {
        return res.status(400).json({ message: "El vehículo no existe" });
      }
    }
    res.status(500).json({ message: "Error al crear la oferta", error });
  }
};

// Actualizar una oferta
const updateOferta = async (req, res) => {
  const { id } = req.params;
  const { precio_oferta, estado_oferta } = req.body;

  try {
    const oferta = await OfertaDriver.findByPk(id);
    if (!oferta) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }

    await oferta.update({
      precio_oferta,
      estado_oferta,
    });

    res.status(200).json({ message: "Oferta actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la oferta", error });
  }
};

// Eliminar una oferta
const deleteOferta = async (req, res) => {
  const { id } = req.params;

  try {
    const oferta = await OfertaDriver.findByPk(id);
    if (!oferta) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }

    await oferta.destroy();
    res.status(200).json({ message: "Oferta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la oferta", error });
  }
};

// Obtener oferta por ID de pedido
const getOfertaByPedidoId = async (req, res) => {
  const { id_pedido } = req.params;

  try {
    const oferta = await OfertaDriver.findOne({
      where: { id_pedido }
    });
    
    if (!oferta) {
      return res.status(404).json({ message: "No se encontró oferta para este pedido" });
    }
    res.json(oferta);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la oferta", error });
  }
};

module.exports = {
  getAllOfertas,
  getOfertaById,
  createOferta,
  updateOferta,
  deleteOferta,
  getOfertaByPedidoId
};