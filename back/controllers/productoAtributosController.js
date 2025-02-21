const ProductoAtributo = require("../models/ProductoAtributo");

// Obtener todos los atributos de un producto
const getAtributosByProducto = async (req, res) => {
  const { id_producto } = req.params;

  try {
    const atributosProducto = await ProductoAtributo.findAll({
      where: { id_producto },
    });

    if (!atributosProducto || atributosProducto.length === 0) {
      return res.status(404).json({ message: "No se encontraron atributos para este producto" });
    }

    res.json(atributosProducto);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los atributos del producto", error });
  }
};

// Asociar un atributo a un producto
const associateAtributoToProducto = async (req, res) => {
  const { id_producto } = req.params;
  const { id_valor_atributo, precio_adicional } = req.body;
  try {
    const productoAtributo = await ProductoAtributo.create({
      id_producto,
      id_valor_atributo,
      precio_adicional,
    });

    res.status(201).json({ message: "Atributo asociado al producto exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_producto")) {
        return res.status(400).json({ message: "El producto no existe" });
      }
      if (error.fields.includes("id_valor_atributo")) {
        return res.status(400).json({ message: "El valor de atributo no existe" });
      }
    }
    res.status(500).json({ message: "Error al asociar el atributo al producto", error });
  }
};

// Actualizar un atributo de un producto
const updateAtributoForProducto = async (req, res) => {
  const { id } = req.params;
  const { precio_adicional } = req.body;

  try {
    const productoAtributo = await ProductoAtributo.findByPk(id);
    if (!productoAtributo) {
      return res.status(404).json({ message: "Relación producto-atributo no encontrada" });
    }

    await productoAtributo.update({
      precio_adicional,
    });

    res.status(200).json({ message: "Atributo actualizado correctamente para el producto" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el atributo para el producto", error });
  }
};

// Eliminar un atributo de un producto
const deleteAtributoFromProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const productoAtributo = await ProductoAtributo.findByPk(id);
    if (!productoAtributo) {
      return res.status(404).json({ message: "Relación producto-atributo no encontrada" });
    }

    await productoAtributo.destroy();
    res.status(200).json({ message: "Atributo eliminado correctamente del producto" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el atributo del producto", error });
  }
};

module.exports = {
  getAtributosByProducto,
  associateAtributoToProducto,
  updateAtributoForProducto,
  deleteAtributoFromProducto,
};