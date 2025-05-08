const Pedido = require("../models/Pedido");
const PedidoDetalle = require("../models/PedidoDetalle");
const DireccionLocal = require("../models/DireccionLocal");
const OfertaDriver = require("../models/OfertaDriver");
const MetodoPago = require("../models/MetodoPago");
const { getIO } = require('../socket');

// Obtener todos los pedidos
const getAllPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      attributes: [
        'id_pedido',
        'id_cliente',
        'id_local',
        'id_driver',
        'id_metodo_pago',
        'tipo_pedido',
        'fecha_pedido',
        'fecha_entrega',
        'estado',
        'tiempo_preparacion_estimado',
        'tiempo_llegada_estimado'
      ],
      include: [
        {
          model: PedidoDetalle,
          as: 'items',
          attributes: ['id_pedido_detalle', 'nombre_producto', 'cantidad', 'precio_unitario', 'subtotal', 'atributos', 'extras', 'notas']
        },
        {
          model: DireccionLocal,
          as: 'DireccionLocal',
          attributes: ['colonia', 'direccion_precisa', 'latitud', 'longitud']
        },
        {
          model: MetodoPago,
          attributes: ['id_metodo_pago', 'tipo_pago']
        }
      ]
    });

    // Obtener las ofertas de drivers para cada pedido
    const pedidosProcesados = await Promise.all(pedidos.map(async pedido => {
      const pedidoJSON = pedido.toJSON();
      const oferta = await OfertaDriver.findOne({
        where: { id_pedido: pedidoJSON.id_pedido }
      });

      return {
        ...pedidoJSON,
        pago_delivery: oferta ? oferta.precio_oferta : 0,
        items: pedidoJSON.items.map(item => ({
          ...item,
          atributos: typeof item.atributos === 'string' ? JSON.parse(item.atributos) : item.atributos || {},
          extras: typeof item.extras === 'string' ? JSON.parse(item.extras) : item.extras || []
        }))
      };
    }));

    if (!pedidos || pedidos.length === 0) {
      return res.status(404).json({ message: "No se encontraron pedidos" });
    }
    res.json(pedidosProcesados);
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    res.status(500).json({ message: "Error al obtener los pedidos", error });
  }
};

// Obtener un pedido por su ID
const getPedidoById = async (req, res) => {
  const { id } = req.params;

  try {
    const pedido = await Pedido.findByPk(id, {
      attributes: [
        'id_pedido',
        'id_cliente',
        'id_local',
        'id_driver',
        'id_metodo_pago',
        'tipo_pedido',
        'fecha_pedido',
        'fecha_entrega',
        'estado',
        'tiempo_preparacion_estimado',
        'tiempo_llegada_estimado'
      ],
      include: [
        {
          model: PedidoDetalle,
          as: 'items',
          attributes: ['id_pedido_detalle', 'nombre_producto', 'cantidad', 'precio_unitario', 'subtotal', 'atributos', 'extras', 'notas']
        },
        {
          model: DireccionLocal,
          as: 'DireccionLocal',
          attributes: ['colonia', 'direccion_precisa', 'latitud', 'longitud']
        },
        {
          model: MetodoPago,
          attributes: ['id_metodo_pago', 'tipo_pago']
        }
      ]
    });

    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    // Obtener la oferta del driver para este pedido
    const oferta = await OfertaDriver.findOne({
      where: { id_pedido: id }
    });

    const pedidoJSON = pedido.toJSON();
    pedidoJSON.pago_delivery = oferta ? oferta.precio_oferta : 0;

    res.json(pedidoJSON);
  } catch (error) {
    console.error("Error al obtener el pedido:", error);
    res.status(500).json({ message: "Error al obtener el pedido", error });
  }
};

// Controlador para obtener el conteo de productos en el carrito
const getCarritoCount = async (req, res) => {
  try {
    const { id_cliente } = req.params; // Obtenemos el id_cliente de los parámetros de la ruta

    // Buscamos si el cliente tiene al menos un pedido
    const pedidos = await Pedido.findAll({
      where: { id_cliente }, // Filtramos por id_cliente
      limit: 1, // Solo necesitamos saber si existe al menos uno
    });

    // Si hay al menos un pedido, mostramos el indicador (punto)
    const hasPedidos = pedidos.length > 0;

    // Respondemos con un indicador para el front
    res.json({ hasPedidos });

  } catch (error) {
    console.error("Error al obtener el indicador del carrito:", error);
    res.status(500).json({ message: 'Error al obtener el indicador del carrito' });
  }
};

// Crear un nuevo pedido
const createPedido = async (req, res) => {
  try {
    const { id_cliente, id_local, id_direccion_cliente, id_direccion_local, id_metodo_pago, tipo_pedido } = req.body;

    const pedido = await Pedido.create({
      id_cliente,
      id_local,
      id_direccion_cliente,
      id_direccion_local,
      id_metodo_pago,
      tipo_pedido,
      fecha_pedido: new Date(),
      estado: 'pendiente'
    });

    // Emitir evento de nuevo pedido
    const io = getIO();
    io.emit('nuevo_pedido', {
      id_pedido: pedido.id_pedido,
      id_cliente,
      id_local,
      id_direccion_cliente,
      id_direccion_local,
      id_metodo_pago,
      tipo_pedido,
      fecha_pedido: pedido.fecha_pedido,
      estado: pedido.estado
    });

    res.status(201).json(pedido);
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ message: 'Error al crear el pedido' });
  }
};

// Actualizar un pedido
const updatePedido = async (req, res) => {
  const { id } = req.params;
  const {
    id_driver,
    id_metodo_pago,
    tipo_pedido,
    tiempo_preparacion_estimado,
    tiempo_llegada_estimado,
    fecha_entrega,
    estado_pedido,
    fecha_pedido,
  } = req.body;

  try {
    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    // Actualizar el pedido
    await pedido.update({
      id_driver,
      id_metodo_pago,
      tipo_pedido,
      tiempo_preparacion_estimado,
      tiempo_llegada_estimado,
      fecha_entrega,
      estado: estado_pedido,
      fecha_pedido,
    });

    // Si el estado del pedido es cancelado, actualizar el estado de la oferta
    if (estado_pedido === 'cancelado') {
      const oferta = await OfertaDriver.findOne({
        where: { id_pedido: id }
      });

      if (oferta) {
        await oferta.update({
          estado_oferta: 'cancelado'
        });
      }
    }

    // Emitir evento de actualización de estado
    const io = getIO();
    io.emit('estado_pedido_actualizado', {
      id_pedido: pedido.id_pedido,
      estado: pedido.estado,
      tarifa: pedido.tarifa
    });

    res.status(200).json({ message: "Pedido actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el pedido:", error);
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
  getCarritoCount,
  createPedido,
  updatePedido,
  deletePedido,
};