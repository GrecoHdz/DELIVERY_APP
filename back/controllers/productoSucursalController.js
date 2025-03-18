const ProductoSucursal = require("../models/ProductoSucursal");

// Obtener todos los productos de una sucursal
const getAllProductosBySucursal = async (req, res) => {
  const { id_direccion_local } = req.params;

  try {
    const productos = await ProductoSucursal.findAll({
      where: { id_direccion_local },
    });

    if (!productos || productos.length === 0) {
      return res.status(404).json({ message: "No se encontraron productos para esta sucursal" });
    }
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos de la sucursal", error });
  }
};

// Obtener todas las sucursales de un producto
const getSucursalesByProducto = async (req, res) => {
  const { id_producto } = req.params;

  try {
    const sucursales = await ProductoSucursal.findAll({
      where: { id_producto },
    });

    if (!sucursales || sucursales.length === 0) {
      return res.status(404).json({ message: "No se encontraron sucursales para este producto" });
    }
    res.json(sucursales);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las sucursales del producto", error });
  }
};

// Crear un nuevo producto en una sucursal
const createProductoSucursal = async (req, res) => {
    const { id_producto } = req.params;
    const { id_direccion_local, precio, preciofinal } = req.body;
  try {
    const productoSucursal = await ProductoSucursal.create({
      id_producto,
      id_direccion_local,
      precio,
      preciofinal, 
    });
    res.status(201).json({ message: "Producto agregado a la sucursal exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_producto")) {
        return res.status(400).json({ message: "El producto no existe" });
      }
      if (error.fields.includes("id_direccion_local")) {
        return res.status(400).json({ message: "La dirección del local no existe" });
      }
    }
    res.status(500).json({ message: "Error al agregar el producto a la sucursal", error });
  }
};

// Actualizar un producto en una sucursal
const updateProductoSucursal = async (req, res) => {
  const { id } = req.params;
  const { id_producto, id_direccion_local, precio, preciofinal, activo } = req.body;

  try {
    const productoSucursal = await ProductoSucursal.findByPk(id);
    if (!productoSucursal) {
      return res.status(404).json({ message: "Producto en sucursal no encontrado" });
    }
    await productoSucursal.update({
      id_producto,
      id_direccion_local,
      precio,
      preciofinal,
      activo,
    });

    res.status(200).json({ message: "Producto en sucursal actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto en sucursal", error });
  }
};

// Eliminar un producto de una sucursal
const deleteProductoSucursal = async (req, res) => {
  const { id } = req.params;
  try {
    const productoSucursal = await ProductoSucursal.findByPk(id);
    if (!productoSucursal) {
      return res.status(404).json({ message: "Producto en sucursal no encontrado" });
    }
    await productoSucursal.destroy();
    res.status(200).json({ message: "Producto eliminado de la sucursal correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto de la sucursal", error });
  }
};

module.exports = { 
  getAllProductosBySucursal, 
  createProductoSucursal,  
  updateProductoSucursal, 
  deleteProductoSucursal,
  getSucursalesByProducto, // Exportamos el nuevo controlador
};