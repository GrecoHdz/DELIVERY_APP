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

// Obtener un producto por su IDLOCAL
const getProductosByLocal = async (req, res) => {
  const { id_local } = req.params;

  try {
    const productos = await Producto.findAll({
      where: { id_local },
    });

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

// Crear un producto con imagen
const createProducto = async (req, res) => {
  const { id_local } = req.params;
  const {
    id_subcategoria,
    nombre_producto,
    descripcion_producto,
    precio,
    preciooferta,
    precioofertafinal,
    preciofinal,
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

    // Datos para crear el producto
    const productoData = {
      id_local,
      id_subcategoria,
      nombre_producto,
      descripcion_producto,
      precio,
      preciooferta: preciooferta || null,
      precioofertafinal: precioofertafinal || null,
      preciofinal: preciofinal,
      activo: activo !== undefined ? activo : true,
    };

    // Si se subió una imagen, guardar la URL y el public_id
    if (req.file) {
      productoData.imagen_url = req.file.path; // Cloudinary URL
      productoData.imagen_public_id = req.file.filename; // Cloudinary public_id
    }

    // Crear el nuevo producto
    const producto = await Producto.create(productoData);

    res.status(201).json({ 
      message: "Producto creado exitosamente",
      producto
    });
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
    preciooferta,
    precioofertafinal,
    preciofinal,
    activo,
  } = req.body;

  try {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Datos para actualizar
    const updateData = {};
    if (id_local !== undefined) updateData.id_local = id_local;
    if (id_subcategoria !== undefined) updateData.id_subcategoria = id_subcategoria;
    if (nombre_producto !== undefined) updateData.nombre_producto = nombre_producto;
    if (descripcion_producto !== undefined) updateData.descripcion_producto = descripcion_producto;
    if (precio !== undefined) updateData.precio = precio;
    if (preciooferta !== undefined) updateData.preciooferta = preciooferta;
    if (precioofertafinal !== undefined) updateData.precioofertafinal = precioofertafinal;    
    if (preciofinal !== undefined) updateData.preciofinal = preciofinal;    
    if (activo !== undefined) updateData.activo = activo;

    // Si se subió una nueva imagen
    if (req.file) {
      updateData.imagen_url = req.file.path;
      updateData.imagen_public_id = req.file.filename;

      // Aquí se debería implementar la eliminación de la imagen anterior en Cloudinary si es necesario
    }

    await producto.update(updateData);

    res.status(200).json({ 
      message: "Producto actualizado correctamente",
      producto: await Producto.findByPk(id)
    });
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

    // Si el producto tiene una imagen, eliminarla de Cloudinary
    // Aquí se debería implementar la lógica de eliminación de la imagen

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
  getProductosByLocal,
};