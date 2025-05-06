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
const Producto = require("./Producto");
const ProductoSucursal = require("./ProductoSucursal");
const Subcategoria = require("./Subcategoria");
const EstadisticaLocal = require("./EstadisticaLocal");
const CobroSemanal = require("./CobroSemanal");
const CobroProducto = require("./CobroProducto");
const Ciudad = require("./Ciudad");
const MembresiaLocal = require("./MembresiaLocales");

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

  // Asociaciones de Producto
  Producto.belongsTo(Local, {
    foreignKey: "id_local",
    onDelete: "CASCADE"
  });

  Producto.belongsTo(Subcategoria, {
    foreignKey: "id_subcategoria",
    onDelete: "SET NULL"
  });

  Producto.hasMany(ProductoSucursal, {
    foreignKey: "id_producto",
    as: "ProductoSucursales",
    onDelete: "CASCADE"
  });

  // Asociaciones de ProductoSucursal
  ProductoSucursal.belongsTo(Producto, {
    foreignKey: "id_producto",
    onDelete: "CASCADE"
  });

  ProductoSucursal.belongsTo(DireccionLocal, {
    foreignKey: "id_direccion_local",
    onDelete: "CASCADE"
  });

  // Asociaciones de CobroSemanal
  CobroSemanal.belongsTo(Local, {
    foreignKey: "id_local",
    onDelete: "CASCADE"
  });

  // Asociaciones de CobroProducto
  CobroProducto.belongsTo(Local, {
    foreignKey: "id_local",
    onDelete: "CASCADE"
  });

  CobroProducto.belongsTo(Producto, {
    foreignKey: "id_producto",
    onDelete: "CASCADE"
  });

  CobroProducto.belongsTo(DireccionLocal, {
    foreignKey: "id_direccion_local",
    as: "sucursal",
    onDelete: "SET NULL"
  });

  // Asociación entre DireccionLocal y Local
  DireccionLocal.belongsTo(Local, {
    foreignKey: "id_local",
    onDelete: "CASCADE"
  });

  Local.hasMany(DireccionLocal, {
    foreignKey: "id_local",
    as: "DireccionLocales",
    onDelete: "CASCADE"
  });

  // Asociación entre DireccionLocal y Ciudad
  DireccionLocal.belongsTo(Ciudad, {
    foreignKey: "id_ciudad",
    onDelete: "CASCADE"
  });

  Ciudad.hasMany(DireccionLocal, {
    foreignKey: "id_ciudad",
    onDelete: "CASCADE"
  });

  // Asociación entre Local y MembresiaLocal
  Local.belongsTo(MembresiaLocal, {
    foreignKey: "id_membresia",
    onDelete: "SET NULL"
  });

  MembresiaLocal.hasMany(Local, {
    foreignKey: "id_membresia",
    onDelete: "SET NULL"
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
  DireccionLocal,
  Producto,
  ProductoSucursal,
  Subcategoria,
  EstadisticaLocal,
  CobroSemanal,
  CobroProducto,
  Ciudad,
  MembresiaLocal
};
