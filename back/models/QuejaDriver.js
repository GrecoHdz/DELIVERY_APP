const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const QuejaDriver = sequelize.define(
  "QuejaDriver",
  {
    id_queja: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_driver: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_pedido: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imagen_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "QuejaDriver", // Nombre de la tabla en la base de datos
    indexes: [
      {
        name: "idx_quejadriver_id_driver",
        fields: ["id_driver"], // Índice para mejorar consultas por id_driver
      },
    ],
  }
);

// Asociaciones
QuejaDriver.associate = (models) => {
  QuejaDriver.belongsTo(models.Cliente, {
    foreignKey: "id_cliente",
    onDelete: "CASCADE", // Si se elimina el cliente, también se eliminan sus quejas asociadas
  });
  QuejaDriver.belongsTo(models.Driver, {
    foreignKey: "id_driver",
    onDelete: "CASCADE", // Si se elimina el driver, también se eliminan sus quejas asociadas
  });
  QuejaDriver.belongsTo(models.Pedido, {
    foreignKey: "id_pedido",
    onDelete: "SET NULL", // Si se elimina el pedido, el campo id_pedido se establece en NULL
  });
};

module.exports = QuejaDriver;