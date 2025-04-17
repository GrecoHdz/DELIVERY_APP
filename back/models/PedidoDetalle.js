const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const PedidoDetalle = sequelize.define(
  "PedidoDetalle",
  {
    id_pedido_detalle: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_pedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombre_producto: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    atributos: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    extras: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    descuento: {
      type: DataTypes.INTEGER,
      allowNull: true, // Descuento es opcional
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    cambiode: {
      type: DataTypes.INTEGER,
      allowNull: true,// Cambio es opcional
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true, // Notas adicionales son opcionales
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Pedidos_Detalle", // Nombre de la tabla en la base de datos
  }
);

module.exports = PedidoDetalle;