const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const QuejaLocal = sequelize.define(
  "QuejaLocal",
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
    id_local: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_pedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    tableName: "QuejaLocal", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
QuejaLocal.associate = (models) => {
  QuejaLocal.belongsTo(models.Cliente, {
    foreignKey: "id_cliente",
    onDelete: "CASCADE", // Si se elimina el cliente, también se eliminan sus quejas asociadas
  });
  QuejaLocal.belongsTo(models.Local, {
    foreignKey: "id_local",
    onDelete: "CASCADE", // Si se elimina el local, también se eliminan sus quejas asociadas
  });
  QuejaLocal.belongsTo(models.Pedido, {
    foreignKey: "id_pedido",
    onDelete: "CASCADE", // Si se elimina el pedido, también se eliminan sus quejas asociadas
  });
};

module.exports = QuejaLocal;