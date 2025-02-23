const Mandadito = require("../models/Mandadito");

// Obtener todos los mandaditos
const getAllMandaditos = async (req, res) => {
  try {
    const mandaditos = await Mandadito.findAll();
    if (!mandaditos || mandaditos.length === 0) {
      return res.status(404).json({ message: "No se encontraron mandaditos" });
    }
    res.json(mandaditos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los mandaditos", error });
  }
};

// Obtener un mandadito por su ID
const getMandaditoById = async (req, res) => {
  const { id } = req.params;

  try {
    const mandadito = await Mandadito.findByPk(id);
    if (!mandadito) {
      return res.status(404).json({ message: "Mandadito no encontrado" });
    }
    res.json(mandadito);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el mandadito", error });
  }
};

// Crear un nuevo mandadito
const createMandadito = async (req, res) => {
    const { id_cliente } = req.params;
    const {
    id_driver,
    metodo_pago,
    direccion_origen,
    direccion_destino,
    descripcion,
    tiempo_llegada_recogida_estimado,
    tiempo_entrega_estimado,
    estado,
  } = req.body;

  try {
    const mandadito = await Mandadito.create({
      id_cliente,
      id_driver,
      metodo_pago,
      direccion_origen,
      direccion_destino,
      descripcion,
      tiempo_llegada_recogida_estimado,
      tiempo_entrega_estimado,
      estado,
    });

    res.status(201).json({ message: "Mandadito creado exitosamente", data: mandadito });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_cliente")) {
        return res.status(400).json({ message: "El cliente no existe" });
      }
      if (error.fields.includes("id_driver")) {
        return res.status(400).json({ message: "El driver no existe" });
      }
    }
    res.status(500).json({ message: "Error al crear el mandadito", error });
  }
};

// Actualizar un mandadito existente
const updateMandadito = async (req, res) => {
  const { id } = req.params;
  const {
    id_driver,
    metodo_pago,
    direccion_origen,
    direccion_destino,
    descripcion,
    tiempo_llegada_recogida_estimado,
    tiempo_entrega_estimado,
    fecha_entregado,
    estado,
  } = req.body;

  try {
    const mandadito = await Mandadito.findByPk(id);
    if (!mandadito) {
      return res.status(404).json({ message: "Mandadito no encontrado" });
    }

    await mandadito.update({
      id_driver,
      metodo_pago,
      direccion_origen,
      direccion_destino,
      descripcion,
      tiempo_llegada_recogida_estimado,
      tiempo_entrega_estimado,
      fecha_entregado,
      estado,
    });

    res.status(200).json({ message: "Mandadito actualizado correctamente", data: mandadito });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el mandadito", error });
  }
};

// Eliminar un mandadito
const deleteMandadito = async (req, res) => {
  const { id } = req.params;

  try {
    const mandadito = await Mandadito.findByPk(id);
    if (!mandadito) {
      return res.status(404).json({ message: "Mandadito no encontrado" });
    }

    await mandadito.destroy();
    res.status(200).json({ message: "Mandadito eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el mandadito", error });
  }
};

module.exports = {
  getAllMandaditos,
  getMandaditoById,
  createMandadito,
  updateMandadito,
  deleteMandadito,
};