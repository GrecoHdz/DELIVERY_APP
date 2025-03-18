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

// Asociaciones
Pedido.associate = (models) => {
  Pedido.belongsTo(models.Cliente, {
    foreignKey: "id_cliente",
    onDelete: "CASCADE", // Si se elimina el cliente, también se eliminan sus pedidos
  });
  Pedido.belongsTo(models.Local, {
    foreignKey: "id_local",
    onDelete: "CASCADE", // Si se elimina el local, también se eliminan sus pedidos
  });
  Pedido.belongsTo(models.Driver, {
    foreignKey: "id_driver",
    onDelete: "SET NULL", // Si se elimina el driver, el campo se establece como NULL
  });
  Pedido.belongsTo(models.Direccion, {
    foreignKey: "id_direccion_cliente",
    as: "DireccionCliente",
    onDelete: "CASCADE", // Si se elimina la dirección del cliente, también se eliminan sus pedidos
  });
  Pedido.belongsTo(models.Direccion, {
    foreignKey: "id_direccion_local",
    as: "DireccionLocal",
    onDelete: "CASCADE", // Si se elimina la dirección del local, también se eliminan sus pedidos
  });
};

module.exports = Pedido;