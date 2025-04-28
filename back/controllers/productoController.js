const Producto = require("../models/Producto");
const Config = require("../models/Config");
const { cloudinary } = require("../config/cloudinary");

// Función para obtener todos los productos
const getProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: [
        {
          association: 'ProductoSucursales',
          attributes: ['id_producto_sucursal', 'id_direccion_local', 'precio', 'preciooferta', 'preciofinal', 'precioofertafinal', 'activo']
        }
      ]
    });

    // Transformar los datos para mantener compatibilidad con el frontend
    const productosTransformados = productos.map(producto => {
      const productoJson = producto.toJSON();

      // Crear objetos para almacenar precios por sucursal
      productoJson.sucursales = [];
      productoJson.sucursalesPrecios = {};
      productoJson.sucursalesPreciosOferta = {};
      productoJson.sucursalesActivo = {};

      // Procesar cada sucursal
      if (productoJson.ProductoSucursales && productoJson.ProductoSucursales.length > 0) {
        productoJson.ProductoSucursales.forEach(sucursal => {
          productoJson.sucursales.push(sucursal.id_direccion_local);
          productoJson.sucursalesPrecios[sucursal.id_direccion_local] = sucursal.precio;
          productoJson.sucursalesActivo[sucursal.id_direccion_local] = sucursal.activo;

          if (sucursal.preciooferta) {
            productoJson.sucursalesPreciosOferta[sucursal.id_direccion_local] = sucursal.preciooferta;
          }
        });
      }

      // Determinar si el producto está activo en al menos una sucursal
      productoJson.activo = productoJson.sucursales.some(
        sucursalId => productoJson.sucursalesActivo[sucursalId]
      );

      // Eliminar el array original de ProductoSucursales para no duplicar datos
      delete productoJson.ProductoSucursales;

      return productoJson;
    });

    res.json(productosTransformados);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ message: "Error al obtener los productos", error: error.message });
  }
};

// Obtener un producto por su IDLOCAL
const getProductosByLocal = async (req, res) => {
  const { id_local } = req.params;

  try {
    const productos = await Producto.findAll({
      where: { id_local },
      include: [
        {
          association: 'ProductoSucursales',
          attributes: ['id_producto_sucursal', 'id_direccion_local', 'precio', 'preciooferta', 'preciofinal', 'precioofertafinal', 'activo']
        }
      ]
    });

    // Transformar los datos para mantener compatibilidad con el frontend
    const productosTransformados = productos.map(producto => {
      const productoJson = producto.toJSON();

      // Crear objetos para almacenar precios por sucursal
      productoJson.sucursales = [];
      productoJson.sucursalesPrecios = {};
      productoJson.sucursalesPreciosOferta = {};
      productoJson.sucursalesActivo = {};

      // Procesar cada sucursal
      if (productoJson.ProductoSucursales && productoJson.ProductoSucursales.length > 0) {
        productoJson.ProductoSucursales.forEach(sucursal => {
          productoJson.sucursales.push(sucursal.id_direccion_local);
          productoJson.sucursalesPrecios[sucursal.id_direccion_local] = sucursal.precio;
          productoJson.sucursalesActivo[sucursal.id_direccion_local] = sucursal.activo;

          if (sucursal.preciooferta) {
            productoJson.sucursalesPreciosOferta[sucursal.id_direccion_local] = sucursal.preciooferta;
          }
        });
      }

      // Determinar si el producto está activo en al menos una sucursal
      productoJson.activo = productoJson.sucursales.some(
        sucursalId => productoJson.sucursalesActivo[sucursalId]
      );

      // Eliminar el array original de ProductoSucursales para no duplicar datos
      delete productoJson.ProductoSucursales;

      return productoJson;
    });

    res.json(productosTransformados);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ message: "Error al obtener los productos", error: error.message });
  }
};

