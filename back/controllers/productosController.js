const Producto = require("../models/Producto");

// Obtener todos los productos de un local
const getProductosByLocal = async (req, res) => {
  const { id_local } = req.params;

  try {
    const productos = await Producto.findAll({
      where: { id_local, activo: true }, // Solo productos activos
    });

    if (!productos || productos.length === 0) {
      return res.status(404).json({ message: "No se encontraron productos para este local" });
    }

    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos del local", error });
  }
};

// Crear un nuevo producto
const createProducto = async (req, res) => {
  const { id_local, id_subcategoria, nombre_producto, descripcion_producto, precio, imagen_url } = req.body;

  try {
    const nuevoProducto = await Producto.create({
      id_local,
      id_subcategoria,
      nombre_producto,
      descripcion_producto,
      precio,
      imagen_url,
    });

    res.status(201).json({ message: "Producto creado exitosamente", producto: nuevoProducto });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_local")) {
        return res.status(400).json({ message: "El local no existe" });
      }
      if (error.fields.includes("id_subcategoria")) {
        return res.status(400).json({ message: "La subcategoría no existe" });
      }
    }
    res.status(500).json({ message: "Error al crear el producto", error });
  }
};

// Actualizar un producto
const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { id_subcategoria, nombre_producto, descripcion_producto, precio, imagen_url, activo } = req.body;

  try {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    await producto.update({
      id_subcategoria,
      nombre_producto,
      descripcion_producto,
      precio,
      imagen_url,
      activo,
    });

    res.status(200).json({ message: "Producto actualizado correctamente", producto });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_subcategoria")) {
        return res.status(400).json({ message: "La subcategoría no existe" });
      }
    }
    res.status(500).json({ message: "Error al actualizar el producto", error });
  }
};

// Eliminar un producto
const deleteProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    await producto.destroy();
    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto", error });
  }
};

module.exports = {
  getProductosByLocal,
  createProducto,
  updateProducto,
  deleteProducto,
};