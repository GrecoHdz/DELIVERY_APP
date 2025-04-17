const { sequelize } = require("../config/database");

// Importar modelos
const Usuario = require("./Usuario");
const Pedido = require("./Pedido");
const PedidoDetalle = require("./PedidoDetalle");
const Cliente = require("./Cliente");
const Local = require("./Local");
const Driver = require("./Driver");
const DireccionCliente = require("./DireccionCliente");
const DireccionLocal = require("./DireccionLocal");

// Definir las asociaciones
const setupAssociations = () => {
  // Asociaciones de Pedido
  Pedido.hasMany(PedidoDetalle, {
    foreignKey: "id_pedido",
    as: "items",
    onDelete: "CASCADE"
  });

  PedidoDetalle.belongsTo(Pedido, {
    foreignKey: "id_pedido",
    onDelete: "CASCADE"
  });

  Pedido.belongsTo(Cliente, {
    foreignKey: "id_cliente",
    onDelete: "CASCADE"
  });

  Pedido.belongsTo(Local, {
    foreignKey: "id_local",
    onDelete: "CASCADE"
  });

  Pedido.belongsTo(Driver, {
    foreignKey: "id_driver",
    onDelete: "SET NULL"
  });

  Pedido.belongsTo(DireccionCliente, {
    foreignKey: "id_direccion_cliente",
    as: "DireccionCliente",
    onDelete: "CASCADE"
  });

  Pedido.belongsTo(DireccionLocal, {
    foreignKey: "id_direccion_local",
    as: "DireccionLocal",
    onDelete: "CASCADE"
  });
};

// Ejecutar las asociaciones
setupAssociations();

module.exports = {
  sequelize,
  Usuario,
  Pedido,
  PedidoDetalle,
  Cliente,
  Local,
  Driver,
  DireccionCliente,
  DireccionLocal
};
