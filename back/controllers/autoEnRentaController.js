const AutoEnRenta = require("../models/AutoEnRenta");

// Obtener todos los autos en renta
const getAllAutosEnRenta = async (req, res) => {
  try {
    const autos = await AutoEnRenta.findAll();
    if (!autos || autos.length === 0) {
      return res.status(404).json({ message: "No se encontraron autos en renta" });
    }
    res.json(autos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los autos en renta", error });
  }
};

// Obtener un auto en renta por su ID
const getAutoEnRentaById = async (req, res) => {
  const { id } = req.params;

  try {
    const auto = await AutoEnRenta.findByPk(id);
    if (!auto) {
      return res.status(404).json({ message: "Auto en renta no encontrado" });
    }
    res.json(auto);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el auto en renta", error });
  }
};

// Crear un nuevo auto en renta
const createAutoEnRenta = async (req, res) => {
    const {id_cliente}=req.params;
    const { 
    id_vehiculo,
    direccion_recogida,
    precio_por_dia,
    opcion_conductor,
    entrega_a_domicilio,
    id_metodo_pago,
  } = req.body;

  try {
    const auto = await AutoEnRenta.create({
      id_cliente,
      id_vehiculo,
      direccion_recogida,
      precio_por_dia,
      opcion_conductor,
      entrega_a_domicilio,
      id_metodo_pago,
    });

    res.status(201).json({ message: "Auto en renta creado exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_cliente")) {
        return res.status(400).json({ message: "El cliente no existe" });
      }
      if (error.fields.includes("id_vehiculo")) {
        return res.status(400).json({ message: "El vehículo no existe" });
      }
      if (error.fields.includes("id_metodo_pago")) {
        return res.status(400).json({ message: "El método de pago no existe" });
      }
    }
    res.status(500).json({ message: "Error al crear el auto en renta", error });
  }
};

// Actualizar un auto en renta
const updateAutoEnRenta = async (req, res) => {
  const { id } = req.params;
  const {
    direccion_recogida,
    precio_por_dia,
    opcion_conductor,
    entrega_a_domicilio,
    id_metodo_pago,
    activo,
  } = req.body;

  try {
    const auto = await AutoEnRenta.findByPk(id);
    if (!auto) {
      return res.status(404).json({ message: "Auto en renta no encontrado" });
    }

    await auto.update({
      direccion_recogida,
      precio_por_dia,
      opcion_conductor,
      entrega_a_domicilio,
      id_metodo_pago,
      activo,
    });

    res.status(200).json({ message: "Auto en renta actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el auto en renta", error });
  }
};

// Eliminar un auto en renta
const deleteAutoEnRenta = async (req, res) => {
  const { id } = req.params;

  try {
    const auto = await AutoEnRenta.findByPk(id);
    if (!auto) {
      return res.status(404).json({ message: "Auto en renta no encontrado" });
    }

    await auto.destroy();
    res.status(200).json({ message: "Auto en renta eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el auto en renta", error });
  }
};

module.exports = {
  getAllAutosEnRenta,
  getAutoEnRentaById,
  createAutoEnRenta,
  updateAutoEnRenta,
  deleteAutoEnRenta,
};