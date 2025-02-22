const LocalMetodoPago = require("../models/LocalMetodoPago");

// Obtener todos los métodos de pago de un local
const getMetodosPagoByLocal = async (req, res) => {
  const { id_local } = req.params;

  try {
    const metodosPago = await LocalMetodoPago.findAll({
      where: { id_local },
    });

    if (!metodosPago || metodosPago.length === 0) {
      return res.status(404).json({ message: "No se encontraron métodos de pago para este local" });
    }

    res.json(metodosPago);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los métodos de pago del local", error });
  }
};

// Asociar un método de pago a un local
const associateMetodoPagoToLocal = async (req, res) => {
  const {id_local}=req.params;
  const { id_metodo_pago } = req.body;

  try {
    const metodoPago = await LocalMetodoPago.create({
      id_local,
      id_metodo_pago,
    });

    res.status(201).json({ message: "Método de pago asociado al local exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_local")) {
        return res.status(400).json({ message: "El local no existe" });
      }
      if (error.fields.includes("id_metodo_pago")) {
        return res.status(400).json({ message: "El método de pago no existe" });
      }
    }
    res.status(500).json({ message: "Error al asociar el método de pago al local", error });
  }
};

// Eliminar la asociación entre un local y un método de pago
const deleteMetodoPagoFromLocal = async (req, res) => {
  const { id_local, id_metodo_pago } = req.params;

  try {
    const relacion = await LocalMetodoPago.findOne({
      where: { id_local, id_metodo_pago },
    });

    if (!relacion) {
      return res.status(404).json({ message: "Asociación local-método de pago no encontrada" });
    }

    await relacion.destroy();
    res.status(200).json({ message: "Asociación eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la asociación", error });
  }
};

module.exports = {
  getMetodosPagoByLocal,
  associateMetodoPagoToLocal,
  deleteMetodoPagoFromLocal,
};