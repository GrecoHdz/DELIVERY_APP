const socketIO = require('socket.io');

let io;
const locales = new Map(); // Mapa para almacenar los locales conectados
const clientes = new Map(); // Mapa para almacenar los clientes conectados

const initSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:3000"], // URLs del frontend
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    // Registrar un local
    socket.on('register_local', (data) => {
      console.log('Local registrado:', data.localId, 'Socket ID:', socket.id);
      locales.set(data.localId, socket.id);

      // Unir al socket a una sala específica para este local
      socket.join(`local_${data.localId}`);
    });

    // Registrar un cliente
    socket.on('register_client', (data) => {
      console.log('Cliente registrado:', data.clientId, 'Socket ID:', socket.id);
      clientes.set(data.clientId, socket.id);

      // Unir al socket a una sala específica para este cliente
      socket.join(`client_${data.clientId}`);
    });

    // Suscribirse a actualizaciones de pedidos
    socket.on('subscribe_to_orders', (data) => {
      if (data.client_id) {
        console.log('Cliente suscrito a actualizaciones de pedidos:', data.client_id);
        socket.join(`orders_client_${data.client_id}`);
      }

      if (data.local_id) {
        console.log('Local suscrito a actualizaciones de pedidos:', data.local_id);
        socket.join(`orders_local_${data.local_id}`);
      }
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);

      // Eliminar el socket de los mapas
      for (const [localId, socketId] of locales.entries()) {
        if (socketId === socket.id) {
          locales.delete(localId);
          console.log('Local eliminado:', localId);
          break;
        }
      }

      for (const [clientId, socketId] of clientes.entries()) {
        if (socketId === socket.id) {
          clientes.delete(clientId);
          console.log('Cliente eliminado:', clientId);
          break;
        }
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io no está inicializado');
  }
  return io;
};

// Función para enviar un nuevo pedido a todos los locales
const emitNuevoPedido = (pedido) => {
  if (!io) {
    throw new Error('Socket.io no está inicializado');
  }

  // Si el pedido tiene un local específico, enviar solo a ese local
  if (pedido.id_local) {
    const localSocketId = locales.get(pedido.id_local);
    if (localSocketId) {
      io.to(localSocketId).emit('nuevo_pedido', pedido);
      console.log(`Pedido enviado al local ${pedido.id_local}`);
    } else {
      io.to(`local_${pedido.id_local}`).emit('nuevo_pedido', pedido);
      console.log(`Pedido enviado a la sala del local ${pedido.id_local}`);
    }
  } else {
    // Si no tiene un local específico, enviar a todos los locales
    io.emit('nuevo_pedido', pedido);
    console.log('Pedido enviado a todos los locales');
  }
};

// Función para enviar actualización de estado de pedido al cliente
const emitActualizacionPedido = (pedidoId, nuevoEstado, detalles = {}) => {
  if (!io) {
    throw new Error('Socket.io no está inicializado');
  }

  const data = {
    order_id: pedidoId,
    new_status: nuevoEstado,
    ...detalles
  };

  // Emitir a todos los clientes (en una implementación real, solo al cliente específico)
  io.emit('order_status_updated', data);
  console.log(`Actualización de pedido ${pedidoId} enviada: ${nuevoEstado}`);
};

module.exports = {
  initSocket,
  getIO,
  emitNuevoPedido,
  emitActualizacionPedido
};