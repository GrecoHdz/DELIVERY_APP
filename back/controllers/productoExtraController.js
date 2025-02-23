const ProductoExtra = require("../models/ProductoExtra");

// Obtener todos los extras de un producto
const getAllExtrasByProducto = async (req, res) => {
  const { id_producto } = req.params;

  try {
    const extras = await ProductoExtra.findAll({
      where: { id_producto },
    });

    if (!extras || extras.length === 0) {
      return res.status(404).json({ message: "No se encontraron extras para este producto" });
    }

    res.json(extras);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los extras del producto", error });
  }
};

// Crear un nuevo extra para un producto
const createProductoExtra = async (req, res) => {
  const { id_producto } = req.params;
  const { nombre, precio } = req.body;

  try {
    const extra = await ProductoExtra.create({
      id_producto,
      nombre,
      precio, 
    });

    res.status(201).json({ message: "Extra creado exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ message: "El producto no existe" });
    }
    res.status(500).json({ message: "Error al crear el extra", error });
  }
};

// Actualizar un extra de un producto
const updateProductoExtra = async (req, res) => {
  const { id_producto } = req.params;
  const { precio, activo } = req.body;

  try {
    const extra = await ProductoExtra.findOne({
      where: { id_producto },
    });

    if (!extra) {
      return res.status(404).json({ message: "Extra no encontrado" });
    }

    await extra.update({
      precio,
      activo,
    });

    res.status(200).json({ message: "Extra actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el extra", error });
  }
};

// Eliminar un extra de un producto
const deleteProductoExtra = async (req, res) => {
  const { id_producto } = req.params;

  try {
    const extra = await ProductoExtra.findOne({
      where: { id_producto },
    });

    if (!extra) {
      return res.status(404).json({ message: "Extra no encontrado" });
    }

    await extra.destroy();
    res.status(200).json({ message: "Extra eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el extra", error });
  }
};

module.exports = {
  getAllExtrasByProducto,
  createProductoExtra,
  updateProductoExtra,
  deleteProductoExtra,
};