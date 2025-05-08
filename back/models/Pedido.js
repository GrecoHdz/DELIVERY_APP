const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Pedido = sequelize.define(
  "Pedido",
  {
    id_pedido: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_local: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: true, // El driver es opcional hasta que se asigne
    },
    id_direccion_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_direccion_local: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_metodo_pago: {
      type: DataTypes.INTEGER,
      allowNull: true, // Método de pago es opcional inicialmente
    },
    tipo_pedido: {
      type: DataTypes.STRING(55),
      allowNull: true, // Tipo de pedido es opcional inicialmente
    },
    tiempo_preparacion_estimado: {
      type: DataTypes.INTEGER,
      allowNull: true, // Tiempo en minutos (opcional)
    },
    tiempo_llegada_estimado: {
      type: DataTypes.INTEGER,
      allowNull: true, // Tiempo en minutos (opcional)
    },
    fecha_pedido: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fecha_entrega: {
      type: DataTypes.DATE,
      allowNull: true, // Fecha de entrega es opcional
    },
    estado: {
      type: DataTypes.STRING(55),
      defaultValue: "pendiente_local", // Estados: 'pendiente_local', 'pendiente_deposito', 'preparando_pedido', 'en_camino', 'entregado'
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Pedidos", // Nombre de la tabla en la base de datos
  }
);

module.exports = Pedido;