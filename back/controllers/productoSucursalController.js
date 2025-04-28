const ProductoSucursal = require("../models/ProductoSucursal");
const Config = require("../models/Config");
const { sequelize } = require("../config/database");

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
    console.log(`Buscando sucursales para el producto ID: ${id_producto}`);

    // Verificar si la tabla existe
    try {
      await sequelize.query(`SELECT 1 FROM Productos_Sucursales LIMIT 1`);
    } catch (tableError) {
      console.error('Error al verificar la tabla Productos_Sucursales:', tableError);
      // Si la tabla no existe, devolver un array vacío en lugar de un error
      return res.json([]);
    }

    // Buscar las sucursales
    const sucursales = await ProductoSucursal.findAll({
      where: { id_producto },
    });

    console.log(`Sucursales encontradas: ${sucursales ? sucursales.length : 0}`);

    // Si no hay sucursales, devolver un array vacío en lugar de un error 404
    if (!sucursales || sucursales.length === 0) {
      console.log(`No se encontraron sucursales para el producto ID: ${id_producto}`);
      return res.json([]);
    }

    res.json(sucursales);
  } catch (error) {
    console.error(`Error al obtener sucursales para producto ID ${id_producto}:`, error);
    // Devolver un array vacío en lugar de un error 500
    return res.json([]);
  }
};

// Crear un nuevo producto en una sucursal
const createProductoSucursal = async (req, res) => {
    const { id_producto } = req.params;
    const { id_direccion_local, precio, preciooferta } = req.body;
  try {
    // Obtener la configuración para el porcentaje de comisión
    const config = await Config.findOne();
    const comisionPorcentaje = config ? parseFloat(config.comision_productos) : 15; // Usar 15% por defecto si no hay configuración

    // Crear objeto con los datos básicos
    const productoData = {
      id_producto,
      id_direccion_local,
      precio: precio || null,
      preciooferta: preciooferta || null,
    };

    // Si se proporciona un precio, calcular el precio final con la comisión
    if (precio) {
      // Calcular precio final (precio + comisión)
      const comisionDecimal = comisionPorcentaje / 100;
      productoData.preciofinal = parseFloat(precio) * (1 + comisionDecimal);

      // Si hay precio de oferta, calcular también el precio de oferta final
      if (preciooferta) {
        productoData.precioofertafinal = parseFloat(preciooferta) * (1 + comisionDecimal);
      }
    }

    const productoSucursal = await ProductoSucursal.create(productoData);
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
  const { id_producto, id_direccion_local, precio, preciooferta, activo } = req.body;

  console.log('Actualizando producto en sucursal con ID:', id);
  console.log('Datos recibidos:', req.body);
  console.log('Tipo de preciooferta:', typeof preciooferta);
  console.log('Valor de preciooferta:', preciooferta);

  try {
    // 1. Buscar el producto en sucursal
    const productoSucursal = await ProductoSucursal.findByPk(id);
    if (!productoSucursal) {
      console.log(`No se encontró producto en sucursal con ID: ${id}`);
      return res.status(404).json({ message: "Producto en sucursal no encontrado" });
    }

    console.log('Producto en sucursal encontrado:', productoSucursal.toJSON());

    // 2. Obtener la configuración para el porcentaje de comisión
    const config = await Config.findOne();
    const comisionPorcentaje = config ? parseFloat(config.comision_productos) : 15; // Usar 15% por defecto si no hay configuración
    const comisionDecimal = comisionPorcentaje / 100;
    console.log(`Comisión actual: ${comisionPorcentaje}% (${comisionDecimal} en decimal)`);

    // 3. Preparar datos para actualizar
    const updateData = {};

    // 4. Actualizar campos según lo que se envió en la solicitud

    // Actualizar ID de producto (raro, pero por si acaso)
    if (id_producto !== undefined) {
      updateData.id_producto = id_producto;
    }

    // Actualizar ID de dirección de local (también raro)
    if (id_direccion_local !== undefined) {
      updateData.id_direccion_local = id_direccion_local;
    }

    // Actualizar precio regular
    if (precio !== undefined) {
      const precioNumerico = parseFloat(precio);
      if (!isNaN(precioNumerico)) {
        updateData.precio = precioNumerico;
        updateData.preciofinal = precioNumerico * (1 + comisionDecimal);
        console.log(`Actualizando precio a ${precioNumerico} y precio final a ${updateData.preciofinal}`);
      }
    }

    // Actualizar precio de oferta
    if (preciooferta !== undefined) {
      // Caso especial: eliminar precio de oferta
      if (preciooferta === null || preciooferta === '' || preciooferta === 'null' || String(preciooferta).trim() === '') {
        updateData.preciooferta = null;
        updateData.precioofertafinal = null;
        console.log('Eliminando precio de oferta');
      } else {
        // Caso normal: establecer precio de oferta
        const precioOfertaNumerico = parseFloat(preciooferta);
        if (!isNaN(precioOfertaNumerico)) {
          updateData.preciooferta = precioOfertaNumerico;
          updateData.precioofertafinal = precioOfertaNumerico * (1 + comisionDecimal);
          console.log(`Actualizando precio de oferta a ${precioOfertaNumerico} y precio de oferta final a ${updateData.precioofertafinal}`);
        } else {
          console.error(`Error: El precio de oferta "${preciooferta}" no es un número válido`);
          return res.status(400).json({
            message: "El precio de oferta debe ser un número válido",
            errores: [{ campo: "preciooferta", mensaje: `El valor "${preciooferta}" no es un número válido` }]
          });
        }
      }
    }

    // Actualizar estado activo
    if (activo !== undefined) {
      updateData.activo = activo;
    }

    // 5. Verificar si hay datos para actualizar
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No se proporcionaron datos para actualizar",
        errores: [{ campo: "general", mensaje: "Debe proporcionar al menos un campo para actualizar" }]
      });
    }

    // 6. Realizar la actualización
    console.log('Datos a actualizar:', updateData);
    await productoSucursal.update(updateData);

    // 7. Responder con éxito
    res.status(200).json({
      message: "Producto en sucursal actualizado correctamente",
      data: await productoSucursal.reload()
    });
  } catch (error) {
    console.error('Error al actualizar producto en sucursal:', error);

    // Manejar diferentes tipos de errores
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: "Error de validación al actualizar el producto en sucursal",
        errores: error.errors.map(e => ({ campo: e.path, mensaje: e.message }))
      });
    }

    if (error.name === 'SequelizeDatabaseError') {
      return res.status(400).json({
        message: "Error de base de datos al actualizar el producto en sucursal",
        errores: [{ campo: "database", mensaje: error.message }]
      });
    }

    res.status(500).json({
      message: "Error al actualizar el producto en sucursal",
      errores: [{ campo: "general", mensaje: error.message }]
    });
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