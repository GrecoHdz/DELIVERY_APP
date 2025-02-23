const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Favorito = sequelize.define(
  "Favorito",
  {
    id_favorito: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_local: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false, // Desactiva los timestamps automáticos de Sequelize
    tableName: "Favoritos", // Nombre de la tabla en la base de datos
  }
);

// Asociaciones
Favorito.associate = (models) => {
  Favorito.belongsTo(models.Cliente, {
    foreignKey: "id_cliente",
    onDelete: "CASCADE", // Si se elimina el cliente, también se eliminan sus favoritos asociados
  });
  Favorito.belongsTo(models.Producto, {
    foreignKey: "id_producto",
    onDelete: "CASCADE", // Si se elimina el producto, también se eliminan sus favoritos asociados
  });
  Favorito.belongsTo(models.Local, {
    foreignKey: "id_local",
    onDelete: "CASCADE", // Si se elimina el local, también se eliminan sus favoritos asociados
  });
};

module.exports = Favorito;