const OfertaMandadito = require("../models/OfertaMandadito");

// Obtener todas las ofertas
const getAllOfertas = async (req, res) => {
  try {
    const ofertas = await OfertaMandadito.findAll();
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
    const oferta = await OfertaMandadito.findByPk(id);
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
    const { id_mandadito } = req.params;
    const { id_driver, monto_ofrecido} = req.body;

  try {
    const oferta = await OfertaMandadito.create({
      id_mandadito,
      id_driver,
      monto_ofrecido,
    });

    res.status(201).json({ message: "Oferta creada exitosamente", data: oferta });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_mandadito")) {
        return res.status(400).json({ message: "El mandadito no existe" });
      }
      if (error.fields.includes("id_driver")) {
        return res.status(400).json({ message: "El driver no existe" });
      }
    }
    res.status(500).json({ message: "Error al crear la oferta", error });
  }
};

// Actualizar una oferta existente
const updateOferta = async (req, res) => {
  const { id } = req.params;
  const { monto_ofrecido, estado } = req.body;

  try {
    const oferta = await OfertaMandadito.findByPk(id);
    if (!oferta) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }

    await oferta.update({
      monto_ofrecido,
      estado,
    });

    res.status(200).json({ message: "Oferta actualizada correctamente", data: oferta });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la oferta", error });
  }
};

// Eliminar una oferta
const deleteOferta = async (req, res) => {
  const { id } = req.params;

  try {
    const oferta = await OfertaMandadito.findByPk(id);
    if (!oferta) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }

    await oferta.destroy();
    res.status(200).json({ message: "Oferta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la oferta", error });
  }
};

module.exports = {
  getAllOfertas,
  getOfertaById,
  createOferta,
  updateOferta,
  deleteOferta,
};