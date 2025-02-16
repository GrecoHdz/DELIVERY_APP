const { validationResult } = require('express-validator');
const ProductoExtra = require('../models/ProductoExtra');

// Crear una nueva relación Producto-Extra
exports.createProductoExtra = async (req, res) => {
  // Verificar errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_producto, id_extra, activo } = req.body;

    // Crear la relación en la base de datos
    const productoExtra = await ProductoExtra.create({ id_producto, id_extra, activo });
    res.status(201).json(productoExtra);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la relación Producto-Extra' });
  }
};

// Obtener todas las relaciones Producto-Extra
exports.getAllProductoExtras = async (req, res) => {
  try {
    const productoExtras = await ProductoExtra.findAll();
    res.status(200).json(productoExtras);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las relaciones Producto-Extra' });
  }
};

// Actualizar una relación Producto-Extra
exports.updateProductoExtra = async (req, res) => {
  // Verificar errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_producto, id_extra } = req.params;
    const { activo } = req.body;

    // Buscar la relación en la base de datos
    const productoExtra = await ProductoExtra.findOne({ where: { id_producto, id_extra } });
    if (!productoExtra) {
      return res.status(404).json({ error: 'Relación Producto-Extra no encontrada' });
    }

    // Actualizar el campo activo
    productoExtra.activo = activo;
    await productoExtra.save();

    res.status(200).json(productoExtra);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la relación Producto-Extra' });
  }
};

// Eliminar una relación Producto-Extra
exports.deleteProductoExtra = async (req, res) => {
  // Verificar errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_producto, id_extra } = req.params;

    // Buscar la relación en la base de datos
    const productoExtra = await ProductoExtra.findOne({ where: { id_producto, id_extra } });
    if (!productoExtra) {
      return res.status(404).json({ error: 'Relación Producto-Extra no encontrada' });
    }

    // Eliminar la relación
    await productoExtra.destroy();
    res.status(200).json({ message: 'Relación Producto-Extra eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la relación Producto-Extra' });
  }
};