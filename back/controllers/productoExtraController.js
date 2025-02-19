const ProductoExtra = require("../models/ProductoExtra");

// Obtener todos los extras asociados a un producto
const getExtrasByProducto = async (req, res) => {
  const { id_producto } = req.params;

  try {
    const extras = await ProductoExtra.findAll({
      where: { id_producto, activo: true }, // Solo los extras activos
    });

    if (!extras || extras.length === 0) {
      return res.status(404).json({ message: "No se encontraron extras para este producto" });
    }

    res.json(extras);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los extras del producto", error });
  }
};

// Asociar un extra a un producto
const associateExtraToProducto = async (req, res) => {
  const { id_producto, id_extra } = req.body;

  try {
    const productoExtra = await ProductoExtra.create({
      id_producto,
      id_extra,
      activo: true,
    });

    res.status(201).json({ message: "Extra asociado al producto exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_producto")) {
        return res.status(400).json({ message: "El producto no existe" });
      }
      if (error.fields.includes("id_extra")) {
        return res.status(400).json({ message: "El extra no existe" });
      }
    }
    res.status(500).json({ message: "Error al asociar el extra al producto", error });
  }
};

// Desactivar un extra para un producto
const deactivateExtraForProducto = async (req, res) => {
  const { id_producto, id_extra } = req.params;

  try {
    const productoExtra = await ProductoExtra.findOne({
      where: { id_producto, id_extra },
    });

    if (!productoExtra) {
      return res.status(404).json({ message: "Relación producto-extra no encontrada" });
    }

    await productoExtra.update({ activo: false });

    res.status(200).json({ message: "Extra desactivado para el producto correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al desactivar el extra para el producto", error });
  }
};

// Reactivar un extra para un producto
const reactivateExtraForProducto = async (req, res) => {
  const { id_producto, id_extra } = req.params;

  try {
    const productoExtra = await ProductoExtra.findOne({
      where: { id_producto, id_extra },
    });

    if (!productoExtra) {
      return res.status(404).json({ message: "Relación producto-extra no encontrada" });
    }

    await productoExtra.update({ activo: true });

    res.status(200).json({ message: "Extra reactivado para el producto correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al reactivar el extra para el producto", error });
  }
};

module.exports = {
  getExtrasByProducto,
  associateExtraToProducto,
  deactivateExtraForProducto,
  reactivateExtraForProducto,
};