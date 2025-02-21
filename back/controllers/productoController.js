const Producto = require("../models/Producto");

// Obtener todos los productos
const getProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos", error });
  }
};

// Obtener un producto por su ID
const getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el producto", error });
  }
};

const createProducto = async (req, res) => {
  const { id_local } = req.params; // Obtener id_local de los parámetros de la ruta
  const {
    id_subcategoria,
    nombre_producto,
    descripcion_producto,
    precio,
    imagen_url,
    activo,
  } = req.body;

  try {
    // Verificar si ya existe un producto con el mismo nombre
    const productoExistente = await Producto.findOne({
      where: { nombre_producto },
    });

    if (productoExistente) {
      return res.status(400).json({ message: "El nombre del producto ya está en uso" });
    }

    // Crear el nuevo producto
    const producto = await Producto.create({
      id_local,
      id_subcategoria,
      nombre_producto,
      descripcion_producto,
      precio,
      imagen_url,
      activo,
    });

    res.status(201).json({ message: "Producto creado exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "El nombre del producto ya está en uso" });
    }
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
  const {
    id_local,
    id_subcategoria,
    nombre_producto,
    descripcion_producto,
    precio,
    imagen_url,
    activo,
  } = req.body;

  try {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    await producto.update({
      id_local,
      id_subcategoria,
      nombre_producto,
      descripcion_producto,
      precio,
      imagen_url,
      activo,
    });

    res.status(200).json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_local")) {
        return res.status(400).json({ message: "El local no existe" });
      }
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
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
};