// Obtener un producto por su ID
const getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id, {
      include: [
        {
          association: 'ProductoSucursales',
          attributes: ['id_producto_sucursal', 'id_direccion_local', 'precio', 'preciooferta', 'preciofinal', 'precioofertafinal', 'activo']
        }
      ]
    });

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Transformar los datos para mantener compatibilidad con el frontend
    const productoJson = producto.toJSON();

    // Crear objetos para almacenar precios por sucursal
    productoJson.sucursales = [];
    productoJson.sucursalesPrecios = {};
    productoJson.sucursalesPreciosOferta = {};
    productoJson.sucursalesActivo = {};

    // Procesar cada sucursal
    if (productoJson.ProductoSucursales && productoJson.ProductoSucursales.length > 0) {
      productoJson.ProductoSucursales.forEach(sucursal => {
        productoJson.sucursales.push(sucursal.id_direccion_local);
        productoJson.sucursalesPrecios[sucursal.id_direccion_local] = sucursal.precio;
        productoJson.sucursalesActivo[sucursal.id_direccion_local] = sucursal.activo;

        if (sucursal.preciooferta) {
          productoJson.sucursalesPreciosOferta[sucursal.id_direccion_local] = sucursal.preciooferta;
        }
      });
    }

    // Determinar si el producto está activo en al menos una sucursal
    productoJson.activo = productoJson.sucursales.some(
      sucursalId => productoJson.sucursalesActivo[sucursalId]
    );

    // Eliminar el array original de ProductoSucursales para no duplicar datos
    delete productoJson.ProductoSucursales;

    res.json(productoJson);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ message: "Error al obtener el producto", error: error.message });
  }
};

// Crear un producto con imagen
const createProducto = async (req, res) => {
  const { id_local } = req.params;
  const {
    id_subcategoria,
    nombre_producto,
    descripcion_producto,
  } = req.body;

  try {
    // Verificar si ya existe un producto con el mismo nombre
    const productoExistente = await Producto.findOne({
      where: { nombre_producto },
    });

    if (productoExistente) {
      return res.status(400).json({ message: "El nombre del producto ya está en uso" });
    }

    // Obtener la configuración para el porcentaje de comisión
    let comisionPorcentaje = 15; // Valor por defecto
    try {
      const config = await Config.findOne();
      if (config && config.comision_productos) {
        comisionPorcentaje = parseFloat(config.comision_productos);
      }
      console.log('Configuración encontrada, comisión:', comisionPorcentaje + '%');
    } catch (error) {
      console.warn('Error al obtener configuración, usando valor por defecto:', error.message);
    }

    // Nota: Ya no guardamos los precios en la tabla Productos
    // Los precios ahora se manejan exclusivamente en la tabla Productos_Sucursales

    // Datos para crear el producto
    const productoData = {
      id_local,
      id_subcategoria,
      nombre_producto,
      descripcion_producto,
    };

    // Si el middleware 'upload' subió una imagen, usar su información
    if (req.file) {
      productoData.imagen_url = req.file.path; // URL segura proporcionada por multer-storage-cloudinary
      productoData.imagen_public_id = req.file.filename; // public_id proporcionado por multer-storage-cloudinary
      console.log('Middleware subió la imagen con éxito:', req.file.filename);
    } else {
      console.log('No se proporcionó ninguna imagen en la solicitud');
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

    // Nota: Ya no manejamos los precios en la tabla Productos
    // Los precios ahora se manejan exclusivamente en la tabla Productos_Sucursales

    // Nota: El campo activo ahora se maneja en la tabla producto_sucursales
    // No necesitamos actualizar el campo activo en la tabla productos

    // Manejar eliminación de imagen antigua si hay una nueva imagen
    if (req.file) {
      if (producto.imagen_public_id) {
        try {
          // Usar cloudinary.uploader.destroy para eliminar la imagen
          const result = await cloudinary.uploader.destroy(producto.imagen_public_id);
          console.log('Resultado de eliminación de imagen antigua:', result);
          if (result.result === 'ok' || result.result === 'not found') {
             console.log('Imagen antigua eliminada con éxito o no encontrada en Cloudinary');
          } else {
             console.warn('No se pudo eliminar la imagen antigua de Cloudinary:', result);
          }
        } catch (error) {
          console.error('Error al intentar eliminar imagen antigua de Cloudinary:', error);
          // Considerar si se debe detener la actualización o continuar sin eliminar la imagen antigua
        }
      }
      // Usar la información de req.file proporcionada por el middleware
      updateData.imagen_url = req.file.path;
      updateData.imagen_public_id = req.file.filename;
      console.log('Middleware subió nueva imagen con éxito:', req.file.filename);
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
    if (producto.imagen_public_id) {
      try {
        const result = await cloudinary.uploader.destroy(producto.imagen_public_id);
        console.log('Resultado de eliminación de imagen:', result);
        if (result.result === 'ok' || result.result === 'not found') {
          console.log('Imagen eliminada con éxito o no encontrada en Cloudinary');
        } else {
          console.warn('No se pudo eliminar la imagen de Cloudinary:', result);
        }
      } catch (cloudinaryError) {
        console.error('Error al eliminar imagen de Cloudinary:', cloudinaryError);
        // Continuamos con la eliminación del producto aunque falle la eliminación de la imagen
      }
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
  getProductosByLocal,
};