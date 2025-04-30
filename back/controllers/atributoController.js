const Atributo = require("../models/Atributo");

// Obtener todos los atributos de un producto
const getAllAtributosByProducto = async (req, res) => {
  const { id_producto } = req.params;

  try {
    const atributos = await Atributo.findAll({
      where: { id_producto },
    });

    if (!atributos || atributos.length === 0) {
      return res.status(404).json({ message: "No se encontraron atributos para este producto" });
    }

    res.json(atributos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los atributos del producto", error });
  }
};

// Crear un nuevo atributo para un producto
const createAtributo = async (req, res) => {
  const { id_producto } = req.params;
  const { nombre_atributo, valor, precio_adicional } = req.body;

  try {
    const atributo = await Atributo.create({
      id_producto,
      nombre_atributo,
      valor,
      precio_adicional,
    });

    res.status(201).json({ message: "Atributo creado exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Ya existe un atributo con este nombre para este producto" });
    }
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ message: "El producto no existe" });
    }
    console.error("Error al crear atributo:", error);
    res.status(500).json({ message: "Error al crear el atributo", error });
  }
};

// Actualizar un atributo
const updateAtributo = async (req, res) => {
  const { id } = req.params;
  const { valor, precio_adicional, nombre_atributo } = req.body;

  try {
    const atributo = await Atributo.findByPk(id);
    if (!atributo) {
      return res.status(404).json({ message: "Atributo no encontrado" });
    }

    await atributo.update({
      valor,
      nombre_atributo,
      precio_adicional,
    });

    res.status(200).json({ message: "Atributo actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el atributo", error });
  }
};

// Eliminar un atributo
const deleteAtributo = async (req, res) => {
  const { id } = req.params;

  try {
    const atributo = await Atributo.findByPk(id);
    if (!atributo) {
      return res.status(404).json({ message: "Atributo no encontrado" });
    }

    await atributo.destroy();
    res.status(200).json({ message: "Atributo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el atributo", error });
  }
};

module.exports = {
  getAllAtributosByProducto,
  createAtributo,
  updateAtributo,
  deleteAtributo,
};