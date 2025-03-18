const PedidoDetalle = require("../models/PedidoDetalle");  
// Obtener todos los detalles de pedidos
const getAllDetalles = async (req, res) => {
  try {
    const detalles = await PedidoDetalle.findAll();
    if (!detalles || detalles.length === 0) {
      return res.status(404).json({ message: "No se encontraron detalles de pedidos" });
    }
    res.json(detalles);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los detalles de pedidos", error });
  }
};

// Obtener un detalle de pedido por su ID
const getDetalleById = async (req, res) => {
  const { id } = req.params;

  try {
    const detalle = await PedidoDetalle.findByPk(id);
    if (!detalle) {
      return res.status(404).json({ message: "Detalle de pedido no encontrado" });
    }
    res.json(detalle);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el detalle de pedido", error });
  }
}; 

// Crear un nuevo detalle de pedido
const createDetalle = async (req, res) => {
    const { id_pedido } = req.params;
    const {
    id_producto,
    nombre_producto,
    precio_unitario,
    cantidad,
    subtotal,
    atributos,
    extras,
  } = req.body;

  try {
    const detalle = await PedidoDetalle.create({
      id_pedido,
      id_producto,
      nombre_producto,
      precio_unitario,
      cantidad,
      subtotal,
      atributos,
      extras,
    });

    res.status(201).json({ message: "Detalle de pedido creado exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_pedido")) {
        return res.status(400).json({ message: "El pedido no existe" });
      }
      if (error.fields.includes("id_producto")) {
        return res.status(400).json({ message: "El producto no existe" });
      }
    }
    res.status(500).json({ message: "Error al crear el detalle de pedido", error });
  }
};

// Actualizar un detalle de pedido
const updateDetalle = async (req, res) => {
  const { id } = req.params;
  const {
    nombre_producto,
    precio_unitario,
    cantidad,
    subtotal,
    atributos,
    notas,
  } = req.body;

  try {
    const detalle = await PedidoDetalle.findByPk(id);
    if (!detalle) {
      return res.status(404).json({ message: "Detalle de pedido no encontrado" });
    }

    await detalle.update({
      nombre_producto,
      precio_unitario,
      cantidad,
      subtotal,
      atributos,
      notas,
    });

    res.status(200).json({ message: "Detalle de pedido actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el detalle de pedido", error });
  }
};

// Eliminar un detalle de pedido
const deleteDetalle = async (req, res) => {
  const { id } = req.params;

  try {
    const detalle = await PedidoDetalle.findByPk(id);
    if (!detalle) {
      return res.status(404).json({ message: "Detalle de pedido no encontrado" });
    }

    await detalle.destroy();
    res.status(200).json({ message: "Detalle de pedido eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el detalle de pedido", error });
  }
};

module.exports = {
  getAllDetalles,
  getDetalleById, 
  createDetalle,
  updateDetalle,
  deleteDetalle,
};