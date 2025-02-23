const Pedido = require("../models/Pedido");

// Obtener todos los pedidos
const getAllPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll();
    if (!pedidos || pedidos.length === 0) {
      return res.status(404).json({ message: "No se encontraron pedidos" });
    }
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los pedidos", error });
  }
};

// Obtener un pedido por su ID
const getPedidoById = async (req, res) => {
  const { id } = req.params;

  try {
    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el pedido", error });
  }
};

// Crear un nuevo pedido
const createPedido = async (req, res) => {
    const { id_cliente } = req.params;
    const {    
    id_local,
    id_direccion_cliente,
    id_direccion_local,  
    fecha_pedido, 
  } = req.body;

  try {
    const pedido = await Pedido.create({
      id_cliente,
      id_local,
      id_direccion_cliente,
      id_direccion_local,  
      fecha_pedido, 
    });

    res.status(201).json({ message: "Pedido creado exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      if (error.fields.includes("id_cliente")) {
        return res.status(400).json({ message: "El cliente no existe" });
      }
      if (error.fields.includes("id_local")) {
        return res.status(400).json({ message: "El local no existe" });
      }
      if (error.fields.includes("id_direccion_cliente")) {
        return res.status(400).json({ message: "La dirección del cliente no existe" });
      }
      if (error.fields.includes("id_direccion_local")) {
        return res.status(400).json({ message: "La dirección del local no existe" });
      }
    }
    res.status(500).json({ message: "Error al crear el pedido", error });
  }
};

// Actualizar un pedido
const updatePedido = async (req, res) => {
  const { id } = req.params;
  const {
    id_driver,
    tiempo_preparacion_estimado,
    tiempo_llegada_estimado, 
    fecha_entrega,
    estado_pedido,
  } = req.body;

  try {
    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    await pedido.update({
      id_driver,
      tiempo_preparacion_estimado,
      tiempo_llegada_estimado,
      fecha_entrega,
      estado_pedido,
    });

    res.status(200).json({ message: "Pedido actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el pedido", error });
  }
};

// Eliminar un pedido
const deletePedido = async (req, res) => {
  const { id } = req.params;

  try {
    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    await pedido.destroy();
    res.status(200).json({ message: "Pedido eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el pedido", error });
  }
};

module.exports = {
  getAllPedidos,
  getPedidoById,
  createPedido,
  updatePedido,
  deletePedido,
};