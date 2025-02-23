const Complemento = require("../models/Complemento");

// Obtener todos los complementos
const getAllComplementos = async (req, res) => {
  try {
    const complementos = await Complemento.findAll();
    if (!complementos || complementos.length === 0) {
      return res.status(404).json({ message: "No se encontraron complementos" });
    }
    res.json(complementos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los complementos", error });
  }
};

// Obtener un complemento por su ID
const getComplementoById = async (req, res) => {
  const { id } = req.params;

  try {
    const complemento = await Complemento.findByPk(id);
    if (!complemento) {
      return res.status(404).json({ message: "Complemento no encontrado" });
    }
    res.json(complemento);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el complemento", error });
  }
};

// Crear un nuevo complemento
const createComplemento = async (req, res) => {
    const { id_producto } = req.params;
    const { nombre, precio } = req.body;

  try {
    const complemento = await Complemento.create({
      id_producto,
      nombre,
      precio, 
    });

    res.status(201).json({ message: "Complemento creado exitosamente", data: complemento });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ message: "El producto no existe" });
    }
    res.status(500).json({ message: "Error al crear el complemento", error });
  }
};

// Actualizar un complemento existente
const updateComplemento = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, activo } = req.body;

  try {
    const complemento = await Complemento.findByPk(id);
    if (!complemento) {
      return res.status(404).json({ message: "Complemento no encontrado" });
    }

    await complemento.update({
      nombre,
      precio,
      activo,
    });

    res.status(200).json({ message: "Complemento actualizado correctamente", data: complemento });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el complemento", error });
  }
};

// Eliminar un complemento
const deleteComplemento = async (req, res) => {
  const { id } = req.params;

  try {
    const complemento = await Complemento.findByPk(id);
    if (!complemento) {
      return res.status(404).json({ message: "Complemento no encontrado" });
    }

    await complemento.destroy();
    res.status(200).json({ message: "Complemento eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el complemento", error });
  }
};

module.exports = {
  getAllComplementos,
  getComplementoById,
  createComplemento,
  updateComplemento,
  deleteComplemento,
};