const Cupon = require("../models/Cupon");

// Obtener todos los cupones
const getAllCupones = async (req, res) => {
  try {
    const cupones = await Cupon.findAll();
    if (!cupones || cupones.length === 0) {
      return res.status(404).json({ message: "No se encontraron cupones" });
    }
    res.json(cupones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los cupones", error });
  }
};

// Obtener un cupón por su ID
const getCuponById = async (req, res) => {
  const { id } = req.params;

  try {
    const cupon = await Cupon.findByPk(id);
    if (!cupon) {
      return res.status(404).json({ message: "Cupón no encontrado" });
    }
    res.json(cupon);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el cupón", error });
  }
};

// Crear un nuevo cupón
const createCupon = async (req, res) => {
  const {
    id_local,
    tipo_descuento,
    codigo_cupon,
    descuento,
    limite_uso,
    usos_actuales,
    fecha_vencimiento,
    imagen_url,
    activo,
  } = req.body;

  try {
    const cupon = await Cupon.create({
      id_local,
      tipo_descuento,
      codigo_cupon,
      descuento,
      limite_uso,
      usos_actuales,
      fecha_vencimiento,
      imagen_url,
      activo,
    });

    res.status(201).json({ message: "Cupón creado exitosamente", data: cupon });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "El código del cupón ya existe" });
    }
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ message: "El local no existe" });
    }
    res.status(500).json({ message: "Error al crear el cupón", error });
  }
};

// Actualizar un cupón existente
const updateCupon = async (req, res) => {
  const { id } = req.params;
  const {
    id_local,
    tipo_descuento,
    codigo_cupon,
    descuento,
    limite_uso,
    usos_actuales,
    fecha_vencimiento,
    imagen_url,
    activo,
  } = req.body;

  try {
    const cupon = await Cupon.findByPk(id);
    if (!cupon) {
      return res.status(404).json({ message: "Cupón no encontrado" });
    }

    await cupon.update({
      id_local,
      tipo_descuento,
      codigo_cupon,
      descuento,
      limite_uso,
      usos_actuales,
      fecha_vencimiento,
      imagen_url,
      activo,
    });

    res.status(200).json({ message: "Cupón actualizado correctamente", data: cupon });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "El código del cupón ya existe" });
    }
    res.status(500).json({ message: "Error al actualizar el cupón", error });
  }
};

// Eliminar un cupón
const deleteCupon = async (req, res) => {
  const { id } = req.params;

  try {
    const cupon = await Cupon.findByPk(id);
    if (!cupon) {
      return res.status(404).json({ message: "Cupón no encontrado" });
    }

    await cupon.destroy();
    res.status(200).json({ message: "Cupón eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el cupón", error });
  }
};

module.exports = {
  getAllCupones,
  getCuponById,
  createCupon,
  updateCupon,
  deleteCupon,
};