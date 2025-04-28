const Producto = require("../models/Producto");
const Config = require("../models/Config");
const { cloudinary } = require("../config/cloudinary");

// Función para obtener todos los productos
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
    const comisionDecimal = comisionPorcentaje / 100;

    console.log('Porcentaje de comisión aplicado:', comisionPorcentaje + '%');

    // Calcular precios finales con la comisión
    const precioNumerico = parseFloat(precio) || 0;
    const precioFinal = precioNumerico * (1 + comisionDecimal);

    // Calcular precio de oferta final si existe
    let precioOfertaFinal = null;
    let precioOfertaNumerico = null;
    if (preciooferta) {
      precioOfertaNumerico = parseFloat(preciooferta);
      precioOfertaFinal = precioOfertaNumerico * (1 + comisionDecimal);
    }

    // Mostrar todos los precios en la consola para depuración
    console.log('PRECIOS AL CREAR PRODUCTO:');
    console.log('precio (original):', precioNumerico);
    console.log('preciooferta (original):', precioOfertaNumerico);
    console.log('preciofinal (con comisión):', precioFinal);
    console.log('precioofertafinal (con comisión):', precioOfertaFinal);

    // Datos para crear el producto
    const productoData = {
      id_local,
      id_subcategoria,
      nombre_producto,
      descripcion_producto,
      precio: precioNumerico,
      preciooferta: preciooferta ? parseFloat(preciooferta) : null,
      precioofertafinal: precioOfertaFinal,
      preciofinal: precioFinal,
      activo: activo !== undefined ? activo : true,
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
    const comisionDecimal = comisionPorcentaje / 100;

    console.log('Porcentaje de comisión aplicado:', comisionPorcentaje + '%');

    // Mostrar los valores recibidos del cliente
    console.log('VALORES RECIBIDOS DEL CLIENTE:');
    console.log('precio:', precio);
    console.log('preciooferta:', preciooferta);
    console.log('preciofinal:', preciofinal);
    console.log('precioofertafinal:', precioofertafinal);

    // Convertir el precio a número decimal si está definido
    if (precio !== undefined) {
      // Asegurarse de que sea un número válido
      const precioNumerico = parseFloat(precio);
      if (!isNaN(precioNumerico)) {
        updateData.precio = precioNumerico;
        // Calcular y actualizar el precio final con la comisión
        updateData.preciofinal = precioNumerico * (1 + comisionDecimal);
        console.log('Precio actualizado a:', precioNumerico);
        console.log('Precio final calculado:', updateData.preciofinal);
      } else {
        console.error('Error: El precio no es un número válido:', precio);
        return res.status(400).json({ message: "El precio debe ser un número válido" });
      }
    }

    // Manejar el precio de oferta correctamente
    if (preciooferta !== undefined) {
      // Si es un string vacío o null, establecer como null
      if (preciooferta === '' || preciooferta === null) {
        updateData.preciooferta = null;
        updateData.precioofertafinal = null;
        console.log('Precio de oferta eliminado');
      } else {
        const precioOfertaNumerico = parseFloat(preciooferta);
        if (!isNaN(precioOfertaNumerico)) {
          updateData.preciooferta = precioOfertaNumerico;
          // Calcular y actualizar el precio de oferta final con la comisión
          updateData.precioofertafinal = precioOfertaNumerico * (1 + comisionDecimal);
          console.log('Precio de oferta actualizado a:', precioOfertaNumerico);
          console.log('Precio de oferta final calculado:', updateData.precioofertafinal);
        } else {
          console.error('Error: El precio de oferta no es un número válido:', preciooferta);
          return res.status(400).json({ message: "El precio de oferta debe ser un número válido" });
        }
      }
    }

    // Ignoramos los valores de precioofertafinal y preciofinal que vienen del cliente
    // ya que los calculamos automáticamente basados en precio y preciooferta

    // Mostrar los valores finales que se guardarán en la base de datos
    console.log('VALORES FINALES QUE SE GUARDARÁN:');
    console.log('precio:', updateData.precio);
    console.log('preciooferta:', updateData.preciooferta);
    console.log('preciofinal:', updateData.preciofinal);
    console.log('precioofertafinal:', updateData.precioofertafinal);

    // Convertir el valor de activo a booleano
    if (activo !== undefined) {
      if (activo === 'true' || activo === '1' || activo === 1) {
        updateData.activo = true;
      } else if (activo === 'false' || activo === '0' || activo === 0) {
        updateData.activo = false;
      } else {
        updateData.activo = Boolean(activo);
      }
    }

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